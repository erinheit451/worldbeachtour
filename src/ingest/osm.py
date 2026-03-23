"""Ingest beach data from OpenStreetMap via Overpass API.

Queries for natural=beach and leisure=beach_resort globally.
The Overpass API has rate limits, so we query by continent-level bounding boxes.
"""

import json
import time
import uuid
import requests
from slugify import slugify
from tqdm import tqdm

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# Bounding boxes by region to avoid timeout on global query
# Format: (south, west, north, east)
REGION_BOXES = {
    "europe": (35.0, -25.0, 72.0, 45.0),
    "north_america": (5.0, -170.0, 72.0, -50.0),
    "south_america": (-56.0, -82.0, 13.0, -34.0),
    "africa": (-35.0, -18.0, 38.0, 52.0),
    "asia_west": (10.0, 25.0, 55.0, 75.0),
    "asia_east": (-10.0, 75.0, 55.0, 150.0),
    "oceania": (-50.0, 110.0, 0.0, 180.0),
    "oceania_east": (-50.0, -180.0, 0.0, -120.0),
}

OVERPASS_QUERY_TEMPLATE = """
[out:json][timeout:300];
(
  nwr["natural"="beach"]({south},{west},{north},{east});
  nwr["leisure"="beach_resort"]({south},{west},{north},{east});
);
out center body;
"""


def _build_query(bbox):
    south, west, north, east = bbox
    return OVERPASS_QUERY_TEMPLATE.format(
        south=south, west=west, north=north, east=east
    )


def _extract_center(element):
    """Extract lat/lng from an OSM element (node, way, or relation)."""
    if element["type"] == "node":
        return element.get("lat"), element.get("lon")
    # Ways and relations have a 'center' field when using 'out center'
    center = element.get("center", {})
    return center.get("lat"), center.get("lon")


def _extract_geometry_geojson(element):
    """Build a GeoJSON point from the element center."""
    lat, lng = _extract_center(element)
    if lat is None or lng is None:
        return None, None, None
    geojson = json.dumps({
        "type": "Point",
        "coordinates": [lng, lat]
    })
    return geojson, lat, lng


def _map_surface(tags):
    """Map OSM surface tags to our substrate types."""
    surface = tags.get("surface", "").lower()
    natural = tags.get("natural", "").lower()

    mapping = {
        "sand": "sand",
        "fine_gravel": "gravel",
        "gravel": "gravel",
        "pebblestone": "pebble",
        "pebbles": "pebble",
        "shingle": "pebble",
        "rock": "rock",
        "rocky": "rock",
        "stones": "rock",
    }
    return mapping.get(surface, "unknown")


def _map_water_body_type(tags):
    """Infer water body type from OSM tags."""
    # If near a lake/river, OSM sometimes tags it
    for key in ["water", "waterway"]:
        val = tags.get(key, "").lower()
        if "lake" in val:
            return "lake"
        if "river" in val:
            return "river"
        if "reservoir" in val:
            return "reservoir"
    return "ocean"  # Default assumption for coastal beaches


def _extract_attributes(tags):
    """Extract structured attributes from OSM tags."""
    attrs = []

    # Facilities
    facility_mappings = {
        "toilets": ("facilities", "restrooms"),
        "shower": ("facilities", "showers"),
        "parking": ("facilities", "parking"),
        "drinking_water": ("facilities", "drinking_water"),
        "wheelchair": ("facilities", "wheelchair_access"),
        "dog": ("social", "dog_friendly"),
        "nudism": ("social", "nudist"),
        "supervised": ("safety", "lifeguard"),
        "fee": ("facilities", "fee_required"),
    }

    for tag_key, (category, attr_key) in facility_mappings.items():
        if tag_key in tags:
            val = tags[tag_key]
            if val in ("yes", "no", "true", "false"):
                attrs.append((category, attr_key, val, "boolean"))
            else:
                attrs.append((category, attr_key, val, "string"))

    # Access
    if "access" in tags:
        attrs.append(("facilities", "access", tags["access"], "string"))

    # Sport/activity tags
    if "sport" in tags:
        for sport in tags["sport"].split(";"):
            sport = sport.strip()
            if sport == "surfing":
                attrs.append(("surfing", "surfing_available", "true", "boolean"))
            elif sport == "swimming":
                attrs.append(("water_conditions", "swimming", "true", "boolean"))

    return attrs


def _make_slug(name, lat, lng):
    """Generate a URL-friendly slug."""
    if name:
        base = slugify(name)
    else:
        base = f"beach-{lat:.4f}-{lng:.4f}"
    return base


def query_region(region_name, bbox, retries=3):
    """Query Overpass API for a region, with retries."""
    query = _build_query(bbox)

    for attempt in range(retries):
        try:
            print(f"  Querying {region_name}...")
            resp = requests.post(
                OVERPASS_URL,
                data={"data": query},
                timeout=360,
            )
            if resp.status_code == 429:
                wait = 60 * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue
            if resp.status_code == 504:
                print(f"  Timeout on {region_name}, retrying...")
                time.sleep(30)
                continue
            resp.raise_for_status()
            data = resp.json()
            elements = data.get("elements", [])
            print(f"  Got {len(elements)} elements from {region_name}")
            return elements
        except requests.exceptions.Timeout:
            print(f"  Request timeout for {region_name}, attempt {attempt + 1}")
            time.sleep(30)
        except Exception as e:
            print(f"  Error querying {region_name}: {e}")
            time.sleep(15)

    print(f"  Failed to query {region_name} after {retries} attempts")
    return []


def ingest(conn):
    """Run the full OSM ingest pipeline."""
    print("=== OSM Beach Ingest ===")

    seen_osm_ids = set()
    total_inserted = 0
    total_skipped = 0

    for region_name, bbox in tqdm(REGION_BOXES.items(), desc="Regions"):
        elements = query_region(region_name, bbox)

        # Rate limit between regions
        time.sleep(10)

        for elem in elements:
            osm_id = f"{elem['type']}/{elem['id']}"

            # Skip duplicates from overlapping bboxes
            if osm_id in seen_osm_ids:
                total_skipped += 1
                continue
            seen_osm_ids.add(osm_id)

            tags = elem.get("tags", {})
            geojson, lat, lng = _extract_geometry_geojson(elem)
            if geojson is None:
                total_skipped += 1
                continue

            name = tags.get("name")
            slug = _make_slug(name, lat, lng)

            # Handle slug collisions
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
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)""",
                (
                    beach_id, name, slug, geojson, lat, lng,
                    None,  # country_code — will be enriched later
                    _map_water_body_type(tags),
                    _map_surface(tags),
                ),
            )

            conn.execute(
                """INSERT INTO beach_sources
                   (id, beach_id, source_name, source_id, source_url, raw_data)
                   VALUES (?, ?, 'osm', ?, ?, ?)""",
                (
                    source_id, beach_id, osm_id,
                    f"https://www.openstreetmap.org/{osm_id}",
                    json.dumps(tags),
                ),
            )

            # Insert attributes
            for category, key, value, value_type in _extract_attributes(tags):
                conn.execute(
                    """INSERT INTO beach_attributes
                       (id, beach_id, category, key, value, value_type, source_id)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    (str(uuid.uuid4()), beach_id, category, key, value, value_type, source_id),
                )

            total_inserted += 1

        conn.commit()

    print(f"OSM ingest complete: {total_inserted} beaches inserted, {total_skipped} skipped")
    return total_inserted
