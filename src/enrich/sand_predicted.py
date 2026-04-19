"""
Tier 1 — GloPrSM predicted sand composition.

Samples the three Q, F, L raster layers (Ingersoll-Johnson QFL scheme by
default) at each beach centroid and writes the percentages plus a regime
label to the beaches table.

Raster pack: GloPrSM v1.0.0 from https://doi.org/10.5281/zenodo.6471406
(5 folders of GeoTIFFs; we use IJ_QFL/{Q,F,L}.tif by default).

CAVEAT: GloPrSM is trained on modern fluvial (river) sand, not beach sand.
Treat the output as predicted regional composition, not measured beach sand.
"""

import sys
from pathlib import Path

import rasterio
from tqdm import tqdm

from src.enrich._common import (
    assert_coverage_delta,
    coverage_count,
    log_run_finish,
    log_run_start,
    open_db,
)

DEFAULT_RASTER_DIR = Path("data/sand/glopsrm/IJ_QFL")
SOURCE_TAG = "GloPrSM v1.0.0 (IJ_QFL)"


def regime_label(q: float | None, f: float | None, l: float | None) -> str:
    """Priority-ordered regime from Q/F/L percentages.

    Returns 'unknown' if any value is None.
    """
    if q is None or f is None or l is None:
        return "unknown"
    if l >= 40:
        return "lithic-rich (volcanic/collisional terrane)"
    if q >= 75:
        return "quartz-dominant"
    if f >= 35:
        return "feldspar-rich (plutonic/crystalline terrane)"
    return "mixed Q-F-L"


def _sample(dataset, lng: float, lat: float) -> float | None:
    """Sample a raster at lng/lat. Returns None for nodata/out-of-bounds."""
    try:
        for val in dataset.sample([(lng, lat)]):
            v = val[0]
            nodata = dataset.nodata
            if nodata is not None and v == nodata:
                return None
            if v != v:  # NaN
                return None
            return float(v)
    except (IndexError, ValueError):
        return None
    return None


def _open_rasters(raster_dir: Path):
    """Open Q, F, L GeoTIFFs. Auto-detect filenames case-insensitively."""
    wanted = {"Q": None, "F": None, "L": None}
    if not raster_dir.exists():
        raise FileNotFoundError(f"raster dir not found: {raster_dir}")
    for f in raster_dir.iterdir():
        if f.suffix.lower() != ".tif":
            continue
        stem = f.stem.upper()
        for key in wanted:
            # Match files like Q.tif, q_mean.tif, IJ_Q.tif, Q_pct.tif
            if stem == key or stem.startswith(key + "_") or stem.endswith("_" + key) or f"_{key}_" in stem:
                if wanted[key] is None:
                    wanted[key] = f
    missing = [k for k, v in wanted.items() if v is None]
    if missing:
        raise FileNotFoundError(
            f"missing Q/F/L rasters in {raster_dir}. "
            f"Found: {[p.name for p in raster_dir.iterdir() if p.suffix.lower() == '.tif']}"
        )
    return {k: rasterio.open(p) for k, p in wanted.items()}


def enrich_predicted(conn, *, raster_dir: Path = DEFAULT_RASTER_DIR,
                     limit: int | None = None, dry_run: bool = False) -> dict:
    """Sample GloPrSM Q/F/L for every beach with centroid coords and write results."""
    run_id = log_run_start(conn, "sand_predicted", phase="A")
    before = coverage_count(conn, "beaches", "sand_regime_label")

    rasters = _open_rasters(raster_dir)
    try:
        q = "SELECT id, centroid_lat, centroid_lng FROM beaches WHERE centroid_lat IS NOT NULL AND centroid_lng IS NOT NULL ORDER BY id"
        if limit:
            q += f" LIMIT {int(limit)}"
        rows = conn.execute(q).fetchall()

        updated = 0
        unknown = 0
        for row in tqdm(rows, desc="GloPrSM sample"):
            lat = row["centroid_lat"]
            lng = row["centroid_lng"]
            qv = _sample(rasters["Q"], lng, lat)
            fv = _sample(rasters["F"], lng, lat)
            lv = _sample(rasters["L"], lng, lat)
            # Normalise: if rasters return 0-1, scale to 0-100.
            def _pct(v):
                if v is None:
                    return None
                if v <= 1.5:
                    return round(v * 100, 1)
                return round(v, 1)
            qp, fp, lp = _pct(qv), _pct(fv), _pct(lv)
            label = regime_label(qp, fp, lp)
            if label == "unknown":
                unknown += 1
            if not dry_run:
                conn.execute(
                    """UPDATE beaches
                       SET sand_q_pct=?, sand_f_pct=?, sand_l_pct=?,
                           sand_regime_label=?, sand_predicted_source=?,
                           updated_at=datetime('now')
                       WHERE id=?""",
                    (qp, fp, lp, label, SOURCE_TAG, row["id"]),
                )
            updated += 1
            if updated % 5000 == 0 and not dry_run:
                conn.commit()
    finally:
        for ds in rasters.values():
            ds.close()
        if not dry_run:
            conn.commit()

    log_run_finish(conn, run_id, "ok", total_processed=updated)

    # Coverage guard — require at least 80% of processed rows to have a non-unknown label.
    if updated >= 100 and not dry_run:
        assert_coverage_delta(
            conn, "beaches", "sand_regime_label",
            before=before, min_delta=max(1, int(updated * 0.8)),
        )

    return {"processed": updated, "unknown": unknown}


if __name__ == "__main__":
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else None
    conn = open_db(db_path)
    result = enrich_predicted(conn, limit=limit)
    print("GloPrSM enrichment:", result)
    conn.close()
