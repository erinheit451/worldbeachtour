import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate


@pytest.fixture
def enriched_db_sharks():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    # Bondi Beach, Sydney — known shark area
    conn.execute(
        """INSERT INTO beaches (id, slug, name, centroid_lat, centroid_lng)
           VALUES ('b1', 'bondi', 'Bondi Beach', -33.891, 151.274)"""
    )
    # Remote beach, no incidents nearby
    conn.execute(
        """INSERT INTO beaches (id, slug, name, centroid_lat, centroid_lng)
           VALUES ('b2', 'remote', 'Remote Beach', 0.0, 0.0)"""
    )
    conn.commit()
    return conn


def test_haversine():
    from src.enrich.shark_incidents import _haversine_km
    # Sydney to nearby point (~1km)
    d = _haversine_km(-33.891, 151.274, -33.900, 151.274)
    assert 0.5 < d < 2.0


def test_parse_incident():
    from src.enrich.shark_incidents import _parse_incident_row
    row = {
        "Latitude": "-33.89",
        "Longitude": "151.27",
        "Year": "2020",
    }
    result = _parse_incident_row(row)
    assert result is not None
    assert result["lat"] == pytest.approx(-33.89)
    assert result["year"] == 2020


def test_parse_incident_bad_data():
    from src.enrich.shark_incidents import _parse_incident_row
    assert _parse_incident_row({"Latitude": "", "Longitude": "", "Year": ""}) is None
    assert _parse_incident_row({"Latitude": "abc", "Longitude": "def", "Year": "xyz"}) is None
