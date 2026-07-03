# Layer: Climate future ("beaches with a deadline")
**Status:** idea
**Scores:** Uniqueness H · Leverage M · Cost M · Authority H · Revenue M

## What it is
Per-beach sea-level-rise exposure and erosion trajectory. Doubles as the program's
strongest press/editorial franchise — "the beaches disappearing fastest" is a news
cycle, not a page.

## What it yields (DB columns / products)
Sea-level-rise exposure tier, historical shoreline-change rate (erosion/accretion),
projected exposure by decade. Products: the erosion press piece, a "deadline" map,
and a recurring ranking (fastest-disappearing beaches).

## Sources
Sentinel-2 / Landsat historical imagery diffing (shoreline position over time),
NASA/NOAA sea-level projections, Copernicus coastal DEM, published shoreline-change
datasets (e.g. Luijendijk/Deltares). Shares the Sentinel pipeline with
[sand-library](sand-library.md) rung 1.

## Depends on
[geometry-keystone](geometry-keystone.md) for shoreline extraction; Sentinel pipeline
shared with sand library — build the imagery pipeline once, serve both.

## Effort
Medium — mostly the shared satellite pipeline + a change-detection pass. Editorial
packaging is where the value converts.

## Open questions
- Change-detection method (waterline extraction cadence, tide normalization).
- Confidence/attribution — climate claims get scrutinized; cite sources per beach.
