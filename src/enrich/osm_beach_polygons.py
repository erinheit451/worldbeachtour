"""Fetch beach polygons from an OSM PBF extract and fill beaches.geometry_geojson.

Wave 2 of the acquisition plan (docs/program/ACQUISITION-AND-STORAGE.md): the
geometry keystone, at pilot (country-extract) scale. Reads natural=beach areas
(closed ways + multipolygon relations) from a Geofabrik extract, matches them to
beach rows by point-in-polygon then nearest-within-threshold, and replaces the
Point geometry_geojson with the real polygon. The original point survives in
centroid_lat/centroid_lng. Provenance lands in geometry_source (added if missing).

Downstream: re-run src/enrich/geometry_derived.py to backfill beach_length_m,
orientation_deg, orientation_label, sunset_visible from the new polygons.

Usage:
    python -m src.enrich.osm_beach_polygons <extract.osm.pbf> <db_path> --country GR
"""

import argparse
import json
import math

import osmium
from shapely.geometry import Point, shape
from shapely.strtree import STRtree

from src.enrich._common import (
    open_db, log_run_start, log_run_finish, CoverageAssertionError,
)

# A dedup'd centroid can sit slightly off the mapped polygon (multi-source
# averaging), so containment misses are retried as nearest-neighbour up to
# this many metres away.
NEAREST_MAX_M = 150.0


class BeachAreaHandler(osmium.SimpleHandler):
    """Collect every natural=beach area (closed way or multipolygon relation)."""

    def __init__(self):
        super().__init__()
        self._factory = osmium.geom.GeoJSONFactory()
        self.areas = []  # (osm_kind, osm_id, name, geojson_str)
        self.degenerate = 0

    def area(self, a):
        if a.tags.get("natural") != "beach":
            return
        try:
            geojson = self._factory.create_multipolygon(a)
        except RuntimeError:
            self.degenerate += 1
            return
        kind = "way" if a.from_way() else "relation"
        self.areas.append((kind, a.orig_id(), a.tags.get("name"), geojson))


def extract_beach_areas(pbf_path: str) -> BeachAreaHandler:
    handler = BeachAreaHandler()
    # An `area` callback makes pyosmium run its two-pass multipolygon assembly.
    handler.apply_file(pbf_path, locations=True)
    return handler


def _meters_per_deg(lat: float) -> tuple[float, float]:
    return 111_320.0, 111_320.0 * math.cos(math.radians(lat))


def match_beaches(conn, handler, country_code: str, source_label: str) -> dict:
    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches "
        "WHERE country_code = ? AND centroid_lat IS NOT NULL",
        (country_code,),
    ).fetchall()

    geoms, meta = [], []
    for kind, osm_id, name, geojson in handler.areas:
        try:
            g = shape(json.loads(geojson))
        except Exception:
            handler.degenerate += 1
            continue
        if g.is_empty or not g.is_valid:
            g = g.buffer(0)  # standard self-intersection repair
            if g.is_empty:
                handler.degenerate += 1
                continue
        geoms.append(g)
        meta.append((kind, osm_id, name))

    tree = STRtree(geoms)
    stats = {"contains": 0, "nearest": 0, "unmatched": 0}

    for row in rows:
        pt = Point(row["centroid_lng"], row["centroid_lat"])
        lat_m, lng_m = _meters_per_deg(row["centroid_lat"])

        candidate_idx = tree.query(pt, predicate="within")
        if len(candidate_idx) > 0:
            # Multiple containing polygons: take the smallest (most specific).
            best = min(candidate_idx, key=lambda i: geoms[i].area)
            match_note = "point-in-polygon"
            stats["contains"] += 1
        else:
            i = tree.nearest(pt)
            # Degree distance -> metres at this latitude (anisotropic, so use
            # the worse of the two axes as a conservative bound).
            deg_dist = geoms[i].distance(pt)
            dist_m = deg_dist * max(lat_m, lng_m)
            if dist_m > NEAREST_MAX_M:
                stats["unmatched"] += 1
                continue
            best = i
            match_note = f"nearest {dist_m:.0f}m"
            stats["nearest"] += 1

        kind, osm_id, _name = meta[best]
        geojson_out = json.dumps(geoms[best].__geo_interface__)
        conn.execute(
            """UPDATE beaches
               SET geometry_geojson=?, geometry_source=?, updated_at=datetime('now')
               WHERE id=?""",
            (geojson_out,
             f"{source_label} {kind}/{osm_id} ({match_note})",
             row["id"]),
        )

    conn.commit()
    return stats


def polygon_count(conn, country_code: str) -> int:
    # Matches both "Polygon" and "MultiPolygon" (Point does not contain "Polygon").
    return conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE country_code=? "
        "AND geometry_geojson LIKE '%Polygon%'",
        (country_code,),
    ).fetchone()[0]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pbf")
    ap.add_argument("db")
    ap.add_argument("--country", required=True, help="ISO country_code to match, e.g. GR")
    ap.add_argument("--source-label", default=None,
                    help="provenance prefix; defaults to 'OSM <pbf filename>'")
    args = ap.parse_args()

    source_label = args.source_label or f"OSM {args.pbf.replace(chr(92), '/').rsplit('/', 1)[-1]}"

    conn = open_db(args.db)
    cols = [r[1] for r in conn.execute("PRAGMA table_info(beaches)")]
    if "geometry_source" not in cols:
        conn.execute("ALTER TABLE beaches ADD COLUMN geometry_source TEXT")
        conn.commit()

    run_id = log_run_start(conn, "osm_beach_polygons", phase="W2")
    before = polygon_count(conn, args.country)

    print(f"extracting natural=beach areas from {args.pbf} ...")
    handler = extract_beach_areas(args.pbf)
    named = sum(1 for _, _, n, _ in handler.areas if n)
    print(f"  areas: {len(handler.areas)} ({named} named), degenerate skipped: {handler.degenerate}")

    stats = match_beaches(conn, handler, args.country, source_label)
    print(f"  matched: {stats['contains']} point-in-polygon, {stats['nearest']} nearest<= {NEAREST_MAX_M:.0f}m, "
          f"{stats['unmatched']} unmatched")

    after = polygon_count(conn, args.country)
    matched_total = stats["contains"] + stats["nearest"]
    log_run_finish(conn, run_id, "ok", total_processed=matched_total,
                   total_errors=stats["unmatched"])
    print(f"  {args.country} polygon coverage: {before} -> {after}")

    if after - before < max(1, matched_total // 2):
        raise CoverageAssertionError(
            f"beaches.geometry_geojson polygons for {args.country}: "
            f"matched {matched_total} but coverage moved {before}->{after}. "
            f"Pipeline failed silently.")
    conn.close()


if __name__ == "__main__":
    main()
