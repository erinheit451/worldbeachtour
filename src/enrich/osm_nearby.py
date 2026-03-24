"""
OSM Overpass per-beach facility enrichment — targeted amenity discovery.

Queries Overpass for amenities within 500m of each notable beach directly,
using the `around` filter which is spatially indexed and fast (~0.5s/query).
"""

import argparse
import sqlite3
import time

import requests
from tqdm import tqdm

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
USER_AGENT = "WorldBeachTour/1.0 (beach-enrichment)"
DEFAULT_RADIUS = 500  # metres
RATE_LIMIT_S = 1.0   # seconds between requests


def _query_nearby(lat: float, lng: float, radius: int = DEFAULT_RADIUS) -> list[dict]:
    """Query Overpass for amenities within `radius` metres of (lat, lng).

    Returns a list of Overpass elements (each is a dict with a 'tags' key).
    """
    query = f"""
[out:json][timeout:30];
(
  node["amenity"](around:{radius},{lat},{lng});
  node["emergency"](around:{radius},{lat},{lng});
  node["leisure"="pitch"](around:{radius},{lat},{lng});
  node["tourism"](around:{radius},{lat},{lng});
);
out tags;
"""
    headers = {"User-Agent": USER_AGENT}
    try:
        resp = requests.post(
            OVERPASS_URL,
            data={"data": query},
            headers=headers,
            timeout=60,
        )
        if resp.status_code == 429:
            print("  Rate limited — waiting 60s")
            time.sleep(60)
            resp = requests.post(
                OVERPASS_URL,
                data={"data": query},
                headers=headers,
                timeout=60,
            )
        resp.raise_for_status()
        return resp.json().get("elements", [])
    except Exception as e:
        print(f"  Overpass error at ({lat},{lng}): {e}")
        return []


def _classify_nearby(elements: list[dict]) -> dict:
    """Classify Overpass elements into our facility columns.

    Returns a dict of {column: value} updates, or {} if nothing matched.
    Only columns with a positive signal are included.
    """
    updates: dict = {}
    food_count = 0

    for elem in elements:
        tags = elem.get("tags", {})
        amenity = tags.get("amenity", "")
        emergency = tags.get("emergency", "")
        tourism = tags.get("tourism", "")

        if amenity == "toilets":
            updates["has_restrooms"] = 1
        if amenity == "shower":
            updates["has_showers"] = 1
        if amenity == "parking":
            updates["has_parking"] = 1
        if amenity in ("restaurant", "cafe"):
            updates["has_food_nearby"] = 1
            food_count += 1
        if amenity == "drinking_water":
            pass  # signal only — no column yet
        if emergency == "lifeguard":
            updates["lifeguard"] = 1
        if tourism == "camp_site":
            updates["camping_allowed"] = 1

    return updates


def enrich_nearby_facilities(conn: sqlite3.Connection, limit: int = 500) -> int:
    """Query Overpass per-beach for the top `limit` unprocessed notable beaches.

    Beaches are ordered by notability_score DESC and only those where
    facilities_source IS NULL are processed.

    Returns the number of beaches updated.
    """
    rows = conn.execute(
        """
        SELECT id, name, centroid_lat, centroid_lng
        FROM beaches
        WHERE facilities_source IS NULL
          AND centroid_lat IS NOT NULL
          AND centroid_lng IS NOT NULL
        ORDER BY notability_score DESC NULLS LAST
        LIMIT ?
        """,
        (limit,),
    ).fetchall()

    print(f"Processing {len(rows)} beaches (limit={limit})")

    updated = 0
    for i, row in enumerate(tqdm(rows, desc="Querying Overpass")):
        beach_id, name, lat, lng = row[0], row[1], row[2], row[3]

        elements = _query_nearby(lat, lng)
        updates = _classify_nearby(elements)

        # Always mark as processed so we don't retry on next run
        set_parts = ["facilities_source = ?", "updated_at = datetime('now')"]
        values: list = ["osm_nearby"]

        for col, val in updates.items():
            set_parts.append(f"{col} = COALESCE({col}, ?)")
            values.append(val)

        values.append(beach_id)
        conn.execute(
            f"UPDATE beaches SET {', '.join(set_parts)} WHERE id = ?",
            values,
        )

        if updates:
            updated += 1
            if i < 10 or (i + 1) % 50 == 0:
                amenities = ", ".join(
                    k for k, v in updates.items() if v == 1
                )
                total_elems = len(elements)
                safe_name = (name or beach_id).encode("ascii", "replace").decode("ascii")
                tqdm.write(
                    f"  [{i+1}] {safe_name} "
                    f"({lat:.3f},{lng:.3f}) - "
                    f"{total_elems} elements -> {amenities}"
                )

        if (i + 1) % 100 == 0:
            conn.commit()

        # Respect Overpass rate limit
        time.sleep(RATE_LIMIT_S)

    conn.commit()
    print(f"\nosm_nearby: {len(rows)} beaches queried, {updated} updated with facilities")
    return updated


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Enrich beach facilities via Overpass around queries")
    parser.add_argument("db_path", nargs="?", default="output/world_beaches.db")
    parser.add_argument("limit", nargs="?", type=int, default=500)
    args = parser.parse_args()

    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    conn = get_connection(args.db_path)
    migrate(conn)
    enrich_nearby_facilities(conn, limit=args.limit)
    conn.close()
