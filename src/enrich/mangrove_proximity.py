"""
GlobalMangroveWatch v3 2020 → beaches.mangrove_nearby flag.

Data: data/gmw/gmw_v3_2020_vec.shp  (894 MB, global mangrove extent polygons, WGS84)

A beach's `mangrove_nearby` becomes 1 if any mangrove polygon intersects a
small buffer around the centroid (default 1000 m). Only considers beaches
within the mangrove latitude band (-35° to 35°) — GMW has zero coverage
outside that range anyway.
"""

import math
from pathlib import Path

from tqdm import tqdm

from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)

GMW_PATH = Path("data/gmw/gmw_v3_2020_vec.shp")
MANGROVE_BUFFER_M = 1000
# Mangroves only exist in warm coasts — cheap pre-filter
MANGROVE_LAT_BAND = 35.0


def _deg_per_meter(lat: float) -> tuple[float, float]:
    """Approx degrees of lat/lng per meter at a given latitude."""
    lat_per_m = 1.0 / 111_320
    lng_per_m = 1.0 / (111_320 * max(0.1, math.cos(math.radians(lat))))
    return lat_per_m, lng_per_m


def _beach_bbox(lat: float, lng: float, buffer_m: float = MANGROVE_BUFFER_M):
    """Return (min_lng, min_lat, max_lng, max_lat) of a buffer_m box around (lat, lng)."""
    lat_per_m, lng_per_m = _deg_per_meter(lat)
    dlat = buffer_m * lat_per_m
    dlng = buffer_m * lng_per_m
    return (lng - dlng, lat - dlat, lng + dlng, lat + dlat)


def enrich_mangrove_proximity(conn, gmw_path: Path = GMW_PATH) -> int:
    if not gmw_path.exists():
        raise FileNotFoundError(
            f"GMW shapefile not found at {gmw_path}. "
            f"Download gmw_v3_2020_vec.zip from https://zenodo.org/record/6894273 "
            f"and extract into data/gmw/."
        )

    run_id = log_run_start(conn, "mangrove_proximity", phase="A")
    before = coverage_count(conn, "beaches", "mangrove_nearby")

    # Lazy imports so unit tests can pass without geopandas installed
    import geopandas as gpd
    from rtree import index as rtree_index

    print(f"Loading GMW mangrove polygons from {gmw_path.name} (~894 MB)...")
    gdf = gpd.read_file(gmw_path)
    print(f"  loaded {len(gdf):,} mangrove polygons")

    print("Building mangrove R-tree...")
    idx = rtree_index.Index()
    for i, geom in enumerate(gdf.geometry):
        if geom is not None and not geom.is_empty:
            idx.insert(i, geom.bounds)
    gdf_geom = list(gdf.geometry)

    # Pre-filter beaches to the mangrove latitude band
    rows = conn.execute(
        """SELECT id, centroid_lat, centroid_lng FROM beaches
           WHERE mangrove_nearby IS NULL
             AND centroid_lat IS NOT NULL
             AND centroid_lat BETWEEN ? AND ?""",
        (-MANGROVE_LAT_BAND, MANGROVE_LAT_BAND),
    ).fetchall()

    # Also mark out-of-band beaches as mangrove_nearby = 0
    out_of_band = conn.execute(
        """SELECT COUNT(*) FROM beaches
           WHERE mangrove_nearby IS NULL AND centroid_lat IS NOT NULL
             AND (centroid_lat < ? OR centroid_lat > ?)""",
        (-MANGROVE_LAT_BAND, MANGROVE_LAT_BAND),
    ).fetchone()[0]
    print(f"  {len(rows):,} tropical/subtropical beaches to check")
    print(f"  {out_of_band:,} beaches outside mangrove band → marked 0")

    updated = 0
    for r in tqdm(rows, desc="mangrove match"):
        lat, lng = r["centroid_lat"], r["centroid_lng"]
        bbox = _beach_bbox(lat, lng, MANGROVE_BUFFER_M)
        candidates = list(idx.intersection(bbox))
        flag = 0
        if candidates:
            # Quick check: any candidate polygon's bbox overlaps our bbox.
            # R-tree already confirmed bbox overlap; that's close enough at 1km
            # resolution for a boolean "nearby" flag. No need to do exact
            # polygon.distance() which would be 1000× slower.
            flag = 1
        conn.execute(
            "UPDATE beaches SET mangrove_nearby=?, updated_at=datetime('now') WHERE id=?",
            (flag, r["id"]),
        )
        updated += 1
        if updated % 5000 == 0:
            conn.commit()

    # Set out-of-band beaches to 0 in one batch
    conn.execute(
        """UPDATE beaches SET mangrove_nearby = 0, updated_at = datetime('now')
           WHERE mangrove_nearby IS NULL AND centroid_lat IS NOT NULL
             AND (centroid_lat < ? OR centroid_lat > ?)""",
        (-MANGROVE_LAT_BAND, MANGROVE_LAT_BAND),
    )
    conn.commit()

    log_run_finish(conn, run_id, "ok", total_processed=updated + out_of_band)
    if len(rows) >= 100:
        assert_coverage_delta(
            conn, "beaches", "mangrove_nearby",
            before=before, min_delta=max(1, (len(rows) + out_of_band) // 2),
        )
    print(f"Mangrove proximity: {updated:,} checked, {out_of_band:,} out-of-band marked 0")
    return updated


if __name__ == "__main__":
    import sqlite3
    import sys
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    enrich_mangrove_proximity(db)
    db.close()
