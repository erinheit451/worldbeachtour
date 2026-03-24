import pytest


@pytest.fixture
def enriched_db_with_beaches(enriched_db):
    """enriched_db with test beaches pre-loaded."""
    beaches = [
        ("b1", "Waikiki Beach", "waikiki", 21.274, -157.826, "US", "ocean"),
        ("b2", "Bondi Beach", "bondi", -33.891, 151.274, "AU", "ocean"),
        ("b3", "Lake Beach", "lake-beach", -44.693, 169.132, "NZ", "lake"),
    ]
    for b in beaches:
        enriched_db.execute(
            """INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng,
               country_code, water_body_type)
               VALUES (?, ?, ?, ?, ?, ?, ?)""", b
        )
    enriched_db.commit()
    return enriched_db


def test_nearest_city_populated(enriched_db_with_beaches):
    from src.enrich.computed_fields import enrich_nearest_city
    count = enrich_nearest_city(enriched_db_with_beaches)
    assert count == 3
    row = enriched_db_with_beaches.execute(
        "SELECT nearest_city, nearest_city_distance_km FROM beaches WHERE id='b1'"
    ).fetchone()
    assert row["nearest_city"] is not None
    assert row["nearest_city_distance_km"] is not None
    assert row["nearest_city_distance_km"] < 50


def test_nearest_airport_populated(enriched_db_with_beaches):
    from src.enrich.computed_fields import enrich_nearest_airport
    count = enrich_nearest_airport(enriched_db_with_beaches)
    assert count == 3
    row = enriched_db_with_beaches.execute(
        "SELECT nearest_airport_iata, nearest_airport_distance_km FROM beaches WHERE id='b1'"
    ).fetchone()
    assert row["nearest_airport_iata"] is not None
    assert row["nearest_airport_distance_km"] is not None


def test_substrate_heuristic():
    from src.enrich.computed_fields import substrate_from_name
    assert substrate_from_name("Sandy Beach") == "sand"
    assert substrate_from_name("Rocky Point Beach") == "rock"
    assert substrate_from_name("Pebble Cove") == "pebble"
    assert substrate_from_name("Gravel Beach") == "gravel"
    assert substrate_from_name("Random Name") is None


def test_substrate_heuristic_enrichment(enriched_db_with_beaches):
    from src.enrich.computed_fields import enrich_substrate_heuristic
    enriched_db_with_beaches.execute(
        """INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng, substrate_type)
           VALUES ('bx', 'Sandy Shores', 'sandy-shores', 10, 20, 'unknown')"""
    )
    enriched_db_with_beaches.commit()
    count = enrich_substrate_heuristic(enriched_db_with_beaches)
    assert count >= 1
    row = enriched_db_with_beaches.execute("SELECT substrate_type FROM beaches WHERE id='bx'").fetchone()
    assert row["substrate_type"] == "sand"
