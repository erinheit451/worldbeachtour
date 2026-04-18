import pytest
import geopandas as gpd
from shapely.geometry import Polygon

from src.enrich.gadm_admin import (
    _build_spatial_index,
    _lookup_admin,
    seed_admin_regions,
)


def _sample_gadm_gdf():
    """One polygon covering a rectangular region around Greek Ionian Islands."""
    return gpd.GeoDataFrame(
        {
            "COUNTRY": ["Greece"],
            "GID_0": ["GRC"],
            "NAME_1": ["Ionian Islands"],
            "NAME_2": ["Zakynthos"],
            "NAME_3": ["Volimes"],
        },
        geometry=[Polygon([(20.0, 37.8), (21.0, 37.8), (21.0, 38.0), (20.0, 38.0)])],
        crs="EPSG:4326",
    )


def test_lookup_admin_matches_point_inside_polygon():
    gdf = _sample_gadm_gdf()
    idx = _build_spatial_index(gdf)
    admin = _lookup_admin(idx, lat=37.86, lng=20.62)
    assert admin is not None
    assert admin["country_code"] == "GRC"
    assert admin["admin_l1"] == "Ionian Islands"
    assert admin["admin_l2"] == "Zakynthos"
    assert admin["admin_l3"] == "Volimes"


def test_lookup_admin_returns_none_outside_all_polygons():
    gdf = _sample_gadm_gdf()
    idx = _build_spatial_index(gdf)
    assert _lookup_admin(idx, lat=0.0, lng=0.0) is None


def test_seed_admin_regions_collapses_duplicates(db_with_beaches):
    """Two beaches in the same (country, l1, l2, l3) tuple → one admin_regions row."""
    db_with_beaches.execute(
        "UPDATE beaches SET admin_level_2='X', admin_level_3='Y', "
        "country_code='US', admin_level_1='California' WHERE id IN ('b1','b2')"
    )
    db_with_beaches.execute(
        "UPDATE beaches SET admin_level_2='Q', admin_level_3='R', "
        "country_code='AU', admin_level_1='NSW' WHERE id='b3'"
    )
    db_with_beaches.commit()

    n = seed_admin_regions(db_with_beaches)
    assert n == 2

    rows = db_with_beaches.execute(
        "SELECT country_code, admin_l2 FROM admin_regions ORDER BY country_code"
    ).fetchall()
    assert [(r["country_code"], r["admin_l2"]) for r in rows] == [("AU", "Q"), ("US", "X")]


def test_seed_admin_regions_is_idempotent(db_with_beaches):
    """Re-running seed must not duplicate rows."""
    db_with_beaches.execute(
        "UPDATE beaches SET admin_level_2='X', admin_level_3='Y', "
        "country_code='US', admin_level_1='CA' WHERE id='b1'"
    )
    db_with_beaches.commit()
    first = seed_admin_regions(db_with_beaches)
    second = seed_admin_regions(db_with_beaches)
    assert first == 1
    assert second == 0
