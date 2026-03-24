"""
Search Wikimedia Commons for geotagged photos near each beach and store them.

Two-step API usage per beach:
  1. Geosearch: find Commons pages (File: namespace) within 500m of the beach centroid.
  2. Image info: fetch URL, thumbnail, author, and license for each result.

Processes beaches ordered by notability_score DESC, limited to a configurable cap
(default 10,000) so API budget is not wasted on remote unnamed beaches.
Skips beaches that already have photo_count > 0.
"""

import sys
import time
import urllib.parse
import urllib.request
import json
from tqdm import tqdm

COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "WorldBeachTour/1.0 (https://worldbeachtour.com; contact@worldbeachtour.com)"
DELAY_S = 0.5
BATCH_SIZE = 200
DEFAULT_LIMIT = 10_000
GEOSEARCH_RADIUS_M = 500
GEOSEARCH_MAX_RESULTS = 10
THUMBNAIL_WIDTH = 640


def _build_geosearch_url(lat: float, lng: float) -> str:
    """Build the Wikimedia Commons geosearch API URL for a coordinate pair."""
    params = urllib.parse.urlencode({
        "action": "query",
        "list": "geosearch",
        "gscoord": f"{lat}|{lng}",
        "gsradius": GEOSEARCH_RADIUS_M,
        "gsnamespace": 6,  # File namespace
        "gslimit": GEOSEARCH_MAX_RESULTS,
        "format": "json",
    })
    return f"{COMMONS_API}?{params}"


def _geosearch(lat: float, lng: float) -> list[dict]:
    """Return list of geosearch hit dicts (title, pageid, …)."""
    url = _build_geosearch_url(lat, lng)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        if exc.code in (404, 429):
            return []
        raise
    return data.get("query", {}).get("geosearch", [])


def _fetch_image_info(titles: list[str]) -> dict[str, dict]:
    """
    Fetch imageinfo for a list of File: page titles.

    Returns a dict keyed by title with image metadata.
    """
    params = urllib.parse.urlencode({
        "action": "query",
        "titles": "|".join(titles),
        "prop": "imageinfo",
        "iiprop": "url|size|user|extmetadata",
        "iiurlwidth": THUMBNAIL_WIDTH,
        "format": "json",
    })
    url = f"{COMMONS_API}?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception:
        return {}

    result = {}
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        title = page.get("title", "")
        imageinfos = page.get("imageinfo", [])
        if not imageinfos:
            continue
        info = imageinfos[0]
        extmeta = info.get("extmetadata", {})
        result[title] = {
            "url": info.get("url"),
            "thumbnail_url": info.get("thumburl"),
            "width": info.get("width"),
            "height": info.get("height"),
            "author": extmeta.get("Artist", {}).get("value") or info.get("user"),
            "license": extmeta.get("LicenseShortName", {}).get("value"),
            "title": page.get("title", "").replace("File:", ""),
        }
    return result


def enrich_wikimedia_photos(conn, limit: int = DEFAULT_LIMIT) -> dict:
    """
    Fetch Wikimedia Commons photos for top beaches by notability_score.

    Inserts rows into beach_photos and updates photo_count on beaches.
    Returns a dict with keys: beaches_processed, photos_inserted, beaches_with_photos.
    """
    rows = conn.execute(
        """SELECT id, centroid_lat, centroid_lng, notability_score
           FROM beaches
           WHERE centroid_lat IS NOT NULL
             AND centroid_lng IS NOT NULL
             AND (photo_count IS NULL OR photo_count = 0)
           ORDER BY notability_score DESC NULLS LAST
           LIMIT ?""",
        (limit,),
    ).fetchall()

    beaches_processed = 0
    photos_inserted = 0
    beaches_with_photos = 0

    for row in tqdm(rows, desc="Wikimedia Commons photos"):
        beach_id = row["id"]
        lat = row["centroid_lat"]
        lng = row["centroid_lng"]

        # Step 1: geosearch
        try:
            hits = _geosearch(lat, lng)
        except Exception as exc:
            print(f"\n  GEOSEARCH ERROR {beach_id}: {exc}", file=sys.stderr)
            time.sleep(DELAY_S)
            beaches_processed += 1
            continue

        time.sleep(DELAY_S)

        if not hits:
            beaches_processed += 1
            continue

        # Step 2: image info for all hits in one request
        titles = [h["title"] for h in hits if h.get("title")]
        image_info = {}
        if titles:
            try:
                image_info = _fetch_image_info(titles)
            except Exception as exc:
                print(f"\n  IMAGEINFO ERROR {beach_id}: {exc}", file=sys.stderr)
            time.sleep(DELAY_S)

        # Insert photos
        inserted_this_beach = 0
        for title, meta in image_info.items():
            if not meta.get("url"):
                continue
            conn.execute(
                """INSERT INTO beach_photos
                   (beach_id, url, thumbnail_url, source, license, author, title,
                    width, height, fetched_at)
                   VALUES (?, ?, ?, 'wikimedia_commons', ?, ?, ?, ?, ?, datetime('now'))""",
                (
                    beach_id,
                    meta["url"],
                    meta.get("thumbnail_url"),
                    meta.get("license"),
                    meta.get("author"),
                    meta.get("title"),
                    meta.get("width"),
                    meta.get("height"),
                ),
            )
            inserted_this_beach += 1

        if inserted_this_beach > 0:
            conn.execute(
                "UPDATE beaches SET photo_count = ?, updated_at = datetime('now') WHERE id = ?",
                (inserted_this_beach, beach_id),
            )
            photos_inserted += inserted_this_beach
            beaches_with_photos += 1

        beaches_processed += 1

        if beaches_processed % BATCH_SIZE == 0:
            conn.commit()
            print(
                f"  [{beaches_processed}/{len(rows)}] "
                f"photos={photos_inserted} beaches_with_photos={beaches_with_photos}"
            )

    conn.commit()
    print(
        f"Wikimedia photos: beaches_processed={beaches_processed} "
        f"photos_inserted={photos_inserted} beaches_with_photos={beaches_with_photos}"
    )
    return {
        "beaches_processed": beaches_processed,
        "photos_inserted": photos_inserted,
        "beaches_with_photos": beaches_with_photos,
    }


if __name__ == "__main__":
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_LIMIT

    conn = get_connection(db_path)
    migrate(conn)
    enrich_wikimedia_photos(conn, limit=limit)
    conn.close()
