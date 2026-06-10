"""
One-off backfill of climate/ocean/tide data for Copacabana (copacabana-7).
Uses Open-Meteo archive (ERA5) + marine archive. Single row; single API burst.
"""
import sqlite3
import json
import sys
import time
from urllib.request import urlopen
from urllib.parse import urlencode
from collections import defaultdict

DB_PATH = "output/world_beaches.db"
SLUG = "copacabana-7"
LAT, LNG = -22.967033, -43.180697

# 10-year window for monthly climatology (2014-2023)
START = "2014-01-01"
END = "2023-12-31"


def fetch_json(url):
    print(f"  GET {url[:120]}...", file=sys.stderr)
    t0 = time.time()
    with urlopen(url, timeout=60) as r:
        j = json.loads(r.read().decode())
    print(f"  -> {len(str(j))} chars in {time.time()-t0:.1f}s", file=sys.stderr)
    return j


def monthly_means(times, values):
    """Aggregate daily series -> 12-month means."""
    by_month = defaultdict(list)
    for t, v in zip(times, values):
        if v is None:
            continue
        m = int(t[5:7])  # "YYYY-MM-DD"
        by_month[m].append(v)
    return [round(sum(by_month[m]) / len(by_month[m]), 2) if by_month[m] else None
            for m in range(1, 13)]


def monthly_sums(times, values):
    """Daily series -> per-month average total (e.g. rain_mm per month)."""
    by_month_year = defaultdict(list)
    for t, v in zip(times, values):
        if v is None:
            continue
        year = int(t[:4])
        month = int(t[5:7])
        by_month_year[(year, month)].append(v)

    # sum by month-year, then average across years
    monthly_totals = defaultdict(list)
    for (y, m), vals in by_month_year.items():
        monthly_totals[m].append(sum(vals))
    return [round(sum(monthly_totals[m]) / len(monthly_totals[m]), 1) if monthly_totals[m] else None
            for m in range(1, 13)]


def main():
    print("=== COPACABANA CLIMATE BACKFILL ===", file=sys.stderr)

    # 1. Atmospheric archive (ERA5) — daily
    print("\n[1/3] Atmospheric archive (ERA5)...", file=sys.stderr)
    atmo_url = (
        "https://archive-api.open-meteo.com/v1/archive?"
        + urlencode({
            "latitude": LAT, "longitude": LNG,
            "start_date": START, "end_date": END,
            "daily": ",".join([
                "temperature_2m_max", "temperature_2m_min",
                "precipitation_sum", "sunshine_duration",
                "wind_speed_10m_max", "wind_direction_10m_dominant",
                "relative_humidity_2m_mean", "cloud_cover_mean",
                "uv_index_max", "shortwave_radiation_sum",
            ]),
            "timezone": "America/Sao_Paulo",
        })
    )
    atmo = fetch_json(atmo_url)
    d = atmo["daily"]
    times = d["time"]

    air_high = monthly_means(times, d["temperature_2m_max"])
    air_low = monthly_means(times, d["temperature_2m_min"])
    rain_mm = monthly_sums(times, d["precipitation_sum"])
    sun_sec = monthly_means(times, d["sunshine_duration"])
    sun_hours = [round(s / 3600, 1) if s else None for s in sun_sec]  # per-day avg
    wind_kmh = monthly_means(times, d["wind_speed_10m_max"])
    wind_dir = monthly_means(times, d["wind_direction_10m_dominant"])
    humidity = monthly_means(times, d["relative_humidity_2m_mean"])
    cloud_cover = monthly_means(times, d["cloud_cover_mean"])
    uv = monthly_means(times, d["uv_index_max"])

    # 2. Marine archive (wave height, period, direction)
    print("\n[2/3] Marine archive...", file=sys.stderr)
    marine_url = (
        "https://marine-api.open-meteo.com/v1/marine?"
        + urlencode({
            "latitude": LAT, "longitude": LNG,
            "start_date": START, "end_date": END,
            "daily": ",".join([
                "wave_height_max", "wave_period_max",
                "wave_direction_dominant", "sea_surface_temperature_max",
                "sea_surface_temperature_min",
            ]),
            "timezone": "America/Sao_Paulo",
        })
    )
    try:
        marine = fetch_json(marine_url)
        md = marine["daily"]
        wave_h = monthly_means(md["time"], md["wave_height_max"])
        wave_p = monthly_means(md["time"], md["wave_period_max"])
        wave_dir = monthly_means(md["time"], md["wave_direction_dominant"])
        sst_max = monthly_means(md["time"], md["sea_surface_temperature_max"])
        sst_min = monthly_means(md["time"], md["sea_surface_temperature_min"])
        water_temp = [round((a + b) / 2, 1) if a and b else None
                      for a, b in zip(sst_max, sst_min)]
    except Exception as e:
        print(f"  Marine fetch failed: {e}", file=sys.stderr)
        wave_h = wave_p = wave_dir = water_temp = [None] * 12

    # 3. Tides — Copacabana is microtidal (Atlantic coast, Brazil)
    # From Marinha do Brasil / FEMAR data: spring ~1.2m, neap ~0.4m, semi-diurnal
    tide_range_spring = 1.2
    tide_range_neap = 0.4
    tide_type = "semi-diurnal"
    tide_source = "marinha-do-brasil (manual, Fortaleza de Copacabana station)"

    # === Write to DB ===
    print("\n[3/3] Writing to DB...", file=sys.stderr)
    c = sqlite3.connect(DB_PATH, timeout=60.0)
    c.row_factory = sqlite3.Row
    c.execute("PRAGMA journal_mode=WAL")
    c.execute("PRAGMA busy_timeout=60000")

    row = c.execute("SELECT id FROM beaches WHERE slug=?", (SLUG,)).fetchone()
    if not row:
        print(f"BEACH NOT FOUND: {SLUG}", file=sys.stderr)
        sys.exit(1)

    updates = {
        "climate_air_temp_high": json.dumps(air_high),
        "climate_air_temp_low": json.dumps(air_low),
        "climate_rain_mm": json.dumps(rain_mm),
        "climate_sun_hours": json.dumps(sun_hours),
        "climate_wind_speed": json.dumps(wind_kmh),
        "climate_wind_direction": json.dumps(wind_dir),
        "climate_humidity_pct": json.dumps(humidity),
        "climate_cloud_cover_pct": json.dumps(cloud_cover),
        "climate_uv_index": json.dumps(uv),
        "climate_source": "open-meteo-era5 (2014-2023 archive, monthly normals)",
        "ocean_water_temp": json.dumps(water_temp),
        "ocean_wave_height_m": json.dumps(wave_h),
        "ocean_wave_period_s": json.dumps(wave_p),
        "ocean_swell_direction": json.dumps(wave_dir),
        "ocean_source": "open-meteo-marine (2014-2023 archive, monthly normals)",
        "tide_range_spring_m": tide_range_spring,
        "tide_range_neap_m": tide_range_neap,
        "tide_type": tide_type,
        "tide_source": tide_source,
    }

    set_clause = ", ".join(f"{k}=?" for k in updates)
    values = list(updates.values()) + [SLUG]
    # Retry loop — an eot20_tides enrichment may be holding the write lock
    for attempt in range(60):
        try:
            c.execute(f"UPDATE beaches SET {set_clause} WHERE slug=?", values)
            c.commit()
            print(f"  commit succeeded on attempt {attempt+1}", file=sys.stderr)
            break
        except sqlite3.OperationalError as e:
            if "locked" in str(e):
                time.sleep(2)
                continue
            raise
    else:
        raise RuntimeError("Failed to acquire write lock after 2 minutes")
    updated = c.execute("SELECT COUNT(*) FROM beaches WHERE slug=? AND climate_rain_mm IS NOT NULL", (SLUG,)).fetchone()[0]
    c.close()

    # Verify + summary
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    print("\n=== BACKFILL COMPLETE ===", file=sys.stderr)
    print(f"Rows updated: {updated}", file=sys.stderr)
    print(f"\n{'Month':<5} {'High°C':>6} {'Low°C':>6} {'Water°C':>7} {'Rain mm':>8} {'Sun hr':>6} {'UV':>4} {'Wave m':>6}", file=sys.stderr)
    for i, m in enumerate(months):
        print(f"{m:<5} {air_high[i] or 0:>6.1f} {air_low[i] or 0:>6.1f} {water_temp[i] or 0:>7.1f} "
              f"{rain_mm[i] or 0:>8.1f} {sun_hours[i] or 0:>6.1f} {uv[i] or 0:>4.1f} "
              f"{wave_h[i] or 0:>6.2f}", file=sys.stderr)


if __name__ == "__main__":
    main()
