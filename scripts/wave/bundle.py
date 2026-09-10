"""Zero-token input bundles so every LLM stage is ONE read -> ONE write.

Subagent cost is turns x context, not research volume: the pilot's authors made
~30 tool calls each and re-billed a 12k-token exemplar every turn. Bundling all
inputs into a single file collapses that to 2-4 tool calls per stage.

Usage:
  python bundle.py author <slug> <out_file>   # sheet + spec + exemplar excerpt + data + meta + scaffold mdx
  python bundle.py verify <slug> <out_file>   # page files + claims ledger + sheet
  python bundle.py sources <slug> <out_file>  # research/src/<slug>/*.md harvested pages -> one file (for extract)
"""
import json, os, subprocess, sys

try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WAVE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(ROOT, "site", "content", "beaches")
DATA = os.path.join(ROOT, "site", "data", "beaches")
RESEARCH = os.path.join(ROOT, "research")


def rd(p):
    try: return open(p, encoding="utf-8", errors="replace").read()
    except FileNotFoundError: return f"(missing: {os.path.relpath(p, ROOT)})"


def section(title, body):
    return f"\n\n===== {title} =====\n{body.strip()}\n"


def author(slug):
    d = os.path.join(CONTENT, slug)
    parts = [f"AUTHOR BUNDLE for slug={slug}. Everything you need is in this file; do not read anything else."]
    parts.append(section("research/<slug>.json — THE ONLY SOURCE OF FACTS", rd(os.path.join(RESEARCH, f"{slug}.json"))))
    parts.append(section("docs/content-spec.md", rd(os.path.join(ROOT, "docs", "content-spec.md"))))
    parts.append(section("exemplar excerpt (quality bar)", rd(os.path.join(WAVE, "prompts", "exemplar-excerpt.md"))))
    parts.append(section("site/data/beaches/<slug>.json (coords, airport = STRAIGHT-LINE km)", rd(os.path.join(DATA, f"{slug}.json"))))
    parts.append(section("meta.json (do not edit; images already chosen)", rd(os.path.join(d, "meta.json"))))
    for fn in ("overview.mdx", "travel.mdx"):
        parts.append(section(f"UNTRUSTED scaffold {fn} — REPLACE entirely; keep only the MDX component pattern", rd(os.path.join(d, fn))))
    return "".join(parts)


def verify(slug):
    d = os.path.join(CONTENT, slug)
    parts = [f"VERIFY BUNDLE for slug={slug}. The page, its claims ledger, and the fact sheet the author was confined to."]
    for fn in sorted(os.listdir(d)):
        if fn == "meta.json": continue
        parts.append(section(f"page file {fn}", rd(os.path.join(d, fn))))
    led = subprocess.run([sys.executable, os.path.join(WAVE, "build_ledger.py"), CONTENT, slug],
                         capture_output=True, text=True, encoding="utf-8", errors="replace").stdout
    try:  # drop the prose copy (already above) to keep the bundle small
        j = json.loads(led); j.pop("prose", None); led = json.dumps(j, ensure_ascii=False, indent=1)
    except Exception: pass
    parts.append(section("claims ledger (build_ledger.py)", led))
    parts.append(section("research/<slug>.json fact sheet", rd(os.path.join(RESEARCH, f"{slug}.json"))))
    parts.append(section("site/data/beaches/<slug>.json — TRUSTED structured dataset (straight-line km, sand, "
                         "safety: shark_incidents_total, cyclone_count_50yr). Claims sourced here are NOT "
                         "fabricated; flag only if the page mislabels the source or misreads a value",
                         rd(os.path.join(DATA, f"{slug}.json"))))
    return "".join(parts)


def sources(slug):
    sd = os.path.join(RESEARCH, "src", slug)
    parts = [f"HARVESTED SOURCES for slug={slug}. Each section is one fetched page (title line = URL)."]
    if not os.path.isdir(sd): return parts[0] + "\n(no harvested sources)"
    for fn in sorted(os.listdir(sd)):
        parts.append(section(fn, rd(os.path.join(sd, fn))))
    return "".join(parts)


if __name__ == "__main__":
    kind, slug, out = sys.argv[1], sys.argv[2], sys.argv[3]
    body = {"author": author, "verify": verify, "sources": sources}[kind](slug)
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    open(out, "w", encoding="utf-8").write(body)
    print(f"{kind} bundle for {slug}: {len(body):,} chars ≈ {len(body)//4:,} tokens -> {out}")
