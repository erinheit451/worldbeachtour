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

## Storage needs — three buckets

| Bucket | What | Now | At full scale | Kept? |
|---|---|---|---|---|
| **Permanent** | `world_beaches.db` (the moat) | 1.4 GB | ~3–5 GB *(est., all columns)* | Forever |
| **Growing** | Photos, sand-library macros, cached galleries | 0.37 GB (`site/public`) | tens of GB over years | Yes, compounds |
| **Transient** | Source rasters / OSM planet / tiles during a run | ~0 | peak ~100 GB *during* a full run, then deleted | No |

### Current footprint (measured 2026-07-03)
- `output/` = 2.5 GB, but only `world_beaches.db` (1.4 GB) is live. The rest is
  **~940 MB of stale backups/old DBs** reclaimable now:
  `world_beaches_backup_before_phase3.db` (272 MB),
  `world_beaches_sharks.db` (276 MB), `beaches_v2.db` (394 MB).
- Free space on C: **114 GB**.

### The load-bearing recommendation: big geo jobs run on Hetzner, not local
114 GB local free is fine for the **pilot** (regional extracts are sub-GB). It is
**too tight** for the full 70 GB OSM planet + processing scratch + peak transient.
The Hetzner box already runs the deploy, is 16-core, and will host self-hosted
Open-Meteo — so the full-scale acquisition (Wave 4) belongs there. Local stays for
the pilot and DB work.

## Housekeeping actions
- Reclaim ~940 MB now by removing the three stale backup DBs (keep one dated backup
  of `world_beaches.db` before the next schema change).
- Every transient corpus: confirm sampled → then delete. Don't let scratch rasters
  accumulate (the reason `data/` is clean today — keep it that way).

*Sizes marked (est.) are dataset-documentation estimates, not measured on our box;
the pilot-scale numbers and current-footprint numbers are measured.*
