import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate


@pytest.fixture
def fresh_db():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    return conn


def _column_names(conn, table):
    return [r[1] for r in conn.execute(f"PRAGMA table_info({table})").fetchall()]


def _table_exists(conn, table):
    return conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (table,)
    ).fetchone() is not None


def test_migration_adds_climate_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "climate_air_temp_high" in cols
    assert "climate_grid_cell" in cols
    assert "ocean_water_temp" in cols


def test_migration_adds_physical_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "sand_color" in cols
    assert "coastal_type" in cols
    assert "orientation_deg" in cols
    assert "nearest_city" in cols
    assert "nearest_airport_iata" in cols


def test_migration_adds_safety_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "water_quality_rating" in cols
    assert "blue_flag" in cols
    assert "shark_incidents_total" in cols
    assert "lifeguard" in cols


def test_migration_adds_facilities_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "has_parking" in cols
    assert "has_restrooms" in cols
    assert "wheelchair_accessible" in cols


def test_migration_adds_ecology_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "protected_area_name" in cols
    assert "coral_reef_distance_km" in cols
    assert "species_observed_count" in cols


def test_migration_adds_popularity_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "wikipedia_url" in cols
    assert "notability_score" in cols
    assert "data_completeness_pct" in cols


def test_migration_adds_computed_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "best_months" in cols
    assert "swim_suitability" in cols
    assert "enrichment_version" in cols


def test_migration_creates_new_tables(fresh_db):
    migrate(fresh_db)
    assert _table_exists(fresh_db, "beach_photos")
    assert _table_exists(fresh_db, "beach_species")
    assert _table_exists(fresh_db, "climate_grid_cells")
    assert _table_exists(fresh_db, "enrichment_log")


def test_migration_is_idempotent(fresh_db):
    migrate(fresh_db)
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "climate_air_temp_high" in cols


def test_migration_preserves_existing_data(fresh_db):
    fresh_db.execute(
        """INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng)
           VALUES ('test1', 'Test Beach', 'test-beach', 10.0, 20.0)"""
    )
    fresh_db.commit()
    migrate(fresh_db)
    row = fresh_db.execute("SELECT name, climate_air_temp_high FROM beaches WHERE id='test1'").fetchone()
    assert row["name"] == "Test Beach"
    assert row["climate_air_temp_high"] is None


def test_migration_creates_indexes(fresh_db):
    migrate(fresh_db)
    indexes = [r[1] for r in fresh_db.execute("PRAGMA index_list(beaches)").fetchall()]
    assert "idx_beaches_notability" in indexes
    assert "idx_beaches_climate_grid" in indexes


def test_enrichment_log_table_works(fresh_db):
    migrate(fresh_db)
    fresh_db.execute(
        """INSERT INTO enrichment_log (script_name, phase, status, started_at)
           VALUES ('grid_climate', 'phase_1', 'running', datetime('now'))"""
    )
    fresh_db.commit()
    row = fresh_db.execute("SELECT * FROM enrichment_log WHERE script_name='grid_climate'").fetchone()
    assert row["status"] == "running"
