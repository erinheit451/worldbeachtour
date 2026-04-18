"""Derive beach_length_m, orientation_deg, orientation_label, sunset_visible from existing polygon geometry."""

import json
import math
from tqdm import tqdm
from shapely.geometry import shape
from shapely.geometry.polygon import orient

from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)


COMPASS = ["N","NE","E","SE","S","SW","W","NW"]


def _orientation_label(deg: float) -> str:
    idx = int(((deg % 360) + 22.5) // 45) % 8
    return COMPASS[idx]


def _meters_per_deg(lat: float) -> tuple[float, float]:
    """Approx meters per degree of lat, lng at a given latitude. Good enough for beach-scale."""
    lat_m = 111_320
    lng_m = 111_320 * math.cos(math.radians(lat))
    return lat_m, lng_m


def compute_length_and_orientation(geometry_geojson: dict) -> tuple[float, float]:
    """Oriented minimum bounding rectangle in meters. Longer side = length.
    Bearing of long axis (0°=N, 90°=E) = orientation_deg, normalized to [0, 180)
    since a beach axis is undirected.

    Returns (length_m, bearing_deg) or (0.0, None) for empty/invalid geometry.
    """
    geom = shape(geometry_geojson)
    if geom.is_empty:
        return 0.0, None

    mbr = geom.minimum_rotated_rectangle
    coords = list(orient(mbr).exterior.coords)

    # Project to local meters using centroid latitude
    cx, cy = geom.centroid.x, geom.centroid.y
    lat_m, lng_m = _meters_per_deg(cy)
    pts_m = [((x - cx) * lng_m, (y - cy) * lat_m) for x, y in coords[:4]]

    # Two side lengths of the rectangle
    def _dist(a, b):
        return math.hypot(a[0] - b[0], a[1] - b[1])

    side_a = _dist(pts_m[0], pts_m[1])
    side_b = _dist(pts_m[1], pts_m[2])

    if side_a >= side_b:
        length = side_a
        dx = pts_m[1][0] - pts_m[0][0]
        dy = pts_m[1][1] - pts_m[0][1]
    else:
        length = side_b
        dx = pts_m[2][0] - pts_m[1][0]
        dy = pts_m[2][1] - pts_m[1][1]

    # Bearing: atan2(east_component, north_component), normalized to [0, 180)
    bearing = (math.degrees(math.atan2(dx, dy)) + 360) % 180
    return length, bearing


def enrich_geometry_derived(conn) -> int:
    """Fill beach_length_m, orientation_deg, orientation_label, sunset_visible
    for every beach with a polygon but missing those fields."""
    run_id = log_run_start(conn, "geometry_derived", phase="A")
    before_len = coverage_count(conn, "beaches", "beach_length_m")

    rows = conn.execute(
        "SELECT id, geometry_geojson FROM beaches "
        "WHERE geometry_geojson IS NOT NULL "
        "AND (beach_length_m IS NULL OR orientation_deg IS NULL)"
    ).fetchall()

    updated = 0
    errors = 0
    for row in tqdm(rows, desc="geometry-derived"):
        try:
            geom = json.loads(row["geometry_geojson"])
            length, bearing = compute_length_and_orientation(geom)
            if length is None or length <= 0 or bearing is None:
                continue
            label = _orientation_label(bearing)
            sunset = 1 if 225 <= bearing <= 315 else 0
            conn.execute(
                """UPDATE beaches SET beach_length_m=?, orientation_deg=?,
                   orientation_label=?, sunset_visible=?, updated_at=datetime('now')
                   WHERE id=?""",
                (length, bearing, label, sunset, row["id"]),
            )
            updated += 1
            if updated % 5000 == 0:
                conn.commit()
        except Exception:
            errors += 1

    conn.commit()
    log_run_finish(conn, run_id, "ok", total_processed=updated, total_errors=errors)

    if rows:
        assert_coverage_delta(
            conn, "beaches", "beach_length_m",
            before=before_len, min_delta=max(1, len(rows) // 10),
        )
    return updated


if __name__ == "__main__":
    import sqlite3, sys
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    enrich_geometry_derived(db)
    db.close()
