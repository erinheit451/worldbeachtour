# Layer: Geometry keystone (polygon fetch)
**Status:** scoped
**Scores:** Uniqueness M · Leverage H · Cost H(cheap) · Authority M · Revenue L

## What it is
Replace point-only geometry with real beach polygons from OSM. All 227,780 rows are
currently Points, which blocks every shape-derived attribute. Full technical spec
already exists: [`../../future-scope-polygon-geometry-fetch.md`](../../future-scope-polygon-geometry-fetch.md).
This is the single cheapest unblock in the program.

## What it yields (DB columns)
`geometry_geojson` (Polygon/MultiPolygon), then via re-running `src/enrich/geometry_derived.py`:
`beach_length_m`, `orientation_deg`, `orientation_label`, `sunset_visible` — and it
unblocks beach width/area, shoreline curvature, substrate transitions, accurate
offshore bearing for bathymetry, and polygon-resolution photo/satellite matching.

## Sources
OSM planet PBF (~70GB) + `osmium` batch extraction of `natural=beach` ways/relations
(~6h on the 16-core Hetzner box), or self-hosted Overpass. Public Overpass is too
slow (~3 weeks rate-limited).

## Depends on
Nothing. This IS the dependency.

## Effort
~2 days. Expected polygon coverage 50–80% of beaches (rest stay Points — fine).

## Open questions
- How many rows carry a usable OSM id vs need nearest-polygon geo-search? (audit first)
- Store `osm_polygon_source` provenance tag per the future-scope doc.
