"""
Multi-tier photo enrichment with programmatic quality scoring.

Tiers (higher = more canonical):
  1. Wikipedia article images via `prop=images` on the wiki page
  2. Commons geosearch (existing — 500m radius around beach centroid)
  3. Commons category search by beach name
  4. Unsplash / Pexels fallback (not yet wired)

Scoring signals per candidate:
  - Commons Featured Picture flag  (+50)
  - Commons Quality Image flag     (+25)
  - Wikipedia usage count          (+5 per article, cap 40)
  - Min dimension / 1000 × 15      (cap 15)
  - Landscape aspect ratio bonus   (+10)
  - Demerits for map/logo/schematic filenames
  - Source-tier bonus              (Tier1 +20, Tier2 +5, Tier3 +10)

Run against a single beach slug to prototype, or against a range of
top-notability beaches for bulk enrichment.
"""

import json
import re
import sqlite3
import sys
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass, field

COMMONS_API = "https://commons.wikimedia.org/w/api.php"
WIKI_API_TEMPLATE = "https://{lang}.wikipedia.org/w/api.php"
USER_AGENT = "WorldBeachTour/1.0 (https://worldbeachtour.com; contact@worldbeachtour.com)"
DELAY_S = 0.3
THUMBNAIL_WIDTH = 1280

MAP_LOGO_RE = re.compile(
    r"(?:map|chart|schematic|logo|icon|seal|coat.of.arms|flag|pronun|symbol|diagram|plaque|graph)",
    re.I,
)
FILE_EXT_OK = (".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif")


def _api_get(url: str, timeout: int = 15) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


@dataclass
class PhotoCandidate:
    title: str              # File:...
    source_tier: int        # 1-4
    url: str = ""
    thumbnail_url: str = ""
    width: int = 0
    height: int = 0
    author: str = ""
    license: str = ""
    is_featured: bool = False
    is_quality: bool = False
    global_usage_count: int = 0
    score: float = 0.0
    score_breakdown: dict = field(default_factory=dict)


# ----- Tier 1: Wikipedia article images -----

def tier1_wikipedia_article(wikipedia_url: str) -> list[str]:
    """Return File: titles appearing on the Wikipedia article."""
    if not wikipedia_url:
        return []
    m = re.match(r"https?://([a-z]+)\.wikipedia\.org/wiki/(.+)", wikipedia_url)
    if not m:
        return []
    lang, title_enc = m.group(1), m.group(2)
    title = urllib.parse.unquote(title_enc).replace("_", " ")
    url = WIKI_API_TEMPLATE.format(lang=lang) + "?" + urllib.parse.urlencode({
        "action": "query", "titles": title, "prop": "images", "imlimit": 100, "format": "json",
    })
    try:
        data = _api_get(url)
    except Exception:
        return []
    pages = list(data.get("query", {}).get("pages", {}).values())
    if not pages:
        return []
    return [i["title"] for i in pages[0].get("images", [])]


# ----- Tier 2: Commons geosearch (reuse from existing code) -----

def tier2_geosearch(lat: float, lng: float, radius_m: int = 500, limit: int = 20) -> list[str]:
    url = COMMONS_API + "?" + urllib.parse.urlencode({
        "action": "query", "list": "geosearch", "gscoord": f"{lat}|{lng}",
        "gsradius": radius_m, "gsnamespace": 6, "gslimit": limit, "format": "json",
    })
    try:
        data = _api_get(url)
    except Exception:
        return []
    return [h["title"] for h in data.get("query", {}).get("geosearch", [])]


# ----- Tier 3: Commons category search -----

def tier3_category(category: str, limit: int = 50) -> list[str]:
    """List files in a Commons category like 'Category:Cable Beach (Western Australia)'."""
    if not category.startswith("Category:"):
        category = "Category:" + category
    url = COMMONS_API + "?" + urllib.parse.urlencode({
        "action": "query", "list": "categorymembers", "cmtitle": category,
        "cmtype": "file", "cmlimit": limit, "format": "json",
    })
    try:
        data = _api_get(url)
    except Exception:
        return []
    return [m["title"] for m in data.get("query", {}).get("categorymembers", [])]


# ----- Image metadata + quality flags -----

def fetch_image_info(titles: list[str]) -> dict[str, dict]:
    """Get URL, size, author, license for a batch of File: titles."""
    out = {}
    # Commons limits titles per request; chunk by 50
    for chunk_start in range(0, len(titles), 50):
        chunk = titles[chunk_start:chunk_start + 50]
        url = COMMONS_API + "?" + urllib.parse.urlencode({
            "action": "query", "titles": "|".join(chunk), "prop": "imageinfo|categories",
            "iiprop": "url|size|user|extmetadata", "iiurlwidth": THUMBNAIL_WIDTH,
            "clcategories": "Category:Featured pictures on Wikimedia Commons|Category:Quality images",
            "cllimit": 2, "format": "json",
        })
        try:
            data = _api_get(url)
        except Exception:
            continue
        for page in data.get("query", {}).get("pages", {}).values():
            title = page.get("title", "")
            imageinfos = page.get("imageinfo", [])
            if not imageinfos:
                continue
            info = imageinfos[0]
            ext = info.get("extmetadata", {})
            cats = {c.get("title", "") for c in page.get("categories", [])}
            out[title] = {
                "url": info.get("url"),
                "thumbnail_url": info.get("thumburl"),
                "width": info.get("width") or 0,
                "height": info.get("height") or 0,
                "author": ext.get("Artist", {}).get("value", info.get("user", "")),
                "license": ext.get("LicenseShortName", {}).get("value", ""),
                "is_featured": "Category:Featured pictures on Wikimedia Commons" in cats,
                "is_quality": "Category:Quality images" in cats,
            }
        time.sleep(DELAY_S)
    return out


def fetch_global_usage(titles: list[str]) -> dict[str, int]:
    """Count how many articles (across Wikipedias) embed each file."""
    out = {}
    for chunk_start in range(0, len(titles), 50):
        chunk = titles[chunk_start:chunk_start + 50]
        url = COMMONS_API + "?" + urllib.parse.urlencode({
            "action": "query", "titles": "|".join(chunk), "prop": "globalusage",
            "gulimit": 100, "format": "json",
        })
        try:
            data = _api_get(url)
        except Exception:
            continue
        for page in data.get("query", {}).get("pages", {}).values():
            title = page.get("title", "")
            usage = page.get("globalusage", []) or []
            out[title] = len(usage)
        time.sleep(DELAY_S)
    return out


# ----- Scoring -----

def score_candidate(c: PhotoCandidate) -> PhotoCandidate:
    breakdown = {}
    score = 0.0

    if c.is_featured:
        breakdown["featured"] = 50; score += 50
    if c.is_quality:
        breakdown["quality"] = 25; score += 25

    usage_points = min(c.global_usage_count * 5, 40)
    breakdown["usage"] = usage_points; score += usage_points

    min_dim = min(c.width, c.height) if c.width and c.height else 0
    res_points = min(min_dim / 1000 * 15, 15)
    breakdown["resolution"] = round(res_points, 1); score += res_points

    if c.width and c.height:
        ar = c.width / c.height
        if 1.3 <= ar <= 2.1:  # landscape 4:3 to 21:9
            breakdown["aspect"] = 10; score += 10

    tier_bonus = {1: 20, 2: 5, 3: 10, 4: 0}.get(c.source_tier, 0)
    breakdown["tier"] = tier_bonus; score += tier_bonus

    if MAP_LOGO_RE.search(c.title):
        breakdown["map_demerit"] = -30; score -= 30

    c.score = round(score, 1)
    c.score_breakdown = breakdown
    return c


# ----- Orchestrator -----

def enrich_beach_photos(conn, slug: str, verbose: bool = False) -> list[PhotoCandidate]:
    """Fetch multi-tier candidates for one beach, score, insert into beach_photos."""
    row = conn.execute(
        "SELECT id, name, centroid_lat, centroid_lng, wikipedia_url, wikidata_id "
        "FROM beaches WHERE slug = ?", (slug,)
    ).fetchone()
    if not row:
        print(f"  Beach not found: {slug}"); return []

    beach_id = row["id"]
    seen_titles = set()
    candidates: list[PhotoCandidate] = []

    # Tier 1: Wikipedia article
    if row["wikipedia_url"]:
        titles = tier1_wikipedia_article(row["wikipedia_url"])
        if verbose: print(f"  Tier 1 (Wikipedia article): {len(titles)} raw")
        for t in titles:
            if t in seen_titles or not t.lower().endswith(FILE_EXT_OK): continue
            seen_titles.add(t)
            candidates.append(PhotoCandidate(title=t, source_tier=1))

    # Tier 2: geosearch
    titles2 = tier2_geosearch(row["centroid_lat"], row["centroid_lng"])
    if verbose: print(f"  Tier 2 (geosearch 500m): {len(titles2)} raw")
    for t in titles2:
        if t in seen_titles or not t.lower().endswith(FILE_EXT_OK): continue
        seen_titles.add(t)
        candidates.append(PhotoCandidate(title=t, source_tier=2))

    # Tier 3: category search — try name + regional variants
    name = row["name"]
    cat_guesses = [f"Category:{name}", f"Category:Beaches of {name}"]
    # If the Wikipedia URL includes a disambiguator, try the full title
    if row["wikipedia_url"]:
        m = re.match(r".+/wiki/(.+)", row["wikipedia_url"])
        if m:
            wiki_title = urllib.parse.unquote(m.group(1)).replace("_", " ")
            cat_guesses.append(f"Category:{wiki_title}")
    for cat_guess in cat_guesses:
        titles3 = tier3_category(cat_guess)
        if titles3:
            if verbose: print(f"  Tier 3 ({cat_guess}): {len(titles3)} raw")
            for t in titles3:
                if t in seen_titles or not t.lower().endswith(FILE_EXT_OK): continue
                seen_titles.add(t)
                candidates.append(PhotoCandidate(title=t, source_tier=3))
            break

    # Tier 3b: Commons text search as final fallback — disambiguate with nearest_city/admin_level_1/country_code
    if len([c for c in candidates if c.source_tier == 3]) == 0:
        nearest_city = (row["nearest_city"] or "") if "nearest_city" in row.keys() else ""
        disambig = ""
        full_row = conn.execute("SELECT nearest_city, admin_level_1, country_code FROM beaches WHERE id = ?", (beach_id,)).fetchone()
        if full_row:
            for field_val in (full_row["nearest_city"], full_row["admin_level_1"], full_row["country_code"]):
                if field_val:
                    disambig = field_val; break
        search_q = f"{name} {disambig}".strip()
        url = COMMONS_API + "?" + urllib.parse.urlencode({
            "action": "query", "list": "search", "srsearch": search_q,
            "srnamespace": 6, "srlimit": 30, "format": "json",
        })
        try:
            data = _api_get(url)
            hits = data.get("query", {}).get("search", [])
            if verbose: print(f"  Tier 3b (text search '{search_q}'): {len(hits)} raw")
            for h in hits:
                t = h.get("title", "")
                if t in seen_titles or not t.lower().endswith(FILE_EXT_OK): continue
                seen_titles.add(t)
                candidates.append(PhotoCandidate(title=t, source_tier=3))
        except Exception:
            pass

    if verbose: print(f"  Total unique candidates: {len(candidates)}")
    if not candidates:
        return []

    # Fetch metadata + usage in bulk
    all_titles = [c.title for c in candidates]
    info = fetch_image_info(all_titles)
    usage = fetch_global_usage(all_titles)

    enriched: list[PhotoCandidate] = []
    for c in candidates:
        meta = info.get(c.title, {})
        if not meta.get("url"):
            continue
        c.url = meta["url"]
        c.thumbnail_url = meta.get("thumbnail_url", "")
        c.width = meta.get("width", 0)
        c.height = meta.get("height", 0)
        c.author = meta.get("author", "")
        c.license = meta.get("license", "")
        c.is_featured = meta.get("is_featured", False)
        c.is_quality = meta.get("is_quality", False)
        c.global_usage_count = usage.get(c.title, 0)
        score_candidate(c)
        enriched.append(c)

    enriched.sort(key=lambda x: x.score, reverse=True)

    # Clear prior rows for this beach, re-insert with scoring
    conn.execute("DELETE FROM beach_photos WHERE beach_id = ?", (beach_id,))
    for c in enriched:
        conn.execute(
            """INSERT INTO beach_photos
               (beach_id, url, thumbnail_url, source, license, author, title,
                width, height, fetched_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))""",
            (beach_id, c.url, c.thumbnail_url,
             f"tier{c.source_tier}" + ("_fp" if c.is_featured else "_qi" if c.is_quality else ""),
             c.license, c.author, c.title.replace("File:", ""),
             c.width, c.height),
        )
    conn.execute("UPDATE beaches SET photo_count = ? WHERE id = ?",
                 (len(enriched), beach_id))
    conn.commit()
    return enriched


if __name__ == "__main__":
    db = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    slug = sys.argv[2] if len(sys.argv) > 2 else "cable-beach-6"
    conn = sqlite3.connect(db, timeout=30)
    conn.row_factory = sqlite3.Row
    print(f"Enriching: {slug}")
    results = enrich_beach_photos(conn, slug, verbose=True)
    print(f"\nTop {min(10, len(results))} scored candidates:\n")
    for i, c in enumerate(results[:10], 1):
        badges = []
        if c.is_featured: badges.append("FP")
        if c.is_quality: badges.append("QI")
        print(f"  #{i}  score={c.score:5.1f}  T{c.source_tier}  "
              f"{c.width}x{c.height}  usage={c.global_usage_count}  "
              f"{'[' + '/'.join(badges) + ']' if badges else ''}  "
              f"{c.title[:70]}")
        print(f"       {c.score_breakdown}")
        print(f"       {c.url}")
    conn.close()
