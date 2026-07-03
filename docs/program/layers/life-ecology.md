# Layer: Life & ecology
**Status:** partial (protected areas 29%, species <1%; several pipelines coded)
**Scores:** Uniqueness H · Leverage M · Cost M · Authority M · Revenue M

## What it is
The ecology layer — a novel join of open biodiversity + environmental data to
beaches. Feeds wildlife/seasonal calendars, cleanliness signals, and the
dive/snorkel vertical.

## What it yields (DB columns)
Species by beach, turtle-nesting + whale seasons, seagrass/mangrove extent,
bioluminescence sites, official water-quality classifications, Blue Flag status,
cleanliness propensity (from ocean-current plastic accumulation models).

## Sources
GBIF/iNaturalist/OBIS (species pipelines coded); SWOT sea-turtle nesting; NOAA coral
bleaching alerts; EU Bathing Water Directive (~22K European sites, free, authoritative,
plug-and-play — `eu_bathing.py` coded, water quality at 9%); Blue Flag registry
(`blue_flag.py` coded); seagrass/mangrove (`mangrove_proximity.py` coded); ocean-current
plastic models.

## Depends on
Nothing hard. Shares species/reef sources with [dive-snorkel](dive-snorkel.md).

## Effort
Medium — many pipelines coded; this is largely finish-the-runs + the plastic model
(new) and turtle/whale season joins (new).

## Open questions
- EU Bathing Water is the fastest authoritative win (22K sites) — prioritize within
  this layer.
- Cleanliness propensity from plastic-accumulation models: methodology + confidence.
