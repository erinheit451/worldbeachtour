"""
Additive schema migration: adds enrichment columns to beaches table
and creates new tables (beach_photos, beach_species, climate_grid_cells, enrichment_log).

Idempotent — safe to re-run. Never drops columns or tables.
"""

import sqlite3
import sys
from pathlib import Path

BEACHES_NEW_COLUMNS = [
    ("admin_level_3", "TEXT"),
    ("sand_color", "TEXT"),
    ("coastal_type", "TEXT"),
    ("orientation_deg", "REAL"),
    ("orientation_label", "TEXT"),
    ("sunset_visible", "INTEGER"),
    ("elevation_m", "REAL"),
    ("nearshore_depth_m", "REAL"),
    ("nearest_city", "TEXT"),
    ("nearest_city_distance_km", "REAL"),
    ("nearest_airport_iata", "TEXT"),
    ("nearest_airport_name", "TEXT"),
    ("nearest_airport_distance_km", "REAL"),
    ("climate_air_temp_high", "JSON"),
    ("climate_air_temp_low", "JSON"),
    ("climate_rain_mm", "JSON"),
    ("climate_sun_hours", "JSON"),
    ("climate_wind_speed", "JSON"),
    ("climate_wind_direction", "JSON"),
    ("climate_uv_index", "JSON"),
    ("climate_humidity_pct", "JSON"),
    ("climate_cloud_cover_pct", "JSON"),
    ("climate_source", "TEXT"),
    ("climate_grid_cell", "TEXT"),
    ("ocean_water_temp", "JSON"),
    ("ocean_wave_height_m", "JSON"),
    ("ocean_wave_period_s", "JSON"),
    ("ocean_swell_direction", "JSON"),
    ("ocean_salinity_psu", "JSON"),
    ("ocean_chlorophyll", "JSON"),
    ("ocean_source", "TEXT"),
    ("tide_range_spring_m", "REAL"),
    ("tide_range_neap_m", "REAL"),
    ("tide_type", "TEXT"),
    ("tide_source", "TEXT"),
    ("tide_station_id", "TEXT"),
    ("water_quality_rating", "TEXT"),
    ("water_quality_source", "TEXT"),
    ("water_quality_year", "INTEGER"),
    ("blue_flag", "INTEGER DEFAULT 0"),
    ("blue_flag_source", "TEXT"),
    ("shark_incidents_total", "INTEGER"),
    ("shark_incident_last_year", "INTEGER"),
    ("shark_source", "TEXT"),
    ("lifeguard", "INTEGER"),
    ("lifeguard_source", "TEXT"),
    ("has_parking", "INTEGER"),
    ("has_restrooms", "INTEGER"),
    ("has_showers", "INTEGER"),
    ("has_changing_rooms", "INTEGER"),
    ("wheelchair_accessible", "INTEGER"),
    ("has_food_nearby", "INTEGER"),
    ("camping_allowed", "INTEGER"),
    ("dogs_allowed", "INTEGER"),
    ("nudism", "TEXT"),
    ("facilities_source", "TEXT"),
    ("protected_area_name", "TEXT"),
    ("protected_area_type", "TEXT"),
    ("protected_area_iucn", "TEXT"),
    ("protected_area_source", "TEXT"),
    ("unesco_site", "TEXT"),
    ("coral_reef_distance_km", "REAL"),
    ("seagrass_nearby", "INTEGER"),
    ("mangrove_nearby", "INTEGER"),
    ("species_observed_count", "INTEGER"),
    ("notable_species", "JSON"),
    ("ecology_sources", "JSON"),
    ("wikipedia_url", "TEXT"),
    ("wikipedia_page_views_annual", "INTEGER"),
    ("wikidata_id", "TEXT"),
    ("wikidata_sitelinks", "INTEGER"),
    ("photo_count", "INTEGER"),
    ("notability_score", "REAL"),
    ("best_months", "JSON"),
    ("swim_suitability", "TEXT"),
    ("swim_suitability_confidence", "TEXT"),
    ("data_completeness_pct", "REAL"),
    ("enrichment_version", "INTEGER DEFAULT 0"),
]

NEW_INDEXES = [
    ("idx_beaches_substrate", "beaches(substrate_type)"),
    ("idx_beaches_notability", "beaches(notability_score DESC)"),
    ("idx_beaches_climate_grid", "beaches(climate_grid_cell)"),
]

NEW_TABLES = {
    "beach_photos": """
        CREATE TABLE beach_photos (
            id INTEGER PRIMARY KEY,
            beach_id TEXT REFERENCES beaches(id),
            url TEXT NOT NULL,
            thumbnail_url TEXT,
            source TEXT NOT NULL,
            license TEXT,
            author TEXT,
            title TEXT,
            width INTEGER,
            height INTEGER,
            fetched_at TEXT
        )
    """,
    "beach_species": """
        CREATE TABLE beach_species (
            id INTEGER PRIMARY KEY,
            beach_id TEXT REFERENCES beaches(id),
            species_name TEXT NOT NULL,
            common_name TEXT,
            taxon_group TEXT,
            observation_count INTEGER,
            source TEXT,
            iucn_status TEXT,
            fetched_at TEXT
        )
    """,
    "climate_grid_cells": """
        CREATE TABLE climate_grid_cells (
            cell_id TEXT PRIMARY KEY,
            centroid_lat REAL,
            centroid_lng REAL,
            climate_air_temp_high JSON,
            climate_air_temp_low JSON,
            climate_rain_mm JSON,
            climate_sun_hours JSON,
            climate_wind_speed JSON,
            climate_wind_direction JSON,
            climate_uv_index JSON,
            climate_humidity_pct JSON,
            climate_cloud_cover_pct JSON,
            ocean_water_temp JSON,
            ocean_wave_height_m JSON,
            ocean_wave_period_s JSON,
            ocean_swell_direction JSON,
            ocean_salinity_psu JSON,
            ocean_chlorophyll JSON,
            fetched_at TEXT,
            source TEXT
        )
    """,
    "enrichment_log": """
        CREATE TABLE enrichment_log (
            id INTEGER PRIMARY KEY,
            script_name TEXT NOT NULL,
            phase TEXT,
            last_processed_id TEXT,
            total_processed INTEGER DEFAULT 0,
            total_errors INTEGER DEFAULT 0,
            status TEXT,
            started_at TEXT,
            updated_at TEXT,
            completed_at TEXT
        )
    """,
}

NEW_TABLE_INDEXES = [
    ("idx_photos_beach", "beach_photos(beach_id)"),
    ("idx_photos_source", "beach_photos(source)"),
    ("idx_species_beach", "beach_species(beach_id)"),
    ("idx_species_name", "beach_species(species_name)"),
    ("idx_enrichment_script", "enrichment_log(script_name)"),
]


def _column_exists(conn, table, column):
    cols = [r[1] for r in conn.execute(f"PRAGMA table_info({table})").fetchall()]
    return column in cols


def _table_exists(conn, table):
    return conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (table,)
    ).fetchone() is not None


def _index_exists(conn, index_name):
    return conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='index' AND name=?", (index_name,)
    ).fetchone() is not None


def migrate(conn):
    """Run the full additive migration. Idempotent."""
    added_cols = 0
    for col_name, col_type in BEACHES_NEW_COLUMNS:
        if not _column_exists(conn, "beaches", col_name):
            conn.execute(f"ALTER TABLE beaches ADD COLUMN {col_name} {col_type}")
            added_cols += 1

    for table_name, create_sql in NEW_TABLES.items():
        if not _table_exists(conn, table_name):
            conn.execute(create_sql)

    for idx_name, idx_def in NEW_INDEXES:
        if not _index_exists(conn, idx_name):
            conn.execute(f"CREATE INDEX {idx_name} ON {idx_def}")

    for idx_name, idx_def in NEW_TABLE_INDEXES:
        if not _index_exists(conn, idx_name):
            conn.execute(f"CREATE INDEX {idx_name} ON {idx_def}")

    conn.commit()
    print(f"Migration complete: {added_cols} columns added")
    return added_cols


if __name__ == "__main__":
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    if not Path(db_path).exists():
        print(f"Database not found: {db_path}")
        sys.exit(1)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    migrate(conn)
    conn.close()
