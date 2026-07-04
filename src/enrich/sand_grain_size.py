"""
Sand substrate / grain tendency (Wave 0 — no downloads, DB-only).

THREE-TIER, ground-truth-first. Validated against 43,388 OSM-labelled beaches:

  Tier 1  MEASURED (conf 'high') — OSM already tags the substrate
          (sand/pebble/gravel/rock). Data, not inference. ~43K beaches.
  Tier 2  SPATIAL INFERENCE (conf 'medium') — for unknown-substrate beaches,
          vote the substrate of nearby KNOWN beaches (distance-weighted kNN
          within 25 km). Substrate is strongly spatially clustered, so this is
          a real geology backstop: leave-one-out gives ~91% accuracy and 70%
          coarse recall — vs 32% coarse recall for slope. Covers the ~58% of
          unknowns that have a known neighbour within 25 km.
  Tier 3  SLOPE ESTIMATE (conf 'low') — last resort for unknowns with no known
          neighbour: recalibrated shelf-slope split (2.0%). Weak (~64% ceiling),
          labelled '(est.)'.

Upgrade path (grows Tier 1, so Tiers 2-3 shrink): join USGS usSEABED (US) +
EMODnet (EU) + the Global Coastal Classification transects, then sand-passport.

Columns:
  sand_grain_tendency    : 'sand'|'pebble'|'gravel'|'rocky' (measured),
                           '<class> (inferred)' (spatial), '<coarse|fine> (est.)'
  sand_grain_confidence  : 'high' | 'medium' | 'low' | 'very-low'
  sand_grain_source      : provenance tag

Usage:  python -m src.enrich.sand_grain_size <db_path>
"""
import sys
import numpy as np
from scipy.spatial import cKDTree

from src.enrich._common import (
    open_db, coverage_count, log_run_start, log_run_finish,
)

SRC_OSM = "OSM substrate tag (measured)"
SRC_NBR = "spatial kNN from OSM-known beaches (<=25km, distance-weighted)"
SRC_EST = "shelf-slope estimate (recalibrated split=2.0%; no known neighbour)"

OSM_MAP = {"sand": "sand", "pebble": "pebble", "gravel": "gravel", "rock": "rocky", "reef": "rocky"}
KNOWN = ("sand", "pebble", "gravel", "rock", "reef")
RADIUS_KM = 25.0
K = 10
EARTH_KM = 6371.0
EST_COARSE_CUT = 2.0


def _chord(km):
    return 2.0 * np.sin(km / (2.0 * EARTH_KM))


def _xyz(lat, lon):
    la, lo = np.radians(lat), np.radians(lon)
    return np.c_[np.cos(la) * np.cos(lo), np.cos(la) * np.sin(lo), np.sin(la)]


def _ensure_columns(conn):
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
        updates = []

        # --- Tier 1: measured (OSM) ---
        known = conn.execute(
            "SELECT id, centroid_lat, centroid_lng, substrate_type FROM beaches "
            "WHERE substrate_type IN ('sand','pebble','gravel','rock','reef') "
            "AND centroid_lat IS NOT NULL"
        ).fetchall()
        klat = np.array([r["centroid_lat"] for r in known])
        klon = np.array([r["centroid_lng"] for r in known])
        kcls = [OSM_MAP[r["substrate_type"]] for r in known]
        for r, c in zip(known, kcls):
            updates.append((c, "high", SRC_OSM, r["id"]))
        tree = cKDTree(_xyz(klat, klon))
        kcls_arr = np.array(kcls)

        # --- Tiers 2 & 3: unknowns ---
        unk = conn.execute(
            "SELECT id, centroid_lat, centroid_lng, slope_pct FROM beaches "
            "WHERE substrate_type='unknown' AND centroid_lat IS NOT NULL"
        ).fetchall()
        ulat = np.array([r["centroid_lat"] for r in unk])
        ulon = np.array([r["centroid_lng"] for r in unk])
        d, idx = tree.query(_xyz(ulat, ulon), k=K)
        hi_c = _chord(RADIUS_KM)
        n_spatial = n_slope = 0
        for i, r in enumerate(unk):
            nd, ni = d[i], idx[i]
            m = nd <= hi_c
            if m.any():
                # distance-weighted vote over neighbour classes
                w = 1.0 / (nd[m] + 1e-9)
                labels = kcls_arr[ni[m]]
                scores = {}
                for lab, wt in zip(labels, w):
                    scores[lab] = scores.get(lab, 0.0) + wt
                top = max(scores, key=scores.get)
                share = scores[top] / sum(scores.values())
                conf = "medium" if (m.sum() >= 3 and share >= 0.6) else "low"
                updates.append((f"{top} (inferred)", conf, SRC_NBR, r["id"]))
                n_spatial += 1
            elif r["slope_pct"] is not None:
                s = r["slope_pct"]
                if s <= 0:
                    updates.append(("fine/sand (est.)", "very-low", SRC_EST, r["id"]))
                else:
                    cls = "coarse (est.)" if s >= EST_COARSE_CUT else "fine/sand (est.)"
                    updates.append((cls, "low", SRC_EST, r["id"]))
                n_slope += 1

        conn.executemany(
            "UPDATE beaches SET sand_grain_tendency=?, sand_grain_confidence=?, "
            "sand_grain_source=? WHERE id=?", updates,
        )
        conn.commit()
        log_run_finish(conn, run_id, "ok", total_processed=len(updates))

        after = coverage_count(conn, "beaches", "sand_grain_tendency")
        if after <= before and after < 1000:
            raise SystemExit(f"coverage did not grow ({before}->{after}); aborting")

        by_conf = dict(conn.execute(
            "SELECT sand_grain_confidence, COUNT(*) FROM beaches "
            "WHERE sand_grain_tendency IS NOT NULL GROUP BY 1").fetchall())
        print(f"populated {after} beaches")
        print(f"  Tier 1 measured  (high):   {by_conf.get('high',0):>7}")
        print(f"  Tier 2 inferred  (med+low):{n_spatial:>7}")
        print(f"  Tier 3 slope est (low/vl): {n_slope:>7}")
        print(f"  confidence split: {by_conf}")
    finally:
        conn.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    run(sys.argv[1])
