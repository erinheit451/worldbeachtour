"""Zero-LLM fix for legacy gold pages whose showcase.json timeline is out of order
(mech_check's chronology gate, added 2026-09-13, flagged 17 of 178).
Rules: stable sort by (year, month); a null month sorts as "sometime that year"
BEFORE dated rows of the same year (-1); month names ("May") are normalised to ints.
Nothing else in the row is touched; file is rewritten with the same 2-space indent + LF.
Usage: python sort_timelines.py <content_beaches_root> [--apply] [slug...]
"""
import json, os, sys

try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

MONTHS = {m.lower(): i for i, m in enumerate(
    ["January","February","March","April","May","June","July","August","September","October","November","December"], 1)}


def month_int(v):
    if v in (None, ""): return None
    if isinstance(v, int): return v
    s = str(v).strip().lower()
    if s.isdigit(): return int(s)
    if s in MONTHS: return MONTHS[s]
    if s[:3] in {k[:3]: k for k in MONTHS}: return MONTHS[{k[:3]: k for k in MONTHS}[s[:3]]]
    raise ValueError(f"unparseable month {v!r}")


def main():
    args = sys.argv[1:]
    apply = "--apply" in args
    if apply: args.remove("--apply")
    root, slugs = args[0], args[1:] or sorted(os.listdir(args[0]))
    changed = 0
    for slug in slugs:
        p = os.path.join(root, slug, "showcase.json")
        if not os.path.isfile(p): continue
        raw = open(p, encoding="utf-8").read()
        try: s = json.loads(raw)
        except Exception: continue
        tl = s.get("timeline") or []
        if not tl: continue
        try:
            norm = [dict(t, month=month_int(t.get("month"))) for t in tl]
            if any(t.get("year") in (None, "") for t in norm): raise ValueError("a row has no year")
        except ValueError as e:
            print(f"SKIP {slug}: {e}"); continue
        # null month = "sometime that year": keep it where the author put it relative to that
        # year's dated rows (inherit the preceding row's month), so verified pages are not reshuffled
        keys, last = [], {}
        for t in norm:
            y = int(t["year"]); m = t["month"]
            if m is None: m = last.get(y, -1)
            else: last[y] = m
            keys.append((y, m))
        keyed = [t for _, t in sorted(zip(keys, norm), key=lambda kt: kt[0])]
        if keyed == norm and norm == tl: continue
        changed += 1
        moved = sum(1 for a, b in zip(tl, keyed) if a is not b and a != b)
        print(f"{'FIX ' if apply else 'DRY '}{slug:34} rows={len(tl)} moved/normalised={moved}")
        if apply:
            s["timeline"] = keyed
            indent = 2 if raw.lstrip().startswith("{\n  ") else 1
            open(p, "w", encoding="utf-8", newline="\n").write(json.dumps(s, ensure_ascii=False, indent=indent) + "\n")
    print(f"{'applied' if apply else 'would change'}: {changed}")


if __name__ == "__main__":
    main()
