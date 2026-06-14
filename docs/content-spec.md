# Beach content spec — what a production content agent writes

The contract every content-generation subagent follows. Produces the two JSON
files a beach needs; `assemble_beach.py` + the unified `[slug]` route do the rest.

## Files (write EXACTLY these two, nothing else; NO git, NO .tsx/.ts)
- `site/content/beaches/<slug>/composition.json`
- `site/content/beaches/<slug>/showcase.json`

## Voice rules (anti-AI-slop)
- Declarative, specific. Every sentence carries a real fact, name, date, or number.
- NO brochure adjectives: stunning, breathtaking, pristine, nestled, gem, paradise, must-visit, hidden.
- Honest about the uncomfortable parts (deaths, overtourism, access caps, erosion, exploitation — whatever is real). Don't moralize; report.
- NEVER invent businesses, people, films, or events. Unverifiable → leave it out. Research via web search and verify; if sources conflict, say so or omit.

## composition.json
```
{ "slug": "<slug>", "beach_name": "<Name>", "version": "0.9", "tier": <1|2>,
  "subtitle": "<one line>",                // tier 2 (a spike_statement is the tier-1 form)
  "spike_statement": "<one sentence, UNDER 160 chars, ends with a period>",
  "levers": { "primary_color": "<hex>", "supporting_color": "<hex>",
    "hero_type": "MONUMENT", "display_pairing": "CLASSICAL",
    "voice_register": "<ROMANTIC|REVERENT|TECHNICAL|MELANCHOLIC>", "photo_tone": "<short>" },
  "byline": "Written by Erin Rose",
  "sections": ["hero","quick_facts","story","spike_deep_explainer","timeline","place_anatomy","day_in_life","culture","honest_reckoning","comparison","sea_surf","things_to_know","plan_stack","gallery","sources"],
  "spokes": [] }
```

## showcase.json — exact keys and types
- `intro_text`: string, 4–6 paragraphs (`\n\n` separated), ~1800–2400 chars.
- `spike_explainer`: string, **>=700 words** (tier 1: >=800), markdown with `\n\n` and optional `**bold**` — the deep argument for what makes this beach singular.
- `honest_reckoning_note`: string, 1–2 paragraphs (the uncomfortable truth).
- `reckoning_pullquote`: string, one sharp sentence.
- `key_facts`: array of `{label, value, source}` — 6–8 monument-grade numbers.
- `margin_notes`: array of `{audience, anchor_para_index, text}` — 5–6 gutter asides; `audience` ∈ geology|history|safety|nature|local|culture|surf|economy; `anchor_para_index` is a 0-based index into intro_text's paragraphs.
- `day_in_time`: `{dawn, midday, golden, night}` — each 1–2 concrete sentences about THIS beach at that time (tie to tide where relevant, not just light).
- `food_drink`: array of `{name, description, where}` — 3–4 real regional dishes, located; honest if there's no food on the beach itself.
- `timeline`: array of `{year, month(or null), event_type, title, description, wiki_url(or null), source}` — 6–9 real dated events.
- `zones`: array of `{zone_code, name, position_along_beach_pct, lat, lng, character, best_for(or null), notes(or null)}` — 3–4, coords near the beach centroid.
- `landmarks`: array of `{name, landmark_type, year_built(or null), architect_or_designer(or null), description, wikipedia_url(or null)}` — 2–3.
- `cultural_refs`: array of `{ref_type(film|tv|music|literature|historic|brand|other), title, creator(or null), year(or null), description(or null), wikipedia_url(or null)}` — 3–5, real only.
- `recurring_events`: array of `{name, when_text, month(or null), description, typical_attendance(or null)}` — 1–3.
- `businesses`: array of `{name, category(restaurant|hotel|bar|museum|kiosk|market|rental), description, address(or null), year_established(or null), external_url(or null), source}` — ONLY verifiable, else `[]`.
- `things_to_know`: array of `{label, note}` — 3–4 practical/safety/access notes.
- `access_note`: string — how to actually arrive.

Valid JSON, no comments, no trailing commas.
