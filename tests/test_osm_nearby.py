import pytest


def test_classify_nearby():
    from src.enrich.osm_nearby import _classify_nearby
    elements = [
        {"tags": {"amenity": "toilets"}},
        {"tags": {"amenity": "parking"}},
        {"tags": {"amenity": "restaurant"}},
        {"tags": {"amenity": "cafe"}},
        {"tags": {"emergency": "lifeguard"}},
    ]
    result = _classify_nearby(elements)
    assert result["has_restrooms"] == 1
    assert result["has_parking"] == 1
    assert result["has_food_nearby"] == 1
    assert result["lifeguard"] == 1


def test_classify_empty():
    from src.enrich.osm_nearby import _classify_nearby
    result = _classify_nearby([])
    assert result == {}


def test_classify_irrelevant():
    from src.enrich.osm_nearby import _classify_nearby
    result = _classify_nearby([{"tags": {"amenity": "bank"}}])
    assert result == {}


def test_classify_showers():
    from src.enrich.osm_nearby import _classify_nearby
    result = _classify_nearby([{"tags": {"amenity": "shower"}}])
    assert result["has_showers"] == 1


def test_classify_camping():
    from src.enrich.osm_nearby import _classify_nearby
    result = _classify_nearby([{"tags": {"tourism": "camp_site"}}])
    assert result["camping_allowed"] == 1


def test_classify_drinking_water_ignored():
    """drinking_water has no column — should not appear in updates."""
    from src.enrich.osm_nearby import _classify_nearby
    result = _classify_nearby([{"tags": {"amenity": "drinking_water"}}])
    assert result == {}


def test_classify_multiple_food():
    """Multiple restaurants/cafes still yield has_food_nearby=1 (not a count)."""
    from src.enrich.osm_nearby import _classify_nearby
    elements = [
        {"tags": {"amenity": "restaurant"}},
        {"tags": {"amenity": "restaurant"}},
        {"tags": {"amenity": "cafe"}},
    ]
    result = _classify_nearby(elements)
    assert result["has_food_nearby"] == 1


def test_enrich_nearby_facilities_marks_processed(enriched_db):
    """enrich_nearby_facilities sets facilities_source even when no amenities found."""
    from unittest.mock import patch
    from src.enrich.osm_nearby import enrich_nearby_facilities

    enriched_db.execute(
        """INSERT INTO beaches (id, slug, centroid_lat, centroid_lng, notability_score)
           VALUES ('b1', 'test-beach', 21.274, -157.826, 100.0)"""
    )
    enriched_db.commit()

    with patch("src.enrich.osm_nearby._query_nearby", return_value=[]):
        count = enrich_nearby_facilities(enriched_db, limit=5)

    row = enriched_db.execute(
        "SELECT facilities_source FROM beaches WHERE id = 'b1'"
    ).fetchone()
    assert row[0] == "osm_nearby"
    # 0 updated because no facilities found, but beach was still processed
    assert count == 0


def test_enrich_nearby_facilities_updates_columns(enriched_db):
    """enrich_nearby_facilities writes facility flags to the DB."""
    from unittest.mock import patch
    from src.enrich.osm_nearby import enrich_nearby_facilities

    enriched_db.execute(
        """INSERT INTO beaches (id, slug, centroid_lat, centroid_lng, notability_score)
           VALUES ('b2', 'bondi-beach', -33.891, 151.274, 200.0)"""
    )
    enriched_db.commit()

    fake_elements = [
        {"tags": {"amenity": "toilets"}},
        {"tags": {"amenity": "parking"}},
        {"tags": {"emergency": "lifeguard"}},
    ]
    with patch("src.enrich.osm_nearby._query_nearby", return_value=fake_elements):
        count = enrich_nearby_facilities(enriched_db, limit=5)

    row = enriched_db.execute(
        "SELECT has_restrooms, has_parking, lifeguard, facilities_source FROM beaches WHERE id = 'b2'"
    ).fetchone()
    assert row[0] == 1  # has_restrooms
    assert row[1] == 1  # has_parking
    assert row[2] == 1  # lifeguard
    assert row[3] == "osm_nearby"
    assert count == 1


def test_enrich_skips_already_processed(enriched_db):
    """Beaches with facilities_source already set are skipped."""
    from unittest.mock import patch
    from src.enrich.osm_nearby import enrich_nearby_facilities

    enriched_db.execute(
        """INSERT INTO beaches (id, slug, centroid_lat, centroid_lng, notability_score, facilities_source)
           VALUES ('b3', 'already-done', 10.0, 10.0, 50.0, 'osm_nearby')"""
    )
    enriched_db.commit()

    with patch("src.enrich.osm_nearby._query_nearby") as mock_q:
        enrich_nearby_facilities(enriched_db, limit=5)
        mock_q.assert_not_called()
