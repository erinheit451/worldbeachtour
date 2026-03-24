import pytest


def test_classify_amenity_toilets():
    from src.enrich.osm_facilities import _classify_amenity
    result = _classify_amenity({"amenity": "toilets"})
    assert result == {"has_restrooms": 1}


def test_classify_amenity_parking():
    from src.enrich.osm_facilities import _classify_amenity
    result = _classify_amenity({"amenity": "parking"})
    assert result == {"has_parking": 1}


def test_classify_amenity_restaurant():
    from src.enrich.osm_facilities import _classify_amenity
    result = _classify_amenity({"amenity": "restaurant"})
    assert result == {"has_food_nearby": 1}


def test_classify_amenity_lifeguard():
    from src.enrich.osm_facilities import _classify_amenity
    result = _classify_amenity({"emergency": "lifeguard"})
    assert result == {"lifeguard": 1}


def test_classify_amenity_unknown():
    from src.enrich.osm_facilities import _classify_amenity
    result = _classify_amenity({"amenity": "bank"})
    assert result == {}


def test_haversine():
    from src.enrich.osm_facilities import _haversine_m
    # ~111m per 0.001° at equator
    d = _haversine_m(0, 0, 0.001, 0)
    assert 100 < d < 120


def test_compute_bboxes(enriched_db):
    from src.enrich.osm_facilities import _compute_bboxes
    enriched_db.execute(
        "INSERT INTO beaches (id, slug, centroid_lat, centroid_lng) VALUES ('b1', 'b1', 21.274, -157.826)"
    )
    enriched_db.execute(
        "INSERT INTO beaches (id, slug, centroid_lat, centroid_lng) VALUES ('b2', 'b2', 21.5, -157.5)"
    )
    enriched_db.commit()
    bboxes = _compute_bboxes(enriched_db)
    assert len(bboxes) >= 1
    # Both beaches should be in the same 5° box
    assert any(south <= 21.274 <= north and west <= -157.826 <= east for south, west, north, east in bboxes)
