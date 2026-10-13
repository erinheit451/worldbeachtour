"""Group harvested sources by scout topic into bundle parts of <=45k chars each.

Agent Read truncates around 50k chars, so every part stays under 45k. Pages larger than
a part are split across consecutive parts, and each part repeats the URL header.
Out: research/legendary/coney-island-beach-1/bundles/<topic>.partNofM.md
"""
import os, re, glob
MAIN = r"C:\Users\erinr\wt\worldbeachtour\main"
SLUG = "coney-island-beach-1"
SRC = os.path.join(MAIN, "research", "src", SLUG)
OUT = os.path.join(MAIN, "research", "legendary", SLUG, "bundles")
CAP = 45_000
TOPICS = ["visit", "now", "hist1", "hist2", "culture", "extra"]

def norm(u):
    u = u.strip().rstrip(".,")
    u = re.sub(r"://(php1-84|php-cms|prd2)\.nycgovparks\.org", "://www.nycgovparks.org", u)
    return u.lower().replace("://www.", "://").rstrip("/")

topic_of = {}
for t in TOPICS:
    for line in open(os.path.join(MAIN, "research", "urls", f"{SLUG}.{t}.txt"), encoding="utf-8"):
        m = re.match(r"(https?://\S+)", line.strip())
        if m:
            topic_of.setdefault(norm(m.group(1)), t)

# 'extra' Wikipedia pages are spread to the topic they serve
EXTRA_MAP = {"steeplechase": "hist1", "luna_park,_coney_island_(1903)": "hist1", "cyclone": "now",
             "wonder_wheel": "now", "parachute_jump": "now", "riegelmann": "hist1",
             "luna_park,_coney_island_(2010)": "now", "nathan": "culture", "mermaid": "culture",
             "aquarium": "now", "astroland": "hist2", "polar_bear": "culture", "coney_island_usa": "culture",
             "thunderbolt": "now", "maimonides": "now", "stillwell": "visit", "totonno": "culture",
             "elephantine": "hist1", "brighton_beach": "culture", "nycgovparks.org/parks/coney": "visit",
             "facilities/beaches": "visit"}

groups = {t: [] for t in TOPICS if t != "extra"}
unplaced = []
for fn in sorted(glob.glob(os.path.join(SRC, "*.md"))):
    lines = open(fn, encoding="utf-8").read().split("\n", 2)
    url, status = lines[0], lines[1]
    if "status=200" not in status:
        continue
    text = lines[2] if len(lines) > 2 else ""
    t = topic_of.get(norm(url))
    if t == "extra" or t is None:
        t = next((v for k, v in EXTRA_MAP.items() if k in url.lower()), None)
    if t is None:
        unplaced.append(url)
        t = "hist1"
    groups[t].append((url, text.strip()))

os.makedirs(OUT, exist_ok=True)
for f in glob.glob(os.path.join(OUT, "*.md")):
    os.remove(f)
for t, pages in groups.items():
    parts, cur = [], ""
    for url, text in pages:
        chunk_room = CAP - 200
        pieces = [text[i:i + chunk_room] for i in range(0, max(len(text), 1), chunk_room)]
        for k, piece in enumerate(pieces):
            block = f"\n\n===== SOURCE: {url}" + (f"  (continued {k+1}/{len(pieces)})" if len(pieces) > 1 else "") + " =====\n" + piece
            if len(cur) + len(block) > CAP and cur:
                parts.append(cur); cur = ""
            cur += block
    if cur:
        parts.append(cur)
    for i, p in enumerate(parts, 1):
        open(os.path.join(OUT, f"{t}.part{i}of{len(parts)}.md"), "w", encoding="utf-8").write(p)
    print(f"{t:8} sources={len(pages):3} parts={len(parts)} chars={sum(len(p) for p in parts):,}")
print("unplaced (put in hist1):", unplaced)
