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


class _FakeResp:
    def __init__(self, status_code, url="https://example/x", text=""):
        self.status_code = status_code
        self.url = url
        self.text = text

    def raise_for_status(self):
        if not (200 <= self.status_code < 300):
            import requests
            raise requests.exceptions.HTTPError(f"{self.status_code}", response=self)


def test_raise_for_http_ok():
    from src.enrich._common import raise_for_http
    raise_for_http(_FakeResp(200))
    raise_for_http(_FakeResp(204))


def test_raise_for_http_429():
    from src.enrich._common import raise_for_http, HttpError
    with pytest.raises(HttpError) as ei:
        raise_for_http(_FakeResp(429, text="too many"))
    assert ei.value.status_code == 429


def test_raise_for_http_auth():
    from src.enrich._common import raise_for_http, HttpError
    for code in (401, 403):
        with pytest.raises(HttpError) as ei:
            raise_for_http(_FakeResp(code))
        assert ei.value.status_code == code


def test_raise_for_http_5xx():
    from src.enrich._common import raise_for_http, HttpError
    with pytest.raises(HttpError) as ei:
        raise_for_http(_FakeResp(503, text="down"))
    assert ei.value.status_code == 503


def test_raise_for_http_4xx_other():
    """Non-429/auth 4xx should now raise HttpError too (unified taxonomy)."""
    from src.enrich._common import raise_for_http, HttpError
    with pytest.raises(HttpError) as ei:
        raise_for_http(_FakeResp(404))
    assert ei.value.status_code == 404


def test_check_ident_valid():
    from src.enrich._common import _check_ident
    _check_ident("beaches")
    _check_ident("wikipedia_page_views_annual")


def test_check_ident_rejects_injection():
    from src.enrich._common import _check_ident
    with pytest.raises(ValueError):
        _check_ident("beaches; DROP TABLE beaches")
    with pytest.raises(ValueError):
        _check_ident("a b")
