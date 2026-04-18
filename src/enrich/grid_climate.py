"""
Phase 1: Grid-based climate data fetching.

1. Compute unique 0.1° grid cells from all beach coordinates
2. Fetch 12-month climate normals from Open-Meteo for each cell
3. Fetch 12-month marine data for coastal cells
4. Map climate data back to each beach's row

Uses floor-based bucketing (not round) for deterministic grid assignment.
"""

import json
import math
import sqlite3
import time
from datetime import datetime

import requests
from tqdm import tqdm


def grid_cell_id(lat: float, lng: float) -> str:
    """Compute deterministic grid cell ID using floor-based bucketing at 0.1° resolution."""
    cell_lat = math.floor(lat * 10) / 10
    cell_lng = math.floor(lng * 10) / 10
    return f"{cell_lat}_{cell_lng}"


def compute_grid_cells(conn) -> list[dict]:
    """Compute unique grid cells from all beaches. Returns list of cell dicts."""
    rows = conn.execute("SELECT id, centroid_lat, centroid_lng FROM beaches").fetchall()
    cells = {}  # cell_id -> {cell_id, centroid_lat, centroid_lng, beach_ids}
    for row in rows:
        cid = grid_cell_id(row["centroid_lat"], row["centroid_lng"])
        if cid not in cells:
            # Use cell center as representative point
            cell_lat = math.floor(row["centroid_lat"] * 10) / 10 + 0.05
            cell_lng = math.floor(row["centroid_lng"] * 10) / 10 + 0.05
            cells[cid] = {
                "cell_id": cid,
                "centroid_lat": cell_lat,
                "centroid_lng": cell_lng,
                "beach_ids": [],
            }
        cells[cid]["beach_ids"].append(row["id"])
    return list(cells.values())


def _fetch_open_meteo_climate(lat: float, lng: float) -> dict | None:
    """Fetch 30-year climate normals from Open-Meteo historical API.

    Returns dict with 12-element arrays for each metric, or None on failure.
    Aggregates daily data from 1991-2020 into monthly averages.
    """
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat,
        "longitude": lng,
        "start_date": "1991-01-01",
        "end_date": "2020-12-31",
        "daily": ",".join([
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "sunshine_duration",
            "windspeed_10m_max",
            "winddirection_10m_dominant",
        ]),
        "timezone": "auto",
    }
    resp = requests.get(url, params=params, timeout=60)
    if resp.status_code == 429:
        raise RuntimeError(f"Open-Meteo 429 rate-limited: {resp.text[:200]}")
    resp.raise_for_status()
    data = resp.json()

    daily = data.get("daily", {})
    if not daily or not daily.get("time"):
        return None

    # Aggregate daily values into monthly averages
    monthly = {m: {"temp_max": [], "temp_min": [], "rain": [], "sun": [],
                    "wind": [], "wind_dir": []}
               for m in range(1, 13)}

    times = daily["time"]
    for i, date_str in enumerate(times):
        month = int(date_str[5:7])
        if daily["temperature_2m_max"][i] is not None:
            monthly[month]["temp_max"].append(daily["temperature_2m_max"][i])
        if daily["temperature_2m_min"][i] is not None:
            monthly[month]["temp_min"].append(daily["temperature_2m_min"][i])
        if daily["precipitation_sum"][i] is not None:
            monthly[month]["rain"].append(daily["precipitation_sum"][i])
        if daily["sunshine_duration"][i] is not None:
            monthly[month]["sun"].append(daily["sunshine_duration"][i])
        if daily["windspeed_10m_max"][i] is not None:
            monthly[month]["wind"].append(daily["windspeed_10m_max"][i])
        if daily["winddirection_10m_dominant"][i] is not None:
            monthly[month]["wind_dir"].append(daily["winddirection_10m_dominant"][i])

    def avg(lst):
        return round(sum(lst) / len(lst), 1) if lst else None

    def avg_sum(lst, days_per_month=30):
        """For precipitation: average the daily sums, then multiply by days."""
        if not lst:
            return None
        return round(sum(lst) / len(lst) * days_per_month, 1)

    def dominant_direction(angles):
        """Find prevailing wind direction from angles."""
        if not angles:
            return None
        import math as m
        sin_sum = sum(m.sin(m.radians(a)) for a in angles)
        cos_sum = sum(m.cos(m.radians(a)) for a in angles)
        avg_angle = m.degrees(m.atan2(sin_sum, cos_sum)) % 360
        dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
        idx = round(avg_angle / 45) % 8
        return dirs[idx]

    def sun_hours(seconds_list):
        """Convert sunshine_duration (seconds) to hours per month."""
        if not seconds_list:
            return None
        avg_daily_hrs = sum(seconds_list) / len(seconds_list) / 3600
        return round(avg_daily_hrs * 30, 0)

    return {
        "air_temp_high": [avg(monthly[m]["temp_max"]) for m in range(1, 13)],
        "air_temp_low": [avg(monthly[m]["temp_min"]) for m in range(1, 13)],
        "rain_mm": [avg_sum(monthly[m]["rain"]) for m in range(1, 13)],
        "sun_hours": [sun_hours(monthly[m]["sun"]) for m in range(1, 13)],
        "wind_speed": [avg(monthly[m]["wind"]) for m in range(1, 13)],
        "wind_direction": [dominant_direction(monthly[m]["wind_dir"]) for m in range(1, 13)],
    }


def _fetch_open_meteo_marine(lat: float, lng: float) -> dict | None:
    """Fetch marine climate data from Open-Meteo marine API.

    Returns dict with 12-element arrays, or None on failure / inland point.
    """
    url = "https://marine-api.open-meteo.com/v1/marine"
    params = {
        "latitude": lat,
        "longitude": lng,
        "daily": "wave_height_mean,wave_period_max,wave_direction_dominant",
        "start_date": "2015-01-01",
        "end_date": "2024-12-31",
        "timezone": "auto",
    }
    resp = requests.get(url, params=params, timeout=60)
    if resp.status_code == 400:
        return None  # Inland point, no marine data
    if resp.status_code == 429:
        raise RuntimeError(f"Open-Meteo marine 429 rate-limited: {resp.text[:200]}")
    resp.raise_for_status()
    data = resp.json()

    daily = data.get("daily", {})
    if not daily or not daily.get("time"):
        return None

    monthly = {m: {"wave_h": [], "wave_p": [], "wave_d": []} for m in range(1, 13)}
    times = daily["time"]
    for i, date_str in enumerate(times):
        month = int(date_str[5:7])
        if daily.get("wave_height_mean") and daily["wave_height_mean"][i] is not None:
            monthly[month]["wave_h"].append(daily["wave_height_mean"][i])
        if daily.get("wave_period_max") and daily["wave_period_max"][i] is not None:
            monthly[month]["wave_p"].append(daily["wave_period_max"][i])
        if daily.get("wave_direction_dominant") and daily["wave_direction_dominant"][i] is not None:
            monthly[month]["wave_d"].append(daily["wave_direction_dominant"][i])

    def avg(lst):
        return round(sum(lst) / len(lst), 1) if lst else None

    def dominant_direction(angles):
        if not angles:
            return None
        import math as m
        sin_sum = sum(m.sin(m.radians(a)) for a in angles)
        cos_sum = sum(m.cos(m.radians(a)) for a in angles)
        avg_angle = m.degrees(m.atan2(sin_sum, cos_sum)) % 360
        dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
        idx = round(avg_angle / 45) % 8
        return dirs[idx]

    return {
        "wave_height_m": [avg(monthly[m]["wave_h"]) for m in range(1, 13)],
        "wave_period_s": [avg(monthly[m]["wave_p"]) for m in range(1, 13)],
        "swell_direction": [dominant_direction(monthly[m]["wave_d"]) for m in range(1, 13)],
    }


def fetch_cell_climate(cell: dict, conn) -> bool:
    """Fetch climate + marine data for a single grid cell and store in climate_grid_cells.

    Returns True if data was fetched, False if skipped (already exists or failed).
    """
    existing = conn.execute(
        "SELECT 1 FROM climate_grid_cells WHERE cell_id = ?", (cell["cell_id"],)
    ).fetchone()
    if existing:
        return False

    lat, lng = cell["centroid_lat"], cell["centroid_lng"]

    climate = _fetch_open_meteo_climate(lat, lng)
    if not climate:
        return False

    marine = _fetch_open_meteo_marine(lat, lng)

    conn.execute(
        """INSERT INTO climate_grid_cells
           (cell_id, centroid_lat, centroid_lng,
            climate_air_temp_high, climate_air_temp_low, climate_rain_mm,
            climate_sun_hours, climate_wind_speed, climate_wind_direction,
            climate_uv_index, climate_humidity_pct, climate_cloud_cover_pct,
            ocean_water_temp, ocean_wave_height_m, ocean_wave_period_s,
            ocean_swell_direction, ocean_salinity_psu, ocean_chlorophyll,
            fetched_at, source)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            cell["cell_id"], lat, lng,
            json.dumps(climate["air_temp_high"]),
            json.dumps(climate["air_temp_low"]),
            json.dumps(climate["rain_mm"]),
            json.dumps(climate["sun_hours"]),
            json.dumps(climate["wind_speed"]),
            json.dumps(climate["wind_direction"]),
            None,  # uv_index (not in basic Open-Meteo historical)
            None,  # humidity (not in basic Open-Meteo historical)
            None,  # cloud_cover (not in basic Open-Meteo historical)
            None,  # ocean_water_temp (Copernicus SST, deferred to follow-up plan)
            json.dumps(marine["wave_height_m"]) if marine else None,
            json.dumps(marine["wave_period_s"]) if marine else None,
            json.dumps(marine["swell_direction"]) if marine else None,
            None,  # salinity (Copernicus, future phase)
            None,  # chlorophyll (Copernicus, future phase)
            datetime.utcnow().isoformat(),
            "open_meteo_era5",
        ),
    )
    return True


def map_climate_to_beaches(conn) -> int:
    """Copy climate data from grid cells to each beach's row. Returns count updated."""
    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches WHERE climate_grid_cell IS NULL"
    ).fetchall()

    count = 0
    for row in tqdm(rows, desc="Mapping climate to beaches"):
        cid = grid_cell_id(row["centroid_lat"], row["centroid_lng"])
        cell = conn.execute("SELECT * FROM climate_grid_cells WHERE cell_id = ?", (cid,)).fetchone()
        if not cell:
            continue

        conn.execute(
            """UPDATE beaches SET
               climate_air_temp_high = ?, climate_air_temp_low = ?,
               climate_rain_mm = ?, climate_sun_hours = ?,
               climate_wind_speed = ?, climate_wind_direction = ?,
               climate_uv_index = ?, climate_humidity_pct = ?, climate_cloud_cover_pct = ?,
               climate_source = ?, climate_grid_cell = ?,
               ocean_water_temp = ?,
               ocean_wave_height_m = ?, ocean_wave_period_s = ?,
               ocean_swell_direction = ?,
               ocean_source = ?,
               enrichment_version = COALESCE(enrichment_version, 0) + 1,
               updated_at = datetime('now')
               WHERE id = ?""",
            (
                cell["climate_air_temp_high"], cell["climate_air_temp_low"],
                cell["climate_rain_mm"], cell["climate_sun_hours"],
                cell["climate_wind_speed"], cell["climate_wind_direction"],
                cell["climate_uv_index"], cell["climate_humidity_pct"], cell["climate_cloud_cover_pct"],
                cell["source"], cid,
                cell["ocean_water_temp"],
                cell["ocean_wave_height_m"], cell["ocean_wave_period_s"],
                cell["ocean_swell_direction"],
                "open_meteo_marine" if cell["ocean_wave_height_m"] else None,
                row["id"],
            ),
        )
        count += 1
        if count % 10000 == 0:
            conn.commit()

    conn.commit()
    return count


def run_phase1(conn, max_cells: int | None = None, delay_seconds: float = 0.5):
    """Run the full Phase 1 pipeline: compute cells → fetch climate → map to beaches.

    Args:
        conn: SQLite connection (must be migrated)
        max_cells: Limit number of cells to fetch (for testing/resuming)
        delay_seconds: Delay between API calls (respect rate limits)
    """
    # Log start (mark any stale "running" entries as interrupted first)
    conn.execute(
        """UPDATE enrichment_log SET status='interrupted', updated_at=datetime('now')
           WHERE script_name='grid_climate' AND status='running'"""
    )
    conn.execute(
        """INSERT INTO enrichment_log (script_name, phase, status, started_at)
           VALUES ('grid_climate', 'phase_1', 'running', datetime('now'))"""
    )
    conn.commit()

    # Step 1: Compute grid cells
    print("Computing grid cells...")
    cells = compute_grid_cells(conn)
    print(f"  {len(cells)} unique grid cells from all beaches")

    # Step 2: Fetch climate for each cell
    fetched = 0
    skipped = 0
    errors = 0
    cells_to_fetch = cells[:max_cells] if max_cells else cells
    for cell in tqdm(cells_to_fetch, desc="Fetching climate data"):
        try:
            if fetch_cell_climate(cell, conn):
                fetched += 1
                if fetched % 100 == 0:
                    conn.commit()
            else:
                skipped += 1
        except Exception as e:
            errors += 1
            if errors % 10 == 0:
                print(f"  {errors} errors so far (latest: {e})")
        time.sleep(delay_seconds)

    conn.commit()
    print(f"  Fetched: {fetched}, Skipped: {skipped}, Errors: {errors}")

    # Step 3: Map climate to beaches
    print("Mapping climate data to beaches...")
    mapped = map_climate_to_beaches(conn)
    print(f"  Mapped climate to {mapped} beaches")

    # Log completion
    conn.execute(
        """UPDATE enrichment_log SET status='completed', completed_at=datetime('now'),
           total_processed=?, total_errors=?
           WHERE script_name='grid_climate' AND status='running'""",
        (fetched, errors),
    )
    conn.commit()


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    max_cells = int(sys.argv[2]) if len(sys.argv) > 2 else None

    conn = get_connection(db_path)
    migrate(conn)
    run_phase1(conn, max_cells=max_cells)
    conn.close()
