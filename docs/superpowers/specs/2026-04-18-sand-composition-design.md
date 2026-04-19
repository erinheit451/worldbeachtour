# Sand Composition Feature — Design Spec

**Date:** 2026-04-18
**Status:** Approved design, awaiting implementation plan
**Scope:** Add sand composition data to all 227,779 beaches and surface it through integrated page sections, dedicated sand pages, and a category hub.

---

## Goals

1. Every beach in the DB has at minimum a **predicted sand composition** (quartz / feldspar / lithic fractions + a human-readable regime label).
2. Beaches with a Wikipedia page get a **scraped sand description + color** where the infobox carries it.
3. Beaches near open-data sediment samples (US + Europe) get **measured composition** with provenance.
4. A curated seed of ~50–100 iconic sand beaches drives the **`/sand` hub** and deep-dive narrative content.
5. Site exposes sand data via (a) an integrated "Sand & Geology" section on every beach page, (b) a dedicated `/sand/[slug]` route per beach, (c) a `/sand` category hub.

## Non-goals

- No attempt at a global close-up sand photo corpus (no free source exists; we treat photo collection as a future crowdsourcing project, not this spec).
- No paid APIs or licensed imagery.
- No attempt to fix the existing 184K `substrate_type: unknown` beaches beyond what Wikipedia scraping happens to fill — OSM re-enrichment is out of scope.
- No changes to climate, species, OSM facilities, or other unrelated pipelines.

---

## Tier 1 — Global predicted composition (all 227K beaches)

**Source:** GloPrSM (Global Prediction of Sand Modal Composition), Zenodo record 6471406 — machine-learning model predicting Q/F/L fractions globally from bedrock, topography, climate.

**Caveat to disclose on every rendered output:** GloPrSM is calibrated on modern fluvial (river) sand, not beach sand. Beach sand in the same watershed is a reasonable proxy but not identical. Copy must say *"predicted regional composition"*, not *"this beach's measured sand"*.

**Module:** `src/enrich/sand_predicted.py`
- One-time download of GloPrSM Q/F/L rasters from Zenodo into `data/sand/glopsrm/`.
- For each beach: sample the three rasters at `centroid_lat`, `centroid_lng`. Store percentages rounded to 1 decimal.
- Derive `sand_regime_label` from the Q/F/L tuple via the following priority-ordered rules (first match wins):
  1. Lithic ≥ 40% → `"lithic-rich (volcanic/collisional terrane)"`
  2. Quartz ≥ 75% → `"quartz-dominant"`
  3. Feldspar ≥ 35% → `"feldspar-rich (plutonic/crystalline terrane)"`
  4. Else → `"mixed Q-F-L"`
- Beaches whose centroid samples a NULL/ocean pixel (GloPrSM is fluvial-derived and may not cover pure ocean cells): fall back to the nearest non-null pixel within 50 km; if still none, leave all Q/F/L fields NULL and set `sand_regime_label = "unknown"`.
- Runtime: benchmark on the first 1,000 beaches, extrapolate, report before committing to the full run (do not guess).

**New columns on `beaches` table:**
- `sand_q_pct` REAL
- `sand_f_pct` REAL
- `sand_l_pct` REAL
- `sand_regime_label` TEXT
- `sand_predicted_source` TEXT (e.g. `"GloPrSM v1"`)

## Tier 1.5 — Wikipedia infobox scrape (~17K beaches with Wikipedia URLs)

Wikipedia beach infoboxes frequently carry a "Type" or "Sand" field ("black sand", "pink coral", "pebble"). Cheap, high-signal source for the 17K beaches already linked to Wikidata.

**Module:** `src/enrich/sand_wikipedia.py`
- For each beach with `wikipedia_url IS NOT NULL`, fetch the article, parse the infobox and the first paragraph.
- Extract: sand color keywords (black, white, pink, golden, red, green, orange, grey, mixed), substrate keywords (sand, pebble, gravel, shell, coral, volcanic, glass), and any explicit "sand type" field.
- Write: `sand_color` (overwrites existing column where empty; preserve existing non-null values), and a new free-text field `sand_description` (1–3 sentence extract).
- Rate limit: Wikimedia API polite pacing (≤50 req/s), expected runtime ~10 minutes.

**New column on `beaches`:**
- `sand_description` TEXT (Wikipedia-sourced blurb; nullable)

Note: `sand_color` column already exists. Existing non-null values (11 rows) are preserved.

## Tier 2 — Measured composition spatial join (regional)

**Scope for this spec: narrow.** Two sources only — USGS east-coast sediment CSVs and EMODnet Geology seabed substrates (Europe). Expanding to AUS/JP/NZ/CL is explicitly out of scope for this spec and deferred to a follow-up.

**Module:** `src/enrich/sand_measured.py`
- Download USGS sediment sample CSVs starting from the Coastal & Marine Geosciences Data System catalog (`https://cmgds.marine.usgs.gov/`) — target at minimum the USGS east-coast sediment analysis publication and the DUNEX Pea Island grain-size dataset. Exact publication list to be frozen as a `sources.yaml` manifest inside `data/sand/usgs/` on first download so runs are reproducible.
- Download EMODnet seabed substrate shapefile (Folk classification polygons) into `data/sand/emodnet/`.
- For each sample/polygon, find beaches within 5 km of the sample/polygon centroid using SQLite R*Tree index on `beaches.centroid_lat/lng` (or a straightforward haversine pass if R*Tree not already in place — check before adding).
- Write one row per matched (beach, sample) pair into the new `beach_sand_samples` table.
- Set `beaches.sand_measured_available = 1` for any beach with ≥1 matched sample.

**New table `beach_sand_samples`:**
| column | type | notes |
|---|---|---|
| id | INTEGER PRIMARY KEY | |
| beach_id | INTEGER | FK → beaches.id |
| source | TEXT | `"USGS"`, `"EMODnet"` |
| sample_lat | REAL | |
| sample_lng | REAL | |
| distance_m | INTEGER | from beach centroid |
| grain_size_mean_mm | REAL | nullable |
| folk_class | TEXT | nullable — e.g. `"Sand"`, `"Muddy Sand"` |
| q_pct | REAL | nullable |
| f_pct | REAL | nullable |
| l_pct | REAL | nullable |
| citation_url | TEXT | link back to dataset record |
| created_at | TEXT | ISO timestamp |

**New column on `beaches`:**
- `sand_measured_available` INTEGER (0/1 flag)

## Tier 3 — Curated showcase seeds (~50–100 iconic beaches)

**Seed file:** `data/sand_curated.yaml` — hand-written entries for beaches where sand is the story. Examples:
- Papakōlea (green olivine, Hawaii)
- Punaluʻu (black basalt, Hawaii)
- Pink Sands Beach (pink foraminifera, Bahamas)
- Glass Beach (tumbled glass, California)
- Hyams Beach (whitest quartz, Australia)
- Vík í Mýrdal / Reynisfjara (black basalt, Iceland)
- Playa del Amor / Hidden Beach (Marieta, Mexico)
- Shell Beach (pure shell, Western Australia)
- Red Sand Beach (Kaihalulu, Maui)
- Porto Ferro (orange, Sardinia)

Each entry has: `slug`, `sand_story` (2–4 sentences, expert voice), `sand_story_citations` (Wikipedia / USGS / peer-reviewed URLs), `showcase_rank` (1–100, drives hub order), optional `reference_photo_url` (linked only, not rehosted — e.g. Commons, NOAA).

**Ingestion:** `src/enrich/sand_curated.py` reads the YAML, writes into a new `beach_sand_curated` table keyed on `beach_id`.

**New table `beach_sand_curated`:**
| column | type |
|---|---|
| beach_id | INTEGER PRIMARY KEY (FK) |
| sand_story | TEXT |
| sand_story_citations | TEXT (JSON array) |
| showcase_rank | INTEGER |
| reference_photo_url | TEXT nullable |
| reference_photo_attribution | TEXT nullable |

## Export

`src/export/export_enriched.py` is extended to bundle all sand fields into the per-beach JSON export, plus a new `sand_hub.json` export containing the curated showcase list with joined predicted + measured data.

---

## Site layer (Phase 2 — after DB validated)

### Integrated section on every beach page

New MDX component `<SandGeology>` rendered inside the existing beach template (`site/app/beaches/[slug]/page.tsx` or equivalent). Shows:
- Q/F/L horizontal stacked bar with percentages.
- Regime label + predicted-source caveat.
- `sand_color` badge if known.
- `sand_description` blurb if Wikipedia-sourced.
- "Verified measured samples nearby" badge + link to `/sand/[slug]` if `sand_measured_available`.
- Link: "See the full sand & geology page →".

### Dedicated `/sand/[slug]` route — generated for all 227K beaches

Route: `site/app/sand/[slug]/page.tsx`. Static export like existing beach pages.
Content per page:
- Header: beach name, sand color + regime.
- Predicted composition block (Q/F/L bar, regime explanation, caveat).
- Measured samples list (if any): table of nearby samples with source, distance, grain size, Folk class, citation link.
- Curated sand story (if seeded).
- "Contribute a photo" CTA (mailto or Google Form link — non-blocking; full upload tooling is future work).
- Back-link to main beach page.

### `/sand` category hub

Route: `site/app/sand/page.tsx`. Built from `sand_hub.json`.
Sections:
- Hero: "The geology of the world's beaches."
- Category tiles: Black sand / Pink sand / Green olivine / White quartz / Pure shell / Glass / Red volcanic / Orange — each tile links to a filtered view and lists top 3 beaches per category.
- "Top 100 most distinctive sand beaches" ranked list from curated seeds.
- Educational footer: plain-English explainer of Q/F/L, how beach sand forms, limits of the data.

---

## Sequencing

**Phase A — DB (all parallel, DB-first gate):**
1. Schema migrations for new columns + new tables.
2. Tier 1: GloPrSM raster download + `sand_predicted.py` + full run.
3. Tier 1.5: `sand_wikipedia.py` + full run over linked beaches.
4. Tier 2: dataset downloads + `sand_measured.py` + spatial join.
5. Tier 3: `sand_curated.yaml` authored + `sand_curated.py` ingestion.
6. Export pipeline extended; validation query confirms coverage numbers.

**Gate:** DB validated before any site work.

**Phase B — Site:**
7. `<SandGeology>` component + integration into beach page template.
8. `/sand/[slug]` route generation.
9. `/sand` hub page.
10. Build + local smoke test.

Deploy is out of scope for this spec (site is still undeployed per project memory).

## Data flow

```
Zenodo GloPrSM rasters ─┐
Wikipedia API ──────────┤
USGS east-coast CSVs ───┼─► src/enrich/sand_*.py ─► SQLite (beaches + beach_sand_*)
EMODnet shapefile ──────┤                                     │
data/sand_curated.yaml ─┘                                     ▼
                                               src/export/export_enriched.py
                                                              │
                                              ┌───────────────┴───────────────┐
                                              ▼                               ▼
                                 site/data/beaches/*.json             site/data/sand_hub.json
                                              │                               │
                                              ▼                               ▼
                                  <SandGeology> section +            /sand hub page
                                  /sand/[slug] deep-dive
```

## Error handling + idempotency

- Each enrichment module must be re-runnable without duplicating data: `INSERT OR REPLACE` for per-beach columns, `DELETE + INSERT` by `(beach_id, source)` for sample rows.
- GloPrSM raster download: checksum-verified, skip if present.
- Wikipedia fetch: per-beach try/except, log failures, never silently swallow HTTP errors (raise on 429 / 5xx, respect the silent-failure anti-pattern flagged in memory).
- Tier 2 spatial join: if raw source file missing, module fails loudly — no partial writes.

## Testing

- Unit tests per enrichment module under `tests/`:
  - `test_sand_predicted.py` — mock raster with known values, assert correct Q/F/L + regime label.
  - `test_sand_wikipedia.py` — fixture HTML for three infobox styles; assert color + description extraction.
  - `test_sand_measured.py` — synthetic 10-beach / 20-sample fixtures; assert 5 km join correctness.
  - `test_sand_curated.py` — round-trip YAML → DB.
- Smoke test `scripts/smoke_sand.py` — pick 5 iconic beaches (Papakōlea, Punaluʻu, Pink Sands, Copacabana, Waikiki-1), dump all sand fields, eyeball for sanity.
- Site integration: local `next build`, spot-check 3 beach pages + `/sand` hub + 3 `/sand/[slug]` pages.

## Open items deferred to follow-up specs

- Global Tier 2 expansion (Australia, Japan, NZ, Chile, South Africa).
- Crowdsourced grain-photo upload tooling (SandSnap-style coin-for-scale).
- Paid high-res imagery or licensing Sandatlas photos.
- OSM re-enrichment to reduce the 184K `substrate_type: unknown` count.
- Category-specific SEO landing pages ("black sand beaches", "pink sand beaches") — separate content spec.
