"""Climate/ocean/tide backfill for brighton-beach-1 (central Brighton between the piers).
Same pattern as Copacabana backfill, different coords. UK Channel coast is tidal —
spring range ~6.0m, semi-diurnal."""
import sqlite3, json, sys, time
from urllib.request import urlopen
from urllib.parse import urlencode
from collections import defaultdict

DB_PATH = "output/world_beaches.db"
SLUG = "brighton-beach-1"
LAT, LNG = 50.8189, -0.1380
START, END = "2014-01-01", "2023-12-31"

def fetch_json(url):
    print(f"  GET ...{url[-80:]}", file=sys.stderr)
    with urlopen(url, timeout=60) as r:
        return json.loads(r.read().decode())

def monthly_means(times, values):
    by_m = defaultdict(list)
    for t, v in zip(times, values):
        if v is None: continue
        by_m[int(t[5:7])].append(v)
    return [round(sum(by_m[m]) / len(by_m[m]), 2) if by_m[m] else None for m in range(1, 13)]

def monthly_sums(times, values):
    by_ym = defaultdict(list)
    for t, v in zip(times, values):
        if v is None: continue
        by_ym[(int(t[:4]), int(t[5:7]))].append(v)
    totals = defaultdict(list)
    for (y, m), vals in by_ym.items():
        totals[m].append(sum(vals))
    return [round(sum(totals[m]) / len(totals[m]), 1) if totals[m] else None for m in range(1, 13)]

def main():
    print("=== BRIGHTON CLIMATE BACKFILL ===", file=sys.stderr)
    atmo = fetch_json(
        "https://archive-api.open-meteo.com/v1/archive?" + urlencode({
            "latitude": LAT, "longitude": LNG,
            "start_date": START, "end_date": END,
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,sunshine_duration,wind_speed_10m_max,wind_direction_10m_dominant,relative_humidity_2m_mean,cloud_cover_mean,shortwave_radiation_sum",
            "timezone": "Europe/London",
        }))
    d = atmo["daily"]; times = d["time"]
    air_high = monthly_means(times, d["temperature_2m_max"])
    air_low = monthly_means(times, d["temperature_2m_min"])
    rain_mm = monthly_sums(times, d["precipitation_sum"])
    sun_sec = monthly_means(times, d["sunshine_duration"])
    sun_hours = [round(s / 3600, 1) if s else None for s in sun_sec]
    wind_kmh = monthly_means(times, d["wind_speed_10m_max"])
    wind_dir = monthly_means(times, d["wind_direction_10m_dominant"])
    humidity = monthly_means(times, d["relative_humidity_2m_mean"])
    cloud_cover = monthly_means(times, d["cloud_cover_mean"])

    print("  marine...", file=sys.stderr)
    try:
        marine = fetch_json(
            "https://marine-api.open-meteo.com/v1/marine?" + urlencode({
                "latitude": LAT, "longitude": LNG,
                "start_date": START, "end_date": END,
                "daily": "wave_height_max,wave_period_max,wave_direction_dominant,sea_surface_temperature_max,sea_surface_temperature_min",
                "timezone": "Europe/London",
            }))
        md = marine["daily"]
        wave_h = monthly_means(md["time"], md["wave_height_max"])
        wave_p = monthly_means(md["time"], md["wave_period_max"])
        wave_dir = monthly_means(md["time"], md["wave_direction_dominant"])
        sst_max = monthly_means(md["time"], md["sea_surface_temperature_max"])
        sst_min = monthly_means(md["time"], md["sea_surface_temperature_min"])
        water_temp = [round((a + b) / 2, 1) if a and b else None for a, b in zip(sst_max, sst_min)]
    except Exception as e:
        print(f"  Marine failed: {e}", file=sys.stderr)
        wave_h = wave_p = wave_dir = water_temp = [None] * 12

    # UK Channel coast tides — Brighton is meso-tidal, semi-diurnal
    # Admiralty Hydrographic Office: Brighton Palace Pier spring 6.0m, neap 3.0m (approx)
    tide_range_spring = 6.0
    tide_range_neap = 3.0
    tide_type = "semi-diurnal"
    tide_source = "UK Admiralty Hydrographic Office (typical Channel coast values)"

    c = sqlite3.connect(DB_PATH, timeout=60.0)
    c.execute("PRAGMA busy_timeout=60000")
    updates = {
        "climate_air_temp_high": json.dumps(air_high),
        "climate_air_temp_low": json.dumps(air_low),
        "climate_rain_mm": json.dumps(rain_mm),
        "climate_sun_hours": json.dumps(sun_hours),
        "climate_wind_speed": json.dumps(wind_kmh),
        "climate_wind_direction": json.dumps(wind_dir),
        "climate_humidity_pct": json.dumps(humidity),
        "climate_cloud_cover_pct": json.dumps(cloud_cover),
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
    for attempt in range(60):
        try:
            c.execute(f"UPDATE beaches SET {set_clause} WHERE slug=?", values)
            c.commit()
            break
        except sqlite3.OperationalError as e:
            if "locked" in str(e):
                time.sleep(2); continue
            raise
    else:
        raise RuntimeError("locked")

    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    print("=== DONE ===", file=sys.stderr)
    print(f"{'Mon':<4} {'Air hi':>7} {'Air lo':>7} {'Sea':>6} {'Rain':>7} {'Sun':>5} {'Wave':>6}", file=sys.stderr)
    for i, m in enumerate(months):
        print(f"{m:<4} {air_high[i] or 0:>7.1f} {air_low[i] or 0:>7.1f} {water_temp[i] or 0:>6.1f} {rain_mm[i] or 0:>7.1f} {sun_hours[i] or 0:>5.1f} {wave_h[i] or 0:>6.2f}", file=sys.stderr)


if __name__ == "__main__":
    main()
