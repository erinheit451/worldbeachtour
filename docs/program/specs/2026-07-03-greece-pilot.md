# Spec: The Greece Pilot — data-then-pages on one slice

**Status:** ready to build · **Created:** 2026-07-03 · **Parent:** [ROADMAP](../ROADMAP.md) items 1–3, 5
**Decision context:** [DECISIONS](../DECISIONS.md) — data-authority-first, quality gates, hazard framing.

## Why a pilot (not straight to 228K)

The settled strategy is data-leads-pages, but proving the whole chain on one country
first de-risks three unknowns at once — do the compute pipelines run clean, does the
Tier-3 template render dense/defensible pages, does Google reward them — before betting
the domain on an unproven rollout. This spec is grounded in spikes run 2026-07-03
against `output/world_beaches.db`, not assumptions.

## Pilot country: Greece (GR)

Chosen on evidence over Italy/Spain/Croatia/Portugal:

| Signal | Greece | Why it matters |
|---|---|---|
| Beaches | 5,660 | Real batch — big enough to test rollout mechanics, small enough to iterate |
| slope_pct coverage | 97% | Grain-size inference works almost everywhere |
| tide coverage | 100% | Tide-state attributes complete |
| sand regime | 100% | Mineral-family base present |
| notability | 17% | **The gap is the point** — long-tail Greek-island beaches where Wikipedia is thin and programmatic pages win high-intent search |
| Jurisdiction | EU | Free **EU Bathing Water Directive** water-quality data plugs straight in (global water quality is only 9%) |
| Marine cells | 849 | Waves + SST feasible: minutes on a self-hosted Open-Meteo instance |

Alternates if Greece stalls: Portugal (surf brand, smaller), Croatia (higher protected-area coverage).

## Spike findings that shape the plan

1. **Page density is already high.** Median **16 of 18** curated attributes populated
   per Greece beach; **98%** clear a 12-attribute gate; **0** fall below 8. → The
   thin-page risk barely applies here. Publish the template on the existing base and
   layer new attributes in as they land — do NOT block publishing on the compute runs.
2. **Grain-size tendency is real but a proxy.** `slope_pct` is **nearshore shelf
   slope** (depth drop over 500–2000 m), not textbook beach-face foreshore slope. It
   discriminates (drop-off-flagged beaches median 20.8% vs 3.8% overall) but yields a
   reflective↔dissipative *tendency*, not a calibrated grain class. Ship it as
   "coarse/medium/fine tendency" with a confidence flag; calibrate against usSEABED +
   EMODnet before claiming a hard grain size. Clean noise first (some negative slopes).
3. **Sunset is only a coarse proxy today.** `geometry_derived.sunset_visible` is a
   ±22.5° N–S-axis heuristic and needs polygons even for that. The real
   sun-azimuth-by-month "sunset over water" attribute needs the geometry keystone
   first. → Sunset is a *fast-follow*, not a week-1 pilot attribute.
4. **Waves & water temp need a self-hosted fetch.** `marine_waves.py` is fixed and
   resumable but the free Open-Meteo tier ≈ 38 cells/day (~22 days for Greece's 849
   cells). SST (`ocean_water_temp`) was silently broken the same way and is ~empty.
   → Stand up a self-hosted Open-Meteo (Hetzner) or accept the 3-week free-tier fetch.

## Pilot attribute set (what a Greece Tier-3 page carries)

**Tier A — already populated, publish immediately (the dense base):**
climate (temp/rain/sun/UV), best months, swim suitability, tide range + type,
nearshore slope + drop-off, sand regime, nearest city/airport, shark history,
protected-area status, notability.

**Tier B — runnable now, add in weeks 1–2 (net-new moat attributes):**
- **Grain-size tendency** (from slope + tide; the "nobody publishes this" attribute) — with confidence flag.
- **EU Bathing Water quality** (official classification join for Greek sites).

**Tier C — fast-follow as infra lands (weeks 2–5):**
- **Wave/surf climate + water temperature** (self-hosted Open-Meteo run over 849 cells).
- **Orientation + sunset-over-water** (after the geometry keystone; upgrade the coarse proxy to real sun-azimuth-by-month).
- **Sand color / mineral family** (Sentinel-2, if the satellite pipeline is ready; else defer to sand-library phase).

## Build sequence

| Step | Work | Gate to next |
|---|---|---|
| 0 | Snapshot Greece slice; stand up self-hosted Open-Meteo on Hetzner | instance answers a test marine call |
| 1 | **Grain-size tendency** pipeline on GR (clean negative slopes, quartile/threshold bins, confidence) + spot-verify 15 known beaches | distribution sane, no absurd classes |
| 2 | **EU Bathing Water** join for GR | coverage measured, provenance tagged |
| 3 | **Tier-3 template**: render page from DB (attributes + confidence + JSON-LD + honest "what we know / don't"); build 20 sample pages | pages read dense, not templated-thin |
| 4 | Publish GR batch behind the completeness gate; sitemap + IndexNow wave | indexed; no manual-action flags |
| 5 | **Geometry keystone** (polygon fetch) for GR subset → real orientation/sunset; **self-hosted wave/SST run** over 849 cells; backfill pages | attributes land; pages auto-enrich |
| 6 | **Measure** in Search Console 2–4 weeks: impressions, avg position, indexed ratio, any thin-content flags | decision: scale to next country or fix |

Geometry keystone is pulled *into* the pilot at step 5 (GR subset only, not the full
planet run) so the pilot proves the polygon→attribute chain cheaply before the 228K job.

## Success criteria (the go/no-go for scaling)

- ≥ 95% of GR beaches publishable above the completeness gate (spike says 98% — should hold).
- Grain-size tendency + bathing-water + (by step 5) waves/SST/orientation all populated for GR with `*_source` + confidence.
- Tier-3 pages indexed with **zero** thin-content / manual-action flags after a full measurement window.
- Measurable impression growth on long-tail Greek-beach queries vs. the pre-pilot baseline.

Meeting these → replicate the sequence country-by-country (Italy, Spain next by
coverage). Failing the SEO gate → the template/data density needs work before any
scale-up, and we've learned it on 5,660 pages instead of 228,000.

## Guardrails (from DECISIONS)

- Every new attribute writes `*_source` + a confidence level. No silent nulls-as-zeros.
- Hazards (drop-off, sharks, future rip) framed as "conditions to know," never certification.
- Grain-size labeled "estimated tendency (pending sediment-sample calibration)" until usSEABED/EMODnet calibration lands.
- Publish only above the completeness gate; hold thin rows noindex.
- Work in an isolated worktree; the gold editorial loop keeps running untouched.

## Open questions for Erin

- Stand up self-hosted Open-Meteo on Hetzner (unlocks waves/SST for the whole program, not just GR), or take the free-tier fetch for the pilot?
- Confirm Greece as the pilot, or prefer Portugal (surf brand) / Croatia (protected-area rich)?
