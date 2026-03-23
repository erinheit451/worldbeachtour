"""Ingest Blue Flag certified beach data.

Blue Flag is an international certification for beaches meeting strict
environmental and quality standards. ~4,300 beaches across 50+ countries.

Uses the Blue Flag website's search/data endpoints.
"""

import json
import os
import uuid
import requests
from slugify import slugify
from tqdm import tqdm

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")

# Blue Flag search endpoint (found by inspecting their website)
BLUE_FLAG_API = "https://www.blueflag.global/wp-json/bf/v1/sites"
BLUE_FLAG_SEARCH = "https://www.blueflag.global/wp-admin/admin-ajax.php"


def _download_blue_flag():
    """Try to get Blue Flag beach data."""
    os.makedirs(DATA_DIR, exist_ok=True)
    cache_path = os.path.join(DATA_DIR, "blue_flag_beaches.json")

    if os.path.exists(cache_path):
        print("  Using cached Blue Flag data")
        with open(cache_path, "r", encoding="utf-8") as f:
            return json.load(f)

    print("  Attempting to download Blue Flag data...")
    all_beaches = []

    # Try their API endpoint
    try:
        resp = requests.get(
            BLUE_FLAG_API,
            params={"type": "beach", "per_page": 5000},
            timeout=60,
            headers={"User-Agent": "WorldBeachTour/1.0"}
        )
        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, list) and data:
                all_beaches = data
                print(f"  Got {len(data)} from API")
    except Exception as e:
        print(f"  API attempt failed: {e}")

    # Try the AJAX search
    if not all_beaches:
        try:
            resp = requests.post(
                BLUE_FLAG_SEARCH,
                data={
                    "action": "bf_search",
                    "type": "beach",
                    "limit": 5000,
                },
                timeout=60,
                headers={"User-Agent": "WorldBeachTour/1.0"}
            )
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, dict) and "data" in data:
                    all_beaches = data["data"]
                elif isinstance(data, list):
                    all_beaches = data
                print(f"  Got {len(all_beaches)} from AJAX")
        except Exception as e:
            print(f"  AJAX attempt failed: {e}")

    # Try scraping the main list pages
    if not all_beaches:
        print("  Blue Flag API not accessible — trying Wikidata fallback")
        all_beaches = _blue_flag_from_wikidata()

    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(all_beaches, f)

    return all_beaches


def _blue_flag_from_wikidata():
    """Get Blue Flag beaches from Wikidata as fallback."""
    query = """
    SELECT ?beach ?beachLabel ?coord ?countryLabel WHERE {
      ?beach wdt:P1399 wd:Q727858.
      ?beach wdt:P625 ?coord.
      OPTIONAL { ?beach wdt:P17 ?country. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    """
    try:
        resp = requests.get(
            "https://query.wikidata.org/sparql",
            params={"query": query, "format": "json"},
            headers={"User-Agent": "WorldBeachTour/1.0"},
            timeout=120,
        )
        if resp.status_code == 200:
            results = resp.json().get("results", {}).get("bindings", [])
            beaches = []
            for r in results:
                coord = r.get("coord", {}).get("value", "")
                lat, lng = None, None
                if "Point(" in coord:
                    parts = coord.replace("Point(", "").replace(")", "").split()
                    if len(parts) == 2:
                        lng, lat = float(parts[0]), float(parts[1])

                beaches.append({
                    "name": r.get("beachLabel", {}).get("value"),
                    "lat": lat,
                    "lng": lng,
                    "country": r.get("countryLabel", {}).get("value"),
                    "qid": r.get("beach", {}).get("value", "").split("/")[-1],
                    "blue_flag": True,
                })
            print(f"  Got {len(beaches)} Blue Flag beaches from Wikidata")
            return beaches
    except Exception as e:
        print(f"  Wikidata fallback failed: {e}")

    return []


def ingest(conn):
    """Run the Blue Flag ingest pipeline."""
    print("=== Blue Flag Beach Ingest ===")

    beaches = _download_blue_flag()

    if not beaches:
        print("  No Blue Flag data available")
        return 0

    total_inserted = 0

    for entry in tqdm(beaches, desc="Blue Flag"):
        name = entry.get("name") or entry.get("title")
        lat = entry.get("lat") or entry.get("latitude")
        lng = entry.get("lng") or entry.get("longitude") or entry.get("lon")

        if not name or not lat or not lng:
            continue

        try:
            lat = float(lat)
            lng = float(lng)
        except (ValueError, TypeError):
            continue

        geojson = json.dumps({
            "type": "Point",
            "coordinates": [lng, lat]
        })

        slug = slugify(name)
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
                water_body_type, substrate_type, source_layer)
               VALUES (?, ?, ?, ?, ?, ?, 'ocean', 'unknown', 1)""",
            (beach_id, name, slug, geojson, lat, lng),
        )

        conn.execute(
            """INSERT INTO beach_sources
               (id, beach_id, source_name, source_id, source_url, raw_data)
               VALUES (?, ?, 'blue_flag', ?, ?, ?)""",
            (
                source_id, beach_id,
                entry.get("qid", slug),
                "https://www.blueflag.global",
                json.dumps(entry, default=str),
            ),
        )

        # Add Blue Flag certification attribute
        conn.execute(
            """INSERT INTO beach_attributes
               (id, beach_id, category, key, value, value_type, source_id)
               VALUES (?, ?, 'environment', 'blue_flag_certified', 'true', 'boolean', ?)""",
            (str(uuid.uuid4()), beach_id, source_id),
        )

        total_inserted += 1
        if total_inserted % 2000 == 0:
            conn.commit()

    conn.commit()
    print(f"Blue Flag ingest complete: {total_inserted} beaches inserted")
    return total_inserted
