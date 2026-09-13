"""Zero-token wave triage: rank the buildable queue and emit a slate.
Why: the 09-10 queue ranking lived in a scratchpad and was lost; every wave was
re-deriving it by hand. This persists the rule so slate selection costs nothing.
Buildable = scaffold dir with meta.json + data json, no composition.json (not
gold), no bespoke app/beaches/<slug>/page.tsx, not parked, has wikipedia_url.
Score = notability + completeness bonus + data richness (waves/length/safety);
generic names ("Town Beach", "Long Beach") and near-dupes of gold names are
flagged, not silently dropped. Country cap keeps a wave geographically varied.
Usage: python triage.py [--n 16] [--per-country 2] [--all]
"""
import argparse, json, os, re, sys, unicodedata

try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONTENT = os.path.join(ROOT, "site", "content", "beaches")
DATA = os.path.join(ROOT, "site", "data", "beaches")
BESPOKE = os.path.join(ROOT, "site", "app", "beaches")
PARKED = os.path.join(ROOT, "docs", "wave", "parked.txt")

GENERIC = {"town beach", "long beach", "main beach", "north beach", "south beach",
           "east beach", "west beach", "city beach", "public beach", "the beach",
           "beach", "municipal beach", "central beach"}
JUNK = re.compile(r"(-pm\d|reception|water-taxi|parking|hotel|resort|club|marina|pier)(-|$)")
STOP = {"beach", "praia", "playa", "plage", "cala", "spiaggia", "strand", "plaja",
        "plaza", "de", "da", "do", "del", "la", "le", "el", "di", "the", "bay"}


def norm(name):
    s = unicodedata.normalize("NFKD", name or "").encode("ascii", "ignore").decode().lower()
    toks = [t for t in re.split(r"[^a-z0-9]+", s) if t and t not in STOP]
    return " ".join(toks)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=16)
    ap.add_argument("--per-country", type=int, default=2)
    ap.add_argument("--all", action="store_true", help="print the whole ranked pool")
    a = ap.parse_args()

    parked = set()
    if os.path.exists(PARKED):
        for line in open(PARKED, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#"):
                parked.add(line.split()[0])

    gold_names, pool = {}, []
    for slug in sorted(os.listdir(CONTENT)):
        d = os.path.join(CONTENT, slug)
        if not os.path.isfile(os.path.join(d, "meta.json")):
            continue
        dp = os.path.join(DATA, f"{slug}.json")
        if not os.path.isfile(dp):
            continue
        try:
            data = json.load(open(dp, encoding="utf-8"))
        except Exception:
            continue
        name = data.get("name") or slug
        if os.path.isfile(os.path.join(d, "composition.json")) or \
           os.path.isfile(os.path.join(BESPOKE, slug, "page.tsx")):
            gold_names.setdefault(norm(name), slug)
            continue
        pool.append((slug, name, data))

    rows = []
    for slug, name, data in pool:
        flags = []
        if slug in parked: flags.append("PARKED")
        if not data.get("wikipedia_url"): flags.append("no-wiki")
        if JUNK.search(slug): flags.append("junk-slug")
        n = norm(name)
        if (name or "").lower().strip() in GENERIC or n in {"town", "long", "main"}:
            flags.append("generic-name")
        if n in gold_names: flags.append(f"dupe-of-gold:{gold_names[n]}")
        comp = float(data.get("data_completeness_pct") or 0)
        score = float(data.get("notability_score") or 0)
        score += min(comp, 40) / 4                      # up to +10
        score += 3 if (data.get("waves") or {}).get("hs_mean_m") or data.get("waves") else 0
        score += 2 if data.get("beach_length_m") else 0
        score += 2 if (data.get("safety") or {}).get("lifeguard") else 0
        rows.append(dict(slug=slug, name=name, cc=data.get("country_code"),
                         score=round(score, 1), comp=comp,
                         wiki=bool(data.get("wikipedia_url")), flags=flags))

    rows.sort(key=lambda r: -r["score"])
    clean = [r for r in rows if not r["flags"]]
    print(f"pool {len(rows)} buildable; {len(clean)} clean (no flags); parked {len(parked)}")
    if a.all:
        for r in rows:
            print(f"{r['score']:5} {r['cc']:2} {r['slug']:34} {r['name'][:30]:30} comp={r['comp']:4.0f} {' '.join(r['flags'])}")
        return
    slate, per = [], {}
    for r in clean:
        if per.get(r["cc"], 0) >= a.per_country:
            continue
        per[r["cc"]] = per.get(r["cc"], 0) + 1
        slate.append(r)
        if len(slate) >= a.n:
            break
    print(f"\nSLATE (top {a.n}, ≤{a.per_country}/country):")
    for r in slate:
        print(f"{r['score']:5} {r['cc']:2} {r['slug']:34} {r['name'][:30]:30} comp={r['comp']:4.0f}")
    print("\nslugs:", " ".join(r["slug"] for r in slate))
    flagged = [r for r in rows[:60] if r["flags"]]
    if flagged:
        print("\nflagged in top-60 (excluded):")
        for r in flagged:
            print(f"  {r['slug']:34} {' '.join(r['flags'])}")


if __name__ == "__main__":
    main()
