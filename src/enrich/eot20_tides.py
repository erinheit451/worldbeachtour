"""
EOT20 ocean tide atlas → tide_range_spring_m, tide_range_neap_m, tide_type per beach.

Data: data/eot20/ocean_tides/ocean_tides/<CONSTITUENT>_ocean_eot20.nc  (free from DGFI-TUM)

EOT20 provides per-constituent NetCDFs with `amplitude` (cm) and `phase` (degrees)
on a 0.125° global grid. Land cells are NaN. Beaches on the coast often fall on
land cells via nearest-neighbor, so we sample a small neighborhood and average
the non-NaN values.

Output columns on `beaches`:
  tide_range_spring_m   REAL    2 * (M2 + S2), meters
  tide_range_neap_m     REAL    2 * |M2 - S2|, meters
  tide_type             TEXT    'semidiurnal' / 'mixed' / 'diurnal' / 'unknown'
  tide_source           TEXT    'eot20'
"""

from pathlib import Path

from tqdm import tqdm

from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)
from src.enrich.fes2022_tides import _classify_tide_type, _compute_ranges


EOT20_DIR = Path("data/eot20/ocean_tides/ocean_tides")
# EOT20 uses the same 8 principal constituents we need
CONSTITUENTS = ["M2", "S2", "K1", "O1", "N2", "K2", "P1", "Q1"]
# Neighborhood half-width in grid cells (0.125° each) for coastal fallback
NEIGHBORHOOD_CELLS = 2  # ±2 cells = 0.25° = ~28 km at equator


def _load_constituents(eot20_dir: Path = EOT20_DIR):
    """Open all constituent NetCDFs. Returns dict {name: xarray.Dataset}."""
    import xarray as xr
    missing = []
    datasets = {}
    for c in CONSTITUENTS:
        path = eot20_dir / f"{c}_ocean_eot20.nc"
        if not path.exists():
            missing.append(str(path))
            continue
        datasets[c] = xr.open_dataset(path)
    if missing:
        raise FileNotFoundError(
            f"EOT20 NetCDFs missing: {missing}. "
            f"Download from https://www.seanoe.org/data/00683/79489/ and extract "
            f"ocean_tides.zip into {eot20_dir.parent}."
        )
    return datasets


def _sample_amp(ds, lat: float, lng: float) -> float | None:
    """Sample `amplitude` at (lat, lng) with coastal-NaN fallback.

    Nearest-neighbor first; if NaN, mean of the 5×5 neighborhood (~0.5°).
    Returns amplitude in METERS (EOT20 is stored in cm), or None if the whole
    neighborhood is NaN (fully inland)."""
    # Normalize lng to 0-360 to match EOT20 grid
    lon_360 = lng % 360
    pt = ds.amplitude.sel(lat=lat, lon=lon_360, method="nearest")
    v = float(pt.values)
    if v == v:  # not NaN
        return v / 100.0  # cm → m

    # Coastal fallback — sample small neighborhood
    import numpy as np
    lat_idx = int(ds.lat.searchsorted(lat).item())
    lon_idx = int(ds.lon.searchsorted(lon_360).item())
    nh = NEIGHBORHOOD_CELLS
    lat_slice = slice(max(0, lat_idx - nh), min(len(ds.lat), lat_idx + nh + 1))
    lon_slice = slice(max(0, lon_idx - nh), min(len(ds.lon), lon_idx + nh + 1))
    neighborhood = ds.amplitude.isel(lat=lat_slice, lon=lon_slice).values
    if np.isnan(neighborhood).all():
        return None
    return float(np.nanmean(neighborhood)) / 100.0


def _amp_dict_for_beach(datasets: dict, lat: float, lng: float) -> dict:
    """Return {constituent: amplitude_m} for one beach. Missing/NaN → 0.0.
    If ALL constituents are NaN we return an empty dict (landlocked)."""
    amps = {}
    any_valid = False
    for name, ds in datasets.items():
        v = _sample_amp(ds, lat, lng)
        if v is not None and v == v and v > 0:
            amps[name] = v
            any_valid = True
        else:
            amps[name] = 0.0
    return amps if any_valid else {}


def enrich_eot20_tides(conn, eot20_dir: Path = EOT20_DIR) -> int:
    datasets = _load_constituents(eot20_dir)

    run_id = log_run_start(conn, "eot20_tides", phase="A")
    before = coverage_count(conn, "beaches", "tide_range_spring_m")

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches "
        "WHERE tide_range_spring_m IS NULL AND centroid_lat IS NOT NULL"
    ).fetchall()

    updated = 0
    errors = 0
    for row in tqdm(rows, desc="eot20"):
        try:
            amps = _amp_dict_for_beach(datasets, row["centroid_lat"], row["centroid_lng"])
            if not amps:
                continue  # fully inland; skip
            spring, neap = _compute_ranges(amps)
            if spring == 0 and neap == 0:
                continue
            tide_type = _classify_tide_type(amps)
            conn.execute(
                """UPDATE beaches SET tide_range_spring_m=?, tide_range_neap_m=?,
                   tide_type=?, tide_source='eot20', updated_at=datetime('now')
                   WHERE id=?""",
                (spring, neap, tide_type, row["id"]),
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
            conn, "beaches", "tide_range_spring_m",
            before=before, min_delta=max(1, len(rows) // 3),
        )
    print(f"EOT20: {updated:,} beaches got tidal range ({errors} errors)")
    return updated


if __name__ == "__main__":
    import sys
    from src.enrich._common import open_db
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    db = open_db(db_path)
    enrich_eot20_tides(db)
    db.close()
