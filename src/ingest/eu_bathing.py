"""Ingest beach data from the EU Bathing Water Directive (EEA).

Uses the ArcGIS REST API for site locations + names (~22,000 sites),
then enriches with 2024 quality ratings from DiscoData SQL API.
"""

import json
import os
import uuid
import requests
from slugify import slugify
from tqdm import tqdm

# ArcGIS REST API — has names, coordinates, water category, quality (2022)
ARCGIS_BASE = (
    "https://water.discomap.eea.europa.eu/arcgis/rest/services/"
    "BathingWater/BathingWater_Dyna_WM/MapServer/0/query"
)

# DiscoData SQL — has 2024 quality ratings (keyed by bathingWaterIdentifier)
DISCODATA_URL = "https://discodata.eea.europa.eu/sql"
QUALITY_QUERY = (
    "SELECT bathingWaterIdentifier, quality "
    "FROM [WISE_BWD].[latest].[assessment_BathingWaterStatus] "
    "WHERE season=2024"
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
PAGE_SIZE = 2000  # ArcGIS max per request


def _download_arcgis_data():
    """Download all bathing water sites from the ArcGIS endpoint with pagination."""
    os.makedirs(DATA_DIR, exist_ok=True)
    cache_path = os.path.join(DATA_DIR, "eea_bathing_water.json")

    if os.path.exists(cache_path):
        print("  Using cached EEA ArcGIS data")
        with open(cache_path, "r", encoding="utf-8") as f:
            return json.load(f)

    print("  Downloading EEA bathing water sites from ArcGIS...")
    all_features = []
    offset = 0

    while True:
        params = {
            "where": "countryCode <> 'EU'",
            "outFields": (
                "bathingWaterName,latitude,longitude,countryCode,"
                "bwWaterCategory,qualityStatus,bathingWaterIdentifier"
            ),
            "returnGeometry": "false",
            "resultRecordCount": PAGE_SIZE,
            "resultOffset": offset,
            "f": "json",
        }
        try:
            resp = requests.get(ARCGIS_BASE, params=params, timeout=120)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            print(f"  ArcGIS request failed at offset {offset}: {e}")
            break

        features = data.get("features", [])
        if not features:
            break

        all_features.extend(features)
        print(f"  Fetched {len(all_features)} sites so far...")

        # Check if there are more
        if len(features) < PAGE_SIZE:
            break
        offset += PAGE_SIZE

    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(all_features, f)

    print(f"  Total: {len(all_features)} bathing water sites")
    return all_features


def _download_quality_2024():
    """Download 2024 quality ratings from DiscoData."""
    cache_path = os.path.join(DATA_DIR, "eea_quality_2024.json")

    if os.path.exists(cache_path):
        with open(cache_path, "r", encoding="utf-8") as f:
            return json.load(f)

    print("  Downloading 2024 quality ratings from DiscoData...")
    try:
        resp = requests.get(
            DISCODATA_URL,
            params={"query": QUALITY_QUERY, "p": 1, "nrOfHits": 30000},
            timeout=120,
        )
        resp.raise_for_status()
        data = resp.json()

        # Build lookup dict
        lookup = {}
        results = data.get("results", [])
        for row in results:
            bwid = row.get("bathingWaterIdentifier", "")
            quality = row.get("quality", "")
            if bwid:
                lookup[bwid] = quality

        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(lookup, f)

        print(f"  Got 2024 quality for {len(lookup)} sites")
        return lookup
    except Exception as e:
        print(f"  DiscoData quality fetch failed: {e}")
        return {}


def _map_water_body_type(bw_type):
    """Map EU bathing water type to our schema."""
    if not bw_type:
        return "ocean"
    bw_type = str(bw_type).lower()
    if bw_type in ("l", "lake", "inland"):
        return "lake"
    if "river" in bw_type or "transitional" in bw_type:
        return "river"
    if bw_type in ("c", "coastal"):
        return "ocean"
    return "ocean"


def _map_quality_rating(rating):
    """Normalize EU quality rating."""
    if not rating:
        return None
    rating = str(rating).lower().strip()
    mapping = {
        "excellent": "excellent",
        "good": "good",
        "sufficient": "sufficient",
        "poor": "poor",
        "not classified": None,
        "1": "excellent",
        "2": "good",
        "3": "sufficient",
        "4": "poor",
    }
    return mapping.get(rating, rating)


def ingest(conn):
    """Run the EU Bathing Water ingest pipeline."""
    print("=== EU Bathing Water Ingest ===")

    features = _download_arcgis_data()
    quality_2024 = _download_quality_2024()

    if not features:
        print("  No features from ArcGIS — skipping EU Bathing Water")
        return 0

    total_inserted = 0

    for feat in tqdm(features, desc="EU Bathing Water"):
        attrs = feat.get("attributes", feat)

        name = attrs.get("bathingWaterName")
        lat = attrs.get("latitude")
        lng = attrs.get("longitude")
        country = attrs.get("countryCode")
        bw_type = attrs.get("bwWaterCategory")
        quality_2022 = attrs.get("qualityStatus")
        bw_id = attrs.get("bathingWaterIdentifier", "")

        if not lat or not lng:
            continue

        try:
            lat = float(lat)
            lng = float(lng)
        except (ValueError, TypeError):
            continue

        # Prefer 2024 quality if available, fall back to 2022
        quality = quality_2024.get(bw_id, quality_2022)

        geojson = json.dumps({
            "type": "Point",
            "coordinates": [lng, lat]
        })

        slug = slugify(name) if name else f"eu-beach-{lat:.4f}-{lng:.4f}"
        base_slug = slug
        counter = 1
        while True:
            existing = conn.execute(
                "SELECT 1 FROM beaches WHERE slug = ?", (slug,)
            ).fetchone()
            if not existing:
                break
            slug = f"{base_slug}-{counter}"
            counter += 1

        beach_id = str(uuid.uuid4())
        source_id = str(uuid.uuid4())

        conn.execute(
            """INSERT INTO beaches
               (id, name, slug, geometry_geojson, centroid_lat, centroid_lng,
                country_code, water_body_type, substrate_type, source_layer)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'unknown', 1)""",
            (
                beach_id, name, slug, geojson, lat, lng,
                country,
                _map_water_body_type(bw_type),
            ),
        )

        conn.execute(
            """INSERT INTO beach_sources
               (id, beach_id, source_name, source_id, source_url, raw_data)
               VALUES (?, ?, 'eu_bathing', ?, ?, ?)""",
            (
                source_id, beach_id, str(bw_id),
                f"https://discomap.eea.europa.eu/Bathingwater/",
                json.dumps(attrs, default=str),
            ),
        )

        # Add water quality attribute
        quality_normalized = _map_quality_rating(quality)
        if quality_normalized:
            conn.execute(
                """INSERT INTO beach_attributes
                   (id, beach_id, category, key, value, value_type, source_id)
                   VALUES (?, ?, 'environment', 'water_quality_rating', ?, 'string', ?)""",
                (str(uuid.uuid4()), beach_id, quality_normalized, source_id),
            )

        # Tag bathing water type
        if bw_type:
            conn.execute(
                """INSERT INTO beach_attributes
                   (id, beach_id, category, key, value, value_type, source_id)
                   VALUES (?, ?, 'environment', 'eu_bathing_water_type', ?, 'string', ?)""",
                (str(uuid.uuid4()), beach_id, str(bw_type), source_id),
            )

        total_inserted += 1
        if total_inserted % 5000 == 0:
            conn.commit()

    conn.commit()
    print(f"EU Bathing Water ingest complete: {total_inserted} beaches inserted")
    return total_inserted
