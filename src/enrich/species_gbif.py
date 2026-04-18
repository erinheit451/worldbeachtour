"""
Enrich beaches with species data from GBIF (includes eBird, iNaturalist, museum records).

Uses the GBIF occurrence API to find species observations near each beach.
No API key required. Complements iNaturalist data with eBird and museum records.
"""

import json
import sqlite3
import time
from collections import Counter
from datetime import datetime, timezone

import requests
from tqdm import tqdm

GBIF_URL = "https://api.gbif.org/v1/occurrence/search"
USER_AGENT = "WorldBeachTour/1.0 (beach-enrichment)"


def _fetch_gbif_species(lat, lng, radius_deg=0.02):
    """Fetch species near a coordinate from GBIF.

    Returns list of dicts with keys: name, count, taxon_class, kingdom.
    Uses a single paginated request (limit=300) and aggregates distinct species.
    """
    params = {
        "decimalLatitude": f"{lat - radius_deg},{lat + radius_deg}",
        "decimalLongitude": f"{lng - radius_deg},{lng + radius_deg}",
        "limit": 300,
    }
    headers = {"User-Agent": USER_AGENT}
    try:
        resp = requests.get(GBIF_URL, params=params, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        results = data.get("results", [])
        if not results:
            return []

        # Aggregate by species name, keeping class/kingdom from first occurrence
        species_counts: Counter = Counter()
        species_meta: dict = {}
        for r in results:
            name = r.get("species")
            if not name:
                continue
            species_counts[name] += 1
            if name not in species_meta:
                species_meta[name] = {
                    "taxon_class": r.get("class"),
                    "kingdom": r.get("kingdom"),
                }

        # Return top 30 by observation count, most common first
        return [
            {
                "name": name,
                "count": count,
                "taxon_class": species_meta[name]["taxon_class"],
                "kingdom": species_meta[name]["kingdom"],
            }
            for name, count in species_counts.most_common(30)
        ]
    except Exception:
        return []


def _map_class_to_group(class_name):
    """Map taxonomic class to our taxon_group."""
    if not class_name:
        return "other"
    mapping = {
        "Aves": "bird",
        "Mammalia": "mammal",
        "Reptilia": "reptile",
        "Amphibia": "amphibian",
        "Actinopterygii": "fish",
        "Chondrichthyes": "fish",
        "Insecta": "invertebrate",
        "Malacostraca": "invertebrate",
        "Gastropoda": "invertebrate",
        "Bivalvia": "invertebrate",
        "Echinoidea": "invertebrate",
        "Liliopsida": "plant",
        "Magnoliopsida": "plant",
        "Pinopsida": "plant",
        "Polypodiopsida": "plant",
        "Agaricomycetes": "fungi",
    }
    return mapping.get(class_name, "other")


def enrich_gbif_species(conn, limit=200) -> int:
    """Fetch species from GBIF for beaches that don't have species data yet.

    Targets beaches with no species_observed_count, ordered by notability_score.
    Returns count of beaches enriched.
    """
    rows = conn.execute("""
        SELECT id, slug, centroid_lat, centroid_lng FROM beaches
        WHERE species_observed_count IS NULL
        ORDER BY notability_score DESC
        LIMIT ?
    """, (limit,)).fetchall()

    if not rows:
        print("No beaches need GBIF species enrichment")
        return 0

    print(f"Fetching GBIF species for {len(rows)} beaches...")
    count = 0

    for row in tqdm(rows, desc="GBIF species"):
        beach_id = row["id"]
        species_list = _fetch_gbif_species(row["centroid_lat"], row["centroid_lng"])

        notable = []
        for sp in species_list[:20]:
            name = sp["name"]
            obs_count = sp["count"]
            taxon_class = sp["taxon_class"]
            taxon_group = _map_class_to_group(taxon_class)

            # Skip if already present from any source
            existing = conn.execute(
                "SELECT id FROM beach_species WHERE beach_id=? AND species_name=?",
                (beach_id, name),
            ).fetchone()
            if not existing:
                conn.execute("""
                    INSERT INTO beach_species
                    (beach_id, species_name, taxon_group, observation_count, source, fetched_at)
                    VALUES (?, ?, ?, ?, 'gbif', ?)
                """, (beach_id, name, taxon_group, obs_count, datetime.now(timezone.utc).isoformat()))

            # Track notable wildlife (not plants/fungi)
            if taxon_group in ("bird", "mammal", "reptile", "fish", "invertebrate"):
                notable.append(name)

        species_count = len(species_list)
        notable_json = json.dumps(notable[:10]) if notable else None

        conn.execute("""
            UPDATE beaches SET
                species_observed_count = COALESCE(species_observed_count, 0) + ?,
                notable_species = COALESCE(notable_species, ?),
                ecology_sources = json_insert(COALESCE(ecology_sources, '[]'), '$[#]', 'gbif'),
                updated_at = datetime('now')
            WHERE id = ?
        """, (species_count, notable_json, beach_id))

        count += 1
        if count % 100 == 0:
            conn.commit()

        time.sleep(0.5)  # GBIF is generous but be respectful

    conn.commit()
    print(f"GBIF species: enriched {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 200
    conn = sqlite3.connect(db_path, timeout=120)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=120000")
    enrich_gbif_species(conn, limit=limit)
    conn.close()
