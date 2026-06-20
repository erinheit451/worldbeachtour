"""
Marine wave climatology ingest (corrected, marine-only).

Why this exists: src/enrich/grid_climate.py's marine fetch was silently broken --
it requested daily=wave_height_mean, which is NOT a valid Open-Meteo marine
variable (only *_max aggregations exist), so every call 400'd and waves never
populated (only 2 hand-seeded rows ever had wave data).

This script:
  - uses the CORRECT variables (wave_height_max, wave_period_max, wave_direction_dominant)
  - samples a REAL coastal beach coordinate per 0.1 deg cell (NOT the cell center,
    which often falls inland -> 400), with a small seaward-nudge fallback
  - fetches 2015-2024 daily-max data, aggregates to 12 monthly normals
  - is RESUMABLE: per-cell results cached in marine_wave_cells; done cells skipped.
    Free tier caps ~10k calls/day -> on 429 it stops cleanly; just re-run to resume.
  - writes ONLY ocean_wave_* columns to beaches (never touches climate / WorldClim).

Usage:
  python -m src.enrich.marine_waves <db_path> [max_cells]
  (max_cells limits the fetch for validation; omit for the full run)
"""
import collections
import json
import math
import os
import sqlite3
import sys
import time

import requests

MONTHS = list(range(1, 13))
DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
# beach coord first, then small seaward nudges (keep short to limit API calls)
NUDGES = [(0.0, 0.0), (-0.04, -0.04), (0.0, -0.06), (-0.06, 0.0)]

# Source is configurable so this can target a SELF-HOSTED Open-Meteo instance
# (no rate limits) instead of the public API. The public free API weights
# requests by date-range, so a 10yr historical call costs ~260x a normal call
# (-> ~38 cells/day on the free tier). Self-host or the commercial tier is the
# realistic path for the full 57k-cell run.
MARINE_URL = os.environ.get("OPENMETEO_MARINE_URL", "https://marine-api.open-meteo.com/v1/marine")
START_DATE = os.environ.get("MARINE_START", "2015-01-01")
END_DATE = os.environ.get("MARINE_END", "2024-12-31")


class DailyLimitExceeded(Exception):
    """Raised when the daily quota is exhausted; resume tomorrow (or change source)."""


def grid_cell_id(lat: float, lng: float) -> str:
    return f"{math.floor(lat * 10) / 10}_{math.floor(lng * 10) / 10}"


def fetch_marine(lat: float, lng: float) -> dict | None:
    """Return Open-Meteo daily dict, or None for a land/no-data point.

    Handles 429 gracefully: minutely/hourly limits -> back off and retry (so the
    job self-throttles and runs unattended). Daily limit -> raise DailyLimitExceeded.
    """
    params = {
        "latitude": lat,
        "longitude": lng,
        "daily": "wave_height_max,wave_period_max,wave_direction_dominant",
        "start_date": START_DATE,
        "end_date": END_DATE,
        "timezone": "auto",
    }
    for attempt in range(6):
        r = requests.get(MARINE_URL, params=params, timeout=120)
        if r.status_code == 429:
            reason = (r.text or "").lower()
            if "daily" in reason:
                raise DailyLimitExceeded(r.text[:200])
            backoff = 65 if "minutely" in reason else 305  # minutely vs hourly
            print(f"    429 ({'minutely' if backoff == 65 else 'hourly'}); backing off {backoff}s")
            time.sleep(backoff)
            continue
        if r.status_code == 400:
            return None  # land / no marine grid point here
        r.raise_for_status()
        d = r.json().get("daily")
        if not d or not d.get("time"):
            return None
        return d
    return None  # exhausted retries on this point; treat as miss


def _monthly_mean(d: dict, key: str) -> list:
    buck = collections.defaultdict(list)
    for i, ds in enumerate(d["time"]):
        v = d[key][i]
        if v is not None:
            buck[int(ds[5:7])].append(v)
    return [round(sum(buck[m]) / len(buck[m]), 2) if buck[m] else None for m in MONTHS]


def _monthly_dir(d: dict, key: str) -> list:
    buck = collections.defaultdict(list)
    for i, ds in enumerate(d["time"]):
        v = d[key][i]
        if v is not None:
            buck[int(ds[5:7])].append(v)
    out = []
    for m in MONTHS:
        a = buck[m]
        if not a:
            out.append(None)
            continue
        s = sum(math.sin(math.radians(x)) for x in a)
        c = sum(math.cos(math.radians(x)) for x in a)
        out.append(DIRS[round((math.degrees(math.atan2(s, c)) % 360) / 45) % 8])
    return out


def fetch_cell(lat: float, lng: float):
    """Try the beach coord, then short seaward nudges. Returns (daily|None, used_lat, used_lng)."""
    for dla, dlo in NUDGES:
        d = fetch_marine(lat + dla, lng + dlo)
        if d:
            return d, lat + dla, lng + dlo
    return None, lat, lng


def ensure_table(conn):
    conn.execute(
        """CREATE TABLE IF NOT EXISTS marine_wave_cells(
            cell_id TEXT PRIMARY KEY,
            sample_lat REAL, sample_lng REAL,
            wave_height_m TEXT, wave_period_s TEXT, swell_direction TEXT,
            status TEXT, fetched_at TEXT)"""
    )
    conn.commit()


def build_cells(conn) -> dict:
    """One representative COASTAL beach coordinate per ocean 0.1deg cell."""
    rows = conn.execute(
        "SELECT centroid_lat, centroid_lng FROM beaches WHERE water_body_type='ocean'"
    ).fetchall()
    cells = {}
    for lat, lng in rows:
        cid = grid_cell_id(lat, lng)
        if cid not in cells:
            cells[cid] = (lat, lng)  # first real beach in the cell = a real coastal point
    return cells


def map_to_beaches(conn) -> int:
    cells = {
        r[0]: r
        for r in conn.execute(
            "SELECT cell_id, wave_height_m, wave_period_s, swell_direction "
            "FROM marine_wave_cells WHERE status='ok'"
        ).fetchall()
    }
    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches "
        "WHERE water_body_type='ocean' AND ocean_wave_height_m IS NULL"
    ).fetchall()
    cur = 0
    for bid, lat, lng in rows:
        c = cells.get(grid_cell_id(lat, lng))
        if not c:
            continue
        conn.execute(
            """UPDATE beaches SET ocean_wave_height_m=?, ocean_wave_period_s=?,
               ocean_swell_direction=?,
               ocean_source='open_meteo_marine (2015-2024 daily-max monthly normals)',
               updated_at=datetime('now') WHERE id=?""",
            (c[1], c[2], c[3], bid),
        )
        cur += 1
        if cur % 5000 == 0:
            conn.commit()
            print(f"  mapped {cur}")
    conn.commit()
    return cur


def run(db: str, delay: float = 0.3, max_cells: int | None = None):
    conn = sqlite3.connect(db, timeout=60)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=60000")
    ensure_table(conn)

    cells = build_cells(conn)
    done = {r[0] for r in conn.execute("SELECT cell_id FROM marine_wave_cells").fetchall()}
    todo = [(c, xy) for c, xy in cells.items() if c not in done]
    if max_cells:
        todo = todo[:max_cells]
    print(f"{len(cells)} ocean cells | {len(done)} already done | {len(todo)} to fetch")

    ok = land = calls = 0
    rate_limited = False
    for i, (cid, (lat, lng)) in enumerate(todo):
        try:
            d, ulat, ulng = fetch_cell(lat, lng)
        except DailyLimitExceeded as e:
            print(f"STOP (daily quota) after {ok} ok / {land} land: {e}")
            rate_limited = True
            break
        calls += 1
        # An inland point that falls inside Open-Meteo's grid domain returns HTTP
        # 200 with an all-null daily series (no marine data there) rather than a
        # 400. Treat that the same as land: store a miss so the column stays NULL
        # and a resume skips it -- never propagate an all-null [null,...] array
        # (e.g. OSM "Badestelle" inland bathing sites mislabeled water_body_type=ocean).
        hm = _monthly_mean(d, "wave_height_max") if d else None
        if hm and any(v is not None for v in hm):
            conn.execute(
                "INSERT OR REPLACE INTO marine_wave_cells VALUES (?,?,?,?,?,?,?,datetime('now'))",
                (cid, ulat, ulng,
                 json.dumps(hm),
                 json.dumps(_monthly_mean(d, "wave_period_max")),
                 json.dumps(_monthly_dir(d, "wave_direction_dominant")), "ok"),
            )
            ok += 1
        else:
            conn.execute(
                "INSERT OR REPLACE INTO marine_wave_cells VALUES (?,?,?,?,?,?,?,datetime('now'))",
                (cid, lat, lng, None, None, None, "land"),
            )
            land += 1
        if (i + 1) % 50 == 0:
            conn.commit()
            print(f"  {i + 1}/{len(todo)} cells | ok={ok} land={land}")
        time.sleep(delay)

    conn.commit()
    print(f"FETCH DONE: ok={ok} land={land} (rate_limited={rate_limited})")
    print("Mapping wave data to beaches...")
    mapped = map_to_beaches(conn)
    print(f"MAPPED {mapped} beaches")
    conn.close()
    if rate_limited:
        print("Re-run the same command to resume the remaining cells.")


if __name__ == "__main__":
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    max_cells = int(sys.argv[2]) if len(sys.argv) > 2 else None
    run(db_path, max_cells=max_cells)
