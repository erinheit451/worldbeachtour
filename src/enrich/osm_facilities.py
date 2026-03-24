"""
OSM Overpass deep tag extraction — find facilities near each beach.

Uses regional bounding box queries (not per-beach) for efficiency.
~500 Overpass queries instead of 228K.
"""

import math
import sqlite3
import time
from collections import defaultdict

import requests
from tqdm import tqdm

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
MATCH_RADIUS_M = 500  # Match amenities within 500m of beach
GRID_SIZE = 5.0  # 5° bounding boxes
USER_AGENT = "WorldBeachTour/1.0 (beach-enrichment)"


def _haversine_m(lat1, lng1, lat2, lng2):
    R = 6371000
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(a))


def _compute_bboxes(conn):
    """Compute 5°×5° bounding boxes that contain beaches.

    Uses FLOOR-equivalent math so negative coordinates bin correctly:
    e.g. -157.826 → floor(-157.826/5)*5 = -32*5 = -160, not CAST which
    truncates toward zero and gives -31*5 = -155.
    """
    rows = conn.execute(
        "SELECT DISTINCT "
        "  (CAST(centroid_lat / 5 AS INTEGER) - CASE WHEN centroid_lat < 0 AND centroid_lat != CAST(centroid_lat / 5 AS INTEGER) * 5 THEN 1 ELSE 0 END) * 5 as lat_bin, "
        "  (CAST(centroid_lng / 5 AS INTEGER) - CASE WHEN centroid_lng < 0 AND centroid_lng != CAST(centroid_lng / 5 AS INTEGER) * 5 THEN 1 ELSE 0 END) * 5 as lng_bin "
        "FROM beaches"
    ).fetchall()
    bboxes = []
    for row in rows:
        south = row[0]
        west = row[1]
        bboxes.append((south, west, south + GRID_SIZE, west + GRID_SIZE))
    return bboxes


def _query_overpass(south, west, north, east):
    """Query Overpass for amenities in a bounding box."""
    bbox = f"{south},{west},{north},{east}"
    query = f"""
    [out:json][timeout:120];
    (
      node["amenity"="toilets"]({bbox});
      node["amenity"="shower"]({bbox});
      node["amenity"="parking"]({bbox});
      node["amenity"="restaurant"]({bbox});
      node["amenity"="cafe"]({bbox});
      node["emergency"="lifeguard"]({bbox});
      node["amenity"="drinking_water"]({bbox});
    );
    out center;
    """
    headers = {"User-Agent": USER_AGENT}
    try:
        resp = requests.post(OVERPASS_URL, data={"data": query}, headers=headers, timeout=180)
        if resp.status_code == 429:
            print("  Rate limited — waiting 60s")
            time.sleep(60)
            resp = requests.post(OVERPASS_URL, data={"data": query}, headers=headers, timeout=180)
        resp.raise_for_status()
        data = resp.json()
        return data.get("elements", [])
    except Exception as e:
        print(f"  Overpass error for bbox {bbox}: {e}")
        return []


def _classify_amenity(tags):
    """Classify an OSM amenity into our facility categories."""
    amenity = tags.get("amenity", "")
    emergency = tags.get("emergency", "")
    results = {}
    if amenity == "toilets":
        results["has_restrooms"] = 1
    elif amenity == "shower":
        results["has_showers"] = 1
    elif amenity == "parking":
        results["has_parking"] = 1
    elif amenity in ("restaurant", "cafe"):
        results["has_food_nearby"] = 1
    elif amenity == "drinking_water":
        pass  # No column for this yet
    if emergency == "lifeguard":
        results["lifeguard"] = 1
    return results


def enrich_osm_facilities(conn, max_bboxes=None) -> int:
    """Query Overpass for amenities near beaches. Returns beaches updated."""
    bboxes = _compute_bboxes(conn)
    print(f"Computed {len(bboxes)} bounding boxes")

    if max_bboxes:
        bboxes = bboxes[:max_bboxes]
        print(f"  Limited to {max_bboxes}")

    # Load all beaches into a spatial grid for fast matching
    beaches = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches"
    ).fetchall()

    # Build grid (0.01° ≈ 1.1km cells) for fast proximity lookup
    FINE_GRID = 0.01
    beach_grid = defaultdict(list)
    for b in beaches:
        key = (int(b[1] / FINE_GRID), int(b[2] / FINE_GRID))
        beach_grid[key].append(b)

    # Track updates per beach
    beach_updates = defaultdict(dict)  # beach_id -> {field: value}

    total_amenities = 0
    for i, (south, west, north, east) in enumerate(tqdm(bboxes, desc="Querying Overpass")):
        elements = _query_overpass(south, west, north, east)
        total_amenities += len(elements)

        for elem in elements:
            lat = elem.get("lat")
            lng = elem.get("lon")
            if not lat or not lng:
                continue

            tags = elem.get("tags", {})
            facility = _classify_amenity(tags)
            if not facility:
                continue

            # Find beaches within 500m using grid
            grid_key = (int(lat / FINE_GRID), int(lng / FINE_GRID))
            for di in range(-5, 6):  # ~500m radius in grid cells
                for dj in range(-5, 6):
                    for beach in beach_grid.get((grid_key[0] + di, grid_key[1] + dj), []):
                        dist = _haversine_m(lat, lng, beach[1], beach[2])
                        if dist <= MATCH_RADIUS_M:
                            beach_updates[beach[0]].update(facility)

        # Respect rate limits
        time.sleep(2)

        if (i + 1) % 50 == 0:
            print(f"  Progress: {i+1}/{len(bboxes)} bboxes, {total_amenities} amenities, {len(beach_updates)} beaches matched")

    # Write updates to DB
    count = 0
    for beach_id, updates in tqdm(beach_updates.items(), desc="Writing facility updates"):
        set_parts = [f"{col} = COALESCE({col}, ?)" for col in updates.keys()]
        set_parts.append("facilities_source = COALESCE(facilities_source, 'osm_overpass')")
        set_parts.append("updated_at = datetime('now')")
        values = list(updates.values()) + [beach_id]
        conn.execute(
            f"UPDATE beaches SET {', '.join(set_parts)} WHERE id = ?",
            values,
        )
        count += 1
        if count % 5000 == 0:
            conn.commit()

    conn.commit()
    print(f"OSM facilities: {total_amenities} amenities found, {count} beaches updated")
    return count


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    max_bboxes = int(sys.argv[2]) if len(sys.argv) > 2 else None
    conn = get_connection(db_path)
    migrate(conn)
    enrich_osm_facilities(conn, max_bboxes=max_bboxes)
    conn.close()
