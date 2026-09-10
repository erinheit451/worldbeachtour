"""Turn verifier verdicts into compact per-beach repair briefs. ZERO LLM tokens.

The repair agent should receive the BLOCKING list and nothing else -- not the
verifier's reasoning, not the page text (it can read that itself). Keeping the
brief small is most of why this stage is cheap.

Usage: python repair_brief.py <verdicts_dir> [--out DIR]
"""
import json
import os
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass


def load(verdict_dir):
    out = []
    for f in sorted(os.listdir(verdict_dir)):
        if not f.endswith(".verdict.json"):
            continue
        try:
            out.append(json.load(open(os.path.join(verdict_dir, f), encoding="utf-8")))
        except Exception as e:
            print(f"  !! unreadable {f}: {e}")
    return out


def brief_for(v):
    lines = [f"REPAIR BRIEF — {v.get('slug')}", ""]
    blocking = v.get("blocking") or []
    if not blocking:
        lines.append("No blocking issues.")
        return "\n".join(lines), 0
    lines.append(f"{len(blocking)} BLOCKING issue(s). Fix every one. Do not restyle anything else.")
    lines.append("")
    for i, b in enumerate(blocking, 1):
        lines.append(f"--- {i}. {b.get('where') or '(surface unspecified)'}")
        if b.get("claim"):
            lines.append(f"    CLAIM AS WRITTEN : {b['claim']}")
        if b.get("problem"):
            lines.append(f"    WHY IT IS WRONG  : {b['problem']}")
        if b.get("evidence"):
            lines.append(f"    EVIDENCE         : {b['evidence']}")
        if b.get("fix"):
            lines.append(f"    REQUIRED FIX     : {b['fix']}")
        lines.append("")
    return "\n".join(lines), len(blocking)


if __name__ == "__main__":
    vdir = sys.argv[1]
    outdir = None
    if "--out" in sys.argv:
        outdir = sys.argv[sys.argv.index("--out") + 1]
        os.makedirs(outdir, exist_ok=True)

    verdicts = load(vdir)
    tot_block = tot_adv = 0
    counts = {}
    print(f"{'slug':22} {'verdict':8} {'blocking':>8} {'advisory':>8} {'checked':>8} {'searches':>8}")
    for v in sorted(verdicts, key=lambda x: x.get("slug") or ""):
        nb = len(v.get("blocking") or [])
        na = len(v.get("advisory") or [])
        tot_block += nb
        tot_adv += na
        counts[v.get("verdict", "?")] = counts.get(v.get("verdict", "?"), 0) + 1
        print(f"{v.get('slug',''):22} {v.get('verdict',''):8} {nb:>8} {na:>8} "
              f"{v.get('claims_checked','?'):>8} {v.get('searches_used','?'):>8}")
        if outdir:
            text, _ = brief_for(v)
            open(os.path.join(outdir, f"{v['slug']}.brief.txt"), "w",
                 encoding="utf-8").write(text)

    print(f"\n{len(verdicts)} verdicts | verdicts: {counts}")
    print(f"TOTAL blocking: {tot_block}   TOTAL advisory: {tot_adv}")
    if outdir:
        print(f"briefs written to {outdir}")
