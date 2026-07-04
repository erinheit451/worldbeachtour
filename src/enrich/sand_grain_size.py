"""
Sand grain-size TENDENCY inference (Wave 0 — no downloads, DB-only).

Infers a reflective<->dissipative grain-size *tendency* per beach from the
nearshore shelf slope already in the DB. Physical basis: steeper shoreface ->
reflective beach -> coarser sediment; gentle/wide shelf -> dissipative -> finer
(Wright & Short 1984 beach-state model). Tide range modulates predictability
(macrotidal settings are flatter/less predictive).

IMPORTANT HONESTY (see docs/program/layers/sand-library.md):
  `slope_pct` is NEARSHORE SHELF slope (depth drop over 500-2000 m from
  ETOPO/GEBCO), NOT textbook beach-face foreshore slope. So this yields an
  *uncalibrated tendency*, not a measured grain class. Ship it labelled as such;
  upgrade to a hard grain size only after calibration against USGS usSEABED +
  EMODnet sediment samples. Confidence never exceeds 'medium' by design.

Writes three columns:
  sand_grain_tendency    : text class (see BINS) or NULL if no slope input
  sand_grain_confidence  : 'very-low' | 'low' | 'medium'
  sand_grain_source      : provenance tag

Usage:
  python -m src.enrich.sand_grain_size <db_path>
"""
import sys

from src.enrich._common import (
    open_db, coverage_count, log_run_start, log_run_finish, assert_coverage_delta,
)

SOURCE_TAG = "shelf-slope inference v1 (uncalibrated tendency; pending usSEABED/EMODnet)"

# Fixed global thresholds on slope_pct (%), so a class means the same physical
# thing everywhere (reproducible, not dataset-relative). Anchored on the global
# shelf-slope distribution (median ~3-4%, p90 ~12%).
#   cut, label
BINS = [
    (1.5, "fine (dissipative)"),
    (4.0, "medium-fine"),
    (8.0, "medium-coarse"),
    (float("inf"), "coarse (reflective)"),
]
MACROTIDAL_M = 4.0  # spring range above which shelf-slope is a weaker predictor


def classify(slope_pct: float, tide_range_m: float | None) -> tuple[str, str]:
    """Return (tendency_label, confidence). slope_pct assumed not None."""
    # Clamp noise: a shoreface slope can't be negative; treat as flattest + flag.
    if slope_pct <= 0:
        return BINS[0][1], "very-low"
    s = slope_pct
    for cut, label in BINS:
        if s < cut:
            tendency = label
            break
    else:
        tendency = BINS[-1][1]
    # Confidence: uncalibrated proxy caps at 'medium'. Macrotidal -> 'low'.
    if tide_range_m is not None and tide_range_m > MACROTIDAL_M:
        conf = "low"
    else:
        conf = "medium"
    return tendency, conf


def _ensure_columns(conn) -> None:
    cols = {r[1] for r in conn.execute("PRAGMA table_info(beaches)")}
    for name in ("sand_grain_tendency", "sand_grain_confidence", "sand_grain_source"):
        if name not in cols:
            conn.execute(f"ALTER TABLE beaches ADD COLUMN {name} TEXT")
    conn.commit()


def run(db_path: str) -> None:
    conn = open_db(db_path)
    try:
        _ensure_columns(conn)
        before = coverage_count(conn, "beaches", "sand_grain_tendency")
        run_id = log_run_start(conn, "sand_grain_size", phase="A")

        rows = conn.execute(
            "SELECT id, slope_pct, tide_range_spring_m FROM beaches WHERE slope_pct IS NOT NULL"
        ).fetchall()

        updates = []
        for r in rows:
            tendency, conf = classify(r["slope_pct"], r["tide_range_spring_m"])
            updates.append((tendency, conf, SOURCE_TAG, r["id"]))

        conn.executemany(
            "UPDATE beaches SET sand_grain_tendency=?, sand_grain_confidence=?, "
            "sand_grain_source=? WHERE id=?",
            updates,
        )
        conn.commit()

        log_run_finish(conn, run_id, "ok", total_processed=len(updates), total_errors=0)
        # Fail loudly if nothing was written.
        assert_coverage_delta(conn, "beaches", "sand_grain_tendency", before, min_delta=1000)

        # Report distribution.
        print(f"processed {len(updates)} beaches")
        dist = conn.execute(
            "SELECT sand_grain_tendency, sand_grain_confidence, COUNT(*) "
            "FROM beaches WHERE sand_grain_tendency IS NOT NULL "
            "GROUP BY sand_grain_tendency, sand_grain_confidence ORDER BY 3 DESC"
        ).fetchall()
        for d in dist:
            print(f"  {d[2]:>7}  {d[0]:<22} [{d[1]}]")
    finally:
        conn.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    run(sys.argv[1])
