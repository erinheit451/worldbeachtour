"""Zero-token wave status board: which stage each slug has reached, from disk.

Usage: python wave_status.py <research_dir> <verdicts_dir> <slug> [slug...]
Stages: R sheet exists (facts count, strong spike?) -> A composition+showcase exist
        -> M mech+trace gates -> V verdict (PASS/FAIL, blocking) -> ready to commit.
"""
import json, os, subprocess, sys

try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONTENT = os.path.join(ROOT, "site", "content", "beaches")
WAVE = os.path.dirname(os.path.abspath(__file__))


def gate(script, *args):
    r = subprocess.run([sys.executable, os.path.join(WAVE, script), *args],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    return r.returncode == 0, r.stdout


def main():
    rdir, vdir, slugs = sys.argv[1], sys.argv[2], sys.argv[3:]
    print(f"{'slug':22} {'R':>10} {'A':>3} {'mech':>5} {'trace':>6} {'V':>14}  next")
    for s in slugs:
        rp = os.path.join(rdir, f"{s}.json")
        R = "-"; strong = False
        if os.path.exists(rp):
            try:
                sh = json.load(open(rp, encoding="utf-8"))
                n = len(sh.get("facts") or [])
                strong = any(c.get("strength") == "strong" for c in sh.get("spike_candidates") or [])
                R = f"{n}f{'*' if strong else ''}"
            except Exception as e:
                R = "BAD"
        A = "y" if os.path.exists(os.path.join(CONTENT, s, "composition.json")) else "-"
        mech = trace = "-"
        if A == "y":
            mech = "ok" if gate("mech_check.py", CONTENT, s)[0] else "FAIL"
            trace = "ok" if gate("trace_check.py", CONTENT, rdir, s)[0] else "FAIL"
        V = "-"
        vp = os.path.join(vdir, f"{s}.verdict.json")
        if os.path.exists(vp):
            try:
                v = json.load(open(vp, encoding="utf-8"))
                V = f"{v.get('verdict')} b={len(v.get('blocking') or [])}"
            except Exception:
                V = "BAD"
        if R == "-": nxt = "research"
        elif R != "BAD" and not strong: nxt = "PARK (no strong spike)"
        elif A == "-": nxt = "author"
        elif mech != "ok" or trace != "ok": nxt = "fix gates"
        elif V == "-": nxt = "verify"
        elif V.startswith("FAIL"): nxt = "repair"
        else: nxt = "render + commit"
        print(f"{s:22} {R:>10} {A:>3} {mech:>5} {trace:>6} {V:>14}  {nxt}")


if __name__ == "__main__":
    main()
