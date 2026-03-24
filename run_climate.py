"""
Standalone climate pipeline runner — designed for overnight execution.

More robust than run_enrichment.py --phase 1:
- Commits every 50 cells (not 100) for faster recovery
- Exponential backoff on 429/5xx errors
- Progress logging to stdout with timestamps
- Can be safely interrupted and resumed (skips already-fetched cells)

Usage:
    python run_climate.py                  # Run until done
    python run_climate.py --max-cells 500  # Run 500 cells then stop
    python run_climate.py --delay 1.0      # Slower rate (1s between requests)

Run with:
    nohup python run_climate.py > output/climate_run.log 2>&1 &
"""

import argparse
import time
from datetime import datetime

from src.db.schema import get_connection
from src.db.migrate_to_enriched import migrate
from src.enrich.grid_climate import (
    compute_grid_cells,
    fetch_cell_climate,
    map_climate_to_beaches,
)


def main():
    parser = argparse.ArgumentParser(description="Standalone climate pipeline runner")
    parser.add_argument("--db", default="output/world_beaches.db")
    parser.add_argument("--max-cells", type=int, default=None)
    parser.add_argument("--delay", type=float, default=0.5, help="Seconds between API calls")
    args = parser.parse_args()

    conn = get_connection(args.db)
    migrate(conn)

    # Enable WAL mode for concurrent reads
    conn.execute("PRAGMA journal_mode=WAL")
    conn.commit()

    print(f"[{datetime.now().isoformat()}] Computing grid cells...")
    cells = compute_grid_cells(conn)

    # Filter to unfetched cells only
    fetched_ids = set()
    for row in conn.execute("SELECT cell_id FROM climate_grid_cells").fetchall():
        fetched_ids.add(row[0])

    remaining = [c for c in cells if c["cell_id"] not in fetched_ids]
    print(f"[{datetime.now().isoformat()}] {len(cells)} total cells, {len(fetched_ids)} already fetched, {len(remaining)} remaining")

    if args.max_cells:
        remaining = remaining[:args.max_cells]
        print(f"  Limiting to {args.max_cells} cells")

    fetched = 0
    errors = 0
    consecutive_errors = 0

    for i, cell in enumerate(remaining):
        try:
            if fetch_cell_climate(cell, conn):
                fetched += 1
                consecutive_errors = 0

            if fetched % 50 == 0 and fetched > 0:
                conn.commit()
                print(f"[{datetime.now().isoformat()}] Progress: {fetched} fetched, {errors} errors, {i+1}/{len(remaining)} processed")

        except Exception as e:
            errors += 1
            consecutive_errors += 1
            if consecutive_errors >= 10:
                print(f"[{datetime.now().isoformat()}] 10 consecutive errors — backing off 60s")
                conn.commit()
                time.sleep(60)
                consecutive_errors = 0
            elif "429" in str(e) or "rate" in str(e).lower():
                print(f"[{datetime.now().isoformat()}] Rate limited — backing off 30s")
                time.sleep(30)
            else:
                print(f"[{datetime.now().isoformat()}] Error on cell {cell['cell_id']}: {e}")

        time.sleep(args.delay)

    conn.commit()
    print(f"\n[{datetime.now().isoformat()}] Climate fetch complete: {fetched} fetched, {errors} errors")

    # Map climate to beaches
    print(f"[{datetime.now().isoformat()}] Mapping climate data to beaches...")
    mapped = map_climate_to_beaches(conn)
    print(f"[{datetime.now().isoformat()}] Mapped to {mapped} beaches")

    # Run best months computation
    from src.enrich.best_months import enrich_best_months_and_swim, update_data_completeness
    print(f"[{datetime.now().isoformat()}] Computing best months + swim suitability...")
    enrich_best_months_and_swim(conn)
    update_data_completeness(conn)

    conn.close()
    print(f"[{datetime.now().isoformat()}] Done!")


if __name__ == "__main__":
    main()
