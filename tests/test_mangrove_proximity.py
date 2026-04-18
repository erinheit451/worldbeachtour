import math
import sqlite3
from pathlib import Path

import pytest

from src.enrich.mangrove_proximity import (
    _beach_bbox, _deg_per_meter, enrich_mangrove_proximity,
    MANGROVE_BUFFER_M, MANGROVE_LAT_BAND,
)


def test_deg_per_meter_equator():
    lat_per_m, lng_per_m = _deg_per_meter(0.0)
    assert math.isclose(lat_per_m, 1 / 111_320, rel_tol=1e-6)
    assert math.isclose(lng_per_m, 1 / 111_320, rel_tol=1e-3)


def test_deg_per_meter_polar_guard():
    # At pole cos(lat)=0 — guard must prevent divide-by-zero
    _lat, lng = _deg_per_meter(90.0)
    assert lng > 0 and math.isfinite(lng)


def test_beach_bbox_is_roughly_symmetric_at_equator():
    minx, miny, maxx, maxy = _beach_bbox(0.0, 0.0, 1000)
    assert math.isclose(maxx - minx, maxy - miny, rel_tol=1e-3)
    # 1000m ~ 0.009 deg at equator
    assert 0.008 < (maxy - miny) < 0.011


def test_enrich_raises_when_shapefile_missing():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    with pytest.raises(FileNotFoundError) as ei:
        enrich_mangrove_proximity(conn, gmw_path=Path("data/gmw/NOT_HERE.shp"))
    assert "GMW" in str(ei.value) or "zenodo" in str(ei.value).lower()
