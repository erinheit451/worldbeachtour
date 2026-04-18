"""
IBTrACS tropical cyclone history pipeline.

Data: data/ibtracs/ibtracs.ALL.list.v04r01.csv  (NOAA IBTrACS v04r01)
Writes:
  - beach_hazards rows (one per beach × storm within 100km)
  - beach_attributes (category='safety'):
      'cyclone_count_50yr' -> integer count of storms in last 50 years
      'cyclone_max_category' -> max Saffir-Simpson category observed ever

Algorithm is storm-first (not beach-first): iterate storms, bbox-filter beaches
via R-tree, Haversine-check candidates, insert rows.
O(N_storms * B) where B is candidate beaches per storm (usually <1000).
"""

import csv
import math
import datetime as _dt
import uuid
from collections import defaultdict
from pathlib import Path

from rtree import index as rtree_index
from tqdm import tqdm

from src.enrich._common import (
    log_run_start,
    log_run_finish,
    coverage_count,
    assert_coverage_delta,
)

IBTRACS_PATH = Path("data/ibtracs/ibtracs.ALL.list.v04r01.csv")
MATCH_RADIUS_KM = 100
SOURCE_URL = (
    "https://www.ncei.noaa.gov/data/international-best-track-archive-for-climate-stewardship-ibtracs/"
)
FIFTY_YR_CUTOFF = 1975  # 2025 - 50; storms from 1975 onward count toward count_50yr


def _saffir_simpson(wind_kt: float | None) -> str | None:
    """Map max sustained wind (knots) to Saffir-Simpson category string."""
    if wind_kt is None:
        return None
    if wind_kt >= 137:
        return "5"
    if wind_kt >= 113:
        return "4"
    if wind_kt >= 96:
        return "3"
    if wind_kt >= 83:
        return "2"
    if wind_kt >= 64:
        return "1"
    if wind_kt >= 34:
        return "TS"
    return "TD"


def _category_rank(cat: str | None) -> int:
    """Return integer rank for comparison; -1 if unknown/None."""
    order = {"TD": 0, "TS": 1, "1": 2, "2": 3, "3": 4, "4": 5, "5": 6}
    return order.get(cat, -1)


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in km between two (lat, lon) points."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    return R * 2 * math.asin(math.sqrt(min(a, 1.0)))


def _parse_storms(csv_path: Path):
    """
    Yield one dict per storm (grouped by SID) from IBTrACS CSV.

    Each dict:
      sid        str
      year       int
      name       str
      basin      str
      track      list of (lat, lon, iso_time, wind_kt_or_None)
      max_wind_kt  float | None
    """
    with open(csv_path, encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f)
        header = next(reader)
        _units = next(reader)
        idx = {name.strip(): i for i, name in enumerate(header)}

        current_sid: str | None = None
        current: dict | None = None

        for row in reader:
            # Filter to main tracks only
            if row[idx["TRACK_TYPE"]].strip() != "main":
                continue

            sid = row[idx["SID"]].strip()
            if sid != current_sid:
                if current is not None:
                    yield current
                try:
                    yr = int(row[idx["SEASON"]].strip())
                except (ValueError, IndexError):
                    yr = 0
                current = {
                    "sid": sid,
                    "year": yr,
                    "name": row[idx["NAME"]].strip(),
                    "basin": row[idx["BASIN"]].strip(),
                    "track": [],
                    "max_wind_kt": None,
                }
                current_sid = sid

            # Parse lat/lon — skip rows with bad coords
            try:
                lat = float(row[idx["LAT"]].strip())
                lon = float(row[idx["LON"]].strip())
            except (ValueError, IndexError):
                continue

            iso = row[idx["ISO_TIME"]].strip()

            w_raw = row[idx["WMO_WIND"]].strip()
            wind: float | None = float(w_raw) if w_raw else None

            current["track"].append((lat, lon, iso, wind))

            if wind is not None and (
                current["max_wind_kt"] is None or wind > current["max_wind_kt"]
            ):
                current["max_wind_kt"] = wind

        # Yield last storm
        if current is not None:
            yield current


def _build_beach_rtree(conn):
    """
    Build an R-tree spatial index over all beaches with known coordinates.

    Returns:
      idx      rtree.Index
      ids      list[str]   beach_id at position i
      coords   list[tuple] (lat, lng) at position i
    """
    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches "
        "WHERE centroid_lat IS NOT NULL AND centroid_lng IS NOT NULL"
    ).fetchall()

    idx = rtree_index.Index()
    ids: list[str] = []
    coords: list[tuple[float, float]] = []

    for i, r in enumerate(rows):
        # rtree uses (minx, miny, maxx, maxy) = (lng, lat, lng, lat) for points
        lng = float(r["centroid_lng"])
        lat = float(r["centroid_lat"])
        idx.insert(i, (lng, lat, lng, lat))
        ids.append(r["id"])
        coords.append((lat, lng))

    return idx, ids, coords


def _track_bbox(track, buffer_deg: float = 1.0):
    """
    Return (min_lng, min_lat, max_lng, max_lat) bounding box of track points
    expanded by buffer_deg on each side (~111 km per degree).
    """
    lats = [p[0] for p in track]
    lons = [p[1] for p in track]
    return (
        min(lons) - buffer_deg,
        min(lats) - buffer_deg,
        max(lons) + buffer_deg,
        max(lats) + buffer_deg,
    )


def _get_or_create_beach_source_id(conn, beach_id: str) -> str:
    """
    Return a beach_sources.id for (beach_id, 'ibtracs_v04r01'), creating if absent.

    beach_sources.beach_id is NOT NULL, so we create one source row per beach
    (matching the pattern used by other enrichment pipelines like OSM).
    """
    existing = conn.execute(
        "SELECT id FROM beach_sources "
        "WHERE beach_id = ? AND source_name = 'ibtracs_v04r01' LIMIT 1",
        (beach_id,),
    ).fetchone()
    if existing:
        return existing["id"]

    src_id = str(uuid.uuid4())
    conn.execute(
        """INSERT INTO beach_sources
           (id, beach_id, source_name, source_id, source_url, raw_data, ingested_at)
           VALUES (?, ?, 'ibtracs_v04r01', 'ibtracs_v04r01', ?, '{}', datetime('now'))""",
        (src_id, beach_id, SOURCE_URL),
    )
    return src_id


def enrich_ibtracs_cyclones(conn, csv_path: Path = IBTRACS_PATH) -> int:
    """
    Parse IBTrACS CSV, spatially match storms to beaches, write beach_hazards +
    beach_attributes EAV rows.

    Returns the number of beach_hazards rows inserted.
    """
    if not csv_path.exists():
        raise FileNotFoundError(
            f"IBTrACS CSV not found at {csv_path}. "
            "Download from https://www.ncei.noaa.gov/products/international-best-track-archive"
        )

    run_id = log_run_start(conn, "ibtracs_cyclones", phase="A")

    # Baseline for coverage assertion
    hazards_before = coverage_count(conn, "beach_hazards", "beach_id")

    # Build beach spatial index
    print("Building beach spatial index...")
    rtree_idx, beach_ids, beach_coords = _build_beach_rtree(conn)
    print(f"  Indexed {len(beach_ids):,} beaches")

    # Per-beach accumulator: {beach_id -> {count_50yr, max_cat}}
    beach_stats: dict[str, dict] = defaultdict(
        lambda: {"count_50yr": 0, "max_cat": None}
    )

    inserted_rows = 0
    storms_processed = 0

    print("Iterating storms...")
    for storm in tqdm(_parse_storms(csv_path), desc="storms"):
        storms_processed += 1
        if not storm["track"]:
            continue

        category = _saffir_simpson(storm["max_wind_kt"])
        bbox = _track_bbox(storm["track"], buffer_deg=1.0)
        candidates = list(rtree_idx.intersection(bbox))
        if not candidates:
            continue

        for bi in candidates:
            blat, blng = beach_coords[bi]

            # Find closest track point and its ISO timestamp
            min_d: float | None = None
            closest_iso: str = ""
            for tlat, tlon, iso, _w in storm["track"]:
                d = _haversine_km(blat, blng, tlat, tlon)
                if min_d is None or d < min_d:
                    min_d = d
                    closest_iso = iso

            if min_d is None or min_d > MATCH_RADIUS_KM:
                continue

            # Insert one beach_hazards row for this beach × storm
            conn.execute(
                """INSERT INTO beach_hazards
                   (beach_id, hazard_type, severity, observed_date, source, source_url)
                   VALUES (?, 'tropical_cyclone', ?, ?, 'ibtracs_v04r01', ?)""",
                (beach_ids[bi], category, closest_iso, SOURCE_URL),
            )
            inserted_rows += 1

            # Update per-beach stats
            stats = beach_stats[beach_ids[bi]]
            if storm["year"] >= FIFTY_YR_CUTOFF:
                stats["count_50yr"] += 1
            if category is not None and _category_rank(category) > _category_rank(
                stats["max_cat"]
            ):
                stats["max_cat"] = category

        if storms_processed % 500 == 0:
            conn.commit()

    conn.commit()

    # Write per-beach EAV stats into beach_attributes
    # Schema: id, beach_id, category, key, value, value_type, source_id, last_updated
    # beach_sources.beach_id is NOT NULL, so create one source row per beach.
    now_iso = _dt.datetime.now(_dt.timezone.utc).isoformat(timespec="seconds")
    print(f"Writing EAV stats for {len(beach_stats):,} beaches...")
    for beach_id, stats in beach_stats.items():
        src_id = _get_or_create_beach_source_id(conn, beach_id)

        # count_50yr
        conn.execute(
            """INSERT INTO beach_attributes
               (id, beach_id, category, key, value, value_type, source_id, last_updated)
               VALUES (?, ?, 'safety', 'cyclone_count_50yr', ?, 'integer', ?, ?)""",
            (str(uuid.uuid4()), beach_id, str(stats["count_50yr"]), src_id, now_iso),
        )
        # max_category (only if we have one)
        if stats["max_cat"] is not None:
            conn.execute(
                """INSERT INTO beach_attributes
                   (id, beach_id, category, key, value, value_type, source_id, last_updated)
                   VALUES (?, ?, 'safety', 'cyclone_max_category', ?, 'string', ?, ?)""",
                (str(uuid.uuid4()), beach_id, stats["max_cat"], src_id, now_iso),
            )
    conn.commit()

    # Coverage assertion: at least 1 row if any beach is in a cyclone zone
    if inserted_rows > 0:
        assert_coverage_delta(conn, "beach_hazards", "beach_id", hazards_before, 1)

    log_run_finish(conn, run_id, "ok", total_processed=storms_processed)

    print(
        f"IBTrACS done: {storms_processed:,} storms parsed; "
        f"{inserted_rows:,} beach_hazards rows inserted; "
        f"{len(beach_stats):,} beaches with cyclone history"
    )
    return inserted_rows


if __name__ == "__main__":
    import sqlite3
    import sys

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    from src.enrich._common import open_db
    db = open_db(db_path)
    enrich_ibtracs_cyclones(db)
    db.close()
