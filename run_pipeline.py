"""Main pipeline runner for the World Beach Database.

Usage:
    python run_pipeline.py              # Run all sources + dedup
    python run_pipeline.py --source osm # Run single source only
    python run_pipeline.py --stats      # Print stats only
    python run_pipeline.py --export     # Export to GeoJSON
"""

import argparse
import os
import sys
import time

# Add project root to path
sys.path.insert(0, os.path.dirname(__file__))

from src.db.schema import get_connection, init_db
from src.ingest.osm import ingest as ingest_osm
from src.ingest.geonames import ingest as ingest_geonames
from src.ingest.eu_bathing import ingest as ingest_eu_bathing
from src.ingest.epa_beacon import ingest as ingest_epa_beacon
from src.ingest.wikidata import ingest as ingest_wikidata
from src.dedup.matcher import deduplicate
from src.export.exporters import export_geojson, export_stats

INGESTERS = {
    "osm": ("OpenStreetMap", ingest_osm),
    "geonames": ("GeoNames", ingest_geonames),
    "eu_bathing": ("EU Bathing Water", ingest_eu_bathing),
    "epa_beacon": ("EPA BEACON", ingest_epa_beacon),
    "wikidata": ("Wikidata", ingest_wikidata),
}

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")


def main():
    parser = argparse.ArgumentParser(description="World Beach Database Pipeline")
    parser.add_argument("--source", choices=list(INGESTERS.keys()),
                        help="Run a single source only")
    parser.add_argument("--no-dedup", action="store_true",
                        help="Skip deduplication step")
    parser.add_argument("--stats", action="store_true",
                        help="Print database statistics only")
    parser.add_argument("--export", action="store_true",
                        help="Export to GeoJSON")
    parser.add_argument("--db", default=None,
                        help="Path to database file")
    args = parser.parse_args()

    db_path = args.db or os.path.join(OUTPUT_DIR, "world_beaches.db")
    conn = get_connection(db_path)
    init_db(conn)

    if args.stats:
        export_stats(conn)
        conn.close()
        return

    if args.export:
        geojson_path = os.path.join(OUTPUT_DIR, "world_beaches.geojson")
        export_geojson(conn, geojson_path)
        conn.close()
        return

    start = time.time()
    print("=" * 60)
    print("  WORLD BEACH DATABASE — Layer 1 Pipeline")
    print("=" * 60)

    totals = {}

    if args.source:
        # Run single source
        label, func = INGESTERS[args.source]
        print(f"\nRunning {label} ingester...")
        totals[args.source] = func(conn)
    else:
        # Run all sources in order
        for key, (label, func) in INGESTERS.items():
            print(f"\n{'—' * 40}")
            print(f"Running {label} ingester...")
            try:
                totals[key] = func(conn)
            except Exception as e:
                print(f"  ERROR in {label}: {e}")
                totals[key] = 0

    # Deduplication
    if not args.no_dedup and not args.source:
        print(f"\n{'—' * 40}")
        deduplicate(conn)

    # Stats
    print(f"\n{'—' * 40}")
    export_stats(conn)

    # Export GeoJSON
    geojson_path = os.path.join(OUTPUT_DIR, "world_beaches.geojson")
    print(f"\n{'—' * 40}")
    export_geojson(conn, geojson_path)

    elapsed = time.time() - start
    print(f"\n{'=' * 60}")
    print(f"  Pipeline complete in {elapsed:.1f}s")
    print(f"  Database: {os.path.abspath(db_path)}")
    print(f"  GeoJSON: {os.path.abspath(geojson_path)}")
    print(f"{'=' * 60}")

    conn.close()


if __name__ == "__main__":
    main()
