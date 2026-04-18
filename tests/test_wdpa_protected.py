import pytest
import geopandas as gpd
from shapely.geometry import Polygon

from src.enrich.wdpa_protected import (
    _build_spatial_index,
    _lookup_wdpa,
    _match_beach_to_wdpa,
    enrich_wdpa_protected,
)


def _sample_wdpa_gdf(name="Cousteau Marine Park", desig_eng="Marine Protected Area", iucn="II"):
    return gpd.GeoDataFrame(
        {
            "NAME": [name],
            "DESIG_ENG": [desig_eng],
            "IUCN_CAT": [iucn],
            "DESIG_TYPE": ["National"],
            "WDPAID": [12345],
        },
        geometry=[Polygon([(10.0, 40.0), (11.0, 40.0), (11.0, 41.0), (10.0, 41.0)])],
        crs="EPSG:4326",
    )


def test_match_point_inside_polygon():
    gdf = _sample_wdpa_gdf()
    match = _match_beach_to_wdpa(gdf, lat=40.5, lng=10.5)
    assert match is not None
    assert match["name"] == "Cousteau Marine Park"
    assert match["iucn"] == "II"
    assert match["type"] == "Marine Protected Area"
    assert match["unesco"] is None  # not a World Heritage site


def test_match_point_outside_returns_none():
    gdf = _sample_wdpa_gdf()
    assert _match_beach_to_wdpa(gdf, lat=0.0, lng=0.0) is None


def test_match_flags_world_heritage():
    gdf = _sample_wdpa_gdf(name="Great Barrier Reef", desig_eng="World Heritage Site (natural)")
    match = _match_beach_to_wdpa(gdf, lat=40.5, lng=10.5)
    assert match is not None
    assert match["unesco"] == "Great Barrier Reef"


def test_enrich_wdpa_missing_dir_raises():
    """Pipeline fails loudly with a helpful message when shapefiles aren't present."""
    import sqlite3
    from pathlib import Path
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    with pytest.raises(FileNotFoundError) as ei:
        enrich_wdpa_protected(conn, wdpa_dir=Path("data/wdpa-absent"))
    assert "WDPA" in str(ei.value)
    assert "protectedplanet" in str(ei.value)
