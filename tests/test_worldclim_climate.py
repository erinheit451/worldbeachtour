"""
Tests for src.enrich.worldclim_climate.

Tests 1-3 do NOT require rasterio (they verify behaviour before/without real rasters).
Test 4 is an integration test that creates a tiny synthetic raster with rasterio;
it is skipped automatically if rasterio is not importable.
"""

import json
import os
import sqlite3
import tempfile
import zipfile
from pathlib import Path

import pytest


# ---------------------------------------------------------------------------
# Test 1 — _ensure_unzipped is idempotent
# ---------------------------------------------------------------------------

def test_ensure_unzipped_idempotent(tmp_path, monkeypatch):
    """If all sentinel .tif files already exist, _ensure_unzipped does nothing."""
    import src.enrich.worldclim_climate as wc

    # Point the module constants at tmp paths
    wc_dir = tmp_path / "worldclim"
    tifs_dir = wc_dir / "tifs"
    tifs_dir.mkdir(parents=True)

    monkeypatch.setattr(wc, "WORLDCLIM_DIR", wc_dir)
    monkeypatch.setattr(wc, "TIFS_DIR", tifs_dir)

    # Create all sentinel files so the function believes everything is extracted
    for var in ["tavg", "tmin", "tmax", "prec", "srad", "wind"]:
        (tifs_dir / f"wc2.1_2.5m_{var}_01.tif").write_bytes(b"sentinel")

    # Should complete without raising, creating new files, or touching missing zips
    wc._ensure_unzipped()

    # Still just the 6 sentinel files (no extras created)
    all_files = list(tifs_dir.iterdir())
    assert len(all_files) == 6


# ---------------------------------------------------------------------------
# Test 2 — module imports without rasterio (lazy-import check)
# ---------------------------------------------------------------------------

def test_module_importable_without_rasterio(monkeypatch):
    """The module-level import of rasterio must not happen at import time.
    _open_var_rasters is the only function that requires it, so the module
    should be importable even when rasterio is absent."""
    import sys
    import importlib

    # Temporarily hide rasterio
    real_rasterio = sys.modules.pop("rasterio", None)
    try:
        # Remove cached module so it re-executes
        sys.modules.pop("src.enrich.worldclim_climate", None)
        # This import must succeed even without rasterio
        import src.enrich.worldclim_climate as wc  # noqa: F401
        # The top-level constants should be accessible
        assert wc.WORLDCLIM_DIR is not None
        assert len(wc.VARIABLES) == 5
    finally:
        # Restore rasterio if it was present
        if real_rasterio is not None:
            sys.modules["rasterio"] = real_rasterio
        # Reload fresh so subsequent tests use the real module
        sys.modules.pop("src.enrich.worldclim_climate", None)


# ---------------------------------------------------------------------------
# Test 3 — FileNotFoundError when no zips AND no tifs dir
# ---------------------------------------------------------------------------

def test_enrich_raises_when_no_zips_no_tifs(tmp_path, monkeypatch):
    """enrich_worldclim_climate raises FileNotFoundError with a helpful message
    when neither the zip files nor the extracted tifs are present."""
    import src.enrich.worldclim_climate as wc

    wc_dir = tmp_path / "worldclim"
    wc_dir.mkdir()
    tifs_dir = wc_dir / "tifs"
    # Deliberately do NOT create tifs_dir or any zips

    monkeypatch.setattr(wc, "WORLDCLIM_DIR", wc_dir)
    monkeypatch.setattr(wc, "TIFS_DIR", tifs_dir)

    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row

    with pytest.raises(FileNotFoundError) as exc_info:
        wc.enrich_worldclim_climate(conn)

    msg = str(exc_info.value)
    assert "worldclim" in msg.lower() or "wc2" in msg.lower() or "zip" in msg.lower(), \
        f"Error message should mention WorldClim/zip: {msg!r}"


# ---------------------------------------------------------------------------
# Test 4 — Integration: synthetic raster → 12-element array
# ---------------------------------------------------------------------------

rasterio = pytest.importorskip("rasterio", reason="rasterio not installed")


def _write_tiny_tif(path: Path, value: float, nodata: float = -3.4e38) -> None:
    """Write a 4×4 GeoTIFF covering the whole world, filled with `value`."""
    import numpy as np
    import rasterio
    from rasterio.crs import CRS
    from rasterio.transform import from_bounds

    transform = from_bounds(-180, -90, 180, 90, 4, 4)
    data = np.full((1, 4, 4), value, dtype=np.float32)

    with rasterio.open(
        path, "w",
        driver="GTiff",
        height=4, width=4,
        count=1,
        dtype=np.float32,
        crs=CRS.from_epsg(4326),
        transform=transform,
        nodata=nodata,
    ) as dst:
        dst.write(data)


def test_integration_sample_returns_12_element_array(tmp_path, monkeypatch):
    """Create synthetic monthly rasters and verify that a point inside the grid
    returns a 12-element list of floats via enrich_worldclim_climate."""
    import src.enrich.worldclim_climate as wc

    wc_dir = tmp_path / "worldclim"
    tifs_dir = wc_dir / "tifs"
    tifs_dir.mkdir(parents=True)

    monkeypatch.setattr(wc, "WORLDCLIM_DIR", wc_dir)
    monkeypatch.setattr(wc, "TIFS_DIR", tifs_dir)

    # Write 12 monthly tifs for each of the 5 variables we actually use + tavg
    # Use incrementing values per month so we can verify correct reading order
    all_vars = ["tavg", "tmin", "tmax", "prec", "srad", "wind"]
    for var in all_vars:
        for month in range(1, 13):
            tif_path = tifs_dir / f"wc2.1_2.5m_{var}_{month:02d}.tif"
            _write_tiny_tif(tif_path, float(month))  # value = month number

    # Set up an in-memory DB with enrichment_log + beaches tables
    from src.db.schema import init_db
    from src.db.migrate_to_enriched import migrate

    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)

    # Insert one beach at a known location inside the 4×4 raster
    conn.execute(
        "INSERT INTO beaches (id, slug, centroid_lat, centroid_lng) VALUES (?, ?, ?, ?)",
        ("b1", "test-beach", 20.0, 50.0),
    )
    conn.commit()

    count = wc.enrich_worldclim_climate(conn)

    assert count == 1, f"Expected 1 beach enriched, got {count}"

    row = conn.execute(
        "SELECT climate_air_temp_high, climate_air_temp_low, climate_rain_mm, "
        "climate_sun_hours, climate_wind_speed, climate_source FROM beaches WHERE id='b1'"
    ).fetchone()

    # Every climate column should be populated
    assert row["climate_air_temp_high"] is not None
    assert row["climate_air_temp_low"] is not None
    assert row["climate_rain_mm"] is not None
    assert row["climate_sun_hours"] is not None
    assert row["climate_wind_speed"] is not None
    assert row["climate_source"] == "worldclim_v2.1_2.5m"

    # Verify array structure: 12 elements, values match month numbers (1.0–12.0)
    arr = json.loads(row["climate_air_temp_high"])
    assert len(arr) == 12, f"Expected 12 elements, got {len(arr)}: {arr}"
    assert arr[0] == 1.0, f"Jan value should be 1.0 (month index), got {arr[0]}"
    assert arr[11] == 12.0, f"Dec value should be 12.0 (month index), got {arr[11]}"
