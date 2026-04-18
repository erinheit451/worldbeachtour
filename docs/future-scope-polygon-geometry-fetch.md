# Future Scope: Polygon Geometry Fetch

**Status:** Out-of-scope for the 2026-04-18 Milestone A enrichment. Parked for a dedicated future spec.

## Why this is a gap

The `beaches` table has 227,779 rows, all with `geometry_geojson` populated. Audit on 2026-04-18 confirmed **100% are Point geometries** — none are `Polygon` or `MultiPolygon`. This is fine for locating a beach on a map, but it blocks any enrichment that derives shape-based attributes from the beach footprint:

- `beach_length_m` — oriented minimum bounding rectangle, longer side
- `orientation_deg` — bearing of the long axis
- `orientation_label` / `sunset_visible` — derived from orientation
- future: beach width, shoreline curvature, beach area (m²), substrate transitions along the shore

The existing `src/enrich/geometry_derived.py` pipeline is correct in principle: given a polygon, it computes all four fields. With the current DB, it is a graceful no-op — the pipeline skips Point rows and logs a WARNING instead of failing.

The 32 beaches that already have a non-null `beach_length_m` got that value from some other source (hand-curated? prior OSM scrape? unknown provenance in current DB). Those are preserved.

## Why polygons were not fetched during initial ingestion

The beach ingestion pipeline (see `src/ingest/`) appears to have stored only the representative point (centroid or named location) from whatever upstream source fed it. OSM `natural=beach` features come in both node (Point) and way/relation (Polygon) forms; the ingestion kept only the Point representation. Not fixable in Milestone A — needs a separate re-fetch.

## What a polygon-fetch pipeline would do

1. For every beach with `osm_way_id` or `osm_relation_id` (if stored; audit first), re-query OSM via Overpass:
   - `way({id}); >; out geom;` or `relation({id}); >; out geom;`
   - Convert the returned node list to a `Polygon` (way) or `MultiPolygon` (relation)
2. For beaches without an OSM ID, nearest-beach-polygon search:
   - Query Overpass: `way(around:100,{lat},{lng})[natural=beach]; out geom;`
   - Take the closest matching polygon
3. Update `geometry_geojson` in place, preserving the original Point as `centroid_lat`/`centroid_lng` (already separate columns — good).
4. Re-run `geometry_derived` to backfill length/orientation.

Expected coverage: probably 50-80% of beaches (OSM polygon coverage for named beaches is reasonably good; remote or unnamed beaches are usually nodes only).

## Cost / effort

- Overpass is free but rate-limited (~10K queries/day from public endpoints). 228K beaches = ~3 weeks on free tier, or ~1 day with a self-hosted Overpass instance.
- Self-hosted Overpass: ~120GB planet file + Docker container. One-time setup (1 day), then unlimited queries.
- Alternative: download the OSM planet PBF (~70GB) and run `osmium` locally over it to extract all `natural=beach` ways/relations as GeoJSON in a single batch. Faster end-to-end (~6 hours on a decent laptop) but larger download.

## Blocked downstream work

This future-scope item blocks:
- Real production use of `geometry_derived` pipeline (currently a no-op)
- Any beach-width or beach-area field
- Shoreline orientation used by GEBCO's "offshore bearing" computation (Task 8 has a 4-cardinal fallback that works without polygons, but is less accurate)
- Beach-specific photo ranking / aesthetic scoring at polygon resolution
- Substrate transitions (sand ↔ rock) along long beaches

## Suggested next step when picked up

One brainstorming session focused on this. Likely outputs:
- Audit how many beaches have a usable OSM ID vs need geo-search
- Decide: Overpass public + slow, or self-hosted / planet PBF + fast
- Schema: preserve Point as centroid, add polygon to `geometry_geojson`, store an `osm_polygon_source` tag
- Re-run `geometry_derived` and other polygon-dependent pipelines

## Related docs

- `src/enrich/geometry_derived.py` — pipeline that needs this data
- `docs/superpowers/specs/2026-04-18-enrichment-v2-design.md` — parent spec
- `docs/future-scope-social-photo-mining.md` — sibling future-scope doc
