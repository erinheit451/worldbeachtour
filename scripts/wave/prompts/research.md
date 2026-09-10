# Stage R — Research a beach into a fact sheet (web-enabled, sonnet)

You are building the ONLY research that will ever be done for this beach. A later
author writes the page from your fact sheet with NO web access, and a later
verifier re-fetches your URLs to confirm your quotes. So: every fact needs a URL,
every quote must be verbatim, and anything you could not find must be listed as a
dead end so the author does not invent it.

## Inputs (read all)
- `site/data/beaches/<slug>.json` — coords, country, nearest city/airport
  (`nearest_airport.distance_km` is STRAIGHT-LINE, never road), wikipedia_url.
- `site/content/beaches/<slug>/meta.json` — images already chosen (hero caption
  hints only; do not research images).
- `site/content/beaches/<slug>/overview.mdx` + `travel.mdx` — an UNTRUSTED
  auto-generated scaffold. Treat any specific in it as a hypothesis to check, not a
  fact. Prior audits found invented species, hotel names, wrong hills.
- `docs/content-spec.md` — so you know what the page will need (timeline, zones,
  landmarks, cultural refs, food, businesses, things_to_know, access).

## Method
1. Identity first: what exactly is this beach, where, any slug/name mismatch,
   near-duplicates (a different beach with the same name in the same country).
2. Wikipedia (EN and the local-language edition) → fetch and quote.
3. Official sources: municipality / national-park / conservation agency / port /
   lifeguard service / tourism board / transit operator / airport site. Road
   distances and prices ONLY from these or a named press report — never estimate.
4. Press: search `<beach name> 2025`, `<beach name> 2026`, and the local-language
   equivalent; also `<name> erosion|drowning|closure|sargassum|development|dispute`
   as relevant. The uncomfortable story is the point — find what a brochure elides.
5. Culture: films/books/songs/events ONLY if a source names the beach explicitly.
6. Businesses and restaurants ONLY from the business's own site or dated press —
   and record whether it is CURRENTLY operating (fetch date on the page).
7. Fetch pages (WebFetch); do not rely on search snippets for quotes.

Budget: ≤20 WebSearch, ≤20 WebFetch. Stop when you have 35–45 facts or the budget
is spent — write the sheet either way.

**Cost discipline — this stage is priced by TURNS, not by facts.** Issue tool
calls in parallel batches: all 4–6 searches for a topic in ONE message; then
4–6 fetches in ONE message. Plan three rounds (identity+wikipedia → official+
press → recency+gaps), each round = one search batch + one fetch batch. Write
the sheet in ONE Write call. Target ≤10 tool turns total.

## Output — write EXACTLY one file: `research/<slug>.json`
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
     "quote": "VERBATIM sentence(s) from the source, ≤300 chars, original language",
     "url": "https://...", "source_title": "...",
     "source_type": "official|wikipedia|press|academic|tourism-board|business-site|other",
     "date_of_source": "YYYY-MM or YYYY", "lang": "en|pt|...", "confidence": "high|medium"}
  ],
  "recency": {"queries": ["..."], "newest_item": "what the newest dated item says, with date", "fact_ids": []},
  "dead_ends": ["things searched for and NOT found — e.g. 'no road distance to airport from any official source', 'no named restaurant with a live website'"],
  "conflicts": ["where two sources disagree, both values with fact ids"],
  "budget": {"searches": 0, "fetches": 0}
}
```
Required coverage or an explicit dead_end: ≥8 dated events; geography with a
sourced road/travel figure; safety (lifeguards, rips, closures); governance or
ownership; at least one 2025–2026 item; at least one non-English source when the
country is not anglophone; food specific to the region with a source.
Valid JSON, UTF-8, diacritics preserved. No git. No other files.

Finish with a 5-line summary: facts count, spike candidate #1, strongest dead end,
searches/fetches used.
