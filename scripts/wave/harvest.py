"""Zero-LLM source harvester: fetch raw pages to research/src/<slug>/NN-<host>.md.

Why: WebFetch hands an agent a small model's RENDERING of a page, so the
"verbatim" quotes in pilot-1 sheets were paraphrases (70% failed quote_check even
on Wikipedia). Raw text on disk lets the extractor quote for real and lets
quote_check.py validate citations mechanically.

Usage: python harvest.py <slug> <urls.txt>        # one URL per line, '#' comments ok
       python harvest.py <slug> --from-sheet      # re-harvest every url in research/<slug>.json
Each file: first line = URL, second = fetch status/date, then extracted text.
"""
import json, os, re, sys, time
from urllib.parse import urlparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quote_check import fetch, to_text  # noqa: E402

try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MAX_CHARS = 40_000          # per page; keeps a 20-source bundle ≈ 50k tokens


def main():
    slug = sys.argv[1]
    if sys.argv[2] == "--from-sheet":
        sheet = json.load(open(os.path.join(ROOT, "research", f"{slug}.json"), encoding="utf-8"))
        urls = []
        for f in sheet.get("facts") or []:
            if f.get("url") and f["url"] not in urls: urls.append(f["url"])
    else:
        urls = [l.strip() for l in open(sys.argv[2], encoding="utf-8")
                if l.strip() and not l.startswith("#")]
    out = os.path.join(ROOT, "research", "src", slug)
    os.makedirs(out, exist_ok=True)
    ok = 0
    for i, url in enumerate(urls, 1):
        code, page = fetch(url)
        host = re.sub(r"[^a-z0-9.-]", "_", urlparse(url).netloc.lower())[:40]
        fn = os.path.join(out, f"{i:02d}-{host}.md")
        if code == 200:
            text = to_text(page)[:MAX_CHARS]; ok += 1
        else:
            text = f"(fetch failed: {code})"
        open(fn, "w", encoding="utf-8").write(f"{url}\nstatus={code} fetched={time.strftime('%Y-%m-%d')}\n\n{text}\n")
        print(f"{i:02d} {code:>4} {len(text):>6} chars  {url[:80]}")
        time.sleep(0.3)
    print(f"\n{ok}/{len(urls)} fetched -> {out}")


if __name__ == "__main__":
    main()
