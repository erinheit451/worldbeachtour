"""
GEBCO 2024 bathymetry → nearshore_depth_m, slope_pct, drop_off_flag.

Download (7GB NetCDF, gated on user):
  1. Visit https://download.gebco.net/
  2. Request "GEBCO_2024 Grid (NetCDF)"
  3. Place at data/gebco/GEBCO_2024.nc

Algorithm (per beach):
  1. Sample elevation at centroid (shore_depth)
  2. Find an offshore direction (seaward)
     - If orientation_deg is known, bearing = orientation + 90°
     - If not, try 4 cardinal bearings, keep the deepest (= water)
  3. Sample elevation 500m offshore (offshore_depth; should be negative)
  4. slope_pct = (shore_depth - offshore_depth) / 500 * 100
  5. drop_off_flag = 1 if slope_pct > 15 else 0
  6. nearshore_depth_m = abs(offshore_depth)
"""

import math
from pathlib import Path

from tqdm import tqdm

from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)

GEBCO_PATH = Path("data/gebco/GEBCO_2024.nc")
DROP_OFF_THRESHOLD_PCT = 15.0
OFFSHORE_DISTANCE_M = 500
EARTH_RADIUS_M = 6_371_000


def _offshore_point(lat: float, lng: float, bearing_deg: float, distance_m: float) -> tuple[float, float]:
    """Move `distance_m` along `bearing_deg` from (lat, lng) on the sphere.
    Bearing 0°=N, 90°=E. Returns (new_lat, new_lng) in degrees."""
    bearing = math.radians(bearing_deg)
    lat1 = math.radians(lat)
    lng1 = math.radians(lng)
    ang = distance_m / EARTH_RADIUS_M
    lat2 = math.asin(
        math.sin(lat1) * math.cos(ang)
        + math.cos(lat1) * math.sin(ang) * math.cos(bearing)
    )
    lng2 = lng1 + math.atan2(
        math.sin(bearing) * math.sin(ang) * math.cos(lat1),
        math.cos(ang) - math.sin(lat1) * math.sin(lat2),
    )
    return math.degrees(lat2), math.degrees(lng2)


def _compute_slope_and_flag(
    shore_depth: float, offshore_depth: float, distance_m: float = OFFSHORE_DISTANCE_M
) -> tuple[float, int]:
    """shore_depth and offshore_depth are elevations (negative = below sea level).
    Returns (slope_pct, drop_off_flag)."""
    drop_m = shore_depth - offshore_depth
    slope_pct = (drop_m / distance_m) * 100
    flag = 1 if slope_pct > DROP_OFF_THRESHOLD_PCT else 0
    return slope_pct, flag


def _load_gebco(path: Path = GEBCO_PATH):
    """Lazy-load GEBCO NetCDF via xarray. Raises with a helpful message if gated."""
    try:
        import xarray as xr
    except ImportError as e:
        raise RuntimeError("xarray + netCDF4 not installed. Run: pip install xarray netCDF4") from e
    if not path.exists():
        raise FileNotFoundError(
            f"GEBCO not found at {path}. Download GEBCO_2024 Grid (NetCDF) from "
            f"https://download.gebco.net/ and place at that path."
        )
    return xr.open_dataset(path)


def _sample_elevation(ds, lat: float, lng: float) -> float:
    """Nearest-neighbor sample of GEBCO elevation grid. Coordinate names are
    typically `lat` / `lon` but GEBCO uses lowercase; keep both fallbacks."""
    # GEBCO 2024 uses dims named 'lat' and 'lon'
    pt = ds.elevation.sel(lat=lat, lon=lng, method="nearest")
    return float(pt.values)


def enrich_gebco_bathymetry(conn, path: Path = GEBCO_PATH) -> int:
    ds = _load_gebco(path)

    run_id = log_run_start(conn, "gebco_bathymetry", phase="A")
    before = coverage_count(conn, "beaches", "nearshore_depth_m")

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng, orientation_deg "
        "FROM beaches "
        "WHERE nearshore_depth_m IS NULL AND centroid_lat IS NOT NULL"
    ).fetchall()

    updated = 0
    errors = 0
    for row in tqdm(rows, desc="gebco"):
        lat, lng = row["centroid_lat"], row["centroid_lng"]
        # Offshore bearing: orientation + 90° (seaward-perpendicular) if known;
        # else try all 4 cardinal bearings and keep the deepest hit.
        orient = row["orientation_deg"]
        bearings = [orient + 90] if orient is not None else [0, 90, 180, 270]

        best_depth = None
        for bearing in bearings:
            olat, olng = _offshore_point(lat, lng, bearing, OFFSHORE_DISTANCE_M)
            try:
                depth = _sample_elevation(ds, olat, olng)
            except Exception:
                continue
            if depth < 0 and (best_depth is None or depth < best_depth):
                best_depth = depth

        if best_depth is None:
            continue  # beach not near measurable water in sample bearings

        try:
            shore = _sample_elevation(ds, lat, lng)
        except Exception:
            errors += 1
            continue

        slope, flag = _compute_slope_and_flag(shore, best_depth, OFFSHORE_DISTANCE_M)
        conn.execute(
            """UPDATE beaches SET nearshore_depth_m=?, slope_pct=?, drop_off_flag=?,
               updated_at=datetime('now') WHERE id=?""",
            (abs(best_depth), slope, flag, row["id"]),
        )
        updated += 1
        if updated % 5000 == 0:
            conn.commit()

    conn.commit()
    log_run_finish(conn, run_id, "ok", total_processed=updated, total_errors=errors)
    if rows:
        assert_coverage_delta(
            conn, "beaches", "nearshore_depth_m",
            before=before, min_delta=max(1, len(rows) // 2),
        )
    return updated


if __name__ == "__main__":
    import sqlite3, sys
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    enrich_gebco_bathymetry(db)
    db.close()
