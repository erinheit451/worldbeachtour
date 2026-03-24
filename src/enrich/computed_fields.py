"""
Phase 2: Locally-computed enrichment fields.

No external API calls — uses downloaded datasets + computation:
- Nearest city (reverse_geocoder library)
- Nearest airport (OurAirports CSV + KD-tree)
- Substrate type heuristic (name regex)
"""

import csv
import math
import re
from pathlib import Path

import reverse_geocoder as rg
from tqdm import tqdm

DATA_DIR = Path(__file__).parent.parent.parent / "data"


# Haversine distance in km
def _haversine_km(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


def enrich_nearest_city(conn) -> int:
    """Populate nearest_city and nearest_city_distance_km using reverse_geocoder."""
    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches WHERE nearest_city IS NULL"
    ).fetchall()
    if not rows:
        return 0

    coords = [(r["centroid_lat"], r["centroid_lng"]) for r in rows]
    results = rg.search(coords)

    count = 0
    for row, result in zip(rows, results):
        city = result.get("name", "")
        if not city:
            continue
        city_lat = float(result["lat"])
        city_lng = float(result["lon"])
        dist = _haversine_km(row["centroid_lat"], row["centroid_lng"], city_lat, city_lng)
        conn.execute(
            """UPDATE beaches SET nearest_city = ?, nearest_city_distance_km = ?,
               updated_at = datetime('now') WHERE id = ?""",
            (city, round(dist, 1), row["id"]),
        )
        count += 1
        if count % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"Nearest city: enriched {count} beaches")
    return count


def _load_airports():
    """Load airports from OurAirports CSV. Returns list of (iata, name, lat, lng)."""
    airports_path = DATA_DIR / "airports.csv"
    if not airports_path.exists():
        print(f"  airports.csv not found at {airports_path}")
        print("  Download from: https://ourairports.com/data/airports.csv")
        return []

    airports = []
    with open(airports_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            iata = row.get("iata_code", "").strip()
            if not iata or iata == "0" or len(iata) != 3:
                continue
            if row.get("type") not in ("large_airport", "medium_airport"):
                continue
            try:
                lat = float(row["latitude_deg"])
                lng = float(row["longitude_deg"])
            except (ValueError, KeyError):
                continue
            airports.append((iata, row.get("name", ""), lat, lng))
    return airports


def enrich_nearest_airport(conn) -> int:
    """Populate nearest_airport_iata/name/distance using OurAirports + KD-tree."""
    from scipy.spatial import KDTree
    import numpy as np

    airports = _load_airports()
    if not airports:
        return 0

    # Build KD-tree (in radians for haversine-approximate search)
    airport_coords = np.array([(math.radians(a[2]), math.radians(a[3])) for a in airports])
    tree = KDTree(airport_coords)

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches WHERE nearest_airport_iata IS NULL"
    ).fetchall()
    if not rows:
        return 0

    count = 0
    for row in tqdm(rows, desc="Finding nearest airports"):
        query = [math.radians(row["centroid_lat"]), math.radians(row["centroid_lng"])]
        dist_rad, idx = tree.query(query)
        airport = airports[idx]
        dist_km = _haversine_km(row["centroid_lat"], row["centroid_lng"], airport[2], airport[3])
        conn.execute(
            """UPDATE beaches SET nearest_airport_iata = ?, nearest_airport_name = ?,
               nearest_airport_distance_km = ?, updated_at = datetime('now') WHERE id = ?""",
            (airport[0], airport[1], round(dist_km, 1), row["id"]),
        )
        count += 1
        if count % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"Nearest airport: enriched {count} beaches")
    return count


# Substrate heuristic patterns
_SUBSTRATE_PATTERNS = [
    (re.compile(r"\bsand[ys]?\b", re.IGNORECASE), "sand"),
    (re.compile(r"\brock[ys]?\b", re.IGNORECASE), "rock"),
    (re.compile(r"\bpebble[sy]?\b", re.IGNORECASE), "pebble"),
    (re.compile(r"\bgravel\b", re.IGNORECASE), "gravel"),
    (re.compile(r"\bshingle\b", re.IGNORECASE), "pebble"),
    (re.compile(r"\bcobble\b", re.IGNORECASE), "pebble"),
    (re.compile(r"\bstony\b", re.IGNORECASE), "rock"),
    (re.compile(r"\bblack sand\b", re.IGNORECASE), "sand"),
    (re.compile(r"\bwhite sand\b", re.IGNORECASE), "sand"),
]


def substrate_from_name(name: str) -> str | None:
    """Infer substrate type from beach name. Returns type or None."""
    if not name:
        return None
    for pattern, substrate in _SUBSTRATE_PATTERNS:
        if pattern.search(name):
            return substrate
    return None


def enrich_substrate_heuristic(conn) -> int:
    """Upgrade substrate_type from 'unknown' based on beach name patterns."""
    rows = conn.execute(
        "SELECT id, name FROM beaches WHERE substrate_type = 'unknown' AND name IS NOT NULL"
    ).fetchall()
    count = 0
    for row in rows:
        substrate = substrate_from_name(row["name"])
        if substrate:
            conn.execute(
                "UPDATE beaches SET substrate_type = ?, updated_at = datetime('now') WHERE id = ?",
                (substrate, row["id"]),
            )
            count += 1
    conn.commit()
    print(f"Substrate heuristic: upgraded {count} beaches")
    return count


def run_phase2(conn):
    """Run all Phase 2 computed field enrichments."""
    conn.execute(
        """INSERT INTO enrichment_log (script_name, phase, status, started_at)
           VALUES ('computed_fields', 'phase_2', 'running', datetime('now'))"""
    )
    conn.commit()

    total = 0
    total += enrich_nearest_city(conn)
    total += enrich_nearest_airport(conn)
    total += enrich_substrate_heuristic(conn)

    conn.execute(
        """UPDATE enrichment_log SET status='completed', completed_at=datetime('now'),
           total_processed=?
           WHERE script_name='computed_fields' AND status='running'""",
        (total,),
    )
    conn.commit()
    print(f"Phase 2 complete: {total} total enrichments")


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    run_phase2(conn)
    conn.close()
