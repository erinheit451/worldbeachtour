"""
Enrich beaches with species observation data from iNaturalist.

Queries the iNaturalist API v1 for species observations within 2km
of each beach and stores results in the beach_species table.
"""

import json
import sqlite3
import time
from datetime import datetime, timezone

import requests
from tqdm import tqdm

INAT_URL = "https://api.inaturalist.org/v1/observations/species_counts"
USER_AGENT = "WorldBeachTour/1.0 (beach-enrichment)"
RADIUS_KM = 2
PER_PAGE = 20


def _fetch_species(lat, lng):
    """Fetch top species near a coordinate from iNaturalist."""
    params = {
        "lat": lat,
        "lng": lng,
        "radius": RADIUS_KM,
        "quality_grade": "research",
        "per_page": PER_PAGE,
    }
    headers = {"User-Agent": USER_AGENT}
    try:
        resp = requests.get(INAT_URL, params=params, headers=headers, timeout=30)
        if resp.status_code == 429:
            time.sleep(60)
            resp = requests.get(INAT_URL, params=params, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return data.get("results", [])
    except Exception as e:
        return []


def _map_taxon_group(iconic_name):
    """Map iNaturalist iconic_taxon_name to our categories."""
    mapping = {
        "Aves": "bird",
        "Mammalia": "mammal",
        "Reptilia": "reptile",
        "Amphibia": "amphibian",
        "Actinopterygii": "fish",
        "Mollusca": "invertebrate",
        "Arachnida": "invertebrate",
        "Insecta": "invertebrate",
        "Animalia": "invertebrate",
        "Plantae": "plant",
        "Fungi": "fungi",
        "Chromista": "other",
    }
    return mapping.get(iconic_name, "other")


def _iucn_status(conservation_status):
    """Extract IUCN status code."""
    if not conservation_status:
        return None
    status = conservation_status.get("status")
    # Map iNaturalist status codes to IUCN abbreviations
    mapping = {"LC": "LC", "NT": "NT", "VU": "VU", "EN": "EN", "CR": "CR"}
    return mapping.get(status)


def enrich_species(conn, limit=500) -> int:
    """Fetch species data for top beaches by notability. Returns count updated."""
    rows = conn.execute("""
        SELECT id, slug, centroid_lat, centroid_lng FROM beaches
        WHERE species_observed_count IS NULL
        ORDER BY notability_score DESC
        LIMIT ?
    """, (limit,)).fetchall()

    if not rows:
        print("No beaches need species enrichment")
        return 0

    print(f"Fetching species for {len(rows)} beaches...")
    count = 0

    for row in tqdm(rows, desc="iNaturalist species"):
        beach_id = row["id"]
        results = _fetch_species(row["centroid_lat"], row["centroid_lng"])

        # Insert species records
        notable = []
        for r in results:
            taxon = r.get("taxon", {})
            species_name = taxon.get("name", "Unknown")
            common_name = taxon.get("preferred_common_name")
            taxon_group = _map_taxon_group(taxon.get("iconic_taxon_name", ""))
            obs_count = r.get("count", 0)
            iucn = _iucn_status(taxon.get("conservation_status"))

            conn.execute("""
                INSERT OR IGNORE INTO beach_species
                (beach_id, species_name, common_name, taxon_group, observation_count, source, iucn_status, fetched_at)
                VALUES (?, ?, ?, ?, ?, 'inaturalist', ?, ?)
            """, (beach_id, species_name, common_name, taxon_group, obs_count, iucn, datetime.now(timezone.utc).isoformat()))

            # Track notable species (animals with common names, not plants/fungi/insects)
            if common_name and taxon_group in ("bird", "mammal", "reptile", "fish"):
                notable.append(common_name)

        # Update beach summary
        species_count = len(results)
        notable_json = json.dumps(notable[:10]) if notable else None

        conn.execute("""
            UPDATE beaches SET
                species_observed_count = ?,
                notable_species = ?,
                ecology_sources = '["inaturalist"]',
                updated_at = datetime('now')
            WHERE id = ?
        """, (species_count, notable_json, beach_id))

        count += 1
        if count % 100 == 0:
            conn.commit()

        time.sleep(1)  # Respect rate limits (60 req/min for unauthenticated)

    conn.commit()
    print(f"Species: enriched {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 500
    conn = sqlite3.connect(db_path, timeout=30)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=30000")
    enrich_species(conn, limit=limit)
    conn.close()
