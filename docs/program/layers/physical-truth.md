# Layer: Physical truth (computed attributes)
**Status:** partial (climate/best-months/swim ~97%; slope 52%; the rest stubs)
**Scores:** Uniqueness H · Leverage H · Cost H(cheap) · Authority H · Revenue M

## What it is
Attributes derived from geometry × climatology × physics — data that has never
existed anywhere, impossible to crowdsource, exactly what answer engines need a
structured source for. The crown-jewel layer and the core of the moat.

## What it yields (DB columns / products)
- **Sunset-over-water score by month** — orientation × sun azimuth by date × horizon
  obstruction from DEM. Enables "beaches near Lisbon where the sun sets over water
  in October." NOTE (spike 2026-07-03): today's `geometry_derived.sunset_visible` is
  only a coarse ±22.5° N–S-axis proxy AND needs polygons even for that — the real
  sun-azimuth-by-month attribute is a fast-follow after the geometry keystone.
- **Natural shade by hour** — terrain + vegetation + orientation → "shade on the
  sand after 3pm."
- **Structural crowding index** — parking polygon area × road access class ×
  population inside drive-time isochrone ÷ beach area → the empty-beach finder,
  zero foot-traffic data needed.
- **Rip-current propensity** — bathymetric gradient × swell exposure → structural
  risk tiering ("conditions to know" framing per DECISIONS).
- **Walk-in accessibility** — DEM slope from parking to sand → wheelchair/stroller
  feasibility, computed globally.
- **Dark-sky score** — light-pollution atlas × orientation; pairs with biolum sites.
- Beach width/area at tide states (needs polygons + tide range — already 62%).

## Sources
Already-ingested DEM/GEBCO/ETOPO, WorldClim, EOT20/FES2022 tides; plus light-pollution
atlas (VIIRS), population rasters (GHSL/WorldPop), OSM roads/parking, sun-position math.

## Depends on
[geometry-keystone](geometry-keystone.md) for orientation/sunset/dimensions. Shade,
crowding, accessibility, dark-sky can run point-based with degraded precision — but
polygons first is the right order.

## Effort
Pipelines partly coded (`geometry_derived`, `etopo/gebco`, `grid_climate` done).
New code: shade, crowding, accessibility, dark-sky. ~4–6 weeks of runs total.

## Open questions
- Horizon-obstruction computation cost at 228K scale (coarse DEM pass first?).
- Isochrone provider at scale (OSRM self-hosted on Hetzner vs precomputed rasters).
- Per-attribute confidence display standard (applies to the whole program).
