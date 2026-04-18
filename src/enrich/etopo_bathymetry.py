"""
ETOPO2022 bathymetry (60-arcsec) → nearshore_depth_m, slope_pct, drop_off_flag.

Free alternative to GEBCO (no form-gate). Download URL:
  https://www.ngdc.noaa.gov/mgg/global/etopo2022.html
  Direct file: ETOPO_2022_v1_60s_N90W180_surface.nc (~478MB)
  Place at: data/etopo/ETOPO_2022_v1_60s.nc

ETOPO2022 properties:
  - Variable: 'z' (signed elevation, meters, negative = below sea level)
  - Dimensions: 'lat', 'lon'
  - Resolution: 60 arcsec (~1850m per cell at equator)

Resolution note:
  GEBCO uses 15-arcsec (~450m cells) so a 500m offshore sample crosses into
  a new cell. ETOPO 60-arcsec cells are ~1850m wide, so OFFSHORE_DISTANCE_M
  must be at least 2000m to leave the centroid's cell and read open water.
  This module uses 2000m; slope_pct is computed over the same distance.

Algorithm (per beach):
  1. Sample elevation at centroid (shore_depth)
  2. Find an offshore direction (seaward)
     - If orientation_deg is known, bearing = orientation + 90°
     - If not, try 4 cardinal bearings, keep the deepest (= water)
  3. Sample elevation 2000m offshore (offshore_depth; should be negative)
  4. slope_pct = (shore_depth - offshore_depth) / 2000 * 100
  5. drop_off_flag = 1 if slope_pct > 15 else 0
  6. nearshore_depth_m = abs(offshore_depth)

Math helpers (`_offshore_point`, `_compute_slope_and_flag`) are shared
from gebco_bathymetry to avoid duplication.
"""

from pathlib import Path
from tqdm import tqdm

from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)
from src.enrich.gebco_bathymetry import (
    _offshore_point, _compute_slope_and_flag,
)

ETOPO_PATH = Path("data/etopo/ETOPO_2022_v1_60s.nc")
# 2000m needed to cross at least one 60-arcsec cell (~1850m at equator)
# GEBCO uses 500m (15-arcsec grid), ETOPO needs 2000m minimum.
OFFSHORE_DISTANCE_M = 2000


def _load_etopo(path: Path = ETOPO_PATH):
    """Lazy-load ETOPO NetCDF via xarray. Raises FileNotFoundError or RuntimeError."""
    try:
        import xarray as xr
    except ImportError as e:
        raise RuntimeError("xarray + netCDF4 not installed. Run: pip install xarray netCDF4") from e
    if not path.exists():
        raise FileNotFoundError(
            f"ETOPO not found at {path}. Download from "
            f"https://www.ngdc.noaa.gov/thredds/fileServer/global/ETOPO2022/60s/"
            f"60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc"
        )
    return xr.open_dataset(path)


def _sample_elevation(ds, lat: float, lng: float) -> float:
    """Nearest-neighbor sample of ETOPO `z` variable."""
    pt = ds.z.sel(lat=lat, lon=lng, method="nearest")
    return float(pt.values)


def enrich_etopo_bathymetry(conn, path: Path = ETOPO_PATH) -> int:
    ds = _load_etopo(path)

    run_id = log_run_start(conn, "etopo_bathymetry", phase="A")
    before = coverage_count(conn, "beaches", "nearshore_depth_m")

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng, orientation_deg "
        "FROM beaches "
        "WHERE nearshore_depth_m IS NULL AND centroid_lat IS NOT NULL"
    ).fetchall()

    updated = 0
    errors = 0
    for row in tqdm(rows, desc="etopo"):
        lat, lng = row["centroid_lat"], row["centroid_lng"]
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
            continue  # not near measurable water

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
        # Expect >30% of beaches to hit open water within 2000m in at least one bearing
        assert_coverage_delta(
            conn, "beaches", "nearshore_depth_m",
            before=before, min_delta=max(1, len(rows) // 3),
        )
    return updated


if __name__ == "__main__":
    import sqlite3, sys
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    from src.enrich._common import open_db
    db = open_db(db_path)
    enrich_etopo_bathymetry(db)
    db.close()
