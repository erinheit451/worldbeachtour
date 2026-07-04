"""One-off Wave-0 sand cleanup (2026-07-04).

Two fixes to the sand_grain_* columns:

1. Negative-slope rows: the shelf-slope grain estimate is built on ETOPO/GEBCO
   noise where slope_pct < 0, so those tendencies are nulled (honest absence
   beats a value derived from garbage). Only slope-sourced rows are touched —
   OSM-measured and kNN rows with a negative slope keep their value because
   slope wasn't their input. slope_pct itself is left as-is (it feeds other
   pipelines; cleaning it is a separate decision).

2. Vocabulary normalization: the '(inferred)' / '(est.)' suffixes duplicate
   sand_grain_source exactly (verified: plain = OSM measured, '(inferred)' =
   kNN, '(est.)' = slope estimate — counts match 1:1), so they are stripped.
   Canonical tokens: fine-sand, sand, coarse-sand, gravel, pebble, rocky.
   Full ENUM-GRAIN (silt..cobble-boulder) is deliberately NOT adopted yet —
   our inputs can't support that precision until usSEABED/EMODnet calibration.

Usage: python scripts/cleanup_sand_grain_wave0.py <db_path>
"""

import sys

sys.path.insert(0, ".")
from src.enrich._common import open_db, log_run_start, log_run_finish

VOCAB = {
    "sand": "sand",
    "sand (inferred)": "sand",
    "fine/sand (est.)": "fine-sand",
    "coarse (est.)": "coarse-sand",
    "gravel": "gravel",
    "gravel (inferred)": "gravel",
    "pebble": "pebble",
    "pebble (inferred)": "pebble",
    "rocky": "rocky",
    "rocky (inferred)": "rocky",
}

SLOPE_SOURCE_PREFIX = "shelf-slope estimate"


def main(db_path: str) -> None:
    conn = open_db(db_path)
    run_id = log_run_start(conn, "cleanup_sand_grain_wave0", phase="W0")

    neg = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE slope_pct < 0 "
        "AND sand_grain_tendency IS NOT NULL AND sand_grain_source LIKE ?",
        (SLOPE_SOURCE_PREFIX + "%",),
    ).fetchone()[0]
    conn.execute(
        "UPDATE beaches SET sand_grain_tendency=NULL, sand_grain_confidence=NULL, "
        "sand_grain_source='nulled: negative shelf slope (Wave-0 cleanup 2026-07-04)', "
        "updated_at=datetime('now') "
        "WHERE slope_pct < 0 AND sand_grain_tendency IS NOT NULL "
        "AND sand_grain_source LIKE ?",
        (SLOPE_SOURCE_PREFIX + "%",),
    )
    print(f"nulled {neg} negative-slope shelf-slope tendencies")

    renamed_total = 0
    for old, new in VOCAB.items():
        if old == new:
            continue
        cur = conn.execute(
            "UPDATE beaches SET sand_grain_tendency=?, updated_at=datetime('now') "
            "WHERE sand_grain_tendency=?",
            (new, old),
        )
        renamed_total += cur.rowcount
    print(f"normalized {renamed_total} tendency values to canonical vocabulary")

    leftovers = conn.execute(
        "SELECT sand_grain_tendency, COUNT(*) FROM beaches "
        "WHERE sand_grain_tendency IS NOT NULL GROUP BY 1",
    ).fetchall()
    print("post-cleanup vocabulary:", [tuple(r) for r in leftovers])
    unknown = [r[0] for r in leftovers if r[0] not in set(VOCAB.values())]
    if unknown:
        raise RuntimeError(f"unexpected tendency values survived cleanup: {unknown}")

    conn.commit()
    log_run_finish(conn, run_id, "ok", total_processed=neg + renamed_total)
    conn.close()


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db")
