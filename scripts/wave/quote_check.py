"""Zero-LLM citation check: fetch every fact's URL and confirm its verbatim quote
is on the page. Catches the Kozhikode defect class (a true claim pinned to a URL
that does not contain it) before any author or verifier spends tokens.

Usage: python quote_check.py <research_dir> <slug> [slug...] [--out DIR] [--local]
  --local: grep research/src/<slug>/ harvested text (offline, exact vs what the extractor saw)
Per fact: OK | NOT_FOUND (page fetched, quote absent) | FETCH_FAIL:<code>
Writes <out>/<slug>.quotes.json so the verifier can skip OK rows.
"""
import html, json, os, re, sys, time, urllib.request, urllib.error, unicodedata

try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

UA = "Mozilla/5.0 (compatible; WorldBeachTour-cite-check/1.0; +https://worldbeachtour.com)"
_cache = {}


def fetch(url):
    if url in _cache: return _cache[url]
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "*"})
        with urllib.request.urlopen(req, timeout=25) as r:
            raw = r.read(3_000_000)
            enc = r.headers.get_content_charset() or "utf-8"
            res = (200, raw.decode(enc, "replace"))
    except urllib.error.HTTPError as e: res = (e.code, "")
    except Exception as e: res = (-1, str(e)[:80])
    _cache[url] = res
    return res


def to_text(page):
    page = re.sub(r"(?is)<(script|style|noscript)[^>]*>.*?</\1>", " ", page)
    page = re.sub(r"(?s)<[^>]+>", " ", page)
    return norm(html.unescape(page))


def norm(s):
    s = unicodedata.normalize("NFKC", s or "")
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    s = s.replace("–", "-").replace("—", "-").replace("\xa0", " ")
    s = re.sub(r"\[\s*(?:\d+|[a-z]|note \d+|citation needed)\s*\]", " ", s, flags=re.I)  # wiki [ 2 ] markers
    s = re.sub(r"\s+([.,;:!?)])", r"\1", s)   # "beach ." == "beach."
    return re.sub(r"\s+", " ", s).strip().lower()


def quote_present(text, quote):
    q = norm(quote)
    if not q: return False
    if q in text: return True
    # tolerate ellipses / trimmed quotes: require the two longest 40-char windows
    chunks = [c.strip() for c in re.split(r"\.{3}|…", q) if len(c.strip()) >= 25]
    if chunks: return all(c in text for c in chunks)
    return q[:40] in text if len(q) > 40 else False


def ukey(url):
    """Canonical URL key: percent-decoded (Greek/PT Wikipedia titles), no trailing slash, no fragment."""
    import urllib.parse
    u = urllib.parse.unquote(url.strip()).split("#")[0].rstrip("/")
    return u.replace("http://", "https://")


def local_sources(research_dir, slug):
    """url -> normalised harvested text from research/src/<slug>/ (harvest.py output)."""
    d = os.path.join(research_dir, "src", slug)
    out = {}
    if not os.path.isdir(d): return out
    for fn in sorted(os.listdir(d)):
        if not fn.endswith(".md"): continue
        lines = open(os.path.join(d, fn), encoding="utf-8", errors="replace").read().split("\n", 2)
        if len(lines) < 3: continue
        out[ukey(lines[0])] = norm(lines[2])
    return out


def check(research_dir, slug, local=False):
    sheet = json.load(open(os.path.join(research_dir, f"{slug}.json"), encoding="utf-8"))
    rows = []
    src = local_sources(research_dir, slug) if local else {}
    for f in sheet.get("facts") or []:
        url, quote = f.get("url") or "", f.get("quote") or ""
        if not url: rows.append((f["id"], "NO_URL", "")); continue
        if local:
            # harvested text is what the extractor was shown, so the gate is exact and offline;
            # a URL the harvest did not capture falls back to a live fetch
            text = src.get(ukey(url))
            if text is not None:
                rows.append((f["id"], "OK" if quote_present(text, quote) else "NOT_FOUND", url)); continue
        code, page = fetch(url)
        if code != 200: rows.append((f["id"], f"FETCH_FAIL:{code}", url)); continue
        rows.append((f["id"], "OK" if quote_present(to_text(page), quote) else "NOT_FOUND", url))
        time.sleep(0.3)
    return rows


if __name__ == "__main__":
    args = [a for a in sys.argv[1:]]
    out = None
    if "--out" in args:
        i = args.index("--out"); out = args[i + 1]; del args[i:i + 2]
    local = "--local" in args
    if local: args.remove("--local")
    rdir, slugs = args[0], args[1:]
    for slug in slugs:
        rows = check(rdir, slug, local=local)
        tally = {}
        for _, st, _ in rows: tally[st.split(":")[0]] = tally.get(st.split(":")[0], 0) + 1
        print(f"{slug:22} facts={len(rows):3}  {tally}")
        for fid, st, url in rows:
            if st != "OK": print(f"    {fid:5} {st:16} {url[:90]}")
        if out:
            os.makedirs(out, exist_ok=True)
            json.dump({"slug": slug, "rows": [{"id": a, "status": b, "url": c} for a, b, c in rows]},
                      open(os.path.join(out, f"{slug}.quotes.json"), "w", encoding="utf-8"), indent=1)
