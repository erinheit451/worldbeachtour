"""
WorldClim v2.1 climate enrichment — bulk GeoTIFF, no API, no quota.

Downloads are 6 zip files of 12 monthly GeoTIFFs at 2.5-arcmin resolution:
  data/worldclim/wc2.1_2.5m_{var}.zip  (var in: tavg, tmin, tmax, prec, srad, wind)

Columns written to `beaches`:
  climate_air_temp_high  <- tmax  (°C, 12-element JSON array Jan–Dec)
  climate_air_temp_low   <- tmin  (°C)
  climate_rain_mm        <- prec  (mm)
  climate_sun_hours      <- srad  (kJ m⁻² day⁻¹ — NOTE: not actual sunshine hours;
                                    raw WorldClim solar radiation stored as-is;
                                    convert client-side if hours are needed)
  climate_wind_speed     <- wind  (m/s)
  climate_source         = 'worldclim_v2.1_2.5m'

tavg is extracted but not stored (no matching schema column).
Columns not covered: uv_index, humidity, cloud_cover — left NULL.
"""

import json
import zipfile
from pathlib import Path

from tqdm import tqdm

from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)

WORLDCLIM_DIR = Path("data/worldclim")
TIFS_DIR = WORLDCLIM_DIR / "tifs"

# Map: (DB column, WorldClim variable prefix)
# tavg intentionally omitted — no schema column for it
VARIABLES = [
    ("climate_air_temp_high", "tmax"),
    ("climate_air_temp_low",  "tmin"),
    ("climate_rain_mm",       "prec"),
    ("climate_sun_hours",     "srad"),
    ("climate_wind_speed",    "wind"),
]

# All variable prefixes including tavg (needed for unzip check)
_ALL_VARS = ["tavg", "tmin", "tmax", "prec", "srad", "wind"]


def _ensure_unzipped() -> None:
    """Extract all 6 WorldClim zips into TIFS_DIR if not already extracted.
    Idempotent: skips any variable whose sentinel tif already exists."""
    TIFS_DIR.mkdir(parents=True, exist_ok=True)
    for var in _ALL_VARS:
        sentinel = TIFS_DIR / f"wc2.1_2.5m_{var}_01.tif"
        if sentinel.exists():
            continue
        z = WORLDCLIM_DIR / f"wc2.1_2.5m_{var}.zip"
        if not z.exists():
            raise FileNotFoundError(
                f"WorldClim zip not found: {z}. "
                f"Download from https://worldclim.org/data/worldclim21.html "
                f"and place in {WORLDCLIM_DIR}/"
            )
        print(f"extracting {z.name} -> {TIFS_DIR}/...")
        with zipfile.ZipFile(z) as zf:
            zf.extractall(TIFS_DIR)


def _open_var_rasters(var: str) -> list:
    """Open 12 monthly rasterio datasets for `var`. Caller must close them."""
    # rasterio import is here (not at module top) so the module is importable
    # in CI environments without rasterio installed — tests can check import safety.
    import rasterio  # noqa: PLC0415

    files = [TIFS_DIR / f"wc2.1_2.5m_{var}_{m:02d}.tif" for m in range(1, 13)]
    for f in files:
        if not f.exists():
            raise FileNotFoundError(
                f"WorldClim raster missing: {f}. "
                f"Run _ensure_unzipped() first, or re-download the zip."
            )
    return [rasterio.open(f) for f in files]


def _sample_beach_months(rasters: list, lat: float, lng: float) -> list | None:
    """Sample all 12 monthly rasters at (lat, lng).

    Returns a 12-element list of floats (some may be None for individual months)
    or None if ALL 12 months are NoData (beach is fully landlocked at grid resolution).
    """
    values = []
    any_valid = False
    for r in rasters:
        try:
            raw = list(r.sample([(lng, lat)]))
            v = float(raw[0][0]) if raw else None
        except Exception:
            v = None
        # WorldClim NoData is typically float32 min (~-3.4e38)
        nd = r.nodata
        if v is None or (nd is not None and v == nd) or v < -1e30:
            values.append(None)
        else:
            values.append(round(v, 4))
            any_valid = True
    return values if any_valid else None


def enrich_worldclim_climate(conn) -> int:
    """Enrich beaches with WorldClim v2.1 climate data.

    Each variable is processed independently: we re-query per-variable for
    beaches still missing THAT specific column, since different vars have
    different partial-fill state across resumed runs. Commits every 5000 rows.
    """
    _ensure_unzipped()

    run_id = log_run_start(conn, "worldclim_climate", phase="A")

    # Pick the laggard column as the coverage-assertion target — the one most
    # likely to need populating if anything actually needs doing.
    all_null_counts = {
        col: conn.execute(
            f"SELECT COUNT(*) FROM beaches WHERE {col} IS NULL AND centroid_lat IS NOT NULL"
        ).fetchone()[0]
        for col, _ in VARIABLES
    }
    laggard_col = max(all_null_counts, key=all_null_counts.get)
    laggard_missing = all_null_counts[laggard_col]
    before_laggard = coverage_count(conn, "beaches", laggard_col)

    total_missing = sum(all_null_counts.values())
    if total_missing == 0:
        log_run_finish(conn, run_id, "ok", total_processed=0)
        print("WorldClim: all variables already populated")
        return 0

    print("WorldClim missing-by-variable:")
    for col, n in all_null_counts.items():
        print(f"  {col:28s} {n:>10,}")

    updated_ids: set = set()

    for col, var in VARIABLES:
        # Per-variable target list: only beaches where THIS column is null.
        rows = conn.execute(
            f"SELECT id, centroid_lat, centroid_lng FROM beaches "
            f"WHERE {col} IS NULL AND centroid_lat IS NOT NULL"
        ).fetchall()
        if not rows:
            print(f"\n{var} -> {col}: already complete, skipping")
            continue

        print(f"\nsampling {var} -> {col} for {len(rows):,} beaches...")
        rasters = _open_var_rasters(var)
        batch_updates: list[tuple] = []

        for row in tqdm(rows, desc=var, unit="beach"):
            months = _sample_beach_months(
                rasters, row["centroid_lat"], row["centroid_lng"]
            )
            if months is None:
                continue
            batch_updates.append((json.dumps(months), row["id"]))
            updated_ids.add(row["id"])

            if len(batch_updates) >= 5_000:
                conn.executemany(
                    f"UPDATE beaches SET {col}=?, updated_at=datetime('now') WHERE id=?",
                    batch_updates,
                )
                conn.commit()
                batch_updates.clear()

        if batch_updates:
            conn.executemany(
                f"UPDATE beaches SET {col}=?, updated_at=datetime('now') WHERE id=?",
                batch_updates,
            )
            conn.commit()

        for r in rasters:
            r.close()

    # Tag climate source on every beach that received at least one variable
    if updated_ids:
        chunk = 5_000
        ids = list(updated_ids)
        for i in range(0, len(ids), chunk):
            conn.executemany(
                "UPDATE beaches SET climate_source='worldclim_v2.1_2.5m', "
                "updated_at=datetime('now') WHERE id=?",
                [(bid,) for bid in ids[i : i + chunk]],
            )
            conn.commit()

    log_run_finish(conn, run_id, "ok", total_processed=len(updated_ids))

    # Assert on the laggard variable (most likely to actually move)
    if laggard_missing >= 100:
        assert_coverage_delta(
            conn, "beaches", laggard_col,
            before=before_laggard,
            min_delta=max(1, laggard_missing // 2),
        )

    print(f"\nWorldClim: {len(updated_ids):,} beaches touched across {len(VARIABLES)} variables")
    return len(updated_ids)


if __name__ == "__main__":
    import sqlite3
    import sys

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    from src.enrich._common import open_db
    db = open_db(db_path)
    enrich_worldclim_climate(db)
    db.close()
