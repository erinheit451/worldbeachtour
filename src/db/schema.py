"""Database schema and initialization for the World Beach Database."""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "output", "world_beaches.db")


def get_connection(db_path=None):
    """Get a connection to the SpatiaLite-enabled database."""
    path = db_path or DB_PATH
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row

    # Try to load SpatiaLite; fall back to basic SQLite if unavailable
    try:
        conn.enable_load_extension(True)
        # Try common SpatiaLite library names
        for lib in ["mod_spatialite", "libspatialite", "spatialite"]:
            try:
                conn.load_extension(lib)
                conn.execute("SELECT InitSpatialMetaData(1)")
                break
            except Exception:
                continue
    except Exception:
        pass  # SpatiaLite not available — geometry stored as GeoJSON text fallback

    return conn


def init_db(conn):
    """Create all tables and indexes."""
    cur = conn.cursor()

    cur.executescript("""
        CREATE TABLE IF NOT EXISTS beaches (
            id TEXT PRIMARY KEY,
            name TEXT,
            slug TEXT UNIQUE,
            geometry_geojson TEXT,
            centroid_lat REAL,
            centroid_lng REAL,
            country_code TEXT,
            admin_level_1 TEXT,
            admin_level_2 TEXT,
            water_body_type TEXT DEFAULT 'ocean',
            substrate_type TEXT DEFAULT 'unknown',
            beach_length_m REAL,
            source_layer INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS beach_sources (
            id TEXT PRIMARY KEY,
            beach_id TEXT NOT NULL REFERENCES beaches(id),
            source_name TEXT NOT NULL,
            source_id TEXT,
            source_url TEXT,
            raw_data TEXT,
            ingested_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS beach_attributes (
            id TEXT PRIMARY KEY,
            beach_id TEXT NOT NULL REFERENCES beaches(id),
            category TEXT NOT NULL,
            key TEXT NOT NULL,
            value TEXT,
            value_type TEXT DEFAULT 'string',
            source_id TEXT REFERENCES beach_sources(id),
            last_updated TEXT DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_beaches_country ON beaches(country_code);
        CREATE INDEX IF NOT EXISTS idx_beaches_water_body ON beaches(water_body_type);
        CREATE INDEX IF NOT EXISTS idx_beaches_centroid ON beaches(centroid_lat, centroid_lng);
        CREATE INDEX IF NOT EXISTS idx_beach_sources_beach ON beach_sources(beach_id);
        CREATE INDEX IF NOT EXISTS idx_beach_sources_name ON beach_sources(source_name);
        CREATE INDEX IF NOT EXISTS idx_beach_attrs_beach ON beach_attributes(beach_id);
        CREATE INDEX IF NOT EXISTS idx_beach_attrs_category ON beach_attributes(category, key);
    """)

    conn.commit()
    return conn


if __name__ == "__main__":
    conn = get_connection()
    init_db(conn)
    print(f"Database initialized at {os.path.abspath(DB_PATH)}")
    conn.close()
