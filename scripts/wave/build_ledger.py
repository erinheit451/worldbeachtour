"""Mechanically extract a claims ledger from an authored gold page. ZERO LLM tokens.

Every structured field that already declares a source becomes a ledger row.
The verifier then AUDITS this table instead of re-researching the page from
scratch -- which is where the old pipeline burned most of its budget.

A fabricated citation is structurally visible here: the cited URL either does
not support the quoted value, or does not exist.

Usage: python build_ledger.py <content_beaches_root> <slug> [--out DIR]
"""
import json, os, re, sys

try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

def rows_for(slug, d):
    c = json.load(open(os.path.join(d, "composition.json"), encoding="utf-8"))
    s = json.load(open(os.path.join(d, "showcase.json"), encoding="utf-8"))
    rows = []
    def add(kind, claim, source=None, url=None):
        claim = re.sub(r"\s+", " ", str(claim or "")).strip()
        if claim:
            rows.append({"kind": kind, "claim": claim[:400],
                         "source": (source or None), "url": (url or None)})

    add("SPIKE", c.get("spike_statement"))          # the headline claim
    add("SUBTITLE", c.get("subtitle"))
    for kf in s.get("key_facts") or []:
        add("key_fact", f"{kf.get('label')}: {kf.get('value')}", kf.get("source"))
    for t in s.get("timeline") or []:
        add("timeline", f"{t.get('year')}{'-'+str(t.get('month')) if t.get('month') else ''}: "
                        f"{t.get('title')} — {t.get('description')}", t.get("source"), t.get("wiki_url"))
    for l in s.get("landmarks") or []:
        add("landmark", f"{l.get('name')} ({l.get('year_built') or 'n/d'}, "
                        f"{l.get('architect_or_designer') or 'n/a'}): {l.get('description')}",
            None, l.get("wikipedia_url"))
    for r in s.get("cultural_refs") or []:
        add("cultural_ref", f"[{r.get('ref_type')}] {r.get('title')} "
                            f"({r.get('creator') or 'n/a'}, {r.get('year') or 'n/d'}): {r.get('description')}",
            None, r.get("wikipedia_url"))
    for b in s.get("businesses") or []:
        add("business", f"{b.get('name')} [{b.get('category')}] est.{b.get('year_established') or 'n/d'}: "
                        f"{b.get('description')}", b.get("source"), b.get("external_url"))
    for e in s.get("recurring_events") or []:
        add("event", f"{e.get('name')} ({e.get('when_text')}, attendance "
                     f"{e.get('typical_attendance') or 'n/d'}): {e.get('description')}")
    for z in s.get("zones") or []:
        add("zone", f"{z.get('name')} @ {z.get('position_along_beach_pct')}% "
                    f"({z.get('lat')},{z.get('lng')}): {z.get('character')}")
    return c, s, rows

def prose_bundle(d):
    parts = {}
    s = json.load(open(os.path.join(d, "showcase.json"), encoding="utf-8"))
    for k in ("intro_text", "spike_explainer", "honest_reckoning_note",
              "reckoning_pullquote", "access_note"):
        if s.get(k): parts[k] = s[k]
    dt = s.get("day_in_time") or {}
    if dt: parts["day_in_time"] = " | ".join(f"{k}: {v}" for k, v in dt.items())
    for f in sorted(os.listdir(d)):
        if f.endswith(".mdx"):
            parts[f] = open(os.path.join(d, f), encoding="utf-8", errors="replace").read()
    return parts

if __name__ == "__main__":
    root = sys.argv[1]; slug = sys.argv[2]
    out = None
    if "--out" in sys.argv: out = sys.argv[sys.argv.index("--out") + 1]
    d = os.path.join(root, slug)
    c, s, rows = rows_for(slug, d)
    prose = prose_bundle(d)
    sourced = sum(1 for r in rows if r["source"] or r["url"])
    payload = {"slug": slug, "beach_name": c.get("beach_name"), "tier": c.get("tier"),
               "ledger_rows": len(rows), "rows_with_a_declared_source": sourced,
               "ledger": rows, "prose": prose}
    if out:
        os.makedirs(out, exist_ok=True)
        p = os.path.join(out, f"{slug}.ledger.json")
        json.dump(payload, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"{slug:22} rows={len(rows):3}  sourced={sourced:3}  "
              f"prose_chars={sum(len(v) for v in prose.values()):6}  -> {p}")
    else:
        print(json.dumps(payload, ensure_ascii=False, indent=1))
