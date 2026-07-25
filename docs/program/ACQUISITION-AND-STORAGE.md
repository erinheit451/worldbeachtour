# Data Acquisition Order & Storage Plan

**Created 2026-07-03.** Answers two operational questions: what order we pull data
in, and what it costs to store. Grounded in a live footprint audit + the
[Greece pilot spec](specs/2026-07-03-greece-pilot.md).

## The pattern that governs everything: download → sample → discard

Audit finding: the project's `data/` folder is **3.9 MB**. The big source rasters
(bathymetry, climate, sand) were never kept — each pipeline downloads a corpus,
samples it at the 228K beach points, writes the values into the DB, and deletes the
raw file. **The database is the only permanent store. Source datasets are transient
scratch.** This is why a project spanning terabytes of upstream data has a ~1.4 GB
footprint of actual kept data.

Consequence: peak storage is a *momentary* need during a run, not a standing cost.

## Acquisition order (waves, by dependency + cost)

Pilot-first: every early wave uses **regional extracts** (tiny), not planet-scale
downloads. The 70 GB global pulls happen only when we scale past the pilot.

### Wave 0 — runnable now, zero downloads
Data already in the DB. First work on the board.
- **Grain-size tendency** — from `slope_pct` + tide (already present).
- No acquisition, no storage. Pure compute.

### Wave 1 — pilot: small targeted pulls (Greece)
- **EU Bathing Water Directive** — official water quality; small CSV/JSON (MBs). We
  already hold a partial `data/eea_quality_2024.json` (756 KB).
- **Self-hosted Open-Meteo** — stand up on Hetzner for waves + water temp. This is
  *compute infrastructure*, not a download; unlocks the 849 Greece marine cells in
  minutes (vs ~22 days on the free tier) and serves the whole program later.

### Wave 2 — geometry keystone, PILOT scale
- **OSM Greece extract** (Geofabrik) — **~200–400 MB**, not the 70 GB planet. Run
  `osmium` over it for beach polygons + facility tags. Proves the polygon→attribute
  chain (orientation, sunset, dimensions) on Greece for a trivial download.

### Wave 3 — satellite, pilot subset
- **Sentinel-2** (sand color + erosion) — streamed/tiled per-scene from Copernicus
  Data Space or AWS Open Data for the Greek coast, processed, discarded. Never bulk
  downloaded. GBs move through, ~nothing stays.
- GloPrSM sand rasters already ran (regime at 99% — no re-pull).

### Wave 4 — scale to the full planet (only after the pilot proves out)
Runs on the Hetzner box (see storage note). All transient:
- **OSM planet PBF** — ~70 GB (full polygon + facilities pass).
- **GEBCO 2024** bathymetry global grid — ~7–8 GB *(est.)*.
- **WorldClim 2.1** high-res climate — ~10–20 GB *(est.)*.
- Global Sentinel-2 mosaics — streamed per-tile, not stored.

## How big is the COMPLETE, wired-up database? (computed 2026-07-03)

Measured the logical row weight and projected to full population. The finding that
matters: **the structured data — the entire moat — is tiny. Images decide everything.**

### The structured core (all attributes wired up): ~2–4 GB
Computed from real row weights (current logical content is ~880 B/row; the 1.5 GB
file is mostly SQLite overhead, not data):

| Piece | Complete size | Note |
|---|---|---|
| Core attributes, every row full + monthly climatologies | ~0.6–1.5 GB | 228K rows × ~1 KB + 12-month wave/temp/sunset arrays |
| Real polygons (65% coverage, ~35 verts) | ~0.1–0.3 GB | negligible vs images |
| Spatial/text indexes + optional 768-d embeddings (semantic MCP search) | ~1–2 GB | embeddings are the biggest structured line, and optional |
| **Structured total (the moat)** | **~2–4 GB** | fits on DE's 42 GB free *today*, trivially |

### Images — the actual swing factor (10–100× the data)

| Scenario | Size | What it assumes |
|---|---|---|
| Lean: 1 hosted hero each, 100K built pages | ~20 GB | reference/hot-link CC + social for the rest |
| Mid: hero + 4 gallery images, 100K pages | ~100 GB | we host galleries instead of referencing |
| Sand library, early: 3 macros × 20K beaches | ~60 GB | our own macro shots (we host these) |
| Sand library, mature: 3 macros × 60K beaches | ~216 GB | the community endgame — single biggest line item |

### Bottom line — the complete server footprint

| Build | Total | Where it lives |
|---|---|---|
| **Lean complete** (structured + heroes + early sand) | **~30–80 GB** | data on DE, images on Storage Box |
| **Rich complete** (structured + galleries + mature sand) | **~150–320 GB** | data on DE, images on Storage Box |

**The data goes on DE (2–4 GB, fits now). The images go on the 1 TB Storage Box —
even the 320 GB rich case leaves ~700 GB free.** No new hardware is needed for the
finished product; the only thing DE's 42 GB can't hold is the *transient* 70 GB
planet-processing scratch during a full geometry run (temp volume / freed MRF space).

## The three storage buckets (by lifecycle)

| Bucket | What | Now | Complete | Kept? | Home |
|---|---|---|---|---|---|
| **Permanent** | `world_beaches.db` (the moat) | 1.5 GB | **~2–4 GB** | Forever | DE |
| **Growing** | Photos, sand-library macros, galleries | 0.37 GB | **~25–300 GB** | Yes, compounds | Storage Box (1 TB) |
| **Transient** | Source rasters / OSM planet during a run | ~0 | peak ~100 GB, then deleted | No | temp volume / freed space |

### Current footprint (measured 2026-07-03)
- **Laptop C:** 114 GB free. `output/` = 2.5 GB, but only `world_beaches.db` (1.4 GB)
  is live — the rest is **~940 MB of stale backups** reclaimable now
  (`world_beaches_backup_before_phase3.db` 272 MB, `world_beaches_sharks.db` 276 MB,
  `beaches_v2.db` 394 MB).
- **DE compute box** (`178.104.99.176` — the SAME box that serves the WBT site + the
  CareCost API + the 35M-row rates Postgres + the MRF grind): 601 GB disk,
  **only 42 GB free (93% full)**, 16 cores, 30 GB RAM (19 GB free), load ~1.75 peak.
  MRF pipelines are the disk hog (~52 GB: `xw_payer_uhc` 14G, `mrf-pipeline*` 25G,
  `p2g_uhc_b5` 8G). CPU/RAM have headroom; **disk is the binding constraint.**
- **Hetzner Storage Box** (`u574262.your-storagebox.de`, port 23): **1 TB**, ~600 GB
  free *(as of 2026-04; reverify)*, already wired to DE for backups. Cheap bulk/cold
  storage, separate from the compute disk.

### The home for beach data (three-tier, because DE's compute disk is nearly full)
The final home is the DE box — but split by what actually needs to live where:
1. **Live beach DB → DE box.** The permanent DB is small (1.4 → ~5 GB) and fits on DE
   *even at 42 GB free*, next to the MRF data. This is the "final home" for the data
   the site / MCP / API read from. ✅ no infra change needed.
2. **Bulk + transient + backups → the 1 TB Storage Box.** Source corpuses we choose to
   retain, DB backups, and the growing photo / sand-library assets. Already provisioned.
3. **Planet-scale processing scratch (~100 GB peak) → NOT DE as-is.** DE's 42 GB can't
   hold the 70 GB OSM planet + scratch. Before the full run (Wave 4), either free MRF
   scratch to the Storage Box, or attach a temporary Hetzner volume for the run, then
   detach. **This decision is weeks away** — the pilot doesn't hit it.

### Where each phase runs
- **Pilot (now):** laptop. Greece regional extracts are sub-GB; 114 GB is plenty.
  Ship the resulting enriched DB to DE when ready. No server contention with MRF.
- **Full scale (post-pilot):** DE for the live DB + self-hosted Open-Meteo; Storage
  Box for bulk/backup; a temporary volume or freed MRF space for the planet run.
  Schedule heavy geo passes to not collide with active MRF crunching (disk + CPU).

## Housekeeping actions
- Reclaim ~940 MB now by removing the three stale backup DBs (keep one dated backup
  of `world_beaches.db` before the next schema change).
- Every transient corpus: confirm sampled → then delete. Don't let scratch rasters
  accumulate (the reason `data/` is clean today — keep it that way).

*Sizes marked (est.) are dataset-documentation estimates, not measured on our box;
the pilot-scale numbers and current-footprint numbers are measured.*
