"""Flesch-Kincaid grade per page surface (main page fields + each spoke). Zero deps: syllables by vowel-group heuristic.
Also lists the 8 longest sentences per page, the usual cause of a high grade."""
import json, os, re
MAIN = r"C:\Users\erinr\wt\worldbeachtour\main"
SC = os.path.join(MAIN, "site", "content", "beaches", "coney-island-beach-1", "showcase.json")
s = json.load(open(SC, encoding="utf-8"))

def syllables(w):
    w = w.lower().strip(".,;:!?\"'()")
    if not w: return 0
    if len(w) <= 3: return 1
    w = re.sub(r"(?:[^laeiouy]es|ed|[^laeiouy]e)$", "", w)
    w = re.sub(r"^y", "", w)
    return max(1, len(re.findall(r"[aeiouy]{1,2}", w)))

def sentences(text):
    return [x.strip() for x in re.split(r"(?<=[.!?])\s+(?=[A-Z\"“0-9])", text) if len(x.split()) > 2]

def grade(text):
    sents = sentences(text); words = re.findall(r"[A-Za-z][A-Za-z'’-]*", text)
    if not sents or not words: return None
    syl = sum(syllables(w) for w in words)
    return 0.39 * len(words) / len(sents) + 11.8 * syl / len(words) - 15.59, len(words) / len(sents), len(words)

def strings(o):
    if isinstance(o, str): yield o
    elif isinstance(o, dict):
        for k, v in o.items():
            if k not in ("url", "source_url", "fact_ids", "source", "sources", "image", "hero_image", "quote"): yield from strings(v)
    elif isinstance(o, list):
        for v in o: yield from strings(v)

pages = {"main": " ".join(strings({k: v for k, v in s.items() if k != "spokes_content"}))}
for k, v in (s.get("spokes_content") or {}).items():
    pages[k] = " ".join(strings({kk: vv for kk, vv in v.items() if kk not in ("sources",)}))
print(f"{'page':14} {'FK grade':>8} {'words/sent':>10} {'words':>6}")
for k, t in pages.items():
    g, wps, n = grade(t)
    print(f"{k:14} {g:8.1f} {wps:10.1f} {n:6}")
for k, t in pages.items():
    longest = sorted(sentences(t), key=lambda x: -len(x.split()))[:3]
    print(f"\n[{k}] longest sentences:")
    for x in longest: print(f"  ({len(x.split())}w) {x[:170]}")
