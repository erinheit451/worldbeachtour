# Lens & Surface Architecture — what every legendary beach page must carry

> 2026-06-13. The design analysis behind "all the right intel for all the user
> types." Pairs the 9 editorial lenses (`site/lib/lenses.ts`) with the data we
> actually hold (see the coverage audit in this doc) and the user who needs each.
> Governs which surfaces become main-page bands vs. spoke sub-pages per beach.

## 1. The user types — who lands on a beach page, and their one question

A beach page is read by at least eight distinct people, each arriving with a
different dominant question. The page fails a user when their question isn't
answered above the fold of *their* surface.

| User | Their one question | Dominant surface(s) |
|---|---|---|
| **The surfer** | Is it working — when, how big, what board, what tide? | Waves/surf |
| **The trip planner** | Should I go, when, how do I get there, where do I stay, what's it cost? | Travel-planning · Getting-there |
| **The family / swimmer** | Is it safe to swim — calm? shallow? lifeguard? facilities? | Water & swim-safety · Facilities |
| **The photographer** | Where's the shot, and when's the light? | Photography · A-day-here |
| **The diver / snorkeler** | What's underwater — sites, visibility, marine life? | Diving · Environmental |
| **The naturalist** | What lives here, and is it protected/threatened? | Environmental · Conservation |
| **The culture/history seeker** | What happened here, what's the local life? | Culture · History |
| **The geology/sand nerd** | Why does it look like this — what's the sand? | Sand & geology |
| **(everyone) the pragmatist** | What do I actually need to know before I go? | Things-to-know |

## 2. The intel surfaces — data, coverage, where each lives

Ten content surfaces cover those users. For each: the data we hold, its coverage
(from the DB audit), current build state, and where it belongs on the page.

| # | Surface | Serves | Data we hold | Coverage | State | Placement |
|---|---|---|---|---|---|---|
| 1 | **Weather & climate** | planner, all | air temp/low, rain, **wind, sun** (12-mo) | **~97%** | ✅ built (year-strip, typical) | Main band |
| 2 | **Water & swim safety** | family | tide regime, nearshore depth, swim_suitability, shark history | tide 62–91%, depth 53–95%, shark 100% | ✅ built (safety) | Main band |
| 3 | **Sand & geology** | nerd | sand q/f/l + regime (predicted), color | predicted **~100%**, color sparse | ✅ swatch built; spoke for legendary | Main band + sand spoke |
| 4 | **Environmental / ecology** | naturalist, diver | iNaturalist species, protected area, mangrove/coral flags | species **98% on famous**, protected **32%** | ✅ built (wildlife, conservation) | Main band + eco spoke |
| 5 | **Getting there** | planner | nearest airport (100%), city; transit/ferry (0%) | airport 100%, transit **0%** | ⚠️ partial (airport only) | Main band (plan) |
| 6 | **Travel planning** | planner | best-months, crowds(none), stay/cost(none) | best-months 97%; stay/cost **0%** | ⚠️ thin | Plan spoke |
| 7 | **Local culture & history** | culture | showcase cultural_refs + timeline (authored) | authored per-beach | ✅ built (culture, timeline) | Main band + deep-dive spokes |
| 8 | **Things to know** | everyone | shark, cyclone (13K), blue-flag, lifeguard, rules(editorial) | scattered | ❌ not a unified surface yet | Main band (NEW) |
| 9 | **Waves & surf** | surfer | ocean_wave_height/period/swell | **0%** (marquee hardcoded only) | ❌ data gap | Surf spoke (surf beaches) |
| 10 | **Diving** | diver | reef distance, species; no dive-site data | sparse | ❌ data gap | Diving spoke (dive beaches) |

**The "how it compares" percentile module** (warmer-than-X%, longest-season)
is an 11th, cross-cutting surface — it's the moat and rides on top of #1–#2.

## 3. The architecture — main page is the synthesis, spokes are the depth

The legendary page already supports **spokes** (sub-pages) via `composition.spokes`
(Copa: bossa/favela/réveillon/visiting; Nazaré: spectator's guide). The rule:

- **The main page carries a band for every surface the data supports** — flexed
  off when absent. Every user finds their answer at overview depth.
- **Spokes blow out the 1–3 surfaces this beach is *for*.** A surf beach gets a
  deep **surf** spoke; a wildlife beach a deep **ecology** spoke; a famous one a
  **plan-your-visit** spoke and **history/culture deep-dives**.
- **The hit-list already encodes this** as lens-prominence (1–5). Prominence ≥4
  ⇒ that surface earns a spoke. Prominence ≤2 ⇒ ambient main-page mention only.

So the per-beach composition is a **surface set**: each surface tagged
`primary` (spoke + hero treatment) / `present` (main band) / `absent` (flexed out),
derived from lens-prominence + data coverage.

## 4. The gaps — what's missing from a design + data standpoint

To carry *all* user types well, we need to close these (ranked):

1. **"Things to know" surface (design)** — no unified safety/rules/hazards/etiquette
   band exists. Build a generic module: hazards (rip/shark/cyclone from data) +
   access rules + entry fees + scam/etiquette notes (authored). High value, all data partly in hand.
2. **Getting-there depth (data)** — we have airport only. Add OSM transit/parking +
   authored "how to actually arrive" (boat-only for Navagio, train for Cottesloe).
3. **Waves/surf surface (data)** — 0% wave data kills the surfer for non-marquee
   beaches. Options: a marine-forecast source (Stormglass/Open-Meteo marine API,
   cheap, has wave height/period/swell) → makes the surf surface data-driven site-wide.
   This is the single biggest data unlock for a whole user type.
4. **Travel-planning depth (data/partner)** — no stay/cost. Editorial "where to base
   yourself" + eventual affiliate lodging feed.
5. **Diving surface (data)** — no dive-site data; keep editorial for dive beaches.

## 5. Build implication

Each surface is a **generic, data-gated component** (we already have 6 of them from
the every-beach template + legendary sections). Completing the set — **things-to-know,
getting-there, surf, travel-plan** — means the same composition-driven renderer can
present the full intel matrix for any beach, with spokes for the surfaces a given
beach is famous for. That's the same "build the surface once, compose per beach"
model that just dropped the legendary build cost to ~5 min/beach.

**Net:** the page doesn't need to be redesigned per user type — it needs the full
*surface library* built once, and a per-beach `surface_set` that decides what's a
spoke, what's a band, and what's dark.
