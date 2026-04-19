"""
Sand description + color from Wikipedia.

For every beach with wikipedia_url:
  1. Fetch the article HTML via Wikimedia REST summary API + extracts API.
  2. Parse the infobox for a Type/Sand/Substrate field.
  3. Parse the first paragraph for sand-color keywords.
  4. Write sand_color (only when currently NULL) and sand_description (always overwrite).

Follows the silent-failure policy in src/enrich/_common.py:
raise on 429/auth/5xx; skip individual 404s; coverage assertion at end.
"""

import re
import sys
import time
import urllib.parse

import requests
from tqdm import tqdm

from src.enrich._common import (
    HttpError,
    assert_coverage_delta,
    coverage_count,
    log_run_finish,
    log_run_start,
    raise_for_http,
)

USER_AGENT = "WorldBeachTour/1.0 (https://worldbeachtour.com; contact@worldbeachtour.com)"
DELAY_S = 0.1
WIKI_HTML_API = "https://en.wikipedia.org/w/api.php"

COLOR_LABELS = {
    "black": "black",
    "white": "white",
    "pink": "pink",
    "golden": "golden",
    "gold": "golden",
    "red": "red",
    "green": "green",
    "orange": "orange",
    "grey": "grey",
    "gray": "grey",
    "tan": "tan",
    "brown": "brown",
    "yellow": "yellow",
    "coral": "coral",
    "rainbow": "rainbow",
}

# Match "<color> sand(s)" or "<color> <modifier> sand(s)" (e.g. "white silica sands").
# Modifier is one lowercase word to avoid matching "Gold Beach in Curry County"
# (which would require "Gold <noun> sand" — no sand follows in Gold Beach).
COLOR_SAND_RE = re.compile(
    r"\b(" + "|".join(re.escape(k) for k in COLOR_LABELS) + r")[- ](?:[a-z]+ )?sand(s|y)?\b",
    re.IGNORECASE,
)

# Substrate keywords that describe beach composition.
SUBSTRATE_KEYWORDS = [
    "sand", "pebble", "gravel", "shell", "coral",
    "volcanic", "basalt", "olivine", "quartz", "glass", "shingle",
]

# Words that mean the sentence is *describing* beach material, not just naming a place.
DESCRIPTIVE_HINTS = re.compile(
    r"\b(composed|consists?|made|contains?|features?|known for|famous for|covered|"
    r"grain|sediment|substrate|material|fine|coarse|mineral|erod|derived|formed)\b",
    re.IGNORECASE,
)

SENTENCE_RE = re.compile(r"[^.!?\n]+[.!?]")


def _title_from_url(url: str) -> str | None:
    parsed = urllib.parse.urlparse(url)
    if parsed.netloc not in ("en.wikipedia.org", "www.en.wikipedia.org"):
        return None
    if not parsed.path.startswith("/wiki/"):
        return None
    title = parsed.path[len("/wiki/"):]
    return urllib.parse.unquote(title) if title else None


def _fetch_extract(title: str) -> str | None:
    """Fetch the plain-text extract for the article. Returns None on 404."""
    # NOTE: `exintro` is a *boolean flag* — its presence alone (even with "0")
    # means intro-only. Omit it entirely to get the full plain-text article.
    params = {
        "action": "query",
        "format": "json",
        "prop": "extracts",
        "explaintext": "1",
        "redirects": "1",
        "titles": title,
    }
    resp = requests.get(
        WIKI_HTML_API,
        params=params,
        headers={"User-Agent": USER_AGENT},
        timeout=20,
    )
    raise_for_http(resp)
    data = resp.json()
    pages = data.get("query", {}).get("pages", {})
    if not pages:
        return None
    page = next(iter(pages.values()))
    if "missing" in page:
        return None
    return page.get("extract") or None


def extract_sand_color(text: str) -> str | None:
    """Return the color label from the earliest '<color> sand' construction.

    Only matches 'X sand' (or 'X-sand'/'X sands'/'X sandy'), never loose color words
    in unrelated context. This avoids false positives from place names like
    'Gold Beach' or 'Red Sea'.
    """
    if not text:
        return None
    m = COLOR_SAND_RE.search(text[:4000])
    if not m:
        return None
    return COLOR_LABELS[m.group(1).lower()]


def extract_sand_description(text: str) -> str | None:
    """Return the first descriptive sentence about the beach's sand / substrate.

    Requires the sentence to contain both a substrate keyword AND a descriptive
    hint (composed / made / consists / known for / etc), so we skip generic
    'X Beach is a beach on the coast of Y' openers.
    """
    if not text:
        return None
    for sent_match in SENTENCE_RE.finditer(text[:5000]):
        sent = sent_match.group(0).strip()
        if len(sent) < 20:
            continue
        sent_lower = sent.lower()
        if not any(kw in sent_lower for kw in SUBSTRATE_KEYWORDS):
            continue
        if not DESCRIPTIVE_HINTS.search(sent):
            continue
        if len(sent) > 500:
            sent = sent[:497] + "..."
        return sent
    return None


def enrich_wikipedia_sand(conn, *, limit: int | None = None, dry_run: bool = False) -> dict:
    """Scrape sand description + color from Wikipedia for beaches with wikipedia_url.

    Overwrites sand_description always (it's Wikipedia-sourced).
    Preserves non-null sand_color; only fills when currently NULL.
    Raises HttpError on HTTP failure. Raises CoverageAssertionError on silent failure.
    """
    run_id = log_run_start(conn, "sand_wikipedia", phase="A")
    before_desc = coverage_count(conn, "beaches", "sand_description")

    q = "SELECT id, wikipedia_url, sand_color FROM beaches WHERE wikipedia_url IS NOT NULL ORDER BY id"
    if limit:
        q += f" LIMIT {int(limit)}"
    targets = [dict(r) for r in conn.execute(q).fetchall()]
    if not targets:
        log_run_finish(conn, run_id, "ok", total_processed=0)
        return {"processed": 0, "updated": 0, "skipped_404": 0, "errors": 0}

    updated = 0
    skipped_404 = 0
    errors = 0
    processed = 0

    try:
        for row in tqdm(targets, desc="Wikipedia sand"):
            processed += 1
            time.sleep(DELAY_S)
            title = _title_from_url(row["wikipedia_url"])
            if title is None:
                continue
            try:
                text = _fetch_extract(title)
            except HttpError:
                conn.commit()
                raise
            except Exception as exc:
                errors += 1
                print(f"\n  ERROR {row['id']} ({title}): {exc}", file=sys.stderr)
                continue
            if text is None:
                skipped_404 += 1
                continue

            color = extract_sand_color(text)
            desc = extract_sand_description(text)
            if not desc and not color:
                continue

            sets = []
            args = []
            if desc:
                sets.append("sand_description = ?")
                args.append(desc)
            if color and row["sand_color"] is None:
                sets.append("sand_color = ?")
                args.append(color)
            if not sets:
                continue
            sets.append("updated_at = datetime('now')")
            args.append(row["id"])
            if not dry_run:
                conn.execute(
                    f"UPDATE beaches SET {', '.join(sets)} WHERE id = ?",
                    tuple(args),
                )
            updated += 1
            if updated % 200 == 0 and not dry_run:
                conn.commit()
    finally:
        if not dry_run:
            conn.commit()

    log_run_finish(conn, run_id, "ok", total_processed=processed, total_errors=errors)

    # Silent-failure guard: if we had ≥100 targets, expect ≥10% filled.
    if len(targets) >= 100:
        assert_coverage_delta(
            conn, "beaches", "sand_description",
            before=before_desc, min_delta=max(1, len(targets) // 10),
        )

    return {
        "processed": processed,
        "updated": updated,
        "skipped_404": skipped_404,
        "errors": errors,
    }


if __name__ == "__main__":
    from src.enrich._common import open_db
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else None
    conn = open_db(db_path)
    result = enrich_wikipedia_sand(conn, limit=limit)
    print("Wikipedia sand enrichment:", result)
    conn.close()
