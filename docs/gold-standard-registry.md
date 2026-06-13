# Gold-Standard Registry — the best-possible page for each tier, and the DB to support it

> 2026-06-13. The build target for every tier. For each: the exemplar page(s),
> the best-possible spec across BOTH axes (Editorial = story, Data = live/adaptive
> utility — see `tier-ladder-deep-dive.md`), and the **DB gaps** we must close to
> reach that ceiling. "Since we have AI" — each spec is the maximal version, not
> the safe one.

Numbering note: this supersedes the loose "T0/T1/T3" labels used earlier. One
ladder: **Tier 1 Legendary → Tier 2 Featured → Tier 3 Field Guide → Tier 4 Stub.**

---

## TIER 1 — Legendary  ·  exemplars: **Huntington Beach** + **Waikīkī**

The canonical page on the internet AND the most useful one. Maxes both axes + spokes.

**Best-possible spec:**
- **Editorial axis:** hero (1 of 4 archetypes) · story w/ drop cap · **real spike deep-explainer (≥800w)** · **marginalia** (multi-audience gutter) · timeline w/ **citations** · culture · honest-reckoning w/ pull-quote · **signature visual** · gallery · 5,000–8,500 words total.
- **Data axis (from the pilot):** **adaptive lens shell** (chips reorder sections for surfer/family/photographer/…) · **live conditions** (nearest NDBC buoy + NOAA tide station, read in-browser) · **season-by-season surf** (swell height/period/direction by month) · **tide table** · hazards · **trip-planning + booking** (affiliate slots).
- **Spokes (2–5):** audience guide (`/surf`), deep-dive (`/the-pier`), event, anthology.

**Two exemplars test the fusion from both sides:** Huntington *has* the data/adaptive layer (pilot) → add editorial; Waikīkī *has* editorial (bespoke `waikiki-v2`) → add the data/adaptive layer.

**DB gaps to support Tier 1:**
- **Live-station map** — a table mapping each Tier-1 beach → nearest NDBC buoy + NOAA/national tide station (US/EU have dense coverage; elsewhere sparse → degrade to climatology). *Not in DB.*
- **Tide tables / harmonic constituents** — we have spring/neap range only; a real tide predictor needs station IDs. *Partial.*
- **Bathymetry / break geometry** — pilot uses it for surf; we have `bathymetry` 90k but not break-shaping detail. *Partial.*
- **EAV attribute store** — the pilot's `eav_attributes` (flexible per-beach facts: parking cost, lifeguard towers, contest dates). *Not in main DB — design it.*
- **Affiliate/booking IDs** — per-beach booking.com/Viator/GetYourGuide deep-link params. *Not in DB.*
- **Season-surf** — ✅ now solved (Open-Meteo wave climatology, `enrich_waves.py`).

---

## TIER 2 — Featured  ·  exemplar: **Navagio** (editorial) / the pilot (data)

Strong on ONE axis. The two doors: **2E** a great story w/ thin live data (our 5 pages); **2D** a great instrument w/ thin story (the pilot, minus deep editorial).

**Best-possible spec (2E):** everything Tier 1's editorial axis has EXCEPT the 5–8k length (1,500–4,000 words) and the spokes; signature optional (~30% earn one). This is what the unified content agent already produces.

**Best-possible spec (2D):** the adaptive instrument + live/season data + plan/booking, with a short (not deep) story intro.

**DB gaps:** 2E is essentially data-complete (it's authored). 2D shares the Tier-1 data gaps (live stations, EAV) but at lower stakes.

---

## TIER 3 — Field Guide  ·  exemplar: **a data-rich nobody** (e.g. `playa-de-cuesta-maneli`)

The templated, data-driven page — all surfaces, no authored story. The every-beach
work (`/preview`) is this tier; it just lives in a preview harness today.

**Best-possible spec:** every surface the data supports, flexed: field-guide card · "how it compares" (the moat) · year-here climate (temp/rain/wind/sun) · sea & surf (season swell) · sand swatch · wildlife · safety · conservation · things-to-know · photos · map · neighbors · "what we don't know." Shared `<FieldGuide>` component; per-beach variance entirely in data. ~1,500–2,500 words of data-driven prose.

**DB gaps:**
- **Port the surfaces** built for legendary (sea-surf, things-to-know, getting-there) down into the T0/T1 template — currently legendary-only.
- **Waves at scale** — `enrich_waves.py` runs per-beach on demand; needs a batch run for the indexable cohort.
- **Facilities / transit coverage** — sparse outside famous beaches (OSM/Overpass sweep).
- **Geometry for the coastline diagram** — 100% Point-only; needs the polygon fetch.
- **`beach_length_m`** — 99.98% null; needs a real pipeline (today's quick fix was 5 beaches only).

---

## TIER 4 — Stub  ·  exemplar: an unnamed cove (e.g. `beach-18.4604--64.4327`)

Name/coords + minimal data. Honest field-guide-lite.

**Best-possible spec:** computed title from coords · whatever climate/sand/neighbors exist · map · "what we don't know" + contribute CTA · `noindex` until promoted. The honesty *is* the feature.

**DB gaps:** minimal by design. The only lift is the contribute pipeline (the CTA currently points at a placeholder form).

---

## Cross-cutting DB build list (what unlocks the ceiling)

Ranked by how many tiers it serves:

1. **Live-station map + tide-station IDs** (Tier 1, 2D) — the single thing that makes pages *live*.
2. **EAV attribute store** (Tier 1, 2D) — flexible per-beach facts the rigid schema can't hold.
3. **Batch wave enrichment** (Tier 1–3) — extend `enrich_waves.py` to the indexable cohort.
4. **OSM/Overpass facilities + transit sweep** (Tier 1–3) — fills getting-there + facilities.
5. **`beach_length_m` pipeline** (all tiers, quick-facts) — currently a bad seed.
6. **Polygon geometry fetch** (Tier 3 coastline diagram) — Point-only today.
7. **Affiliate/booking ID table** (Tier 1, 2D) — revenue.

## Build order

1. **Tier 1 fusion ×2** (Huntington + Waikīkī) — defines the ceiling, de-risks merging the editorial + adaptive renderers, and surfaces the real DB gaps by building against them.
2. **Designate Tier 2E (Navagio) + Tier 4 (a stub)** — already built; tighten to spec.
3. **Tier 3 gold** — port the surfaces into the every-beach template, pick the exemplar.
4. **Then scale** — assign each beach the tier its data earns; produce at that tier.
