# Stage P — Repair from a brief (NO web, sonnet)

Read `<briefs_dir>/<slug>.brief.txt`. Fix EVERY numbered blocking issue on EVERY
surface the brief names (the same wrong claim usually lives in 3–6 places:
spike_statement, intro_text, spike_explainer, key_facts, timeline, a DataCard in
travel.mdx, overview.mdx, the spoke). Apply the REQUIRED FIX wording. Grep the
whole beach dir for the old number/name to catch surfaces the brief missed.

Rules: change nothing else; keep JSON valid and shapes intact; spike_statement
stays ≤160 chars; preserve diacritics; do not introduce any new specific that is
not in `research/<slug>.json` or in the brief's EVIDENCE. If a fix requires a
fact you do not have, delete the claim rather than guess.

Then run and make pass:
```
python scripts/wave/mech_check.py site/content/beaches <slug>
python scripts/wave/trace_check.py site/content/beaches research <slug>
```
If the brief's EVIDENCE introduces a new sourced fact you needed, append it to
`research/<slug>.json` facts with a new id and the brief's URL as `url`.

No git. Finish with a per-issue list: `n. FIXED — surfaces touched` or
`n. DELETED — reason`.
