# Stage R2 — Extract a fact sheet from harvested raw sources (sonnet, NO web)

You have NO web access. Read ONE file — the sources bundle (path in your dispatch):
every harvested page as raw text, each section headed by its URL. Then write
`research/<slug>.json` in the schema below, in ONE Write call. **Hard cap: tool calls =
(number of bundle parts) + 1 — one Read per part, then ONE Write. No re-reads, no
greps, no Bash. Every extra call re-bills the whole bundle (measured 09-13: 5–12 calls
→ 130–180k tokens for a 30k-token bundle).**

**Quotes must be VERBATIM substrings of the harvested text** — copy-paste, same
spelling, hyphenation and punctuation; ≤300 chars; original language. A script
(`quote_check.py`) will grep each quote against its page; a quote it cannot find
is treated as a fabricated citation. If the page supports a claim only across two
sentences, quote the load-bearing one.

Also read the scout notes at the bottom of `research/urls/<slug>.txt` if present
(identity warnings, expected tension).

## Schema
```
{
  "slug": "...", "beach_name": "...", "researched_at": "YYYY-MM-DD",
  "identity": {"what_it_is": "...", "where": "...", "aliases": [], "warnings": "slug/name mismatch, near-dupes, or null"},
  "spike_candidates": [
    {"statement": "≤160 chars, one sentence, a specific claim with a date or number",
     "tension": "the uncomfortable truth behind it, one sentence",
     "fact_ids": ["F03","F07"], "strength": "strong|medium|weak"}
  ],
  "facts": [
    {"id": "F01", "topic": "identity|history|geography|access|safety|economy|nature|culture|events|food|business|governance|recent",
     "fact": "one sentence in your own words carrying the number/date/name",
     "quote": "VERBATIM substring of the harvested page",
     "url": "the section's URL", "source_title": "...",
     "source_type": "official|wikipedia|press|academic|tourism-board|business-site|other",
     "date_of_source": "YYYY-MM or YYYY", "lang": "en|pt|...", "confidence": "high|medium"}
  ],
  "recency": {"newest_item": "what the newest dated item says, with date", "fact_ids": []},
  "dead_ends": ["what the page will need that NO harvested source provides — road distance to airport, lifeguard staffing, named restaurants, prices…"],
  "conflicts": ["where two sources disagree, both values with fact ids"],
  "budget": {"sources_read": <n>}
}
```
Target 30–45 facts; ≥8 dated events; geography, safety, governance, food, recency
each covered or listed as a dead end. Businesses only if a harvested page is the
business's own site or dated press confirming it operates now. If no `strong`
spike candidate exists, say so — the wave parks the slug rather than authoring.
Valid JSON, diacritics preserved. No git. No other files.
