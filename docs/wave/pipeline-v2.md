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
| R research | sonnet | ≤20 search / ≤20 fetch | data json, meta, scaffold mdx, spec | `research/<slug>.json` | ≥30 facts w/ quotes + URLs, dead_ends listed. NEXT WAVE: scout → harvest.py → extract → quote_check.py (see Citation finding) |
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
| stage | v1 (Wave 1–2) | v2 pilot-1 (unbundled) | v2 pilot-2 (bundled+batched) |
|---|---|---|---|
| R research | (inside author) | 120k / 124k / 134k — 34–47 calls | 139k / 141k — 42–46 calls |
| A author   | ~200–460k incl. research | 158k / 162k / 181k — 28–34 calls | 141k / 172k — 17 / 12 calls |
| V verify   | ~150k (2× **fable**) | 142k / 158k / 148k — 25–35 calls | 128k / 137k — 20 / 27 calls |
| P repair   | ~20k | 78k / 78k / 68k | 88k / 123k |
| **all-in (raw tokens)** | **~370k** | **~500k** | **~500k** |
| **all-in (sonnet-$-equivalent)** | **~970k** (150k fable × 5) | **~500k** | **~500k** |

Pricing (2026-09): Sonnet 5 $2/$10, Opus 5 $5/$25, Fable 5.1 $10/$50 per MTok ⇒ a
fable token costs 5× a sonnet token. v1's two fable verify passes were the bill.
**v2 is ~2× cheaper per page in dollars at equal-or-better catch rate**, on raw
tokens it is ~35% more. The raw-token target of ≤200k was the wrong yardstick;
the target is ≤400k sonnet-equivalent with zero fable.

What pilot-2 disproved: "cost = turns × context". Kozhikode's author used 12 tool
calls and still cost 172k — the author stage is OUTPUT-bound (~60 KB of files +
reasoning). Bundling cut verify ~15% and removed the exemplar re-reads; it did
not change research (dominated by fetched-page volume) or authoring.

Quality across 5 pilot pages: R caught 2–3 scaffold fabrications per beach; A
dropped every unsupported specific (fees, drive times, species counts, hotel
names); V found 1–5 real blocking issues per page — invented characterisation
("volunteers" for "a private initiative"), invented causation (1978 inlet), date
arithmetic (2 pages: "five months" for 4m6d, "thirteen months" for 7.6m), a
"completed" that the source calls "in progress", and **misattributed citations
(Kozhikode: true claims pinned to URLs that don't contain them)**. All repaired.

## Citation finding — WebFetch quotes are not verbatim (measured)
`quote_check.py` (zero-LLM: fetch each fact's URL, grep for its quote) found
**~70% of pilot-1 "verbatim" quotes absent from their pages, Wikipedia included.**
Cause: WebFetch returns a small model's rendering of the page, so researchers
quote paraphrases ("south-western" for "southwestern", infobox values stitched
into sentences). The sheets are largely right; the quotes are not greppable, so
citation misattribution is invisible until a verifier re-reads the source.

Fix (built, not yet run on a wave): split research into
**scout** (`prompts/scout.md`, search-only → `research/urls/<slug>.txt`) →
**`harvest.py`** (zero-token raw fetch → `research/src/<slug>/`, gitignored) →
**extract** (`prompts/extract.md`, one read of the ~40k-token sources bundle →
one Write, quotes are substrings of raw text) → **`quote_check.py`** as a
mechanical citation gate before authoring. Expected: research ≈ 100k with
greppable quotes; verify shrinks to the rows quote_check could not confirm.

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
