# Legendary verify brief — V1 (sheet → page), one slice of the Coney Island page

Working dir `C:\Users\erinr\wt\worldbeachtour\main`. The author had NO web access and could only use
the fact sheet `research/coney-island-beach-1.json` (677 facts; every fact's quote was mechanically
confirmed verbatim on its source page by quote_check — do NOT re-fetch to confirm quotes). Your job:
does every claim in YOUR SLICE stay within what the sheet's facts actually say?

## Read
1. `scripts/wave/prompts/verify.md` — the defect classes and output shape. Follow its Audit 1 fully.
   Its Audit 2 is replaced by the narrow web rule below. Its tool-call cap is replaced below.
2. `research/legendary/coney-island-beach-1/AUTHOR-BRIEF.md` — the rules the author had to follow
   (copy, tense, superlatives, victims, conflicting numbers, weak sources). Violations are findings.
3. Your slice of `site/content/beaches/coney-island-beach-1/showcase.json` / `composition.json`
   (your dispatch names the fields) — read the file once.

## How to check (the sheet is ~430 KB — do not read it whole)
For each claim carrying a number, date, name, quote, rule, superlative or causal link: use Grep on
`research/coney-island-beach-1.json` (search a distinctive word/number; `-C 3` to see the fact,
quote, url, date_of_source, confidence). Entries with `fact_ids` tell you where to look first.
Also grep the `conflicts` and `dead_ends` sections: a claim that picks one side of a listed conflict
without saying sources differ, or supplies a dead-end item, is BLOCKING.
Batch your Greps: several per message.

Defects to hunt, beyond verify.md's list:
- overstatement past the quote; certainty where the source hedges ("legend has it", "reportedly")
- stale presented as current (check `date_of_source`, `time_sensitive`); wrong tense for 2026
  events relative to today 2026-10-13 (season over; scheduled vs held)
- arithmetic and date spans (verify against `derivations` in the sheet)
- a medium-confidence/satirical-source fact used for a load-bearing claim
- copy rule breaks: clever lines, slogans, tricolons, jargon, sentences a 13-year-old would trip on,
  brochure words, unsourced superlatives — list as ADVISORY unless they mislead (then BLOCKING)
- named minor victims (BLOCKING)

## Web (narrow)
Only for: businesses/attractions presented as operating now, and any 2026-dated claim you suspect is
stale. ≤6 WebFetch, ≤2 WebSearch, in parallel batches.

## Output
Write `research/legendary/coney-island-beach-1/verdicts/v1.<slice>.json` in verify.md's shape
(slug, verdict, claims_checked, blocking[], advisory[], verified_ok[]). Each `fix` must be exact
replacement wording a repair agent with no web can apply verbatim, with the field path
(e.g. `showcase.timeline[4].text`). No edits to page files. No git. Finish with a 4-line summary.
