"""Mechanical gate for Tier-1 spoke files (zero LLM).
For each research/legendary/<slug>/spoke.<s>.json:
  - every fact_id exists in the merged sheet
  - sources URLs == URLs of the cited facts (missing / unused reported)
  - every number in the prose appears in the sheet (facts, quotes, derivations) — reuses trace_check.numbers
  - banned brochure words, word count 1,300-1,900, meta lengths
Exit 1 on any ERR."""
import json, os, re, sys
MAIN = r"C:\Users\erinr\wt\worldbeachtour\main"
sys.path.insert(0, os.path.join(MAIN, "scripts", "wave"))
from trace_check import numbers  # noqa: E402
from mech_check import BANNED  # noqa: E402
SLUG = "coney-island-beach-1"
LEG = os.path.join(MAIN, "research", "legendary", SLUG)
sheet = json.load(open(os.path.join(MAIN, "research", f"{SLUG}.json"), encoding="utf-8"))
facts = {f["id"]: f for f in sheet["facts"]}
sheet_text = " ".join(f"{f.get('fact','')} {f.get('quote','')}" for f in sheet["facts"])
sheet_text += " " + " ".join(d.get("fact", "") for d in sheet.get("derivations") or [])
# Expand abbreviated year ranges the sheet writes in short form ("1679-80" -> 1680, "1830s-40s" -> 1840)
# so a page that spells the full year out is not flagged as untraced.
sheet_text += " " + " ".join(m.group(1) + m.group(2) for m in re.finditer(r"\b(1[5-9]|20)\d{2}s?[-–](\d{2})s?\b", sheet_text))
sheet_nums = set(numbers(sheet_text))

def norm(u):
    return u.lower().replace("://www.", "://").rstrip("/")

bad = 0
for s in sys.argv[1:] or ["travel", "history", "the-rides", "the-shoreline"]:
    p = os.path.join(LEG, f"spoke.{s}.json")
    if not os.path.exists(p):
        print(f"[MISSING] {s}"); bad += 1; continue
    d = json.load(open(p, encoding="utf-8"))
    errs, warns = [], []
    ids = d.get("fact_ids") or []
    unknown = [i for i in ids if i not in facts]
    if unknown: errs.append(f"unknown fact_ids: {unknown}")
    cited = {norm(facts[i]["url"]) for i in ids if i in facts}
    listed = {norm(x["url"]) for x in d.get("sources") or []}
    if cited - listed: errs.append(f"cited but not listed: {sorted(cited - listed)}")
    if listed - cited: warns.append(f"listed but no cited fact: {sorted(listed - cited)}")
    prose = " ".join([d.get("title", ""), d.get("kicker", ""), d.get("meta_title", ""), d.get("meta_description", ""),
                      d.get("intro", "")] + [x.get("heading", "") + " " + x.get("body", "") for x in d.get("sections") or []])
    missing_nums = sorted({n for n in numbers(prose) if n not in sheet_nums})
    if missing_nums: errs.append(f"numbers not in sheet: {missing_nums}")
    low = prose.lower()
    hits = [w for w in BANNED if re.search(r"\b" + re.escape(w) + r"\b", low)]
    if hits: errs.append(f"banned words: {hits}")
    wc = len(re.findall(r"\S+", d.get("intro", "") + " " + " ".join(x.get("body", "") for x in d.get("sections") or [])))
    if not 1300 <= wc <= 1900: warns.append(f"words {wc} outside 1300-1900")
    if len(d.get("meta_title", "")) > 65: errs.append(f"meta_title {len(d['meta_title'])} > 65")
    if not 120 <= len(d.get("meta_description", "")) <= 160: warns.append(f"meta_description {len(d.get('meta_description',''))} chars")
    print(f"[{'FAIL' if errs else 'PASS'}] {s:14} words={wc} facts={len(ids)} sources={len(listed)}")
    for e in errs: print("    ERR ", e)
    for w in warns: print("    warn", w)
    bad += bool(errs)
print(f"SPOKE GATE: {'FAIL' if bad else 'PASS'}")
sys.exit(1 if bad else 0)
