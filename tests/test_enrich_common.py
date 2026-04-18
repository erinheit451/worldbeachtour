import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate
from src.enrich._common import (
    coverage_count, log_run_start, log_run_finish, CoverageAssertionError,
    assert_coverage_delta,
)


@pytest.fixture
def db():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    conn.execute("INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng) VALUES ('b1','A','a',0,0)")
    conn.execute("INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng) VALUES ('b2','B','b',0,0)")
    conn.commit()
    return conn


def test_coverage_count_none(db):
    assert coverage_count(db, "beaches", "notability_score") == 0


def test_coverage_count_one(db):
    db.execute("UPDATE beaches SET notability_score=1.0 WHERE id='b1'")
    assert coverage_count(db, "beaches", "notability_score") == 1


def test_log_run_lifecycle(db):
    run_id = log_run_start(db, "test_pipeline", phase="A")
    assert isinstance(run_id, int)
    log_run_finish(db, run_id, status="ok", total_processed=42)
    row = db.execute("SELECT status, total_processed FROM enrichment_log WHERE id=?", (run_id,)).fetchone()
    assert row["status"] == "ok"
    assert row["total_processed"] == 42


def test_assert_coverage_delta_ok(db):
    db.execute("UPDATE beaches SET notability_score=1.0 WHERE id='b1'")
    assert_coverage_delta(db, "beaches", "notability_score", before=0, min_delta=1)


def test_assert_coverage_delta_fails(db):
    with pytest.raises(CoverageAssertionError):
        assert_coverage_delta(db, "beaches", "notability_score", before=0, min_delta=10)
