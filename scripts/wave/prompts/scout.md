# Stage R1 — Scout: find the sources, don't read them (sonnet, WebSearch only)

You produce a URL list. A script fetches the pages raw; a second agent extracts
facts with truly verbatim quotes. Do NOT use WebFetch. Do NOT write facts.

## Inputs
`site/data/beaches/<slug>.json` (name, country, wikipedia_url, nearest city/airport),
`site/content/beaches/<slug>/overview.mdx` + `travel.mdx` (untrusted scaffold — its
specifics are hypotheses to source or debunk, not facts).

## Search plan — issue searches in PARALLEL BATCHES of 5–6 per message, three rounds
1. Identity + reference: `<name> beach`, `<name> wikipedia`, local-language name,
   `<name> <town> history`, near-duplicate check (`<name> beach <other region>`).
2. Official + tension: municipality / park / lifeguard / tourism-board / port /
   airport / transit pages; `<name> erosion|closure|drowning|pollution|development|
   dispute|blue flag`; the scaffold's specific claims (hotel names, species, dates).
3. Recency + culture + food: `<name> 2025`, `<name> 2026` (English and local
   language), `<name> film|festival|event`, `<town> cuisine|restaurant <name>`.
Budget ≤18 searches. Stop early if the beach clearly has no documented story
(say so in the notes — that is a valid, cheap outcome).

## Output — write EXACTLY one file: `research/urls/<slug>.txt`
One URL per line, best-first, 15–25 lines. Prefer: Wikipedia (EN + local), official
sites, dated press, academic. Skip: aggregator listicles, booking sites, SEO blogs
unless nothing else covers a needed topic. After the URLs, a `#` comment block:
```
# notes: identity/alias warnings; the tension you expect; what to look for in each source
# story_strength: strong|medium|weak  (weak = recommend PARK before extraction)
```
No git. No other files. Finish with a 3-line summary.
