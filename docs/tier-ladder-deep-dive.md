# The Tier Ladder — what "legendary" actually means, and the gold standard for each rung

> 2026-06-13. Reconciles three parallel workstreams — the editorial "legendary"
> pages (Navagio/Boulders/Whitehaven/Varkala/Patong), the **Huntington adaptive
> pilot** (lens-reorder + live NDBC/NOAA feeds + season-by-season surf + booking),
> and the April `tier-system.md` spec. Conclusion: what we've been calling
> "legendary" is **Tier 2**. True Tier 1 is a level up, and it needs BOTH things
> we've been building separately, plus a layer neither has yet (spokes).

## 1. The core insight: there are TWO axes, not one tier number

We've been arguing about "tiers" as a single scale. There are actually two
independent axes, and a beach earns a position on each:

- **Axis E — Editorial depth** (how *storied*): the authored layer — spike,
  marginalia, culture, timeline, honest-reckoning, signature visual. Driven by
  how much *story* a beach has (fame, history, culture, a singular fact).
  → **This is what the Navagio/Boulders/etc. pages max.**
- **Axis D — Data/utility depth** (how *useful, live, adaptive*): season-by-season
  surf, live buoy + tide feeds, the lens-reorder (the page rearranges for who you
  are), tide tables, hazards, trip-planning + booking. Driven by how much
  *structured + live data* a beach has.
  → **This is what the Huntington pilot maxes.**

**Neither page is Tier 1.** Navagio is a beautiful *story* with a static body and
no live utility. Huntington is a brilliant *instrument* with thin story. The
canonical page on the internet about a famous, data-rich beach is **both at once**
— and we have never built one.

```
            Axis D (data / live / adaptive utility) →
        low                                   high
  high  ┌─────────────────────┬─────────────────────┐
  Axis  │  TIER 2 (editorial) │   TIER 1 LEGENDARY   │
   E    │  Navagio, Boulders, │  story × instrument  │
 (story)│  Whitehaven, Varkala│   + spokes  ← BUILD  │
        │  Patong             │   (none exist yet)   │
        ├─────────────────────┼─────────────────────┤
  low   │  TIER 3 Field Guide │  TIER 2 (data)       │
        │  every-beach tmpl   │  Huntington pilot    │
        └─────────────────────┴─────────────────────┘
```

## 2. The reconciled ladder (data richness → depth)

Tier is gated by **how much data/story a beach actually has** — the principle you
named: the more there is, the deeper the page should go.

| Tier | Name | Gate (what the beach has) | Page = | Count |
|---|---|---|---|---|
| **1** | **Legendary / Monument** | a spike **and** rich live/structured data (buoy, tides, season surf) **and** enough story for spokes | Axis E maxed × Axis D maxed **+ 2–5 spokes** + adaptive shell + live feeds | ~30–50 |
| **2E** | **Featured — editorial** | a strong story but thin live data | the authored page (what we built): spike, marginalia, culture, reckoning | ~500–1,000 |
| **2D** | **Featured — instrument** | rich data (surf/tides/live) but thin story | the adaptive utility page (the pilot, minus the deep story) | ~500–1,000 |
| **3** | **Field Guide** | name + climate + the standard data surfaces | the every-beach template — all surfaces, data-driven, no authored story | ~10–30k |
| **4** | **Stub** | name + minimal data | honest field-guide-lite | the long tail |

The two Tier-2 halves (2E and 2D) are the same rung from different doors. A beach
that has *both* a story and the data climbs to Tier 1.

## 3. What Tier 1 adds over what we built (the three missing pieces)

Our pages (Tier 2E) → Tier 1 needs:

1. **The adaptive shell (from the pilot).** Lens chips at the top; picking "Surf"
   / "Family" / "Photographer" floats that audience's sections up. On a Tier-1
   page the editorial sections *and* the data sections both participate. This is
   the single biggest "this page is alive" upgrade.
2. **Live data where it exists (from the pilot).** A `LiveConditions` block that
   reads the nearest NDBC buoy + NOAA tide station in the browser; season-by-
   season swell ("W swell in winter, SW in summer"); a real tide table. Only ~the
   coastal-US/EU beaches near a station get true *live* feeds — but season-by-
   season surf is now site-wide (we just built the Open-Meteo wave climatology).
3. **Spokes — the "one level down" page (from `tier-system.md`).** 2–5 subpages.
   This is the depth a single scroll can't hold.

## 4. What a "one level down" page (spoke) looks like

A spoke is **one lens or one topic taken all the way to its own page.** Crucially:
the main page's *lens-emphasis* and a *spoke* are the same idea at two scales —
on the main page a lens reorders sections; one level down, a lens becomes a whole
page. Four spoke archetypes:

- **Audience guide** — e.g. `/beaches/huntington/surf`: the full surf lens — month-
  by-month swell windows, the break(s), tide-for-surf, live buoy, crowd/parking
  timing, board call. (This is the pilot's "Surf" lens, blown out to a page.)
- **Deep-dive** — one topic: Navagio's wreck (the Saint Bedan's two lives); Copa's
  Calçadão mosaic. The signature visual lives here at full size.
- **Event** — Nazaré's big-wave season / the Eddie at Waimea; dated, seasonal.
- **Anthology** — a captioned photo-essay, or the cultural-refs expanded into a
  reading/watching list.

A spoke's spine: focused hero → the one thing, in depth → the data that serves
*that* audience (surf spoke = swell tables + buoy; history spoke = timeline +
citations) → back-link to the parent. ~800–1,500 words each.

## 5. Gold standards — we have none complete. Here's the set to build.

Each tier needs ONE exemplar that pushes the AI ceiling, so every other page has a
target. Current state and the build:

| Tier | Closest today | Gap to gold | Gold-standard build |
|---|---|---|---|
| **1 Legendary** | *nothing* (Nazaré = story only; Huntington = utility only) | the fusion + spokes | **Fuse one beach end-to-end**: editorial body + adaptive lens shell + live feeds + season surf + 2–3 spokes. Best candidate: a famous, data-rich, buoy-near beach (Bondi, Waikīkī, or Huntington itself). |
| **2E Featured (story)** | Navagio (with signature) | already close | Designate **Navagio** as the 2E gold; tighten to spec. |
| **2D Featured (data)** | Huntington pilot | thin story | Add a real story spine to the pilot → 2D gold. |
| **3 Field Guide** | the every-beach template (`/preview`) | needs the surface ports + a chosen exemplar | Designate the best-rendered sample (e.g. a data-rich nobody) as 3 gold. |
| **4 Stub** | the unnamed-stub render | fine | Designate a clean unnamed stub. |

## 6. Pushing the edge with AI (what's newly possible per tier)

- **Tier 1:** auto-generated **spokes** (a subagent per dominant lens); **live-data
  narration** ("the buoy reads 1.2 m at 14 s — clean and overhead right now");
  per-beach **signature visuals**; adaptive prose that changes emphasis by lens.
- **Tier 2:** the unified content agent we locked (~75–97k tokens/beach) — already
  at the edge for editorial; add the season-surf + adaptive shell to reach 2D.
- **Tier 3:** data-driven prose + the full surface library at 228k scale — the
  thing no human team could write by hand.

## 7. Recommended sequence (before any mass scaling)

1. **Build the Tier-1 gold standard** — fuse one beach (editorial × adaptive ×
   live × spokes). This defines the ceiling and de-risks the fusion of the two
   renderers (my `legendary-v2` + the pilot's adaptive shell).
2. **Lock the Tier-2E and Tier-3 golds** (we're close on both).
3. **Then scale** — but scale *to the right tier per beach*: a data-rich famous
   beach gets the Tier-1 pipeline; a storied-but-data-thin one gets 2E; the long
   tail gets Tier 3. Tier is assigned by what data the beach actually has.

The headline: **don't scale Tier 2 and call it legendary.** Build the Tier-1
fusion first so "legendary" means the best page on the internet — story *and*
instrument *and* depth — then scale each beach to the tier its data earns.
