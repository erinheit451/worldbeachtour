import math
import pytest

from src.enrich.gebco_bathymetry import (
    _offshore_point, _compute_slope_and_flag, enrich_gebco_bathymetry,
)


def test_offshore_point_moves_north():
    lat2, lng2 = _offshore_point(lat=0, lng=0, bearing_deg=0, distance_m=500)
    assert lat2 > 0
    assert abs(lng2) < 0.001
    # 500m north at equator ≈ 0.00449°
    assert abs(lat2 - 0.00449) < 0.0005


def test_offshore_point_moves_east():
    lat2, lng2 = _offshore_point(lat=0, lng=0, bearing_deg=90, distance_m=500)
    assert abs(lat2) < 0.001
    assert lng2 > 0


def test_slope_gentle():
    # Shore at 0m, offshore at -2m over 500m → 0.4% slope
    slope, flag = _compute_slope_and_flag(0, -2, 500)
    assert abs(slope - 0.4) < 0.01
    assert flag == 0


def test_slope_dropoff():
    # Shore at 0m, offshore at -100m over 500m → 20% slope (drop-off)
    slope, flag = _compute_slope_and_flag(0, -100, 500)
    assert abs(slope - 20.0) < 0.01
    assert flag == 1


def test_slope_boundary_15pct_not_flagged():
    # Exactly at threshold → not a drop-off (strict >)
    slope, flag = _compute_slope_and_flag(0, -75, 500)
    assert abs(slope - 15.0) < 0.01
    assert flag == 0


def test_slope_boundary_15_01pct_flagged():
    slope, flag = _compute_slope_and_flag(0, -75.05, 500)
    assert slope > 15.0
    assert flag == 1


def test_enrich_raises_when_gebco_missing():
    """Without GEBCO NetCDF, the pipeline fails loudly with a helpful message."""
    import sqlite3
    from pathlib import Path
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    with pytest.raises((FileNotFoundError, RuntimeError)) as ei:
        enrich_gebco_bathymetry(conn, path=Path("data/gebco/NOPE.nc"))
    assert "GEBCO" in str(ei.value) or "xarray" in str(ei.value)
