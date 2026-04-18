"""
WDPA spatial join: attach protected_area_name/type/iucn + unesco_site to every beach.

Download: https://www.protectedplanet.net/en/thematic-areas/wdpa
Extract the three WDPA_*_shp_{0,1,2}.zip into data/wdpa/ (each zip contains a
points shapefile and a polygons shapefile — we use only polygons).

Columns on WDPA polygons (reference: WDPA manual v1.6):
  NAME       — protected area name
  DESIG_ENG  — designation English name (e.g., "National Park", "World Heritage Site")
  IUCN_CAT   — IUCN management category (Ia/Ib/II/III/IV/V/VI or "Not Reported")
  DESIG_TYPE — "National", "Regional", "International", "Not Applicable"
  WDPAID     — unique WDPA id
"""

from pathlib import Path

import pandas
from tqdm import tqdm

import geopandas as gpd
from shapely.geometry import Point
from rtree import index as rtree_index

from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)

WDPA_DIR = Path("data/wdpa")
# WDPA shapefiles have either "polygons" or "poly" in the filename;
# point shapefiles have "points" or "pnt". We want polygons only.
_POLYGON_PATTERNS = ["*polygons*.shp", "*poly*.shp", "*Polygon*.shp"]


def _discover_polygon_shapefiles(wdpa_dir: Path = WDPA_DIR) -> list[Path]:
    found: list[Path] = []
    if not wdpa_dir.exists():
        return found
    for pat in _POLYGON_PATTERNS:
        found.extend(wdpa_dir.rglob(pat))
    # Filter out anything that's accidentally the points shapefile
    return [p for p in found if "point" not in p.name.lower() and "pnt" not in p.name.lower()]


def _load_wdpa_polygons(wdpa_dir: Path = WDPA_DIR) -> gpd.GeoDataFrame:
    """Eager-load every shapefile into one GDF. Used by unit tests.

    For the real 5.9GB / 3-shapefile WDPA release, prefer `_iter_wdpa_polygon_gdfs`
    (streaming) — concatenating all three polygon shapefiles into one GDF peaks
    around 15-20GB of RAM and OOMs on most laptops.
    """
    shapefiles = _discover_polygon_shapefiles(wdpa_dir)
    if not shapefiles:
        raise FileNotFoundError(
            f"No WDPA polygon shapefiles found under {wdpa_dir}. "
            f"Download from https://www.protectedplanet.net/en/thematic-areas/wdpa "
            f"and extract the three WDPA_*_shp_{{0,1,2}}.zip files into that directory."
        )
    print(f"Loading {len(shapefiles)} WDPA polygon shapefile(s)...")
    frames = []
    for shp in shapefiles:
        frames.append(gpd.read_file(shp))
    gdf = gpd.GeoDataFrame(
        pandas.concat(frames, ignore_index=True),
        crs=frames[0].crs,
    )
    if gdf.crs is not None and gdf.crs.to_epsg() != 4326:
        gdf = gdf.to_crs(epsg=4326)
    return gdf


def _iter_wdpa_polygon_gdfs(wdpa_dir: Path = WDPA_DIR):
    """Yield one (Path, GeoDataFrame) per shapefile so the caller can process
    each and release RAM before loading the next. Required for the full WDPA
    release (3 shapefiles × ~2GB geometry each)."""
    shapefiles = _discover_polygon_shapefiles(wdpa_dir)
    if not shapefiles:
        raise FileNotFoundError(
            f"No WDPA polygon shapefiles found under {wdpa_dir}. "
            f"Download from https://www.protectedplanet.net/en/thematic-areas/wdpa "
            f"and extract the three WDPA_*_shp_{{0,1,2}}.zip files into that directory."
        )
    for shp in sorted(shapefiles):
        print(f"Loading {shp}...")
        gdf = gpd.read_file(shp)
        if gdf.crs is not None and gdf.crs.to_epsg() != 4326:
            gdf = gdf.to_crs(epsg=4326)
        yield shp, gdf


def _build_spatial_index(gdf: gpd.GeoDataFrame) -> dict:
    idx = rtree_index.Index()
    for i, geom in enumerate(gdf.geometry):
        if geom is not None and not geom.is_empty:
            idx.insert(i, geom.bounds)
    return {"rtree": idx, "gdf": gdf}


def _match_beach_to_wdpa(gdf: gpd.GeoDataFrame, lat: float, lng: float) -> dict | None:
    """Return a match dict or None. Public for unit testing."""
    idx = _build_spatial_index(gdf)
    return _lookup_wdpa(idx, lat, lng)


def _lookup_wdpa(idx: dict, lat: float, lng: float) -> dict | None:
    pt = Point(lng, lat)
    gdf = idx["gdf"]
    for cand in idx["rtree"].intersection((lng, lat, lng, lat)):
        geom = gdf.geometry.iloc[cand]
        if geom is not None and geom.contains(pt):
            row = gdf.iloc[cand]
            desig_eng = str(row.get("DESIG_ENG") or "")
            name = row.get("NAME")
            return {
                "name": name,
                "type": desig_eng,
                "iucn": row.get("IUCN_CAT"),
                "unesco": name if "World Heritage" in desig_eng else None,
            }
    return None


def enrich_wdpa_protected(conn, wdpa_dir: Path = WDPA_DIR) -> int:
    """Streaming spatial join: process each WDPA shapefile in turn, release its
    R-tree + GDF before loading the next. Each beach is checked against every
    shapefile; the first match wins (WDPA polygons overlap in many places, so a
    stable pick is fine)."""
    # Fail fast on missing shapefiles before touching the DB
    if not _discover_polygon_shapefiles(wdpa_dir):
        raise FileNotFoundError(
            f"No WDPA polygon shapefiles found under {wdpa_dir}. "
            f"Download from https://www.protectedplanet.net/en/thematic-areas/wdpa "
            f"and extract the three WDPA_*_shp_{{0,1,2}}.zip files into that directory."
        )

    run_id = log_run_start(conn, "wdpa_protected", phase="A")
    before = coverage_count(conn, "beaches", "protected_area_name")

    # Unmatched beach pool — beaches drop out of this set as they get a match.
    beaches = [
        dict(r)
        for r in conn.execute(
            "SELECT id, centroid_lat, centroid_lng FROM beaches "
            "WHERE protected_area_name IS NULL AND centroid_lat IS NOT NULL"
        ).fetchall()
    ]
    total_targets = len(beaches)
    updated = 0

    for shp_path, gdf in _iter_wdpa_polygon_gdfs(wdpa_dir):
        if not beaches:
            break  # every beach already matched
        print(f"  building R-tree for {len(gdf):,} polygons from {shp_path.name}...")
        idx = _build_spatial_index(gdf)
        still_unmatched = []
        for beach in tqdm(beaches, desc=f"wdpa {shp_path.parent.name}"):
            match = _lookup_wdpa(idx, beach["centroid_lat"], beach["centroid_lng"])
            if match is None:
                still_unmatched.append(beach)
                continue
            conn.execute(
                """UPDATE beaches
                   SET protected_area_name = ?,
                       protected_area_type = ?,
                       protected_area_iucn = ?,
                       protected_area_source = 'wdpa',
                       unesco_site = COALESCE(unesco_site, ?),
                       updated_at = datetime('now')
                   WHERE id = ?""",
                (match["name"], match["type"], match["iucn"], match["unesco"], beach["id"]),
            )
            updated += 1
            if updated % 5000 == 0:
                conn.commit()
        conn.commit()
        beaches = still_unmatched
        # Explicitly release before next shapefile loads
        del idx, gdf

    log_run_finish(conn, run_id, "ok", total_processed=updated)
    if total_targets:
        # WDPA coverage of beaches globally is ~5-10%, so use a loose threshold
        assert_coverage_delta(
            conn, "beaches", "protected_area_name",
            before=before, min_delta=max(1, total_targets // 50),
        )
    print(f"WDPA: {updated} / {total_targets} beaches matched to protected areas")
    return updated


if __name__ == "__main__":
    import sqlite3
    import sys
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    enrich_wdpa_protected(db)
    db.close()
