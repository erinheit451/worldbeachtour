# Stage A — Author a Tier-2 Featured page from the fact sheet (NO web, sonnet)

You have NO web access and must not try to use any. Every specific on the page —
every number, date, price, distance, name, title — must come from
`research/<slug>.json`. If the sheet lacks it, the page goes without it. The
`dead_ends` list is a list of things you are forbidden to supply from memory.

## Read ONE file: the author bundle (path given in your dispatch)
It contains, in order: `research/<slug>.json` (your ONLY source of facts),
`docs/content-spec.md` (file contract + voice), the exemplar excerpt (quality
bar — match its density), `site/data/beaches/<slug>.json`, `meta.json` (do not
edit), and the existing `overview.mdx`/`travel.mdx` (UNTRUSTED scaffold — you
REPLACE them entirely, keeping only the MDX component pattern
`<MapEmbed lat= lng= name= />`, `<DataCard label= value= unit= />`,
`<WeatherWidget … />`). Do not read anything else.

## Write (exactly these, in `site/content/beaches/<slug>/`)
- `composition.json` — spec shape; `tier: 2`; `spike_statement` ≤160 chars
  ending with a period, taken from the sheet's strongest spike candidate;
  `levers` uses ONLY the canonical enums (voice_register ∈
  CLINICAL|REVERENT|ROMANTIC|SEVERE|WRY; hero_type ∈ MONUMENT|SPIKE|LAYERED|ABSENCE;
  display_pairing ∈ CLASSICAL|AUSTERE|VERNACULAR) and no other keys; declare ONE
  spoke `{"slug": "<lens>", "type": "deep_dive"}` where lens ∈
  history|environment|surf|sand|culture|travel|family|photography|diving (the
  router's lens set — anything else 404s; pick what the facts support).
- `showcase.json` — every spec key. **Add `"fact_ids": ["F.."]` to every entry
  in key_facts, timeline, landmarks, cultural_refs, businesses, recurring_events,
  zones** (the array of sheet ids that support that entry). Keep the existing
  `source` fields too (human-readable). `spike_explainer` ≥750 words.
  `intro_text` 1800–2400 chars. `businesses: []` unless the sheet has a
  business-site or dated-press fact confirming it operates now.
- `<lens>.mdx` — the deep-dive spoke, 900–1400 words, MDX components where
  useful, ends with a back-link `[← Back to the full <Name> guide](/beaches/<slug>)`.
- `overview.mdx` and `travel.mdx` — rewritten from the sheet. Label straight-line
  vs road distances explicitly; the dataset's airport km is straight-line.

## Work in as few tool calls as possible (this is what the stage costs)
1 Read (the bundle) → think → 5 Writes (one per output file, complete on the
first write, no incremental edits) → 1 Bash running BOTH gates → one fix pass
(Edit) → 1 Bash re-run. Target ≤10 tool calls total.

## Rules
- Voice: declarative, specific, honest; no brochure words (stunning, breathtaking,
  pristine, nestled, gem, paradise, must-visit, hidden, crystal-clear); report the
  uncomfortable part without moralizing.
- Never exceed the quote. If the source says "helped make it known", the page may
  not say "made it famous". If a source says a plan was announced, the page says
  announced, not built. Distinguish held vs scheduled events.
- Preserve diacritics exactly as the sheet has them (São, Ölüdeniz, Bečići).
- **Date spans are the #1 arithmetic defect (2 of 5 pilot pages).** Any "N months/
  weeks/years later/between" in prose MUST have a `derivations` entry in the sheet
  showing both dates and the computed gap, e.g.
  `{"id":"D01","fact":"30 Sep 2024 → 5 Feb 2025 = 4 months 6 days ('just over four months')","from":["F15","F26"]}`.
  Compute day-precise; round down in words ("just over four months", never "five").
- No Cyrillic/Greek homoglyphs inside Latin words.
- Same fact → same number on every surface (airport distance, dates, prices).

## Gate yourself before finishing (run these; fix until both pass)
```
python scripts/wave/mech_check.py site/content/beaches <slug>
python scripts/wave/trace_check.py site/content/beaches research <slug>
```
`trace_check` flags any number not present in the sheet. If a number is a
legitimate derivation (e.g. "13 months" from two dated facts), add the derivation
as a `"derived"` entry in a `"derivations"` array you append to
`research/<slug>.json`: `{"id":"D01","fact":"…","from":["F03","F09"]}` — the
verifier will check the arithmetic. Anything else: remove the number.

No git commands. No files other than those listed. Finish with a 6-line summary:
spike used, spoke lens, word counts, gate results, anything you had to omit for
lack of a sourced fact.
