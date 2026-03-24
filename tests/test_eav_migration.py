import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate


@pytest.fixture
def db_with_eav():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    # Insert a beach
    conn.execute(
        """INSERT INTO beaches (id, slug, name, centroid_lat, centroid_lng)
           VALUES ('b1', 'test-beach', 'Test Beach', 10, 20)"""
    )
    # Insert a source
    conn.execute(
        """INSERT INTO beach_sources (id, beach_id, source_name, source_id)
           VALUES ('s1', 'b1', 'eu_bathing', 'EU123')"""
    )
    # Insert EAV attributes
    attrs = [
        ("a1", "b1", "environment", "water_quality_rating", "excellent", "string", "s1"),
        ("a2", "b1", "safety", "lifeguard", "true", "boolean", "s1"),
        ("a3", "b1", "facilities", "restrooms", "true", "boolean", "s1"),
        ("a4", "b1", "facilities", "showers", "true", "boolean", "s1"),
        ("a5", "b1", "facilities", "wheelchair_access", "false", "boolean", "s1"),
        ("a6", "b1", "social", "nudist", "designated", "string", "s1"),
        ("a7", "b1", "social", "dog_friendly", "true", "boolean", "s1"),
        ("a8", "b1", "social", "wikipedia_url", "https://en.wikipedia.org/wiki/Test", "string", "s1"),
    ]
    for a in attrs:
        conn.execute(
            """INSERT INTO beach_attributes (id, beach_id, category, key, value, value_type, source_id)
               VALUES (?, ?, ?, ?, ?, ?, ?)""", a
        )
    conn.commit()
    return conn


def test_water_quality_migrated(db_with_eav):
    from src.enrich.eav_migration import migrate_eav_to_flat
    count = migrate_eav_to_flat(db_with_eav)
    assert count > 0
    row = db_with_eav.execute("SELECT water_quality_rating, water_quality_source FROM beaches WHERE id='b1'").fetchone()
    assert row["water_quality_rating"] == "excellent"
    assert row["water_quality_source"] == "eu_bathing"


def test_lifeguard_migrated(db_with_eav):
    from src.enrich.eav_migration import migrate_eav_to_flat
    migrate_eav_to_flat(db_with_eav)
    row = db_with_eav.execute("SELECT lifeguard FROM beaches WHERE id='b1'").fetchone()
    assert row["lifeguard"] == 1


def test_facilities_migrated(db_with_eav):
    from src.enrich.eav_migration import migrate_eav_to_flat
    migrate_eav_to_flat(db_with_eav)
    row = db_with_eav.execute(
        "SELECT has_restrooms, has_showers, wheelchair_accessible FROM beaches WHERE id='b1'"
    ).fetchone()
    assert row["has_restrooms"] == 1
    assert row["has_showers"] == 1
    assert row["wheelchair_accessible"] == 0


def test_social_fields_migrated(db_with_eav):
    from src.enrich.eav_migration import migrate_eav_to_flat
    migrate_eav_to_flat(db_with_eav)
    row = db_with_eav.execute(
        "SELECT nudism, dogs_allowed, wikipedia_url FROM beaches WHERE id='b1'"
    ).fetchone()
    assert row["nudism"] == "designated"
    assert row["dogs_allowed"] == 1
    assert row["wikipedia_url"] == "https://en.wikipedia.org/wiki/Test"


def test_idempotent(db_with_eav):
    from src.enrich.eav_migration import migrate_eav_to_flat
    migrate_eav_to_flat(db_with_eav)
    migrate_eav_to_flat(db_with_eav)  # Should not raise or double-count
    row = db_with_eav.execute("SELECT water_quality_rating FROM beaches WHERE id='b1'").fetchone()
    assert row["water_quality_rating"] == "excellent"
