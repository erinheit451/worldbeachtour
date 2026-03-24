"""
Fetch annual Wikipedia page view counts for beaches that have a wikipedia_url.

Uses the Wikimedia Pageviews REST API:
  https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/
  en.wikipedia/all-access/all-agents/{title}/monthly/20250101/20251231

Sums monthly counts to produce wikipedia_page_views_annual.
Only processes English Wikipedia URLs; skips 404s gracefully.
"""

import sys
import time
import urllib.parse
import urllib.request
import json
from tqdm import tqdm

PAGEVIEWS_API = (
    "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/"
    "en.wikipedia/all-access/all-agents/{title}/monthly/20250101/20251231"
)

USER_AGENT = "WorldBeachTour/1.0 (https://worldbeachtour.com; contact@worldbeachtour.com)"
DELAY_S = 0.1
BATCH_SIZE = 1000


def _extract_title(url: str | None) -> str | None:
    """
    Extract the article title from an English Wikipedia URL.

    Returns None if url is None or not an English Wikipedia URL.
    Preserves percent-encoding as-is (Wikimedia API accepts encoded titles).
    """
    if url is None:
        return None
    parsed = urllib.parse.urlparse(url)
    if parsed.netloc not in ("en.wikipedia.org", "www.en.wikipedia.org"):
        return None
    path = parsed.path  # e.g. /wiki/Bondi_Beach
    prefix = "/wiki/"
    if not path.startswith(prefix):
        return None
    title = path[len(prefix):]
    if not title:
        return None
    return title


def _fetch_annual_views(title: str) -> int | None:
    """
    Fetch monthly page views for 2025 and sum them.

    Returns None on 404 (article not found / renamed).
    Raises for other HTTP errors.
    """
    url = PAGEVIEWS_API.format(title=title)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return None
        raise

    items = data.get("items", [])
    return sum(item.get("views", 0) for item in items)


def enrich_wikipedia_pageviews(conn, *, dry_run: bool = False) -> dict:
    """
    Fetch annual page views for all beaches with wikipedia_url but no page view count.

    Returns a dict with keys: processed, updated, skipped_404, errors.
    """
    rows = conn.execute(
        """SELECT id, wikipedia_url
           FROM beaches
           WHERE wikipedia_url IS NOT NULL
             AND wikipedia_page_views_annual IS NULL
           ORDER BY id"""
    ).fetchall()

    processed = 0
    updated = 0
    skipped_404 = 0
    errors = 0

    for row in tqdm(rows, desc="Wikipedia page views"):
        beach_id = row["id"]
        url = row["wikipedia_url"]

        title = _extract_title(url)
        if title is None:
            processed += 1
            continue

        try:
            views = _fetch_annual_views(title)
        except Exception as exc:
            errors += 1
            processed += 1
            print(f"\n  ERROR {beach_id} ({title}): {exc}", file=sys.stderr)
            time.sleep(DELAY_S)
            continue

        if views is None:
            skipped_404 += 1
        else:
            if not dry_run:
                conn.execute(
                    "UPDATE beaches SET wikipedia_page_views_annual = ?, updated_at = datetime('now') WHERE id = ?",
                    (views, beach_id),
                )
            updated += 1

        processed += 1
        time.sleep(DELAY_S)

        if processed % BATCH_SIZE == 0:
            if not dry_run:
                conn.commit()
            print(
                f"  [{processed}/{len(rows)}] updated={updated} 404s={skipped_404} errors={errors}"
            )

    if not dry_run:
        conn.commit()

    print(
        f"Wikipedia page views: processed={processed} updated={updated} "
        f"404s={skipped_404} errors={errors}"
    )
    return {
        "processed": processed,
        "updated": updated,
        "skipped_404": skipped_404,
        "errors": errors,
    }


if __name__ == "__main__":
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    enrich_wikipedia_pageviews(conn)
    conn.close()
