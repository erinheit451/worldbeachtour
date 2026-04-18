"""
FES2022 tidal atlas → spring/neap range + tide type per beach.

Setup (gated on user):
  1. Register at https://www.aviso.altimetry.fr for an FES2022 account.
  2. Download ocean_tide NetCDFs for M2, S2, K1, O1, N2, K2, P1, Q1 to
     data/fes2022/ocean_tide/
  3. Create data/fes2022/fes2022.ini per pyfes docs (lists each constituent's path)
  4. `pip install pyfes`

Classification (Courtier 1938):
  F = (K1 + O1) / (M2 + S2)
  F < 0.25        → semidiurnal
  0.25 <= F < 1.5 → mixed
  F >= 1.5        → diurnal

Ranges (approximations from semidiurnal theory):
  spring ≈ 2 * (M2 + S2)
  neap   ≈ 2 * |M2 - S2|
"""

from pathlib import Path

from tqdm import tqdm

from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)

FES_DIR = Path("data/fes2022")
FES_INI = FES_DIR / "fes2022.ini"
CONSTITUENTS = ["M2", "S2", "K1", "O1", "N2", "K2", "P1", "Q1"]


def _classify_tide_type(amps: dict) -> str:
    """Classify tide type from constituent amplitudes (any units — only the ratio matters).
    amps must contain at least M2, S2, K1, O1 keys."""
    m2 = amps.get("M2", 0) or 0
    s2 = amps.get("S2", 0) or 0
    k1 = amps.get("K1", 0) or 0
    o1 = amps.get("O1", 0) or 0
    denom = m2 + s2
    if denom == 0:
        return "unknown"
    f = (k1 + o1) / denom
    if f < 0.25:
        return "semidiurnal"
    if f < 1.5:
        return "mixed"
    return "diurnal"


def _compute_ranges(amps: dict) -> tuple[float, float]:
    """Spring range ≈ 2*(M2+S2), neap range ≈ 2*|M2-S2|. Both in the amps' units (usually m)."""
    m2 = amps.get("M2", 0) or 0
    s2 = amps.get("S2", 0) or 0
    spring = 2 * (m2 + s2)
    neap = 2 * abs(m2 - s2)
    return spring, neap


def _load_fes_atlas():
    """Lazy-load pyfes + FES2022 NetCDFs. Raises if either is missing."""
    try:
        import pyfes
    except ImportError as e:
        raise RuntimeError(
            "pyfes not installed. Run: pip install pyfes"
        ) from e
    if not FES_INI.exists():
        raise FileNotFoundError(
            f"FES2022 config not found at {FES_INI}. "
            f"Register at https://www.aviso.altimetry.fr, download ocean_tide NetCDFs "
            f"for {', '.join(CONSTITUENTS)} into {FES_DIR}, and create fes2022.ini."
        )
    return pyfes.Handler("ocean", "io", str(FES_INI))


def enrich_fes2022_tides(conn, batch_size: int = 1000) -> int:
    """Compute tidal range + type for every beach with centroid but no tide_range_spring_m."""
    handler = _load_fes_atlas()
    import numpy as np
    import datetime as _dt

    run_id = log_run_start(conn, "fes2022_tides", phase="A")
    before = coverage_count(conn, "beaches", "tide_range_spring_m")

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches "
        "WHERE tide_range_spring_m IS NULL AND centroid_lat IS NOT NULL"
    ).fetchall()

    updated = 0
    errors = 0
    ref_date = _dt.datetime(2026, 1, 1)

    for i in tqdm(range(0, len(rows), batch_size), desc="fes2022"):
        batch = rows[i:i+batch_size]
        lats = np.array([r["centroid_lat"] for r in batch])
        lngs = np.array([r["centroid_lng"] for r in batch])
        dates = np.array([ref_date] * len(batch))
        try:
            amp_dict = handler.vector_constituents(dates, lats, lngs, CONSTITUENTS)
        except Exception as e:
            errors += len(batch)
            raise RuntimeError(f"FES2022 evaluation failed at batch {i}: {e}") from e

        for j, row in enumerate(batch):
            try:
                amps = {c: float(abs(amp_dict[c][j])) for c in CONSTITUENTS}
                spring, neap = _compute_ranges(amps)
                tide_type = _classify_tide_type(amps)
                if spring == 0 and neap == 0:
                    continue  # landlocked or masked cell
                conn.execute(
                    """UPDATE beaches SET tide_range_spring_m=?, tide_range_neap_m=?,
                       tide_type=?, tide_source='fes2022', updated_at=datetime('now')
                       WHERE id=?""",
                    (spring, neap, tide_type, row["id"]),
                )
                updated += 1
            except Exception:
                errors += 1

        conn.commit()

    log_run_finish(conn, run_id, "ok", total_processed=updated, total_errors=errors)
    if rows:
        # Inland/landlocked beaches have 0 tide; coastal expected >> 50% success
        assert_coverage_delta(
            conn, "beaches", "tide_range_spring_m",
            before=before, min_delta=max(1, len(rows) // 3),
        )
    return updated


if __name__ == "__main__":
    import sqlite3, sys
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    enrich_fes2022_tides(db)
    db.close()
