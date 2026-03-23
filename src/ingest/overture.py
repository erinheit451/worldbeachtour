"""Ingest beach data from Overture Maps Places dataset.

Reads pre-downloaded JSON from data/overture_beaches.json
(queried from Overture's S3 parquet files via DuckDB).
"""

import json
import os
import uuid
import requests
from slugify import slugify
from tqdm import tqdm

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")


def ingest(conn):
    """Run the Overture Maps ingest pipeline."""
    print("=== Overture Maps Beach Ingest ===")

    cache_path = os.path.join(DATA_DIR, "overture_beaches.json")

    if not os.path.exists(cache_path):
        print("  No Overture data file found. Run the DuckDB query first.")
        return 0

    with open(cache_path, "r", encoding="utf-8") as f:
        beaches = json.load(f)

    print(f"  Loaded {len(beaches)} beach places from Overture Maps")

    total_inserted = 0

    for entry in tqdm(beaches, desc="Overture Maps"):
        name = entry.get("name")
        lat = entry.get("lat")
        lng = entry.get("lng")
        cc = entry.get("country_code")
        overture_id = entry.get("id", "")

        if not name or lat is None or lng is None:
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

        slug = slugify(name) if name else f"ov-{lat:.4f}-{lng:.4f}"
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
               VALUES (?, ?, ?, ?, ?, ?, ?, 'ocean', 'unknown', 1)""",
            (beach_id, name, slug, geojson, lat, lng, cc),
        )

        conn.execute(
            """INSERT INTO beach_sources
               (id, beach_id, source_name, source_id, source_url, raw_data)
               VALUES (?, ?, 'overture', ?, ?, ?)""",
            (
                source_id, beach_id, overture_id,
                "https://overturemaps.org",
                json.dumps(entry, default=str),
            ),
        )

        total_inserted += 1
        if total_inserted % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"Overture Maps ingest complete: {total_inserted} beaches inserted")
    return total_inserted
