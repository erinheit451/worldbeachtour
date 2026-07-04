"""
Sand substrate / grain tendency (Wave 0 — no downloads, DB-only).

GROUND-TRUTH FIRST. Two-source design, validated against 29,327 OSM-labelled beaches:

  1. Where OSM already tags the substrate (sand / pebble / gravel / rock) — that is
     DATA, not inference. Use it directly, confidence 'high'. Covers ~43K beaches.
  2. Where substrate is 'unknown' but we have nearshore shelf slope — fall back to a
     slope ESTIMATE, confidence 'low', clearly labelled '(est.)'.

Why not slope everywhere: validation showed shelf slope is a weak grain proxy — even
at its best threshold it caps at ~64% balanced accuracy (coarse beaches average 4.0%
shelf slope vs sand 2.2%, but the distributions overlap heavily). It catches sand well
but misses most pebble/gravel (Chesil Beach, famous shingle, has a gentle shelf and
would be called 'fine'). So slope is a last-resort fallback for unknowns only, and the
recalibrated split is 2.0% (best balanced), not the original 8%.

Upgrade path (grows the high-confidence share, shrinks the estimate): join USGS
usSEABED (US) + EMODnet (Europe) sediment samples, then the sand-passport program.

Columns:
  sand_grain_tendency    : e.g. 'sand', 'pebble', 'gravel', 'rocky',
                           'fine/sand (est.)', 'coarse (est.)'  — NULL if no signal
  sand_grain_confidence  : 'high' (OSM/measured) | 'low' (slope estimate) | 'very-low'
  sand_grain_source      : provenance tag

Usage:  python -m src.enrich.sand_grain_size <db_path>
"""
import sys

from src.enrich._common import (
    open_db, coverage_count, log_run_start, log_run_finish, assert_coverage_delta,
)

SRC_OSM = "OSM substrate tag (measured)"
SRC_EST = "shelf-slope estimate v2 (recalibrated split=2.0%; fallback for unknown substrate)"

# Recalibrated on the 29,327-beach ground-truth set (best balanced threshold).
EST_COARSE_CUT = 2.0

OSM_MAP = {
    "sand":   "sand",
    "pebble": "pebble",
    "gravel": "gravel",
    "rock":   "rocky",
    "reef":   "rocky",
}


def classify(substrate: str | None, slope_pct: float | None) -> tuple[str, str, str] | None:
    """Return (tendency, confidence, source) or None if no signal."""
    # 1) Ground truth wins.
    if substrate in OSM_MAP:
        return OSM_MAP[substrate], "high", SRC_OSM
    # 2) Fallback estimate for unknown substrate, only if we have slope.
    if slope_pct is None:
        return None
    if slope_pct <= 0:
        return "fine/sand (est.)", "very-low", SRC_EST
    if slope_pct >= EST_COARSE_CUT:
        return "coarse (est.)", "low", SRC_EST
    return "fine/sand (est.)", "low", SRC_EST


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
            "SELECT id, substrate_type, slope_pct FROM beaches"
        ).fetchall()

        updates = []
        for r in rows:
            res = classify(r["substrate_type"], r["slope_pct"])
            if res is None:
                updates.append((None, None, None, r["id"]))
            else:
                updates.append((*res, r["id"]))

        conn.executemany(
            "UPDATE beaches SET sand_grain_tendency=?, sand_grain_confidence=?, "
            "sand_grain_source=? WHERE id=?",
            updates,
        )
        conn.commit()
        log_run_finish(conn, run_id, "ok", total_processed=len(updates), total_errors=0)

        after = coverage_count(conn, "beaches", "sand_grain_tendency")
        if after < 1000:
            raise SystemExit(f"coverage collapsed to {after}; aborting")

        # Report by confidence + class.
        high = conn.execute(
            "SELECT COUNT(*) FROM beaches WHERE sand_grain_confidence='high'"
        ).fetchone()[0]
        print(f"populated {after} beaches ({high} high-confidence / measured, "
              f"{after - high} low-confidence estimate)")
        for conf, cls, c in conn.execute(
            "SELECT sand_grain_confidence, sand_grain_tendency, COUNT(*) "
            "FROM beaches WHERE sand_grain_tendency IS NOT NULL "
            "GROUP BY 1,2 ORDER BY 1,3 DESC"
        ):
            print(f"  [{conf:<8}] {cls:<20} {c:>7}")
    finally:
        conn.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    run(sys.argv[1])
