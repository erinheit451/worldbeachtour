"""Milestone A coverage report — run after all pipelines complete.

Prints a table of fields filled vs. target thresholds, plus a smoke-beach row
check. Exits 0 if every target is met, 1 otherwise.

Usage:  python scripts/milestone_a_report.py [path/to/world_beaches.db]
"""

import sqlite3
import sys

DB = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"

FIELDS = [
    ("admin_level_2", 180_000),
    ("beach_length_m", 50_000),
    ("orientation_deg", 50_000),
    ("sunset_visible", 50_000),
    ("protected_area_name", 10_000),
    ("unesco_site", 100),
    ("tide_range_spring_m", 100_000),
    ("tide_range_neap_m", 100_000),
    ("tide_type", 100_000),
    ("nearshore_depth_m", 150_000),
    ("slope_pct", 150_000),
    ("drop_off_flag", 150_000),
    ("wikipedia_url", 8_000),
    ("wikipedia_page_views_annual", 8_000),
]

TABLES = [
    ("admin_regions", 3_000),
]


def main():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    total = conn.execute("SELECT COUNT(*) FROM beaches").fetchone()[0]
    print(f"DB: {DB}  ({total:,} beaches)\n")
    print(f"{'Field':35s} {'Filled':>12s} {'Target':>12s} {'%':>7s} {'Status':>10s}")
    print("-" * 80)
    all_ok = True
    for field, target in FIELDS:
        try:
            filled = conn.execute(
                f"SELECT COUNT(*) FROM beaches WHERE {field} IS NOT NULL"
            ).fetchone()[0]
        except sqlite3.OperationalError:
            filled = 0
        pct = 100 * filled / total if total else 0
        ok = filled >= target
        all_ok &= ok
        status = "OK" if ok else "FAIL"
        print(f"{field:35s} {filled:>12,} {target:>12,} {pct:>6.1f}%  {status:>10s}")

    print()
    for table, target in TABLES:
        try:
            n = conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        except sqlite3.OperationalError:
            n = 0
        ok = n >= target
        all_ok &= ok
        status = "OK" if ok else "FAIL"
        print(f"{table:35s} {n:>12,} {target:>12,} {'':>7s}  {status:>10s}")

    print()
    print("Smoke beaches (expected: present + key fields filled):")
    for slug in ["waikiki-beach", "catedrais", "navagio", "oppenheimer-beach"]:
        try:
            row = conn.execute(
                """SELECT name, admin_level_2, beach_length_m, tide_range_spring_m,
                   nearshore_depth_m, wikipedia_page_views_annual
                   FROM beaches WHERE slug=?""",
                (slug,),
            ).fetchone()
        except sqlite3.OperationalError:
            row = None
        if row:
            print(f"  {slug:22s}: {dict(row)}")
        else:
            print(f"  {slug:22s}: NOT FOUND")

    conn.close()
    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
