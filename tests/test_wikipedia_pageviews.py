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
