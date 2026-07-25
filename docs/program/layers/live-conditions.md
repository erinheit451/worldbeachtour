# Layer: Live conditions
**Status:** idea
**Scores:** Uniqueness L · Leverage L · Cost M · Authority L · Revenue M

## What it is
Real-time conditions: surf/wind forecast, bathing-water alerts, webcams, a "right
now" score. Pure passthrough anyone can build — valuable ONLY as a bundle on top of
deep static truth + traffic. Build last.

## What it yields (products)
Live forecast widgets, water-quality alerts, webcam embeds, a composite "good beach
day right now" score. Mostly a rendering/UX layer, not new DB columns.

## Sources
Open-Meteo Marine, surf forecast APIs, EU bathing alerts, webcam directory (shared
with [social-signal](social-signal.md)).

## Depends on
Traffic + the static layers to overlay on. Explicitly sequenced last.

## Effort
Medium, but low priority — no authority yield alone.

## Open questions
- Which forecast provider; caching/refresh cadence and cost at 228K scale (likely
  fetch-on-view for visited beaches only, not precompute).
