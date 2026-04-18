"""
GADM spatial join: attach admin_level_2 + admin_level_3 to every beach,
then seed admin_regions table.

Download: https://geodata.ucdavis.edu/gadm/gadm4.1/gadm_410-levels.gpkg (~1.5GB)
Place at: data/gadm/gadm_410-levels.gpkg

GADM provides up to 5 admin levels (country → L1 → ... → L5). We use L3 layer
where available; countries without L3 fall back to L2 inherently because their
L3 layer rows reference the same L2 fields.
"""

from pathlib import Path
from tqdm import tqdm
import geopandas as gpd
from shapely.geometry import Point
from rtree import index as rtree_index

from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)

GADM_PATH = Path("data/gadm/gadm_410-levels.gpkg")
GADM_LAYER = "ADM_3"


def _build_spatial_index(gdf):
    """Build an R-tree index over polygon bboxes. Returns dict {'rtree': ..., 'gdf': gdf}
    so lookup can do exact within-polygon tests."""
    idx = rtree_index.Index()
    for i, geom in enumerate(gdf.geometry):
        if geom is not None and not geom.is_empty:
            idx.insert(i, geom.bounds)
    return {"rtree": idx, "gdf": gdf}


def _lookup_admin(idx, lat: float, lng: float) -> dict | None:
    """Find the GADM record whose polygon contains (lat, lng). Returns a dict with
    country_code, admin_l1, admin_l2, admin_l3 keys, or None if no polygon contains it."""
    pt = Point(lng, lat)
    gdf = idx["gdf"]
    for cand in idx["rtree"].intersection((lng, lat, lng, lat)):
        geom = gdf.geometry.iloc[cand]
        if geom is not None and geom.contains(pt):
            row = gdf.iloc[cand]
            return {
                "country_code": row.get("GID_0"),
                "admin_l1": row.get("NAME_1"),
                "admin_l2": row.get("NAME_2"),
                "admin_l3": row.get("NAME_3"),
            }
    return None


def seed_admin_regions(conn) -> int:
    """Insert one admin_regions row per distinct (country, l1, l2, l3) tuple from beaches.
    Returns number of rows inserted (duplicates on re-run are silently skipped)."""
    rows = conn.execute(
        """SELECT DISTINCT country_code, admin_level_1, admin_level_2, admin_level_3
           FROM beaches WHERE admin_level_2 IS NOT NULL"""
    ).fetchall()
    inserted = 0
    for r in rows:
        region_id = "|".join([
            r["country_code"] or "",
            r["admin_level_1"] or "",
            r["admin_level_2"] or "",
            r["admin_level_3"] or "",
        ])
        try:
            conn.execute(
                """INSERT INTO admin_regions (id, country_code, admin_l1, admin_l2, admin_l3)
                   VALUES (?, ?, ?, ?, ?)""",
                (region_id, r["country_code"], r["admin_level_1"],
                 r["admin_level_2"], r["admin_level_3"]),
            )
            inserted += 1
        except Exception:
            pass  # duplicate on re-run
    conn.commit()
    return inserted


def enrich_gadm_admin(conn, gpkg_path: Path = GADM_PATH, layer: str = GADM_LAYER) -> int:
    if not gpkg_path.exists():
        raise FileNotFoundError(
            f"GADM not found at {gpkg_path}. Download from "
            f"https://geodata.ucdavis.edu/gadm/gadm4.1/gadm_410-levels.gpkg"
        )
    run_id = log_run_start(conn, "gadm_admin", phase="A")
    before = coverage_count(conn, "beaches", "admin_level_2")

    print(f"Loading GADM {layer}...")
    gdf = gpd.read_file(gpkg_path, layer=layer)
    idx = _build_spatial_index(gdf)

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches "
        "WHERE admin_level_2 IS NULL AND centroid_lat IS NOT NULL"
    ).fetchall()

    updated = 0
    for row in tqdm(rows, desc="gadm join"):
        admin = _lookup_admin(idx, row["centroid_lat"], row["centroid_lng"])
        if admin is None:
            continue
        conn.execute(
            """UPDATE beaches
               SET admin_level_2 = COALESCE(admin_level_2, ?),
                   admin_level_3 = COALESCE(admin_level_3, ?),
                   updated_at = datetime('now')
               WHERE id = ?""",
            (admin["admin_l2"], admin["admin_l3"], row["id"]),
        )
        updated += 1
        if updated % 10000 == 0:
            conn.commit()
    conn.commit()

    seed_count = seed_admin_regions(conn)
    log_run_finish(conn, run_id, "ok", total_processed=updated)
    if rows:
        assert_coverage_delta(
            conn, "beaches", "admin_level_2",
            before=before, min_delta=max(1, len(rows) // 2),
        )
    print(f"GADM: {updated} beaches matched; {seed_count} admin_regions seeded")
    return updated


if __name__ == "__main__":
    import sqlite3, sys
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    enrich_gadm_admin(db)
    db.close()
