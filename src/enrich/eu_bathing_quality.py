"""Match EEA Bathing Water quality ratings onto EXISTING beach rows.

The original src/ingest/eu_bathing.py INSERTED new rows from EEA sites; this
pipeline instead enriches beaches we already have, matching EEA monitoring
points to beaches by polygon containment first (needs the Wave-2 polygons from
osm_beach_polygons.py), then nearest-centroid fallback.

Note the country-code trap this fixes: EEA identifies Greece as 'EL'
(Eurostat), our DB uses ISO 'GR'. The original ingest keyed everything on the
EEA code, which is why Greece had almost no ratings.

Usage:
    python -m src.enrich.eu_bathing_quality <db_path> --country GR --eea-country EL
"""

import argparse
import json
import math
import os

import requests
from shapely.geometry import Point, shape
from shapely.strtree import STRtree

from src.enrich._common import (
    open_db, log_run_start, log_run_finish, raise_for_http,
    coverage_count, assert_coverage_delta,
)

ARCGIS_BASE = (
    "https://water.discomap.eea.europa.eu/arcgis/rest/services/"
    "BathingWater/BathingWater_Dyna_WM/MapServer/0/query"
)
DATA_DIR = os.environ.get(
    "WBT_DATA_DIR", os.path.join(os.path.dirname(__file__), "..", "..", "data"))
PAGE_SIZE = 2000
NEAREST_MAX_M = 300.0
QUALITY_YEAR = 2024


def fetch_sites(eea_country: str) -> list[dict]:
    cache_path = os.path.join(DATA_DIR, f"eea_sites_{eea_country}.json")
    if os.path.exists(cache_path):
        with open(cache_path, encoding="utf-8") as f:
            return json.load(f)

    sites, offset = [], 0
    while True:
        resp = requests.get(ARCGIS_BASE, params={
            "where": f"countryCode = '{eea_country}'",
            "outFields": ("bathingWaterName,latitude,longitude,countryCode,"
                          "bwWaterCategory,qualityStatus,bathingWaterIdentifier"),
            "returnGeometry": "false",
            "resultRecordCount": PAGE_SIZE,
            "resultOffset": offset,
            "f": "json",
        }, timeout=120)
        raise_for_http(resp)
        features = resp.json().get("features", [])
        if not features:
            break
        sites.extend(f.get("attributes", f) for f in features)
        if len(features) < PAGE_SIZE:
            break
        offset += PAGE_SIZE

    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(sites, f)
    return sites


def normalize_quality(raw) -> str | None:
    """EEA values arrive as 'excellent', '1', or '1 - Excellent'. Poor is real
    signal; 'not classified' is not."""
    if not raw:
        return None
    s = str(raw).strip().lower()
    for label in ("excellent", "good", "sufficient", "poor"):
        if label in s:
            return label
    return {"1": "excellent", "2": "good", "3": "sufficient", "4": "poor"}.get(s)


def enrich(conn, country: str, eea_country: str) -> dict:
    run_id = log_run_start(conn, "eu_bathing_quality", phase="W1")
    before = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE country_code=? AND water_quality_rating IS NOT NULL",
        (country,),
    ).fetchone()[0]

    quality_path = os.path.join(DATA_DIR, "eea_quality_2024.json")
    with open(quality_path, encoding="utf-8") as f:
        quality_by_id = json.load(f)

    sites = fetch_sites(eea_country)
    print(f"  EEA sites for {eea_country}: {len(sites)}")

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng, geometry_geojson FROM beaches "
        "WHERE country_code=? AND centroid_lat IS NOT NULL",
        (country,),
    ).fetchall()

    beach_ids, geoms, centroids = [], [], []
    for r in rows:
        beach_ids.append(r["id"])
        centroids.append(Point(r["centroid_lng"], r["centroid_lat"]))
        g = None
        if r["geometry_geojson"]:
            try:
                cand = shape(json.loads(r["geometry_geojson"]))
                if cand.geom_type in ("Polygon", "MultiPolygon"):
                    g = cand
            except Exception:
                pass
        geoms.append(g if g is not None else centroids[-1])

    poly_tree = STRtree(geoms)
    centroid_tree = STRtree(centroids)

    stats = {"in_polygon": 0, "nearest": 0, "unmatched": 0, "unclassified": 0}
    for site in sites:
        try:
            lat, lng = float(site["latitude"]), float(site["longitude"])
        except (TypeError, ValueError, KeyError):
            stats["unmatched"] += 1
            continue
        bw_id = site.get("bathingWaterIdentifier", "")
        quality = normalize_quality(quality_by_id.get(bw_id, site.get("qualityStatus")))
        if quality is None:
            stats["unclassified"] += 1
            continue

        pt = Point(lng, lat)
        hit = None
        contains_idx = poly_tree.query(pt, predicate="within")
        if len(contains_idx) > 0:
            hit = min(contains_idx, key=lambda i: geoms[i].area)
            stats["in_polygon"] += 1
        else:
            i = centroid_tree.nearest(pt)
            lat_m = 111_320.0
            lng_m = 111_320.0 * math.cos(math.radians(lat))
            dist_m = centroids[i].distance(pt) * max(lat_m, lng_m)
            if dist_m <= NEAREST_MAX_M:
                hit = i
                stats["nearest"] += 1
            else:
                stats["unmatched"] += 1
                continue

        conn.execute(
            """UPDATE beaches
               SET water_quality_rating=?, water_quality_source='eu_bathing',
                   water_quality_year=?, updated_at=datetime('now')
               WHERE id=? AND (water_quality_year IS NULL OR water_quality_year < ?)""",
            (quality, QUALITY_YEAR, beach_ids[hit], QUALITY_YEAR),
        )

    conn.commit()
    matched = stats["in_polygon"] + stats["nearest"]
    log_run_finish(conn, run_id, "ok", total_processed=matched,
                   total_errors=stats["unmatched"])
    after = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE country_code=? AND water_quality_rating IS NOT NULL",
        (country,),
    ).fetchone()[0]
    print(f"  matched: {stats['in_polygon']} in-polygon, {stats['nearest']} nearest<={NEAREST_MAX_M:.0f}m, "
          f"{stats['unmatched']} unmatched, {stats['unclassified']} unclassified")
    print(f"  {country} water_quality_rating coverage: {before} -> {after}")

    assert_coverage_delta(conn, "beaches", "water_quality_rating",
                          before=coverage_count(conn, "beaches", "water_quality_rating") - (after - before),
                          min_delta=max(1, matched // 4))
    return stats


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("db")
    ap.add_argument("--country", required=True, help="our ISO country_code, e.g. GR")
    ap.add_argument("--eea-country", required=True, help="EEA country code, e.g. EL")
    args = ap.parse_args()
    conn = open_db(args.db)
    enrich(conn, args.country, args.eea_country)
    conn.close()


if __name__ == "__main__":
    main()
