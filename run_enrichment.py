"""
Enrichment pipeline orchestrator.

Usage:
    python run_enrichment.py                          # Run all phases
    python run_enrichment.py --phase 1                # Run Phase 1 only
    python run_enrichment.py --phase 1 --max-cells 100
    python run_enrichment.py --status                 # Show enrichment status
"""

import argparse
import sys

from src.db.schema import get_connection
from src.db.migrate_to_enriched import migrate


def show_status(conn):
    """Print enrichment progress."""
    cols = [r[1] for r in conn.execute("PRAGMA table_info(beaches)").fetchall()]
    print(f"Schema: {len(cols)} columns on beaches table")

    total = conn.execute("SELECT COUNT(*) FROM beaches").fetchone()[0]
    print(f"Total beaches: {total:,}")

    with_climate = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE climate_air_temp_high IS NOT NULL"
    ).fetchone()[0]
    print(f"Climate data: {with_climate:,} / {total:,} ({with_climate * 100 // max(total, 1)}%)")

    try:
        cells = conn.execute("SELECT COUNT(*) FROM climate_grid_cells").fetchone()[0]
        print(f"Grid cells fetched: {cells:,}")
    except Exception:
        print("Grid cells: table not yet created")

    with_city = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE nearest_city IS NOT NULL"
    ).fetchone()[0]
    print(f"Nearest city: {with_city:,} / {total:,} ({with_city * 100 // max(total, 1)}%)")

    with_airport = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE nearest_airport_iata IS NOT NULL"
    ).fetchone()[0]
    print(f"Nearest airport: {with_airport:,} / {total:,} ({with_airport * 100 // max(total, 1)}%)")

    with_best = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE best_months IS NOT NULL"
    ).fetchone()[0]
    print(f"Best months: {with_best:,} / {total:,} ({with_best * 100 // max(total, 1)}%)")

    with_shark = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE shark_incidents_total IS NOT NULL"
    ).fetchone()[0]
    print(f"Shark incidents: {with_shark:,} / {total:,} ({with_shark * 100 // max(total, 1)}%)")

    with_notability = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE notability_score IS NOT NULL"
    ).fetchone()[0]
    print(f"Notability score: {with_notability:,} / {total:,} ({with_notability * 100 // max(total, 1)}%)")

    try:
        logs = conn.execute(
            "SELECT script_name, phase, status, total_processed, started_at, completed_at FROM enrichment_log ORDER BY started_at DESC LIMIT 10"
        ).fetchall()
        if logs:
            print("\nRecent enrichment runs:")
            for log in logs:
                print(f"  {log['script_name']} ({log['phase']}): {log['status']} — {log['total_processed']} processed")
    except Exception:
        pass


def main():
    parser = argparse.ArgumentParser(description="Beach enrichment pipeline")
    parser.add_argument("--db", default="output/world_beaches.db", help="Database path")
    parser.add_argument("--phase", type=int, choices=[1, 2, 3], help="Run specific phase only")
    parser.add_argument("--max-cells", type=int, help="Limit grid cells to fetch (Phase 1)")
    parser.add_argument("--status", action="store_true", help="Show enrichment status")
    args = parser.parse_args()

    conn = get_connection(args.db)

    if args.status:
        show_status(conn)
        conn.close()
        return

    migrate(conn)

    if args.phase is None or args.phase == 1:
        from src.enrich.grid_climate import run_phase1
        print("\n=== Phase 1: Grid Climate Fetch ===")
        run_phase1(conn, max_cells=args.max_cells)

    if args.phase is None or args.phase == 2:
        from src.enrich.computed_fields import run_phase2
        print("\n=== Phase 2: Computed Fields ===")
        run_phase2(conn)

        from src.enrich.best_months import enrich_best_months_and_swim
        print("\n=== Phase 2b: Best Months + Swim Suitability ===")
        enrich_best_months_and_swim(conn)

    if args.phase is None or args.phase == 3:
        from src.enrich.eav_migration import migrate_eav_to_flat
        print("\n=== Phase 3a: EAV Migration ===")
        migrate_eav_to_flat(conn)

        from src.enrich.wikidata_editorial import enrich_wikidata_editorial
        print("\n=== Phase 3b: Wikidata Editorial ===")
        enrich_wikidata_editorial(conn)

        from src.enrich.shark_incidents import enrich_shark_incidents
        print("\n=== Phase 3c: Shark Incidents ===")
        enrich_shark_incidents(conn)

        from src.enrich.wikipedia_pageviews import enrich_wikipedia_pageviews
        print("\n=== Phase 3d: Wikipedia Page Views ===")
        enrich_wikipedia_pageviews(conn)

        from src.enrich.wikimedia_photos import enrich_wikimedia_photos
        print("\n=== Phase 3e: Wikimedia Commons Photos (top 10k) ===")
        enrich_wikimedia_photos(conn, limit=10_000)

        from src.enrich.popularity import enrich_notability
        print("\n=== Phase 3f: Notability Scoring ===")
        enrich_notability(conn)

        from src.enrich.best_months import update_data_completeness
        print("\n=== Phase 3g: Data Completeness ===")
        update_data_completeness(conn)

    show_status(conn)
    conn.close()


if __name__ == "__main__":
    main()
