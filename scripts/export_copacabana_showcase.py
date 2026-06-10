"""
Export Copacabana's full showcase data (core + new tables) into the site JSON.
Merges with the existing structure so the legacy template still works.
"""
import sqlite3
import json
import sys
from pathlib import Path

DB_PATH = "output/world_beaches.db"
SLUG = "copacabana-7"
OUT = Path("site/data/beaches/copacabana-7.json")

c = sqlite3.connect(DB_PATH)
c.row_factory = sqlite3.Row

b = c.execute("SELECT * FROM beaches WHERE slug=?", (SLUG,)).fetchone()
if not b:
    print("Beach not found", file=sys.stderr); sys.exit(1)
bid = b["id"]

# --- Core (preserve existing structure)
out = {
    "slug": b["slug"],
    "name": b["name"],
    "centroid_lat": b["centroid_lat"],
    "centroid_lng": b["centroid_lng"],
    "country_code": b["country_code"],
    "admin_level_1": b["admin_level_1"],
    "admin_level_2": b["admin_level_2"],
    "water_body_type": b["water_body_type"],
    "substrate_type": b["substrate_type"],
    "beach_length_m": b["beach_length_m"],
    "wikipedia_url": b["wikipedia_url"],
    "notability_score": b["notability_score"],
    "data_completeness_pct": b["data_completeness_pct"],
    "nearest_city": b["nearest_city"],
    "nearest_city_distance_km": b["nearest_city_distance_km"],
    "nearest_airport": {
        "iata": b["nearest_airport_iata"],
        "name": b["nearest_airport_name"],
        "distance_km": b["nearest_airport_distance_km"],
    } if b["nearest_airport_iata"] else None,
    "safety": {
        "shark_incidents_total": 0,  # GSAF returned zero
    },
    "facilities": {
        "parking": bool(b["has_parking"]),
        "restrooms": bool(b["has_restrooms"]),
        "food_nearby": bool(b["has_food_nearby"]),
    },
}

# --- Sources
out["sources"] = [dict(r) for r in c.execute(
    "SELECT source_name, source_id, source_url FROM beach_sources WHERE beach_id=?", (bid,)
)]

# --- Attributes
attrs = {}
for r in c.execute("SELECT category, key, value FROM beach_attributes WHERE beach_id=?", (bid,)):
    attrs.setdefault(r["category"], {})[r["key"]] = r["value"]
out["attributes"] = attrs

# --- Species
out["species"] = [dict(r) for r in c.execute(
    "SELECT species_name, common_name, taxon_group, observation_count, source FROM beach_species "
    "WHERE beach_id=? ORDER BY observation_count DESC LIMIT 20", (bid,)
)]

# --- Climate monthly (parse JSON arrays)
def parse_json_arr(v):
    if v is None: return None
    if isinstance(v, str) and v.startswith("["):
        try: return json.loads(v)
        except: return None
    return v

out["climate"] = {
    "air_temp_high": parse_json_arr(b["climate_air_temp_high"]),
    "air_temp_low": parse_json_arr(b["climate_air_temp_low"]),
    "water_temp": parse_json_arr(b["ocean_water_temp"]),
    "rain_mm": parse_json_arr(b["climate_rain_mm"]),
    "sun_hours": parse_json_arr(b["climate_sun_hours"]),
    "wind_speed_kmh": parse_json_arr(b["climate_wind_speed"]),
    "wind_direction": parse_json_arr(b["climate_wind_direction"]),
    "humidity_pct": parse_json_arr(b["climate_humidity_pct"]),
    "cloud_cover_pct": parse_json_arr(b["climate_cloud_cover_pct"]),
    "wave_height_m": parse_json_arr(b["ocean_wave_height_m"]),
    "wave_period_s": parse_json_arr(b["ocean_wave_period_s"]),
    "swell_direction": parse_json_arr(b["ocean_swell_direction"]),
    "climate_source": b["climate_source"],
    "ocean_source": b["ocean_source"],
}
out["tides"] = {
    "range_spring_m": b["tide_range_spring_m"],
    "range_neap_m": b["tide_range_neap_m"],
    "type": b["tide_type"],
    "source": b["tide_source"],
}

# --- Showcase: narrative + new tables
out["showcase"] = {
    "is_showcase": bool(b["is_showcase"]),
    "signature_motif": b["signature_motif"],
    "intro_text": b["intro_text"],
    "favela_note": b["favela_note"],
    "day_in_time": json.loads(b["day_in_time_json"]) if b["day_in_time_json"] else None,
    "food_drink": json.loads(b["food_drink_json"]) if b["food_drink_json"] else None,
    "timeline": [dict(r) for r in c.execute(
        "SELECT year, month, event_type, title, description, wiki_url, source "
        "FROM beach_timeline_events WHERE beach_id=? ORDER BY year, COALESCE(month,0)", (bid,)
    )],
    "zones": [dict(r) for r in c.execute(
        "SELECT zone_code, name, position_along_beach_pct, lat, lng, character, best_for, notes "
        "FROM beach_zones WHERE beach_id=? ORDER BY position_along_beach_pct", (bid,)
    )],
    "landmarks": [dict(r) for r in c.execute(
        "SELECT name, landmark_type, year_built, architect_or_designer, description, "
        "wikipedia_url, lat, lng FROM beach_landmarks WHERE beach_id=?", (bid,)
    )],
    "cultural_refs": [dict(r) for r in c.execute(
        "SELECT ref_type, title, creator, year, description, wikipedia_url, external_url "
        "FROM beach_cultural_refs WHERE beach_id=? ORDER BY year", (bid,)
    )],
    "recurring_events": [dict(r) for r in c.execute(
        "SELECT name, when_text, month, description, typical_attendance "
        "FROM beach_recurring_events WHERE beach_id=?", (bid,)
    )],
    "businesses": [dict(r) for r in c.execute(
        "SELECT name, category, description, address, year_established, lat, lng, external_url, source "
        "FROM beach_businesses WHERE beach_id=?", (bid,)
    )],
}

# --- Photo records (all 81 so the gallery can pick)
out["photos"] = [dict(r) for r in c.execute(
    "SELECT id, title, url, thumbnail_url, source, license, author, width, height "
    "FROM beach_photos WHERE beach_id=? ORDER BY source, id", (bid,)
)]

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False, default=str), encoding="utf-8")

size_kb = OUT.stat().st_size / 1024
print(f"Wrote {OUT} ({size_kb:.1f} KB)", file=sys.stderr)
print(f"  timeline: {len(out['showcase']['timeline'])} events")
print(f"  zones: {len(out['showcase']['zones'])}")
print(f"  landmarks: {len(out['showcase']['landmarks'])}")
print(f"  cultural_refs: {len(out['showcase']['cultural_refs'])}")
print(f"  businesses: {len(out['showcase']['businesses'])}")
print(f"  photos: {len(out['photos'])}")
print(f"  climate months: {len([x for x in out['climate']['air_temp_high'] or [] if x])}")

c.close()
