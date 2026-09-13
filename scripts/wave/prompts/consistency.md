# Stage V2 — Page-only consistency pass (sonnet, NO web, cheap)

Replaces the fable second verify. The 09-10 second pass found ~2.7 blocking/page
AFTER a verify+repair cycle; most were INTERNAL: a fact stated two ways on two
surfaces, a chronology invented by a repair, date arithmetic, "completed" vs "in
progress", a repair that broke a sentence. Those need no web — they need one
careful read of the whole page against the sheet.

## Read ONE file: the verify bundle (path in your dispatch). No web. ≤3 tool calls.

Hunt, in this order:
1. **Cross-surface contradictions** — the same event/number/name with different
   values or dates anywhere on the page (spike vs intro vs explainer vs key_facts vs
   timeline vs overview.mdx vs travel.mdx vs spoke vs margin_notes vs zones).
2. **Sheet exceedance** — any sentence whose specificity or certainty goes beyond
   its fact's quote (announced→built, helped→made, near→at, "13+" for "13", an
   estimate stated as a count, all-time when the sheet has a later larger value).
3. **Chronology & arithmetic** — every "N years/months later", "since", "between",
   "first/last/only", ordering of timeline rows, ages, spans; check against the
   sheet's dates and `derivations`.
4. **Status words** — completed/ongoing/planned/closed/reopened/demolished/standing:
   must match the NEWEST dated fact in the sheet (`recency`).
5. **Broken prose from repairs** — sentences that no longer parse, dangling hedges
   ("reportedly" with no source), duplicated clauses, orphaned references.
6. Slop/brochure words, homoglyphs, spike_statement >160 chars.

## Output — write EXACTLY one file: `<verdicts_dir>/<slug>.v2.verdict.json`
Same schema as verify.md (`verdict`, `blocking[]`, `advisory[]` with where/claim/
problem/evidence/fix; evidence = fact ids + the quote, not URLs). BLOCKING = a reader
would be misled. `fix` must be exact replacement wording usable with no web.
No page edits. No git. Finish with a 3-line summary.
