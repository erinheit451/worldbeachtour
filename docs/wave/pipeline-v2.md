# Gold pipeline v2 — research once, author from the sheet

Supersedes the per-page "author-with-web → fable verify → fable verify → repair"
loop for Tier-2 Featured pages. That loop produced ~11k tokens of page for ~370k
tokens all-in because three agents each re-researched the same beach, and its
dominant defect class (Wave 3: 37 blocking findings) was the author *exceeding*
a source it had already found — not missing research.

v2 makes fabrication structurally visible: the author never touches the web, so
any specific not in the fact sheet is by construction invented.

## Stages (per beach; a wave runs each stage for 12 beaches in parallel)

| stage | model  | web | reads | writes | gate |
|---|---|---|---|---|---|
| R research | sonnet | ≤25 search / ≤20 fetch | data json, meta, scaffold mdx, spec | `research/<slug>.json` | ≥30 facts w/ verbatim quotes + URLs, dead_ends listed |
| A author   | sonnet | **none** | sheet, spec, manila exemplar | composition, showcase (+`fact_ids`), spoke mdx, overview+travel rewrite | `mech_check.py` + `trace_check.py` self-run |
| M mech     | —      | — | page | — | `mech_check.py`, `trace_check.py`, `build_ledger.py` |
| V verify   | sonnet | ≤15 fetch / ≤5 search | page, sheet, ledger | `verdicts/<slug>.verdict.json` | Audit 1 sheet→page (overstatement), Audit 2 re-fetch cited URLs, recency |
| P repair   | sonnet | none | brief | page (+ new facts appended to sheet) | gates re-run |
| render     | —      | — | dev server | — | `render_verify.py`: main + spokes 200, byline, spike text |

Prompts live in `scripts/wave/prompts/*.md`; a dispatch is one line
("follow prompts/research.md, slug=X"). Briefs come from
`scripts/wave/repair_brief.py <verdicts_dir> --out <briefs_dir>`.

A page passes when: mech + trace gates pass, verdict PASS (or all blocking
repaired and re-gated), render passes. Commit per wave.

## Why each rule exists (measured, not guessed)
- **Author has no web**: Wave 1–3 verifiers' findings were overwhelmingly
  "overstated beyond the cited source", "source drift", "misread the source",
  invented specifics (admission price, species, hotel names). With the sheet as
  the only source and `trace_check` flagging every untraced number, those become
  gate failures at zero tokens.
- **Verbatim quotes in the sheet**: lets the verifier *fetch and grep* instead of
  re-search (195 searches for 12 pages in the ledger approach vs. budget
  exhaustion at 200/workflow before).
- **`dead_ends`**: the list of things the author must not supply from memory —
  the exact place the old authors hallucinated.
- **Recency in R and V**: stale facts (Blue Flag lost, event moved, record
  surpassed) were a recurring verify finding; one dated search per stage.
- **Fact sheet persists in `research/`**: a re-verify or a later refresh never
  re-researches; it re-fetches.

## Cost — measured (subagent_tokens as reported by the Agent tool; same metric as the v1 figures)
| stage | v1 (Wave 1–2) | v2 pilot-1 (unbundled, 2026-09-10) | v2 pilot-2 (bundled+batched) |
|---|---|---|---|
| R research | (inside author) | 120k / 124k / 134k — 34–47 tool calls | _fill_ |
| A author   | ~200–460k incl. research | 158k / 162k / 181k — 28–34 tool calls | _fill_ |
| V verify   | ~150k (2× fable) | 142k / 158k / 148k — 25–35 tool calls | _fill_ |
| P repair   | ~20k | 78k / 78k / 68k — 6–14 tool calls | _fill_ |
| **all-in** | **~370k** | **~500k** ✗ | target ≤200k |

**Pilot-1 lesson: v2's quality mechanism worked (R caught 2–3 scaffold
fabrications per beach; A dropped every unsupported specific; V found 1–3 real
blocking issues per page — an invented "volunteers", an invented 1978 causation,
a 4-month gap written as five) but the raw token count got WORSE.** Cost is
turns × context, not facts: each agent dragged a 30–60k context through 25–47
tool calls (the author re-read a 12k exemplar ~30 times). Fixes applied for
pilot-2: `bundle.py` makes every stage one-read (16–22k tokens) → one-write; the
exemplar is a 3k excerpt; research/verify issue searches and fetches in parallel
batches of 4–6 per turn; verify fetch cap 12, only load-bearing rows.

## Triage (before spending anything)
The remaining queue (146 clean buildable at 2026-09-10) is thinner than what is
built: 108/146 have <20 % data completeness. A beach with no documented tension
is where authors manufacture a spike. Rule: if stage R returns no `strong`
spike candidate, STOP — do not author. Park the slug in
`docs/wave/parked.txt` with the reason. R is the triage; it costs one stage,
not four.

## Wave mechanics
- Work in the worktree `C:\Users\Roci\worldbeachtour-gold-resume`; branch per
  wave; agents are forbidden from git.
- Dispatch 12 R agents at once, then 12 A, then gates, then 12 V, then P for
  FAILs. Each stage's outputs are files, so a killed session resumes from disk:
  `python scripts/wave/wave_status.py research verdicts <slugs…>`.
- Waves of 12 keep the orchestrator's read of results to one short summary per
  agent; never read agent transcripts.
- Deploy is unchanged (`scripts/deploy.sh`, cgroup-capped build on the box).
