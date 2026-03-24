"""Tests for src/enrich/wikimedia_photos.py"""

from unittest.mock import patch, MagicMock
import json
import urllib.parse


def test_geosearch_url():
    from src.enrich.wikimedia_photos import _build_geosearch_url

    url = _build_geosearch_url(21.274, -157.826)
    assert "gscoord=21.274%7C-157.826" in url or "gscoord=21.274|-157.826" in url
    assert "gsradius=500" in url
    assert "gsnamespace=6" in url


def test_geosearch_url_southern_hemisphere():
    """Negative coordinates should be preserved correctly."""
    from src.enrich.wikimedia_photos import _build_geosearch_url

    url = _build_geosearch_url(-33.891, 151.274)
    # Negative lat must appear
    assert "-33.891" in urllib.parse.unquote(url)
    assert "151.274" in url


def test_geosearch_returns_list():
    """_geosearch returns a list of hits (may be empty)."""
    from src.enrich.wikimedia_photos import _geosearch

    fake = json.dumps({
        "query": {
            "geosearch": [
                {"title": "File:Bondi_Beach.jpg", "pageid": 1},
                {"title": "File:Bondi_Surf.jpg", "pageid": 2},
            ]
        }
    }).encode("utf-8")

    mock_resp = MagicMock()
    mock_resp.read.return_value = fake
    mock_resp.__enter__ = lambda s: s
    mock_resp.__exit__ = MagicMock(return_value=False)

    with patch("urllib.request.urlopen", return_value=mock_resp):
        results = _geosearch(-33.891, 151.274)

    assert len(results) == 2
    assert results[0]["title"] == "File:Bondi_Beach.jpg"


def test_geosearch_empty_result():
    """Empty geosearch returns an empty list without error."""
    from src.enrich.wikimedia_photos import _geosearch

    fake = json.dumps({"query": {"geosearch": []}}).encode("utf-8")

    mock_resp = MagicMock()
    mock_resp.read.return_value = fake
    mock_resp.__enter__ = lambda s: s
    mock_resp.__exit__ = MagicMock(return_value=False)

    with patch("urllib.request.urlopen", return_value=mock_resp):
        results = _geosearch(0.0, 0.0)

    assert results == []


def test_geosearch_404_returns_empty():
    """404 from geosearch API returns an empty list without raising."""
    import urllib.error
    from src.enrich.wikimedia_photos import _geosearch

    with patch(
        "urllib.request.urlopen",
        side_effect=urllib.error.HTTPError(None, 404, "Not Found", {}, None),
    ):
        results = _geosearch(0.0, 0.0)

    assert results == []


def test_fetch_image_info():
    """_fetch_image_info extracts url, thumbnail, author, license."""
    from src.enrich.wikimedia_photos import _fetch_image_info

    fake = json.dumps({
        "query": {
            "pages": {
                "12345": {
                    "title": "File:Bondi_Beach.jpg",
                    "imageinfo": [{
                        "url": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Bondi_Beach.jpg",
                        "thumburl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bondi_Beach.jpg/640px-Bondi_Beach.jpg",
                        "width": 4000,
                        "height": 3000,
                        "user": "SomePhotographer",
                        "extmetadata": {
                            "Artist": {"value": "Jane Doe"},
                            "LicenseShortName": {"value": "CC BY-SA 4.0"},
                        },
                    }]
                }
            }
        }
    }).encode("utf-8")

    mock_resp = MagicMock()
    mock_resp.read.return_value = fake
    mock_resp.__enter__ = lambda s: s
    mock_resp.__exit__ = MagicMock(return_value=False)

    with patch("urllib.request.urlopen", return_value=mock_resp):
        info = _fetch_image_info(["File:Bondi_Beach.jpg"])

    assert "File:Bondi_Beach.jpg" in info
    meta = info["File:Bondi_Beach.jpg"]
    assert "upload.wikimedia.org" in meta["url"]
    assert meta["license"] == "CC BY-SA 4.0"
    assert meta["author"] == "Jane Doe"
    assert meta["width"] == 4000


def test_enrich_wikimedia_photos_inserts(db_with_beaches):
    """Integration test: photos are inserted and photo_count is updated."""
    conn = db_with_beaches

    # Give b3 (Bondi Beach) a notability score so it's picked up
    conn.execute("UPDATE beaches SET notability_score = 80.0 WHERE id = 'b3'")
    conn.commit()

    geosearch_fake = json.dumps({
        "query": {
            "geosearch": [{"title": "File:Bondi.jpg", "pageid": 999}]
        }
    }).encode("utf-8")

    imageinfo_fake = json.dumps({
        "query": {
            "pages": {
                "999": {
                    "title": "File:Bondi.jpg",
                    "imageinfo": [{
                        "url": "https://upload.wikimedia.org/wikipedia/commons/bondi.jpg",
                        "thumburl": "https://upload.wikimedia.org/wikipedia/commons/thumb/bondi.jpg",
                        "width": 2000,
                        "height": 1500,
                        "user": "Photographer",
                        "extmetadata": {
                            "Artist": {"value": "Alice"},
                            "LicenseShortName": {"value": "CC BY 4.0"},
                        },
                    }]
                }
            }
        }
    }).encode("utf-8")

    call_count = 0

    def fake_urlopen(req, timeout=None):
        nonlocal call_count
        call_count += 1
        mock_resp = MagicMock()
        mock_resp.read.return_value = geosearch_fake if call_count == 1 else imageinfo_fake
        mock_resp.__enter__ = lambda s: s
        mock_resp.__exit__ = MagicMock(return_value=False)
        return mock_resp

    with patch("urllib.request.urlopen", side_effect=fake_urlopen):
        with patch("time.sleep"):
            from src.enrich.wikimedia_photos import enrich_wikimedia_photos
            result = enrich_wikimedia_photos(conn, limit=1)

    assert result["photos_inserted"] == 1
    assert result["beaches_with_photos"] == 1

    photo = conn.execute(
        "SELECT * FROM beach_photos WHERE beach_id = 'b3'"
    ).fetchone()
    assert photo is not None
    assert photo["source"] == "wikimedia_commons"
    assert photo["license"] == "CC BY 4.0"

    photo_count = conn.execute(
        "SELECT photo_count FROM beaches WHERE id = 'b3'"
    ).fetchone()[0]
    assert photo_count == 1


def test_skips_beaches_with_photos(db_with_beaches):
    """Beaches with photo_count > 0 are excluded from the query."""
    conn = db_with_beaches

    # Mark ALL beaches as already having photos — nothing should be fetched
    conn.execute("UPDATE beaches SET photo_count = 5")
    conn.commit()

    with patch("urllib.request.urlopen") as mock_open:
        with patch("time.sleep"):
            from src.enrich.wikimedia_photos import enrich_wikimedia_photos
            result = enrich_wikimedia_photos(conn, limit=10)

    mock_open.assert_not_called()
    assert result["photos_inserted"] == 0
    assert result["beaches_processed"] == 0
