# Layer: The Sand Library
**Status:** scoped
**Scores:** Uniqueness H · Leverage M · Cost M · Authority H · Revenue L

## What it is
The brand-defining vertical: verified sand color, mineral family, and grain size for
every beach — culminating in a community-generated, museum-grade macro-photography
collection no aggregator can synthesize. Physical, collectible, community-generating:
it turns users into contributors.

## The precision stack (three rungs, increasing depth)

**1. Satellite (all ~228K beaches).** Sentinel-2 (10m, 12 spectral bands) classifies
mineral family + color reliably per beach: carbonate white vs quartz tan vs volcanic
black vs iron-oxide red/pink. Verified color/mineral class as data at every site.
Also yields seaweed prevalence and (with polygons) beach width at tide states;
historical imagery diffing feeds [climate-future](climate-future.md) erosion trends.

**2. Inference (global, runnable NOW).** Grain size can't be seen from orbit but the
foreshore slope↔grain-size relationship is well established (steeper = coarser).
We already have DEM slope (52%) and tide range (62%) → fine/medium/coarse/pebble
estimates globally — an attribute literally nobody publishes. NOT blocked by the
polygon keystone.

**3. Ground truth (thousands of beaches, growing).**
- Calibration corpuses: USGS usSEABED (grain-size samples, entire US coast),
  EMODnet substrate (Europe) — calibrate rung 2, seed verified entries.
- Arenophile world: sandatlas.org, International Sand Collectors Society,
  geotagged macro photography on Flickr/iNaturalist. Aggregation + licensing =
  thousands of beaches on day one.
- **The Sand Passport program (endgame):** mail-in kit (vial + card), contributors
  photograph/ship samples, we shoot standardized macros on a USB microscope rig
  (~$500: consistent lighting, scale bar). Contributor credit on the beach page.

## Legality guardrail (settled — see DECISIONS)
Sand removal is illegal in Sardinia, Hawaii, and various protected coasts. Those
beaches get satellite + literature data only, and the page says so — the disclosure
is itself credibility. Maintain a no-collection list keyed off protected-area status
+ jurisdiction rules before any kit ships.

## What it yields (DB columns)
`sand_color` (verified), mineral family class, grain-size class + confidence,
`sand_measured_available`, macro photo ids, contributor credits. Existing columns
`sand_q_pct/f_pct/l_pct`, `sand_regime_label` (99%), `sand_predicted_source` slot in.

## Depends on
Rung 1 better after [geometry-keystone](geometry-keystone.md) (polygon = correct
pixels); rung 2 needs nothing; rung 3 needs nothing technical.

## Effort
Rung 2: days (data already in DB). Rung 1: Sentinel-2 batch pipeline, ~2–4 weeks.
Rung 3: aggregation weeks + an ongoing community program (kit design, postal
logistics, moderation).

## Open questions
- Sentinel-2 access path: Copernicus Data Space vs AWS open data; cloud-free
  composite strategy.
- Licensing conversations with sandatlas.org / ISCS — ask early.
- Sand Passport unit economics + fulfillment (later phase; don't block rungs 1–2).
