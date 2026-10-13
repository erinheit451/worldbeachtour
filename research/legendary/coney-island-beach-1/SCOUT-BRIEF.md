# Legendary scout brief — Coney Island Beach (slug `coney-island-beach-1`)

We are building the single best page on the internet about **Coney Island Beach, Brooklyn, NY**:
a Tier-1 "Legendary" page, ~6,000–8,000 words plus 3–4 sub-pages. Every fact must come from a
source a script can download and grep. You FIND sources; you do not write facts.

The page must beat the current top results for "coney island beach": Wikipedia's Coney Island
article (history, but about the neighborhood) and the NYC Parks facility page (official rules,
almost no context). Readers are (a) people planning a beach day, (b) people curious about the
history and culture. The page must answer the beach-goer's practical questions with official,
CURRENT (2025–2026) sources, and tell the real story with primary/authoritative sources.

## Rules
- WebSearch only. Do NOT use WebFetch. Do NOT write facts. No git commands of any kind.
- Issue searches in parallel batches. Budget: **≤12 searches total.**
- Prefer, in order: official (.gov, nyc.gov, nycgovparks.org, mta.info, ny.gov, noaa.gov,
  usace.army.mil, epa.gov), NYC Landmarks Preservation Commission designation reports, National
  Park Service / NRHP, Library of Congress, Brooklyn Public Library / Brooklyn Historical Society,
  Coney Island History Project, Wikipedia (EN), museums/universities, dated reporting from major
  outlets (NYT, Gothamist, Brooklyn Paper, AP, Brooklyn Eagle, THE CITY, amNY, Curbed). Operator
  sites for currently-operating businesses (Luna Park, Deno's Wonder Wheel, Nathan's, Coney Island
  USA, NY Aquarium). Skip listicles, booking sites, SEO blogs, TripAdvisor.
- Pages must be plain-HTML fetchable (avoid PDFs over ~10 MB, paywalled pages, JS-only apps).
  PDFs of designation reports are fine.
- Note anything that looks out of date or contradicted across sources.

## Output — write EXACTLY one file: the path given in your task
One URL per line, best-first, 15–25 lines. Then a `#` comment block:
```
# notes: what each top source should contain; contradictions; recency warnings; things
#        that are commonly repeated online but you suspect are wrong (myths)
# gaps: questions in your topic you could NOT find a solid source for
```
Finish with a 3-line summary.
