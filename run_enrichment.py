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
    parser.add_argument("--phase", type=int, choices=[1, 2], help="Run specific phase only")
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

    show_status(conn)
    conn.close()


if __name__ == "__main__":
    main()
