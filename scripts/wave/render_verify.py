"""Zero-LLM render check against a running dev server (cd site && PORT=3131 npx next dev).
Per slug: main page + every declared spoke + travel lens must be 200, the byline
must render, and the spike_statement must appear in the HTML (compared after
HTML-unescaping — a raw apostrophe probe false-failed kappad on 09-05).
Usage: python render_verify.py <base_url> <slug> [slug...]
Exit 1 on any failure.
"""
import html, json, os, re, sys, urllib.request

try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONTENT = os.path.join(ROOT, "site", "content", "beaches")


def get(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "wbt-render-verify"}), timeout=120) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return -1, str(e)


def squash(s):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    return re.sub(r"\s+", " ", s).strip()


def main():
    base, slugs = sys.argv[1].rstrip("/"), sys.argv[2:]
    bad = 0
    for slug in slugs:
        d = os.path.join(CONTENT, slug)
        comp = json.load(open(os.path.join(d, "composition.json"), encoding="utf-8"))
        spokes = [s["slug"] for s in comp.get("spokes", [])]
        probs = []
        code, body = get(f"{base}/beaches/{slug}")
        if code != 200:
            probs.append(f"main {code}")
        else:
            text = squash(body)
            if "Erin Rose" not in text: probs.append("byline missing")
            spike = re.sub(r"\s+", " ", comp.get("spike_statement", "")).strip()
            if spike and spike[:80] not in text: probs.append("spike text missing")
            m = re.search(r"Register:\s*(\w+)", text)
            if m and m.group(1).upper() not in {"CLINICAL", "REVERENT", "ROMANTIC", "SEVERE", "WRY"}:
                probs.append(f"non-canonical register rendered: {m.group(1)}")
        for sp in spokes + ["travel"]:
            c, b = get(f"{base}/beaches/{slug}/{sp}")
            if c != 200: probs.append(f"/{sp} {c}")
            elif sp in spokes and "Back to the full" not in squash(b): probs.append(f"/{sp} no back-link")
        status = "OK " if not probs else "FAIL"
        if probs: bad += 1
        print(f"{status} {slug:26} spokes={spokes} {'; '.join(probs)}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
