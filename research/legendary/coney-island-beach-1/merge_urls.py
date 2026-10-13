"""Merge the per-topic scout URL lists into research/urls/coney-island-beach-1.txt (deduped, order kept)."""
import os, re
ROOT = r"C:\Users\erinr\wt\worldbeachtour\main\research\urls"
SLUG = "coney-island-beach-1"
TOPICS = ["visit", "now", "hist1", "hist2", "culture", "extra"]
seen, urls, notes = set(), [], []
for t in TOPICS:
    p = os.path.join(ROOT, f"{SLUG}.{t}.txt")
    for line in open(p, encoding="utf-8"):
        s = line.strip()
        if not s:
            continue
        if s.startswith("#"):
            notes.append(f"# [{t}] " + s.lstrip("# "))
            continue
        m = re.match(r"(https?://\S+)", s)
        if not m:
            continue
        u = m.group(1).rstrip(".,")
        while u.endswith(")") and u.count(")") > u.count("("):
            u = u[:-1]
        # NYC Parks mirror hosts (php1-84 / php-cms / prd2) 401/403 a raw fetch; the canonical host serves the same page
        u = re.sub(r"://(php1-84|php-cms|prd2)\.nycgovparks\.org", "://www.nycgovparks.org", u)
        key = u.lower().replace("://www.", "://").rstrip("/")
        if key in seen:
            continue
        seen.add(key)
        urls.append(u)
with open(os.path.join(ROOT, f"{SLUG}.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(urls) + "\n\n" + "\n".join(notes) + "\n")
print(len(urls), "unique urls;", len(notes), "note lines")
