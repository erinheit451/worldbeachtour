"""Zero-token trace check: every specific on an authored page must trace to the
beach's research fact sheet (research/<slug>.json).

Pipeline v2 authors write from the fact sheet with NO web access, so any number,
year or price that is not in the sheet was invented or mis-derived. This is the
structural version of the verifier's "unsourced specific" finding — it costs
nothing and runs before any LLM verify.

Checks
  1. fact_ids on structured entries (key_facts, timeline, landmarks, cultural_refs,
     businesses, recurring_events, zones) must exist in the sheet.
  2. every number token (years, distances, prices, counts) in prose surfaces
     (intro_text, spike_explainer, honest_reckoning_note, spike_statement, subtitle,
     day_in_time, things_to_know, access_note, every .mdx) must appear in the sheet's
     fact/quote text. Coordinates, percentages of zones, and small ordinals are ignored.
  3. cross-surface consistency: the same labelled distance (airport / nearest city)
     appearing with different values across surfaces.

Usage: python trace_check.py <content_beaches_root> <research_root> <slug> [slug...]
Exit 1 if any slug has blocking findings.
"""
import json, os, re, sys

try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

STRUCT_KEYS = ["key_facts", "timeline", "landmarks", "cultural_refs", "businesses",
               "recurring_events", "zones"]
PROSE_KEYS = ["intro_text", "spike_explainer", "honest_reckoning_note", "reckoning_pullquote",
              "access_note"]
NUM = re.compile(r"(?<![\w.])(\d{1,3}(?:[,.]\d{3})+|\d+(?:\.\d+)?)(?![\w.]*[°′″])")
IGNORE_SMALL = 12          # ordinals / counts up to 12 are language, not facts
SKIP_KEYS = {"lat", "lng", "position_along_beach_pct", "anchor_para_index", "month",
             "centroid_lat", "centroid_lng"}


def numbers(text):
    out = set()
    for m in NUM.finditer(text or ""):
        raw = m.group(1).replace(",", "")
        try: v = float(raw)
        except ValueError: continue
        if v.is_integer() and v <= IGNORE_SMALL: continue
        out.add(raw.rstrip("0").rstrip(".") if "." in raw else raw)
    return out


def sheet_numbers(sheet):
    txt = []
    for f in sheet.get("facts") or []:
        txt.append(f.get("fact") or ""); txt.append(f.get("quote") or "")
        txt.append(str(f.get("date_of_source") or ""))
    for d in sheet.get("derivations") or []:          # author-declared arithmetic
        txt.append(d.get("fact") or "")
    return numbers(" ".join(txt))


def walk_prose(obj, path, acc):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in SKIP_KEYS: continue
            walk_prose(v, f"{path}.{k}", acc)
    elif isinstance(obj, list):
        for i, v in enumerate(obj): walk_prose(v, f"{path}[{i}]", acc)
    elif isinstance(obj, str):
        acc.append((path, obj))


def check(content_root, research_root, slug):
    d = os.path.join(content_root, slug)
    rp = os.path.join(research_root, f"{slug}.json")
    errs, warns = [], []
    if not os.path.exists(rp):
        return [f"no fact sheet at {rp}"], []
    sheet = json.load(open(rp, encoding="utf-8"))
    ids = {f.get("id") for f in sheet.get("facts") or []}
    snums = sheet_numbers(sheet)
    c = json.load(open(os.path.join(d, "composition.json"), encoding="utf-8"))
    s = json.load(open(os.path.join(d, "showcase.json"), encoding="utf-8"))

    # 1. fact_ids on structured entries
    for key in STRUCT_KEYS:
        for i, e in enumerate(s.get(key) or []):
            fids = e.get("fact_ids") or []
            if not fids:
                (warns if key == "zones" else errs).append(f"{key}[{i}] has no fact_ids")
            for fid in fids:
                if fid not in ids: errs.append(f"{key}[{i}] cites unknown fact id {fid}")

    # 2. numbers in prose must exist in the sheet
    surfaces = []
    for k in ("spike_statement", "subtitle"): surfaces.append((f"composition.{k}", c.get(k) or ""))
    for k in PROSE_KEYS: surfaces.append((f"showcase.{k}", s.get(k) or ""))
    acc = []
    for k in ("day_in_time", "things_to_know", "margin_notes", "food_drink") + tuple(STRUCT_KEYS):
        walk_prose(s.get(k), f"showcase.{k}", acc)
    surfaces += acc
    for fn in sorted(os.listdir(d)):
        if fn.endswith(".mdx"):
            body = open(os.path.join(d, fn), encoding="utf-8").read()
            body = re.sub(r"<[A-Z]\w+[^>]*/>", " ", body)        # MDX components carry coords
            surfaces.append((fn, body))
    untraced = {}
    for path, text in surfaces:
        for n in numbers(text) - snums:
            untraced.setdefault(n, []).append(path)
    for n, where in sorted(untraced.items(), key=lambda kv: -len(kv[1])):
        errs.append(f"number {n} not in fact sheet — {', '.join(sorted(set(where))[:4])}")

    # 3. cross-surface distance consistency (airport / city)
    dist = {}
    for path, text in surfaces:
        for m in re.finditer(r"(airport|aeropuerto|aeroporto)[^.\n]{0,80}?(\d+(?:\.\d+)?)\s?km", text or "", re.I):
            dist.setdefault(m.group(2), set()).add(path)
    if len(dist) > 2:
        warns.append(f"airport distance appears as {sorted(dist)} across surfaces — check each is labelled (straight-line vs road)")
    return errs, warns


def main():
    if len(sys.argv) < 4:
        print(__doc__); sys.exit(2)
    content_root, research_root, slugs = sys.argv[1], sys.argv[2], sys.argv[3:]
    bad = 0
    for slug in slugs:
        errs, warns = check(content_root, research_root, slug)
        tag = "PASS" if not errs else "FAIL"; bad += bool(errs)
        print(f"[{tag}] {slug}")
        for e in errs: print(f"    BLOCK {e}")
        for w in warns: print(f"    warn  {w}")
    print(f"\nTRACE GATE: {len(slugs)-bad}/{len(slugs)} pass")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
