import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate


@pytest.fixture
def db():
    """In-memory SQLite database with current schema initialized."""
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    return conn


@pytest.fixture
def enriched_db():
    """In-memory SQLite database with enriched schema (migrated)."""
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    return conn


@pytest.fixture
def db_with_beaches(enriched_db):
    """Enriched DB with 5 sample beaches for testing enrichment."""
    beaches = [
        ("b1", "Waikiki Beach", "waikiki-beach", 21.274, -157.826, "US", "Hawaii", "ocean", "sand"),
        ("b2", "Reynisfjara", "reynisfjara", 63.404, -19.069, "IS", "South", "ocean", "sand"),
        ("b3", "Bondi Beach", "bondi-beach", -33.891, 151.274, "AU", "New South Wales", "ocean", "sand"),
        ("b4", "Lake Wanaka Beach", "lake-wanaka-beach", -44.693, 169.132, "NZ", "Otago", "lake", "sand"),
        ("b5", "No Name Beach", "beach-52.9050-22.5423", 52.905, 22.542, None, None, "ocean", "unknown"),
    ]
    for b in beaches:
        enriched_db.execute(
            """INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng,
               country_code, admin_level_1, water_body_type, substrate_type)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            b,
        )
    enriched_db.commit()
    return enriched_db
