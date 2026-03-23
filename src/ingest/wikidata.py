"""Ingest beach data from Wikidata via SPARQL.

Queries for instances of Q40080 (beach) with coordinates.
Adds Wikipedia links, images, and multilingual names.
"""

import json
import os
import uuid
import requests
from slugify import slugify
from tqdm import tqdm

WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql"
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")

SPARQL_QUERY = """
SELECT ?beach ?beachLabel ?coord ?image ?article ?countryLabel WHERE {
  ?beach wdt:P31 wd:Q40080.
  ?beach wdt:P625 ?coord.
  OPTIONAL { ?beach wdt:P18 ?image. }
  OPTIONAL { ?beach wdt:P17 ?country. }
  OPTIONAL {
    ?article schema:about ?beach;
             schema:isPartOf <https://en.wikipedia.org/>.
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr,es,de,pt,it,ja,zh". }
}
"""


def _download_wikidata():
    """Download beach data from Wikidata SPARQL endpoint."""
    os.makedirs(DATA_DIR, exist_ok=True)
    cache_path = os.path.join(DATA_DIR, "wikidata_beaches.json")

    if os.path.exists(cache_path):
        print("  Using cached Wikidata data")
        with open(cache_path, "r", encoding="utf-8") as f:
            return json.load(f)

    print("  Querying Wikidata SPARQL (may take a few minutes)...")
    resp = requests.get(
        WIKIDATA_SPARQL_URL,
        params={"query": SPARQL_QUERY, "format": "json"},
        headers={"User-Agent": "WorldBeachTour/1.0 (beach-database-project)"},
        timeout=300,
    )
    resp.raise_for_status()
    data = resp.json()

    results = data.get("results", {}).get("bindings", [])
    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(results, f)

    print(f"  Got {len(results)} beaches from Wikidata")
    return results


def _parse_coord(coord_str):
    """Parse WKT Point coordinate string from Wikidata."""
    # Format: "Point(lng lat)"
    if not coord_str:
        return None, None
    coord_str = coord_str.replace("Point(", "").replace(")", "")
    parts = coord_str.strip().split()
    if len(parts) == 2:
        try:
            lng = float(parts[0])
            lat = float(parts[1])
            return lat, lng
        except ValueError:
            return None, None
    return None, None


def _extract_qid(uri):
    """Extract Q-id from Wikidata URI."""
    if uri and "/" in uri:
        return uri.split("/")[-1]
    return uri


def ingest(conn):
    """Run the Wikidata ingest pipeline."""
    print("=== Wikidata Beach Ingest ===")

    results = _download_wikidata()

    if not results:
        print("  No Wikidata results")
        return 0

    total_inserted = 0
    seen_qids = set()

    for row in tqdm(results, desc="Wikidata"):
        beach_uri = row.get("beach", {}).get("value", "")
        qid = _extract_qid(beach_uri)

        # Skip duplicates (SPARQL can return multiple rows per entity)
        if qid in seen_qids:
            continue
        seen_qids.add(qid)

        name = row.get("beachLabel", {}).get("value")
        coord_str = row.get("coord", {}).get("value", "")
        image_url = row.get("image", {}).get("value")
        article_url = row.get("article", {}).get("value")
        country = row.get("countryLabel", {}).get("value")

        lat, lng = _parse_coord(coord_str)
        if lat is None or lng is None:
            continue

        # Skip if name is just the Q-id (no label found)
        if name and name.startswith("Q") and name[1:].isdigit():
            name = None

        geojson = json.dumps({
            "type": "Point",
            "coordinates": [lng, lat]
        })

        slug = slugify(name) if name else f"wd-beach-{lat:.4f}-{lng:.4f}"
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

        raw = {
            "qid": qid,
            "image": image_url,
            "wikipedia": article_url,
            "country": country,
        }

        conn.execute(
            """INSERT INTO beach_sources
               (id, beach_id, source_name, source_id, source_url, raw_data)
               VALUES (?, ?, 'wikidata', ?, ?, ?)""",
            (
                source_id, beach_id, qid,
                f"https://www.wikidata.org/wiki/{qid}",
                json.dumps(raw),
            ),
        )

        # Add image attribute
        if image_url:
            conn.execute(
                """INSERT INTO beach_attributes
                   (id, beach_id, category, key, value, value_type, source_id)
                   VALUES (?, ?, 'social', 'image_url', ?, 'string', ?)""",
                (str(uuid.uuid4()), beach_id, image_url, source_id),
            )

        # Add Wikipedia link
        if article_url:
            conn.execute(
                """INSERT INTO beach_attributes
                   (id, beach_id, category, key, value, value_type, source_id)
                   VALUES (?, ?, 'social', 'wikipedia_url', ?, 'string', ?)""",
                (str(uuid.uuid4()), beach_id, article_url, source_id),
            )

        total_inserted += 1
        if total_inserted % 5000 == 0:
            conn.commit()

    conn.commit()
    print(f"Wikidata ingest complete: {total_inserted} beaches inserted")
    return total_inserted
