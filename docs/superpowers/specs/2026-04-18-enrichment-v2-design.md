# World Beach Database — Enrichment v2 Design

**Date:** 2026-04-18
**Status:** Draft, pending user review
**Supersedes/extends:** `docs/enrichment-plan.md` (original plan), `docs/superpowers/specs/2026-03-23-beach-data-enrichment-design.md`
**Sibling (deferred):** `docs/future-scope-social-photo-mining.md`

## Context

Goal: the world's most complete beach database. Current DB has 227,779 beaches; structural enrichment is sparse (admin_level_2: 1 beach; beach_length: 32; orientation/elevation/tides/waves/protected_area/best_months: 0; substrate: 19%; Wikipedia pageviews: 0.5%). Climate pipeline is quota-blocked on Open-Meteo. Top ~100 beaches have hand-generated guides; ~500 candidates are queued.

Customer is not fully decided; the design hedges by producing both **breadth** (structural columns across 228K) and **depth** (rich, sourced facts on the top ~500 by notability). Either path — traveler site, agentic MCP, licensable dataset — is served by the same underlying DB.

Constraint: prefer free data sources; batch paid spend only after free coverage is measured.

## Architecture

Two independent enrichment tracks write to the same SQLite DB. Four consumer surfaces read it.

```
                  ┌─────────────────────────────────────────┐
                  │  SQLite: output/world_beaches.db        │
                  │  beaches, beach_attributes (EAV),       │
                  │  admin_regions (new), beach_hazards     │
                  │  (new), beach_webcams (new),            │
                  │  beach_photos, beach_sources            │
                  └─────────────────────────────────────────┘
                    ▲                                     ▲
   ┌────────────────┴─────────────┐       ┌───────────────┴─────────────┐
   │ Track 1: bulk spatial joins  │       │ Track 2: LLM extraction      │
   │ (local compute, all 228K)    │       │ (top ~500 notable beaches)   │
   └──────────────────────────────┘       └──────────────────────────────┘

    Consumer surfaces:
      - Next.js static site (existing)
      - MCP server `world-beaches` (new)
      - Polaris pointer at mirrored Postgres (new, reuses existing project)
      - Public dataset: HuggingFace + Zenodo DOI (new, quarterly)
```

Every enriched field carries provenance: either a sibling `*_source` column or a row in `beach_sources` keyed by `(beach_id, field_name, source_type, source_url, fetched_at)`. No orphan data.

## Track 1 — bulk spatial pipelines (228K beaches, $0)

Run serial unless otherwise noted. Each step writes coverage delta to `enrichment_log` and fails loudly on silent errors.

| # | Pipeline | Source | Download | Fills | Runtime |
|---|---|---|---|---|---|
| 1 | GADM admin join | gadm.org L2+L3 GeoPackage | 1.5 GB | `admin_level_2/3` → 100%; creates `admin_regions` | ~1 hr |
| 2 | Geometry-derived | existing `geometry_geojson` | 0 | `beach_length_m`, `orientation_deg`, `orientation_label`, `sunset_visible` | ~30 min |
| 3 | WDPA protected areas | protectedplanet.net shp | 1 GB | `protected_area_name/type/iucn`, `unesco_site` | ~1 hr |
| 4 | FES2022 tides | AVISO+ (free research account) + pyfes | 2 GB | `tide_range_spring_m`, `tide_range_neap_m`, `tide_type` | ~6 hr |
| 5 | GEBCO bathymetry | gebco.net 2024 global grid | 7 GB | `nearshore_depth_m`, `slope_pct`, `drop_off_flag` | ~4 hr |
| 6 | OSM planet enrichment | Geofabrik regional PBFs | ~50 GB (or per-continent) | `parking_capacity`, `parking_fee_usd`, `ferry_terminal_id/distance_km`, `transit_stops_500m_count`, OSM `wheelchair`/`surface` upgrades | 1–2 days |
| 7 | ERA5 climate bulk | Copernicus CDS (free) NetCDF | ~50 GB | `climate_*` monthly normals (12-month JSON). **Replaces Open-Meteo quota path.** | ~2 days |
| 8 | Copernicus Marine SST | marine.copernicus.eu | ~10 GB | `ocean_water_temp` (12-month JSON) | ~4 hr |

**Deferred to Track 1b** (only if free source is insufficient): wave height/period (Open-Meteo Marine or ERA5 wave reanalysis), time-series water quality (EU bathing + EPA BEACON + Surfrider — per-country stitching).

**Key technical bet.** Swap per-beach Open-Meteo fetches for Copernicus ERA5 bulk NetCDF. Free, no daily quota, monthly normals extracted locally via xarray. The Open-Meteo commercial tier ($29/mo) becomes the fallback only if ERA5 monthly granularity is too coarse for coastal micro-climates or setup burns more than three days.

## Track 2 — LLM extraction on top ~500 beaches ($0, Haiku subagents)

**Selection.** Order by `notability_score DESC`, take top 500 (overrideable). Re-runnable as more beaches resolve Wikidata/Wikipedia links.

**Per-beach pipeline** (parallel, ~10 subagents at a time — matches existing content-gen pattern in `project_worldbeachtour.md`):

1. Export beach context JSON via SQL join (`beaches + beach_sources + beach_species`).
2. Fetch raw text from Wikipedia (all language editions via API), Wikivoyage, Wikidata entity dump, OSM feature dump for the beach polygon + 500 m buffer.
3. Spawn Haiku subagent with extraction JSON schema. Prompt requires a `source_quote` field per extracted fact; empty quote → fact rejected.
4. Validate output against schema; write to `beach_attributes` EAV.
5. Sampled human review: 20 random rows per run before batch commit.

**Extraction schema (namespaces in `beach_attributes`):**

| namespace | example keys |
|---|---|
| `culture` | `film_appearance` (title/year/scene), `literary_reference`, `depicted_by_artist`, `local_name` |
| `history` | `heritage_status`, `era`, `shipwreck`, `battle_site`, `founded_year` |
| `access` | `parking_cost_usd`, `parking_capacity`, `ferry_route`, `transit_routes[]`, `seasonal_closure`, `entry_fee` |
| `hazards_reputed` | `rip_current_reputation`, `stinger_season`, `pollution_event`, `dangerous_surf_note` |
| `sensory` | `sand_color_described`, `water_clarity_note`, `crowd_pattern`, `scent_note` |
| `certifications` | `blue_flag_years[]`, `bathing_water_grade`, `iucn_category_confirmed` |

Each row: `(beach_id, namespace, key, value_json, source_url, source_quote, confidence, extracted_at)`.

**Region-scoped attributes go to `admin_regions`, not per-beach:**
- `cuisine.typical_dishes`, `cuisine.fishing_tradition`
- `festivals[]` (name, month, description)
- `transit_system_overview`

Beaches inherit these via `admin_level_2/3` join.

**Anti-hallucination rules** (carry the existing content-gen rules forward):
- No invented businesses. Schema forbids business names unless quoted from a source.
- No dates, pageview numbers, or quantities without a source quote.
- Rejected facts are logged, not silently dropped, so quality patterns are visible.

**Expected output.** ~500 beaches × ~20–40 EAV rows each = ~15K new structured facts + ~200 `admin_regions` records. Roughly 60–90 min of subagent wall time.

## Schema changes

**New tables:**

```sql
admin_regions (
  id                  TEXT PRIMARY KEY,
  country_code        TEXT,
  admin_l1            TEXT,
  admin_l2            TEXT,
  admin_l3            TEXT,
  cuisine_json        JSON,
  festivals_json      JSON,
  transit_system_note TEXT,
  source_url          TEXT,
  extracted_at        TEXT
);

beach_hazards (
  beach_id     TEXT,
  hazard_type  TEXT,   -- rip_current | stinger | pollution | storm_damage
  severity     TEXT,
  observed_date TEXT,
  source       TEXT,   -- NOAA_RCF | SLSA | JELLYWATCH | EMODnet
  source_url   TEXT,
  expires_at   TEXT
);

beach_webcams (
  beach_id       TEXT,
  url            TEXT,
  network        TEXT,   -- skyline | earthcam | surfline | other
  license        TEXT,
  last_verified  TEXT
);
```

**`beach_attributes` extension** (confirm current columns during migration; add if missing):
`namespace`, `source_url`, `source_quote`, `confidence`, `extracted_at`.

**New columns on `beaches`:**
`parking_capacity`, `parking_fee_usd`, `ferry_terminal_id`, `ferry_terminal_distance_km`, `transit_stops_500m_count`, `slope_pct`, `drop_off_flag`, `bathing_water_grade`, `blue_flag_latest_year`.

## Targeted one-off jobs

Small scripts, not bulk pipelines, not LLM. Slot in anywhere.

| Job | Source | Fills | Cost |
|---|---|---|---|
| Wikipedia pageviews expansion | Wikidata→WP resolve for existing 16.7K `wikidata_id` rows, then pageviews REST API | `wikipedia_url` → 16.7K, `wikipedia_page_views_annual` → 16.7K | free |
| Wikimedia Commons seasonal photos | geosearch API, filter by EXIF capture month | `beach_photos` rows tagged with `season` | free |
| Flickr CC geosearch | api.flickr.com photos.search, CC licenses only | `beach_photos` up to ~50K | free (API key) |
| Webcam aggregation | Skyline Webcams + EarthCam + Surfline directory crawl | `beach_webcams` | free |
| Blue Flag structured ingest | blueflag.global annual lists | `blue_flag_latest_year` + EAV history | free |
| EU bathing water quality | EEA Bathing Water Directive bulk download | `bathing_water_grade` + EAV time-series | free |
| US water quality | EPA BEACON + Surfrider Blue Water Task Force | EAV time-series | free |

The **Wikipedia pageviews expansion is the single fastest free win** — Wikidata IDs already exist, it is a batch REST fetch, and it 15×s pageview coverage with no new dataset.

## Consumer surfaces

Four surfaces on the same DB. Each is independently valuable; together they compound.

**1. Next.js site (existing, richer).** Adds hazards panel, webcam embed, seasonal photo carousel, swim-safety composite score, best-months badge, cultural strip (film/TV + history), regional context block (cuisine + festivals).

**2. MCP server `world-beaches` (new).** Registered in `~/.claude/mcp.json`, matches supplements MCP pattern. Tools:
- `search_beaches(filters, bbox, limit)`
- `beach_detail(id_or_slug)`
- `rank_beaches(criteria)` — NL criteria → scored results
- `nearby_beaches(lat, lng, radius_km)`
- `beaches_by_trait(trait, value)` — EAV lookup

**3. Polaris integration.** Mirror SQLite → Postgres, point existing Polaris project at it. "Chat with every beach on Earth" with no new code.

**4. Public dataset release.** Export to parquet via DuckDB, publish on Hugging Face (agent/model visibility) and Zenodo (DOI, citable credibility). Quarterly refresh cadence. Free tier of the DB is a feature — the fresh + API-usable version is the later commercial surface.

**Shared ranking logic.** Implemented once, reused across site filters, MCP `rank_beaches`, and Polaris prompts:

```
score = f(
  swim_suitability,      # slope + waves + hazards
  climate_match(month),  # best_months alignment
  crowd_tolerance,       # photo_count / notability proxy
  access_match(car|transit|ferry|walk),
  trait_filters          # family|surf|nudist|dog|accessible
)
```

Weights tunable per surface.

## Verification (non-negotiable)

Addresses the project's silent-failure and guess-vs-query anti-patterns. Every pipeline must:

1. **Pre-flight coverage SQL** — count current non-null rows, log the baseline.
2. **Raise on HTTP 429 / 5xx / auth errors** — never `except Exception: return None`.
3. **Post-flight coverage SQL** — count after, assert delta ≥ expected threshold, fail loudly otherwise.
4. **Write to `enrichment_log`** — `(pipeline_name, rows_written, started_at, finished_at, success, error_trace)`.
5. **Smoke-test fixtures** — known-answer beaches (Alki, Catedrais, Navagio, Oppenheimer) with expected values. Pipeline fails if smoke beaches produce wrong output.
6. **Sample validation** — 10 random rows printed at end of run for eyeball check before commit.

"Done" means the coverage delta matches the projection *and* smoke tests pass. Not "the process exited zero."

## Paid data gates

Spend only after a trigger fires. No paid source enters the pipeline until a free-source coverage report proves the gap.

| Trigger (measured after free pass) | Spend | What it buys |
|---|---|---|
| ERA5 bulk climate too coarse for coastal micro-climates, OR setup burns >3 days | $29 × 1 month Open-Meteo commercial | 10K → 5M req/day, finish climate in a week |
| Google Places photos become the blocker for top-500 visual quality | $20 Places API test | measure before committing more |
| Beach-width time-series becomes the next moat story | $100+/mo Planet / Sentinel Hub | defer, separate scope |

## Milestones

Rough sequencing. Writing-plans will produce the step-by-step implementation plan.

| M | Week | Deliverable |
|---|---|---|
| A | 1–2 | Schema migrations + Track 1 steps 1–5 (GADM, geometry, WDPA, FES2022, GEBCO) + Wikipedia pageviews expansion |
| B | 3–4 | Track 1 steps 6–8 (OSM planet, ERA5 climate, Marine SST) + Blue Flag + EEA bathing + `beach_hazards` feed |
| C | 5 | Track 2 LLM extraction on top 500 + `admin_regions` populated |
| D | 6 | MCP server + Polaris pointer + first HuggingFace + Zenodo release |
| Gate | end of D | Review free-source coverage. Decide: Open-Meteo spend? Other paid sources? |

Each milestone ends with a coverage report showing before/after numbers per field.

## Explicitly out of scope

- **Social photo / UGC mining** (Instagram, TikTok, X, Reddit, Pinterest, YouTube, Google Places, Tripadvisor). Separate scope parked at `docs/future-scope-social-photo-mining.md`.
- **ML substrate prediction from Sentinel-2** — defer to a later moat-widening phase.
- **LLM-generated descriptions for all 228K beaches** — Track 2 only extracts structured facts; long-form generation remains the Haiku content-gen workflow for selected beaches.
- **Search infrastructure for the site** — the MCP and Polaris surfaces handle agentic query; client-side search over 228K is a separate design.
