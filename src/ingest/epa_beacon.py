"""Ingest beach data from EPA BEACON.

EPA's Beach Advisory and Closing Online Notification system.
~6,000 US coastal and Great Lakes beaches with water quality monitoring.
"""

import json
import os
import uuid
import requests
from slugify import slugify
from tqdm import tqdm

# EPA BEACON API endpoints
BEACON_STATES_URL = "https://beacon.epa.gov/ords/beacon2/beacon_rest/v1/states"
BEACON_BEACHES_URL = "https://beacon.epa.gov/ords/beacon2/beacon_rest/v1/beaches"

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")


def _download_beacon_data():
    """Download EPA BEACON beach data."""
    os.makedirs(DATA_DIR, exist_ok=True)
    cache_path = os.path.join(DATA_DIR, "epa_beacon.json")

    if os.path.exists(cache_path):
        print("  Using cached EPA BEACON data")
        with open(cache_path, "r", encoding="utf-8") as f:
            return json.load(f)

    print("  Downloading EPA BEACON data...")
    all_beaches = []

    # Try the REST API first
    try:
        # Get list of states/territories
        resp = requests.get(BEACON_STATES_URL, timeout=60)
        resp.raise_for_status()
        states_data = resp.json()
        states = [s.get("stateCode", s.get("state_code", ""))
                  for s in states_data.get("items", states_data.get("results", []))]
    except Exception as e:
        print(f"  Could not get state list: {e}")
        # Fallback: known US coastal state codes
        states = [
            "AL", "AK", "AS", "CA", "CT", "DE", "FL", "GA", "GU", "HI",
            "IL", "IN", "LA", "MA", "MD", "ME", "MI", "MN", "MP", "MS",
            "NC", "NH", "NJ", "NY", "OH", "OR", "PA", "PR", "RI", "SC",
            "TX", "VA", "VI", "WA", "WI",
        ]

    for state in tqdm(states, desc="EPA states"):
        if not state:
            continue
        try:
            resp = requests.get(
                BEACON_BEACHES_URL,
                params={"stateCode": state},
                timeout=60,
            )
            if resp.status_code == 200:
                data = resp.json()
                beaches = data.get("items", data.get("results", []))
                if isinstance(beaches, list):
                    all_beaches.extend(beaches)
        except Exception as e:
            print(f"  Error fetching {state}: {e}")
            continue

    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(all_beaches, f)

    print(f"  Downloaded {len(all_beaches)} beaches from EPA BEACON")
    return all_beaches


def ingest(conn):
    """Run the EPA BEACON ingest pipeline."""
    print("=== EPA BEACON Ingest ===")

    beaches = _download_beacon_data()

    if not beaches:
        print("  No EPA BEACON data available — API may require different access method")
        print("  Skipping EPA BEACON ingest")
        return 0

    total_inserted = 0

    for row in tqdm(beaches, desc="EPA BEACON"):
        if isinstance(row, dict):
            # Try multiple possible field name formats
            name = (row.get("beachName") or row.get("beach_name") or
                    row.get("BEACH_NAME") or row.get("name"))
            lat = (row.get("latitude") or row.get("LATITUDE") or
                   row.get("beachLatitude"))
            lng = (row.get("longitude") or row.get("LONGITUDE") or
                   row.get("beachLongitude"))
            state = (row.get("stateCode") or row.get("state_code") or
                     row.get("STATE_CODE"))
            beach_id_src = (row.get("beachId") or row.get("beach_id") or
                           row.get("BEACH_ID") or "")
        else:
            continue

        if not lat or not lng:
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

        slug = slugify(name) if name else f"epa-beach-{lat:.4f}-{lng:.4f}"
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
                country_code, admin_level_1, water_body_type, substrate_type, source_layer)
               VALUES (?, ?, ?, ?, ?, ?, 'US', ?, 'ocean', 'unknown', 1)""",
            (beach_id, name, slug, geojson, lat, lng, state),
        )

        conn.execute(
            """INSERT INTO beach_sources
               (id, beach_id, source_name, source_id, source_url, raw_data)
               VALUES (?, ?, 'epa_beacon', ?, ?, ?)""",
            (
                source_id, beach_id, str(beach_id_src),
                "https://beacon.epa.gov",
                json.dumps(row, default=str),
            ),
        )

        total_inserted += 1
        if total_inserted % 2000 == 0:
            conn.commit()

    conn.commit()
    print(f"EPA BEACON ingest complete: {total_inserted} beaches inserted")
    return total_inserted
