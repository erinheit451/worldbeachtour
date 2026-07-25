# Layer: Place & access
**Status:** scoped (facilities <1%; `osm_facilities.py` coded)
**Scores:** Uniqueness M · Leverage M · Cost H(cheap) · Authority M · Revenue M

## What it is
The practical layer: how you get there and what's there. Individually commodity
facts; nobody has them joined + normalized across 228K beaches. Also supplies the
parking/transit inputs to the crowding index.

## What it yields (DB columns)
Facilities (parking, toilets, showers, lifeguard, fees, dogs, nudism — columns
exist, ~empty), `parking_capacity`, `transit_stops_500m_count`, ferry terminal,
drive-time isochrones, admin boundaries (`gadm_admin.py` coded).

## Sources
OSM deep-tag extraction (`surface=*`, `amenity=toilets/shower/parking`,
`emergency=lifeguard`, `fee=*`, `dog=*`), GADM admin polygons, GTFS/OSM transit.

## Depends on
Shares the OSM planet extract with [geometry-keystone](geometry-keystone.md) — pull
facilities tags in the SAME planet pass. Efficient sequencing win.

## Effort
Cheap once the planet file is local (do it alongside the keystone).

## Open questions
- Parking polygon area (for crowding index) needs OSM parking geometry — grab in
  the same pass.
