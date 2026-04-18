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
    Raises HttpError on 429/auth/5xx (to enforce silent-failure policy).
    Raises other HTTPError on unexpected status codes.
    """
    from src.enrich._common import HttpError  # local import to avoid reordering
    url = PAGEVIEWS_API.format(title=title)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return None
        if exc.code == 429:
            raise HttpError(f"rate-limited ({url})", status_code=429, url=url) from exc
        if exc.code in (401, 403):
            raise HttpError(f"auth failure {exc.code} ({url})", status_code=exc.code, url=url) from exc
        if 500 <= exc.code < 600:
            raise HttpError(f"server error {exc.code} ({url})", status_code=exc.code, url=url) from exc
        raise HttpError(f"http {exc.code} ({url})", status_code=exc.code, url=url) from exc

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


import requests

from src.enrich._common import (
    raise_for_http, log_run_start, log_run_finish,
    coverage_count, assert_coverage_delta, HttpError,
)

WIKIDATA_ENTITY_URL = "https://www.wikidata.org/wiki/Special:EntityData/{qid}.json"


def resolve_wikidata_to_wikipedia_title(qid: str, lang: str = "en") -> str | None:
    """Resolve a Wikidata QID to the Wikipedia page title in the given language.
    Returns None if the entity has no sitelink for that language, or if the
    QID itself no longer exists on Wikidata (404 — stale reference).
    Raises HttpError on 429/auth/5xx (no silent swallow)."""
    url = WIKIDATA_ENTITY_URL.format(qid=qid)
    resp = requests.get(url, timeout=20, headers={"User-Agent": USER_AGENT})
    if resp.status_code == 404:
        return None  # entity deleted or never existed — treat like no-sitelink
    raise_for_http(resp)
    data = resp.json()
    sitelinks = data.get("entities", {}).get(qid, {}).get("sitelinks", {})
    entry = sitelinks.get(f"{lang}wiki")
    return entry["title"] if entry else None


def expand_pageviews(conn, limit: int | None = None) -> int:
    """For every beach with wikidata_id but no wikipedia_url, resolve + fetch pageviews.
    Returns count of beaches updated. Raises CoverageAssertionError if the pipeline
    had >=100 targets but filled <10% of them (silent-failure detection)."""
    run_id = log_run_start(conn, "wikipedia_pageviews_expand", phase="A")
    before = coverage_count(conn, "beaches", "wikipedia_page_views_annual")

    q = """SELECT id, wikidata_id FROM beaches
           WHERE wikidata_id IS NOT NULL AND wikipedia_url IS NULL"""
    if limit:
        q += f" LIMIT {int(limit)}"
    targets = conn.execute(q).fetchall()
    if not targets:
        log_run_finish(conn, run_id, "ok", total_processed=0)
        return 0

    updated = 0
    errors = 0
    for row in tqdm(targets, desc="resolving wikidata→wiki pageviews"):
        time.sleep(DELAY_S)  # throttle every iteration, even on skip paths
        try:
            title = resolve_wikidata_to_wikipedia_title(row["wikidata_id"])
            if not title:
                continue
            views = _fetch_annual_views(title)
            if views is None:
                # 404: article gone since Wikidata record — skip, don't write URL
                continue
            url = f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}"
            conn.execute(
                """UPDATE beaches SET wikipedia_url=?, wikipedia_page_views_annual=?,
                   updated_at=datetime('now') WHERE id=?""",
                (url, views, row["id"]),
            )
            updated += 1
            if updated % 500 == 0:
                conn.commit()
        except HttpError:
            # 429/auth/5xx: commit what we have, record failure, re-raise loudly
            conn.commit()
            log_run_finish(conn, run_id, "error", total_processed=updated, total_errors=errors + 1)
            raise
        except Exception:
            # Individual parse/other error: count and continue
            errors += 1

    conn.commit()
    log_run_finish(conn, run_id, "ok", total_processed=updated, total_errors=errors)

    # Coverage assertion: if we had enough targets, we must have filled *something*
    if len(targets) >= 100:
        assert_coverage_delta(conn, "beaches", "wikipedia_page_views_annual",
                              before=before, min_delta=max(1, len(targets) // 10))
    return updated


if __name__ == "__main__":
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    enrich_wikipedia_pageviews(conn)
    conn.close()
