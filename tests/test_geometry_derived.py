import json
import pytest
from src.enrich.geometry_derived import (
    compute_length_and_orientation,
    enrich_geometry_derived,
    _orientation_label,
)


def _wide_rect(lat, lng, half_lng=0.005, half_lat=0.0005):
    """East-west rect: longer side along longitude (east-west orientation)."""
    return {
        "type": "Polygon",
        "coordinates": [[
            [lng - half_lng, lat - half_lat],
            [lng + half_lng, lat - half_lat],
            [lng + half_lng, lat + half_lat],
            [lng - half_lng, lat + half_lat],
            [lng - half_lng, lat - half_lat],
        ]],
    }


def test_length_computed_in_meters():
    geom = _wide_rect(0, 0)
    length, _ = compute_length_and_orientation(geom)
    # 0.01° of longitude at equator ≈ 1113 m
    assert 900 < length < 1300


def test_orientation_east_west():
    geom = _wide_rect(0, 0)
    _, bearing = compute_length_and_orientation(geom)
    # Long side along longitude → bearing ~90° (normalized to [0, 180))
    assert bearing is not None
    assert 80 <= bearing <= 100


def test_orientation_label_cardinals():
    assert _orientation_label(0) == "N"
    assert _orientation_label(90) == "E"
    assert _orientation_label(180) == "S"
    assert _orientation_label(270) == "W"
    assert _orientation_label(269) == "W"  # just inside W sector
    assert _orientation_label(360 % 360) == "N"


def test_empty_geometry_returns_zero_length():
    empty = {"type": "Polygon", "coordinates": [[]]}
    length, bearing = compute_length_and_orientation(empty)
    assert length == 0.0
    assert bearing is None


def test_enrich_geometry_updates_db(db_with_beaches):
    db_with_beaches.execute(
        "UPDATE beaches SET geometry_geojson=? WHERE id='b1'",
        (json.dumps(_wide_rect(21.274, -157.826)),),
    )
    db_with_beaches.commit()

    n = enrich_geometry_derived(db_with_beaches)
    assert n == 1

    row = db_with_beaches.execute(
        "SELECT beach_length_m, orientation_deg, orientation_label, sunset_visible "
        "FROM beaches WHERE id='b1'"
    ).fetchone()
    assert 900 < row["beach_length_m"] < 1300
    assert row["orientation_deg"] is not None
    assert row["orientation_label"] in ("N", "NE", "E", "SE", "S", "SW", "W", "NW")


def test_enrich_geometry_skips_beach_without_polygon(db_with_beaches):
    # b1 has no geometry_geojson set → should be skipped
    n = enrich_geometry_derived(db_with_beaches)
    # 0 updates since none of the sample beaches have geometries
    assert n == 0
