# Layer: Marine climate (waves, water temperature)
**Status:** partial (pipelines coded — `marine_waves.py`, ocean columns exist; <1% populated)
**Scores:** Uniqueness H · Leverage H · Cost H(cheap) · Authority H · Revenue M

## What it is
Monthly wave and water-temperature climatology per beach from hindcast models —
"swimmable in March: yes/no" and "how big do waves run here" as data, not reviews.
Feeds swim suitability v2, the surf layer, and activity calendars.

## What it yields (DB columns)
`ocean_water_temp` (monthly climatology), `ocean_wave_height_m`, `ocean_wave_period_s`,
`ocean_swell_direction` (columns exist, ~empty). Derived: activity calendars by month
(swim/surf/snorkel/windsurf suitability), improved `best_months`.

## Sources
NOAA WaveWatch III hindcast, Copernicus/ERA5 reanalysis, NOAA OISST / CoastWatch for
SST climatology. All free.

## Depends on
Nothing hard. Offshore-bearing precision improves after [geometry-keystone](geometry-keystone.md).

## Effort
`src/enrich/marine_waves.py` exists — this is a finish-the-run job plus SST
climatology join. Weeks of batch compute, little new code.

## Open questions
- Nearshore transformation: hindcast grids are offshore — accept offshore values
  with a disclosure, or apply simple depth-limited breaking correction using our
  nearshore depth (52% populated)?
- Verify the unmerged `feat/marine-waves-ingest` branch is truly superseded (memory
  says its file is on master) then delete.
