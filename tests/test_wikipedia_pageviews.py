"""Tests for src/enrich/wikipedia_pageviews.py"""

from unittest.mock import patch, MagicMock
import json


def test_extract_title():
    from src.enrich.wikipedia_pageviews import _extract_title

    assert _extract_title("https://en.wikipedia.org/wiki/Waikiki") == "Waikiki"
    assert _extract_title("https://en.wikipedia.org/wiki/Bondi_Beach") == "Bondi_Beach"
    assert (
        _extract_title("https://en.wikipedia.org/wiki/Copacabana_(Rio_de_Janeiro)")
        == "Copacabana_(Rio_de_Janeiro)"
    )
    assert _extract_title(None) is None
    assert _extract_title("https://fr.wikipedia.org/wiki/Plage") is None  # non-English


def test_extract_title_encoded():
    from src.enrich.wikipedia_pageviews import _extract_title

    assert (
        _extract_title("https://en.wikipedia.org/wiki/Waik%C4%ABk%C4%AB")
        == "Waik%C4%ABk%C4%AB"
    )


def test_extract_title_edge_cases():
    from src.enrich.wikipedia_pageviews import _extract_title

    # Missing /wiki/ prefix
    assert _extract_title("https://en.wikipedia.org/") is None
    # Empty title after /wiki/
    assert _extract_title("https://en.wikipedia.org/wiki/") is None
    # Non-Wikipedia domain
    assert _extract_title("https://wikidata.org/wiki/Q12345") is None


def test_fetch_annual_views_success():
    """Test that monthly views are summed correctly."""
    from src.enrich.wikipedia_pageviews import _fetch_annual_views

    fake_response = json.dumps({
        "items": [
            {"views": 10000},
            {"views": 20000},
            {"views": 15000},
        ]
    }).encode("utf-8")

    mock_resp = MagicMock()
    mock_resp.read.return_value = fake_response
    mock_resp.__enter__ = lambda s: s
    mock_resp.__exit__ = MagicMock(return_value=False)

    with patch("urllib.request.urlopen", return_value=mock_resp):
        result = _fetch_annual_views("Bondi_Beach")

    assert result == 45000


def test_fetch_annual_views_404():
    """Test that 404 responses return None instead of raising."""
    import urllib.error
    from src.enrich.wikipedia_pageviews import _fetch_annual_views

    with patch(
        "urllib.request.urlopen",
        side_effect=urllib.error.HTTPError(None, 404, "Not Found", {}, None),
    ):
        result = _fetch_annual_views("NonexistentBeach_XYZ")

    assert result is None


def test_enrich_wikipedia_pageviews_dry_run(db_with_beaches):
    """Test dry_run mode updates nothing in DB but returns correct counts."""
    conn = db_with_beaches

    # Set up two beaches: one with wikipedia_url, one without
    conn.execute(
        "UPDATE beaches SET wikipedia_url = 'https://en.wikipedia.org/wiki/Bondi_Beach' WHERE id = 'b3'"
    )
    conn.execute(
        "UPDATE beaches SET wikipedia_url = 'https://en.wikipedia.org/wiki/Waikiki' WHERE id = 'b1'"
    )
    conn.commit()

    fake_response = json.dumps({
        "items": [{"views": 5000}, {"views": 3000}]
    }).encode("utf-8")

    mock_resp = MagicMock()
    mock_resp.read.return_value = fake_response
    mock_resp.__enter__ = lambda s: s
    mock_resp.__exit__ = MagicMock(return_value=False)

    with patch("urllib.request.urlopen", return_value=mock_resp):
        with patch("time.sleep"):
            from src.enrich.wikipedia_pageviews import enrich_wikipedia_pageviews
            result = enrich_wikipedia_pageviews(conn, dry_run=True)

    assert result["updated"] == 2
    assert result["errors"] == 0

    # dry_run: DB should NOT be updated
    views = conn.execute(
        "SELECT wikipedia_page_views_annual FROM beaches WHERE id = 'b3'"
    ).fetchone()[0]
    assert views is None


def test_enrich_wikipedia_pageviews_writes(db_with_beaches):
    """Test that real run writes page views to DB."""
    conn = db_with_beaches

    conn.execute(
        "UPDATE beaches SET wikipedia_url = 'https://en.wikipedia.org/wiki/Bondi_Beach' WHERE id = 'b3'"
    )
    conn.commit()

    fake_response = json.dumps({
        "items": [{"views": 12345}]
    }).encode("utf-8")

    mock_resp = MagicMock()
    mock_resp.read.return_value = fake_response
    mock_resp.__enter__ = lambda s: s
    mock_resp.__exit__ = MagicMock(return_value=False)

    with patch("urllib.request.urlopen", return_value=mock_resp):
        with patch("time.sleep"):
            from src.enrich.wikipedia_pageviews import enrich_wikipedia_pageviews
            result = enrich_wikipedia_pageviews(conn, dry_run=False)

    assert result["updated"] == 1
    views = conn.execute(
        "SELECT wikipedia_page_views_annual FROM beaches WHERE id = 'b3'"
    ).fetchone()[0]
    assert views == 12345


def test_skips_already_enriched(db_with_beaches):
    """Beaches with wikipedia_page_views_annual already set are skipped."""
    conn = db_with_beaches

    conn.execute(
        """UPDATE beaches SET
           wikipedia_url = 'https://en.wikipedia.org/wiki/Bondi_Beach',
           wikipedia_page_views_annual = 99999
           WHERE id = 'b3'"""
    )
    conn.commit()

    with patch("urllib.request.urlopen") as mock_open:
        with patch("time.sleep"):
            from src.enrich.wikipedia_pageviews import enrich_wikipedia_pageviews
            result = enrich_wikipedia_pageviews(conn)

    mock_open.assert_not_called()
    assert result["processed"] == 0


def test_resolve_wikidata_to_wikipedia_title(monkeypatch):
    """Given a Wikidata QID, return the English Wikipedia page title via sitelinks."""
    from src.enrich import wikipedia_pageviews as wp

    fake_response = {
        "entities": {
            "Q180402": {
                "sitelinks": {
                    "enwiki": {"title": "Bondi Beach"},
                    "eswiki": {"title": "Playa Bondi"},
                }
            }
        }
    }

    class FakeResp:
        status_code = 200
        url = "https://www.wikidata.org/..."
        text = ""
        def json(self): return fake_response
        def raise_for_status(self): pass

    monkeypatch.setattr(wp.requests, "get", lambda *a, **k: FakeResp())
    assert wp.resolve_wikidata_to_wikipedia_title("Q180402") == "Bondi Beach"


def test_resolve_wikidata_returns_none_when_no_sitelink(monkeypatch):
    """If the entity has no enwiki sitelink, return None (don't raise)."""
    from src.enrich import wikipedia_pageviews as wp

    class FakeResp:
        status_code = 200
        url = "https://www.wikidata.org/..."
        text = ""
        def json(self): return {"entities": {"Q1": {"sitelinks": {"eswiki": {"title": "x"}}}}}
        def raise_for_status(self): pass

    monkeypatch.setattr(wp.requests, "get", lambda *a, **k: FakeResp())
    assert wp.resolve_wikidata_to_wikipedia_title("Q1") is None


def test_resolve_wikidata_raises_on_429(monkeypatch):
    from src.enrich import wikipedia_pageviews as wp
    from src.enrich._common import HttpError

    class FakeResp:
        status_code = 429
        text = "rate limited"
        url = "https://www.wikidata.org/..."

    monkeypatch.setattr(wp.requests, "get", lambda *a, **k: FakeResp())
    import pytest
    with pytest.raises(HttpError):
        wp.resolve_wikidata_to_wikipedia_title("Q180402")


def test_expand_pageviews_updates_db(db_with_beaches, monkeypatch):
    """Driver resolves QID→title and writes both wikipedia_url and page views."""
    from src.enrich import wikipedia_pageviews as wp

    db_with_beaches.execute("UPDATE beaches SET wikidata_id='Q180402' WHERE id='b3'")
    db_with_beaches.commit()

    monkeypatch.setattr(wp, "resolve_wikidata_to_wikipedia_title", lambda qid, lang="en": "Bondi Beach")
    monkeypatch.setattr(wp, "_fetch_annual_views", lambda title: 50000)
    monkeypatch.setattr(wp.time, "sleep", lambda *a, **k: None)  # skip rate-limit wait in tests

    count = wp.expand_pageviews(db_with_beaches)
    assert count == 1

    row = db_with_beaches.execute(
        "SELECT wikipedia_url, wikipedia_page_views_annual FROM beaches WHERE id='b3'"
    ).fetchone()
    assert row["wikipedia_url"] == "https://en.wikipedia.org/wiki/Bondi_Beach"
    assert row["wikipedia_page_views_annual"] == 50000


def test_expand_pageviews_skips_beach_when_no_sitelink(db_with_beaches, monkeypatch):
    """If the QID has no enwiki sitelink, the beach is skipped (no URL/views written)."""
    from src.enrich import wikipedia_pageviews as wp

    db_with_beaches.execute("UPDATE beaches SET wikidata_id='Q9999' WHERE id='b3'")
    db_with_beaches.commit()

    monkeypatch.setattr(wp, "resolve_wikidata_to_wikipedia_title", lambda qid, lang="en": None)
    monkeypatch.setattr(wp.time, "sleep", lambda *a, **k: None)

    count = wp.expand_pageviews(db_with_beaches)
    assert count == 0

    row = db_with_beaches.execute(
        "SELECT wikipedia_url, wikipedia_page_views_annual FROM beaches WHERE id='b3'"
    ).fetchone()
    assert row["wikipedia_url"] is None
    assert row["wikipedia_page_views_annual"] is None


def test_fetch_annual_views_raises_httperror_on_429(monkeypatch):
    """_fetch_annual_views now translates urllib HTTPError(429) → HttpError."""
    import urllib.error
    from src.enrich import wikipedia_pageviews as wp
    from src.enrich._common import HttpError
    import pytest

    def fake_urlopen(*a, **k):
        raise urllib.error.HTTPError(
            url="https://wikimedia/...", code=429, msg="Too Many Requests",
            hdrs={}, fp=None,
        )
    monkeypatch.setattr(wp.urllib.request, "urlopen", fake_urlopen)

    with pytest.raises(HttpError) as ei:
        wp._fetch_annual_views("Bondi_Beach")
    assert ei.value.status_code == 429


def test_fetch_annual_views_raises_httperror_on_5xx(monkeypatch):
    import urllib.error
    from src.enrich import wikipedia_pageviews as wp
    from src.enrich._common import HttpError
    import pytest

    def fake_urlopen(*a, **k):
        raise urllib.error.HTTPError(
            url="https://wikimedia/...", code=503, msg="Service Unavailable",
            hdrs={}, fp=None,
        )
    monkeypatch.setattr(wp.urllib.request, "urlopen", fake_urlopen)

    with pytest.raises(HttpError):
        wp._fetch_annual_views("Bondi_Beach")


def test_fetch_annual_views_still_returns_none_on_404(monkeypatch):
    """Existing 404 behavior preserved (no regression)."""
    import urllib.error
    from src.enrich import wikipedia_pageviews as wp

    def fake_urlopen(*a, **k):
        raise urllib.error.HTTPError(
            url="https://wikimedia/...", code=404, msg="Not Found",
            hdrs={}, fp=None,
        )
    monkeypatch.setattr(wp.urllib.request, "urlopen", fake_urlopen)

    assert wp._fetch_annual_views("Nonexistent_Beach_xyz") is None


def test_expand_pageviews_reraises_wikimedia_429(db_with_beaches, monkeypatch):
    """A 429 from the pageviews endpoint should break the loop, not be silently counted."""
    from src.enrich import wikipedia_pageviews as wp
    from src.enrich._common import HttpError
    import pytest

    db_with_beaches.execute("UPDATE beaches SET wikidata_id='Q180402' WHERE id='b3'")
    db_with_beaches.commit()

    monkeypatch.setattr(wp, "resolve_wikidata_to_wikipedia_title", lambda qid, lang="en": "Bondi Beach")
    def boom(title):
        raise HttpError("rate-limited", status_code=429, url="https://wikimedia/...")
    monkeypatch.setattr(wp, "_fetch_annual_views", boom)
    monkeypatch.setattr(wp.time, "sleep", lambda *a, **k: None)

    with pytest.raises(HttpError):
        wp.expand_pageviews(db_with_beaches)


def test_expand_pageviews_throttles_even_on_skip_path(db_with_beaches, monkeypatch):
    """time.sleep must fire for every iteration, including no-sitelink beaches."""
    from src.enrich import wikipedia_pageviews as wp

    # Three beaches with wikidata_ids, all with no enwiki sitelink
    db_with_beaches.execute("UPDATE beaches SET wikidata_id='Q1' WHERE id='b1'")
    db_with_beaches.execute("UPDATE beaches SET wikidata_id='Q2' WHERE id='b2'")
    db_with_beaches.execute("UPDATE beaches SET wikidata_id='Q3' WHERE id='b3'")
    db_with_beaches.commit()

    monkeypatch.setattr(wp, "resolve_wikidata_to_wikipedia_title", lambda qid, lang="en": None)
    sleep_calls = []
    monkeypatch.setattr(wp.time, "sleep", lambda s: sleep_calls.append(s))

    wp.expand_pageviews(db_with_beaches)
    # Three iterations, three throttles — even though all are skipped
    assert len(sleep_calls) == 3
