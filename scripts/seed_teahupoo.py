"""Seed Teahupoʻo into world_beaches.db.

Per research (docs/teahupoo-research.md):
- Commune: Taiarapu-Ouest (NOT Pueu)
- Village coords: -17.84645, -149.26682 (Wikipedia infobox)
- Wave at Passe Havae ~800m offshore, west-southwest
- Wikidata: Q1366155
- Wikipedia: en.wikipedia.org/wiki/Teahupo%CA%BBo
- Population: 1455 (2022)
- Drive from Papeete: ~70 km / 1.5 hr
"""
import sqlite3
import json
from pathlib import Path

DB = Path("output/world_beaches.db")
SLUG = "teahupoo"

conn = sqlite3.connect(DB)
cur = conn.cursor()

# Check if exists
existing = cur.execute("SELECT slug FROM beaches WHERE slug=?", (SLUG,)).fetchone()
if existing:
    print(f"Already exists: {SLUG}")
else:
    # Use a stable id format consistent with the DB ('seeded-<slug>')
    bid = f"seeded-{SLUG}"

    # Approximate wave coords (Passe Havae, west-southwest of village)
    # village ~(-17.84645, -149.26682); wave is ~800m WSW
    centroid_lat = -17.8527  # tweaked toward the actual surfable lineup
    centroid_lng = -149.2740

    # GeoJSON Point at the wave's takeoff
    geom = {
        "type": "Point",
        "coordinates": [centroid_lng, centroid_lat]
    }

    # Notability: high — equivalent to other surf marquees
    cur.execute("""
        INSERT INTO beaches (
            id, slug, name, geometry_geojson, centroid_lat, centroid_lng,
            country_code, admin_level_1, admin_level_2, admin_level_3,
            water_body_type, substrate_type, beach_length_m,
            nearest_city, nearest_city_distance_km,
            nearest_airport_iata, nearest_airport_name, nearest_airport_distance_km,
            wikipedia_url, wikidata_id, wikipedia_page_views_annual, wikidata_sitelinks,
            notability_score, source_layer, created_at, updated_at,
            sand_color, coastal_type, orientation_deg, orientation_label,
            sunset_visible, elevation_m,
            shark_incidents_total, lifeguard,
            coral_reef_distance_km, protected_area_name,
            is_showcase, signature_motif
        ) VALUES (
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?
        )
    """, (
        bid, SLUG, "Teahupoʻo", json.dumps(geom), centroid_lat, centroid_lng,
        "PF", "Iles du Vent (Windward Islands)", "Tahiti", "Taiarapu-Ouest",
        "ocean", "reef", 800.0,  # Passe Havae width approx
        "Vairao", 12.0,
        "PPT", "Faa'a International Airport", 70.0,
        "https://en.wikipedia.org/wiki/Teahupo%CA%BBo", "Q1366155", 180000, 36,
        90.0, 99, "2026-04-19T00:00:00Z", "2026-04-19T00:00:00Z",
        "white-coral", "reef-pass", 200.0, "south-southwest",
        1, 0.0,
        1, 0,  # 1 confirmed surfing fatality (Brice Taerea 2000), no lifeguard service
        0.0, "Aire marine éducative de Teahupoʻo (school-managed marine area)",
        1, "teahupoo-bathymetry"
    ))
    conn.commit()
    print(f"Seeded: {SLUG} at ({centroid_lat}, {centroid_lng}) with notab=90.0")

# Verify
row = cur.execute("""
    SELECT slug, name, country_code, admin_level_1, admin_level_3,
           centroid_lat, centroid_lng, notability_score, wikidata_id
    FROM beaches WHERE slug=?
""", (SLUG,)).fetchone()
print("Verified:", row)
conn.close()
