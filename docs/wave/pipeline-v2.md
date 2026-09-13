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


## Second-pass finding (2026-09-10, measured on all 17 new pages before deploy)
An INDEPENDENT second verify (fable on the 5 pilots, fresh sonnet on the 12
Wave-3 pages) after each page had already passed one verify+repair cycle:
**17/17 FAIL, 46 blocking + 115 advisory (~2.7 blocking/page).** Blockers included
spike-level misreads (Bang Saen "13+" whales; Kozhikode dropping "near"), stale
facts (a house demolished in Feb 2026 still "standing"; a festival held ten days
earlier still "no attendance reported"), a 2018 article presented as 2026, a
fabricated injury, and one chronology INVENTED BY THE 09-05 REPAIR (Kamala).
Repairs then needed their own audit (6 checkers): 3/17 repairs introduced new
damage (a broken spike sentence, an unsupported hedge, a cross-surface
contradiction). Conclusion: **one verify pass is not gold-standard; the process
that shipped is R → A → gates → V1 → P1 → V2 (fable, bundled) → P2 → repair-audit
→ render → deploy.** Cost of that full path ≈ 800k sonnet-equivalent/page for
Wave-3-style pages, ~1.4M for pilots with a fable V2. Defects recur across passes
because a page repeats each fact on 4–9 prose surfaces; see the process memo.

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

## Wave 4 (2026-09-13) — v2.1 as actually run, with measured costs
14 pages authored and double-verified on branch `wave4-0913` (not pushed, not
deployed): platja-de-cala-vedella, cala-salada (ES); praia-do-peneco,
praia-da-adraga (PT); sunset-beach-16, third-beach-1 (CA); aksa-beach-1,
vodarevu-beach (IN); gooseberry-beach, goat-rock-beach (US); sunnyside-beach-3,
shelly-beach-8 (AU); pendine-sands (GB); kokkino-nero-1 (GR). Parked 7
(`parked.txt`): dupes/non-beaches/identity risks, plus laiya-beach (no story)
and kund-malir-beach-1 (thin research, weak spike).

Path: `triage.py` (0 tokens) → scout (sonnet, search-only) → `harvest.py` (0) →
extract (sonnet, no web) → `quote_check.py --local` (0; **641/641 quotes
verbatim**, vs ~30% under WebFetch research) → author (sonnet, no web) →
`mech_check` + `trace_check` (0) → `render_verify.py` (0) → V1 verify (sonnet,
Audit 1 from bundle; web only for businesses/recency) → repair → V2
`consistency.md` (sonnet, page-only, NO web — replaces the fable pass) → repair
→ gates → render. All sonnet; zero fable.

| stage | tokens/page (measured) | notes |
|---|---|---|
| scout | ~95k | search results are verbose; session hit the 200-search cap at 16 scouts |
| extract | ~145k | bundle read in parts (see truncation below) |
| author | ~168k | output-bound; anti-repetition rule + caps applied |
| V1 verify | ~122k | 0–8 fetches; 26 blocking / 12 FAIL of 14 (1.9/page vs 3.1 Wave 3) |
| repair 1 | ~90k | |
| V2 consistency | ~128k | 28 blocking / 13 FAIL of 14 — arithmetic, cross-surface drift, 2 repair-introduced |
| repair 2 | ~85k | |
| **all-in** | **~830k sonnet raw** | ≈ Wave-3 shipped path in $, with greppable citations and no fable |

**What the wave taught (all measured):**
- The agent Read tool silently truncates a file at ~50k chars (a 122k bundle was
  cut at 53,118). Every earlier bundle >50k was only partly read — pilot authors
  likely never saw the exemplar. `bundle.py` now splits into `.partNofM` files.
- `quote_check` false-flagged 16 Pendine quotes on Wikipedia `[ 2 ]` markers and 7
  Greek-Wikipedia rows on URL percent-encoding — my checker was the defect, again.
  Fixed (marker strip, `ukey()` URL canon). `--local` greps the harvested text.
- `trace_check.data_numbers()` resolved `site/content/data/...` (wrong dir) so
  authors dropped every dataset number (airport km, wave heights). Fixed.
- The lens router 404s any lens under 300 prose words; the anti-repetition rule
  pushed two lenses under it. author.md now sets a 360-word floor.
- A repair re-dated a timeline row and left the array out of order; another
  wrote "a century and a half" for 141 years. `mech_check` now enforces timeline
  chronology (null month = year-only). It also flags 17 LEGACY gold pages —
  a mechanical sort is a separate follow-up.
- Cost is turns × context. Extract/verify/consistency each spent 6–13 tool calls
  re-billing a ~20k bundle. Next wave: hard ≤3-call cap on those stages, haiku
  scout with ≤10 searches, and merge V1+V2 prompts only if a fresh second read
  stops finding new blockers (it did not this wave: 26 then 28, mostly disjoint).

## Wave 5 (2026-09-13) — 6 pages, zero-LLM scout, hard call caps
Branch `wave5-0913`. Pages: ocean-beach-14 (SF), shankhumugham-beach, kollam-beach (IN),
cherry-beach-1, woodbine-beach (CA), cable-beach-6 (Broome). 9 slugs parked (stubs /
weak spike / visitor-review "spike" / single source) — see `parked.txt`.

**Blocker:** the session WebSearch quota (200) was already spent by Wave 4's scouts;
all 8 haiku scouts failed (~50k each, stopped). Replacement: `scout_zero.py` —
Wikipedia article + local-language article via the API, every URL they cite
(ranked official > news > other), + Bing RSS (useless for non-famous names) /
GDELT (429). **No independent recency channel this wave.** Rule: scouting is the
only stage that needs WebSearch — run it FIRST in a fresh session, or launch with
`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` raised.

| stage | Wave 4 | Wave 5 | note |
|---|---|---|---|
| scout | ~95k (sonnet) | 0 | Wikipedia+refs only; recency gap |
| extract | ~145k | ~140k | cap parts+1 held (4–6 calls) but N parts re-bill N times |
| author | ~168k | ~147k | |
| V1 verify | ~122k | ~109k | 0–3 fetches; 7 blocking (1.2/page) |
| repair 1 | ~90k | ~76k | |
| V2 consistency | ~128k | ~111k | 4 calls each; 16 blocking (2.7/page) |
| repair 2 | ~85k | ~79k | |
| **all-in** | **~830k** | **~660k** | −20%; still all sonnet, zero fable |

Where the remaining cost sits: extract and both verify passes each pay for the
full bundle once per part. The next lever is bundle SIZE (SOURCES_MAX 130k→90k
and a tighter verify bundle), not call count. The two-pass verify is not
negotiable: V2 found 2.7/page AFTER V1+repair, mostly cross-surface and
arithmetic, same as Wave 4.

Triage held the line: 3 of 9 extracted sheets were parked at zero authoring
cost (10-fact stub; single-source medium spike; a "spike" resting on an
anonymous visitor review). The pool after this wave: ~128 clean buildable, and
the thin end is now reached — see the Tier-1 vs enrichment decision.
