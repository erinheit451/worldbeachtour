# Layer: Dive / snorkel
**Status:** idea
**Scores:** Uniqueness H · Leverage M · Cost M · Authority M · Revenue M

## What it is
"What you'll actually see snorkeling here" — reef, wrecks, species, and protected-area
context per beach. A vertical audience unlock.

## What it yields (DB columns)
Reef cover/proximity, wreck presence, expected species list, MPA boundary context,
snorkel/dive suitability. Columns `coral_reef_distance_km`, `seagrass_nearby`,
`species_observed_count`, `notable_species` already exist (species <1% populated).

## Sources
Allen Coral Atlas (global mapped reef cover), wreck databases, OBIS/GBIF species
occurrences (`species_gbif.py`, `species_inaturalist.py` coded), WDPA for MPA
boundaries (`wdpa_protected.py` — protected areas already 29%).

## Depends on
Overlaps [life-ecology](life-ecology.md) — same species/reef sources. Build the
species/reef join once, split the presentation by vertical.

## Effort
Medium — pipelines partly coded; finish species runs + Allen Coral Atlas join.

## Open questions
- De-duplicate effort with life-ecology: one ingestion, two products.
- Species occurrence → "what you'll see" requires filtering to observable marine life.
