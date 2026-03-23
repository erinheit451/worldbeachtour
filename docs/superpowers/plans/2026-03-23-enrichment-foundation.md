# Beach Enrichment Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the SQLite schema, build the grid-dedup climate pipeline, and add nearest city/airport + scoring fields — delivering the core data moat foundation for 412K beaches.

**Architecture:** Additive migration on the existing SQLite DB. Grid climate fetcher deduplicates 412K coordinates to ~50-80K cells, fetches 12-month normals from Open-Meteo, stores in a cache table, then maps back to beaches. Computed fields (nearest city, nearest airport, substrate heuristic, best months, swim suitability) run as pure local computation against downloaded datasets.

**Scope note:** This plan covers Phase 1 (grid climate) and a subset of Phase 2 (nearest city, nearest airport, substrate heuristic, best months, swim suitability). Deferred to follow-up plans: Phase 1d (Copernicus Marine SST/salinity/chlorophyll — complex auth), Phase 2a (GADM spatial join), Phase 2d (beach orientation from geometry), Phase 2e (beach length from geometry). These are deferred because they require large dataset downloads (GADM 1.5GB, geometry processing) that are independent from the core climate pipeline.

**Tech Stack:** Python 3, SQLite3, Open-Meteo free API, reverse_geocoder, scipy.spatial.KDTree, shapely (for geometry), tqdm, requests

**Spec:** `docs/superpowers/specs/2026-03-23-beach-data-enrichment-design.md`

---

## File Structure

```
src/
  db/
    schema.py                    -- MODIFY: add migrate_to_enriched() function
    migrate_to_enriched.py       -- CREATE: migration script (runnable standalone)
  enrich/
    grid_climate.py              -- CREATE: Phase 1 grid dedup + Open-Meteo fetch
    computed_fields.py           -- CREATE: Phase 2 nearest city/airport, orientation, length, etc
    best_months.py               -- CREATE: best_months + swim_suitability composite scoring
tests/
  test_migration.py              -- CREATE: schema migration tests
  test_grid_climate.py           -- CREATE: grid cell computation + climate mapping tests
  test_computed_fields.py        -- CREATE: nearest-place, orientation, heuristic tests
  test_best_months.py            -- CREATE: scoring logic tests
  conftest.py                    -- CREATE: shared fixtures (in-memory DB, sample beaches)
run_enrichment.py                -- CREATE: enrichment orchestrator (phases 1-5, resumable)
requirements.txt                 -- MODIFY: add scipy, reverse_geocoder (if missing)
```

---

### Task 1: Test Infrastructure + Shared Fixtures

**Files:**
- Create: `tests/conftest.py`
- Create: `tests/__init__.py`
- Modify: `requirements.txt`

- [ ] **Step 1: Add test dependencies to requirements.txt**

Add `pytest`, `scipy`, and `reverse_geocoder` (already used by existing code but missing from requirements) to `requirements.txt`:
```
pytest>=8.0.0
scipy>=1.12.0
reverse_geocoder>=1.5.1
```

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && pip install -r requirements.txt`

- [ ] **Step 2: Create test fixtures**

Create `tests/__init__.py` (empty) and `tests/conftest.py`:

```python
import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate


@pytest.fixture
def db():
    """In-memory SQLite database with current schema initialized."""
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    return conn


@pytest.fixture
def enriched_db():
    """In-memory SQLite database with enriched schema (migrated)."""
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    return conn


@pytest.fixture
def db_with_beaches(enriched_db):
    """Enriched DB with 5 sample beaches for testing enrichment."""
    beaches = [
        ("b1", "Waikiki Beach", "waikiki-beach", 21.274, -157.826, "US", "Hawaii", "ocean", "sand"),
        ("b2", "Reynisfjara", "reynisfjara", 63.404, -19.069, "IS", "South", "ocean", "sand"),
        ("b3", "Bondi Beach", "bondi-beach", -33.891, 151.274, "AU", "New South Wales", "ocean", "sand"),
        ("b4", "Lake Wanaka Beach", "lake-wanaka-beach", -44.693, 169.132, "NZ", "Otago", "lake", "sand"),
        ("b5", "No Name Beach", "beach-52.9050-22.5423", 52.905, 22.542, None, None, "ocean", "unknown"),
    ]
    for b in beaches:
        enriched_db.execute(
            """INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng,
               country_code, admin_level_1, water_body_type, substrate_type)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            b,
        )
    enriched_db.commit()
    return enriched_db
```

- [ ] **Step 3: Verify fixtures work**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/ -v --co`
Expected: Discovers conftest fixtures, no errors.

- [ ] **Step 4: Commit**

```bash
git add tests/ requirements.txt
git commit -m "test: add pytest infrastructure and shared beach fixtures"
```

---

### Task 2: Schema Migration

**Files:**
- Create: `src/db/migrate_to_enriched.py`
- Create: `tests/test_migration.py`

- [ ] **Step 1: Write migration tests**

Create `tests/test_migration.py`:

```python
import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate


@pytest.fixture
def fresh_db():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    return conn


def _column_names(conn, table):
    return [r[1] for r in conn.execute(f"PRAGMA table_info({table})").fetchall()]


def _table_exists(conn, table):
    return conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (table,)
    ).fetchone() is not None


def test_migration_adds_climate_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "climate_air_temp_high" in cols
    assert "climate_grid_cell" in cols
    assert "ocean_water_temp" in cols


def test_migration_adds_physical_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "sand_color" in cols
    assert "coastal_type" in cols
    assert "orientation_deg" in cols
    assert "nearest_city" in cols
    assert "nearest_airport_iata" in cols


def test_migration_adds_safety_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "water_quality_rating" in cols
    assert "blue_flag" in cols
    assert "shark_incidents_total" in cols
    assert "lifeguard" in cols


def test_migration_adds_facilities_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "has_parking" in cols
    assert "has_restrooms" in cols
    assert "wheelchair_accessible" in cols


def test_migration_adds_ecology_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "protected_area_name" in cols
    assert "coral_reef_distance_km" in cols
    assert "species_observed_count" in cols


def test_migration_adds_popularity_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "wikipedia_url" in cols
    assert "notability_score" in cols
    assert "data_completeness_pct" in cols


def test_migration_adds_computed_columns(fresh_db):
    migrate(fresh_db)
    cols = _column_names(fresh_db, "beaches")
    assert "best_months" in cols
    assert "swim_suitability" in cols
    assert "enrichment_version" in cols


def test_migration_creates_new_tables(fresh_db):
    migrate(fresh_db)
    assert _table_exists(fresh_db, "beach_photos")
    assert _table_exists(fresh_db, "beach_species")
    assert _table_exists(fresh_db, "climate_grid_cells")
    assert _table_exists(fresh_db, "enrichment_log")


def test_migration_is_idempotent(fresh_db):
    migrate(fresh_db)
    migrate(fresh_db)  # Should not raise
    cols = _column_names(fresh_db, "beaches")
    assert "climate_air_temp_high" in cols


def test_migration_preserves_existing_data(fresh_db):
    fresh_db.execute(
        """INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng)
           VALUES ('test1', 'Test Beach', 'test-beach', 10.0, 20.0)"""
    )
    fresh_db.commit()
    migrate(fresh_db)
    row = fresh_db.execute("SELECT name, climate_air_temp_high FROM beaches WHERE id='test1'").fetchone()
    assert row["name"] == "Test Beach"
    assert row["climate_air_temp_high"] is None


def test_migration_creates_indexes(fresh_db):
    migrate(fresh_db)
    indexes = [r[1] for r in fresh_db.execute("PRAGMA index_list(beaches)").fetchall()]
    assert "idx_beaches_notability" in indexes
    assert "idx_beaches_climate_grid" in indexes


def test_enrichment_log_table_works(fresh_db):
    migrate(fresh_db)
    fresh_db.execute(
        """INSERT INTO enrichment_log (script_name, phase, status, started_at)
           VALUES ('grid_climate', 'phase_1', 'running', datetime('now'))"""
    )
    fresh_db.commit()
    row = fresh_db.execute("SELECT * FROM enrichment_log WHERE script_name='grid_climate'").fetchone()
    assert row["status"] == "running"
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_migration.py -v`
Expected: ImportError — `migrate_to_enriched` doesn't exist yet.

- [ ] **Step 3: Write the migration script**

Create `src/db/migrate_to_enriched.py`:

```python
"""
Additive schema migration: adds enrichment columns to beaches table
and creates new tables (beach_photos, beach_species, climate_grid_cells, enrichment_log).

Idempotent — safe to re-run. Never drops columns or tables.
"""

import sqlite3
import sys
from pathlib import Path

# Columns to add to the beaches table: (name, type_and_default)
BEACHES_NEW_COLUMNS = [
    # Admin (GADM enrichment — Phase 2a, populated later)
    ("admin_level_3", "TEXT"),

    # Physical
    ("sand_color", "TEXT"),
    ("coastal_type", "TEXT"),
    ("orientation_deg", "REAL"),
    ("orientation_label", "TEXT"),
    ("sunset_visible", "INTEGER"),
    ("elevation_m", "REAL"),
    ("nearshore_depth_m", "REAL"),

    # Nearest places
    ("nearest_city", "TEXT"),
    ("nearest_city_distance_km", "REAL"),
    ("nearest_airport_iata", "TEXT"),
    ("nearest_airport_name", "TEXT"),
    ("nearest_airport_distance_km", "REAL"),

    # Climate profiles (JSON arrays, 12 elements = Jan-Dec)
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

    # Ocean profiles (JSON arrays, NULL for lake/river)
    ("ocean_water_temp", "JSON"),
    ("ocean_wave_height_m", "JSON"),
    ("ocean_wave_period_s", "JSON"),
    ("ocean_swell_direction", "JSON"),
    ("ocean_salinity_psu", "JSON"),
    ("ocean_chlorophyll", "JSON"),
    ("ocean_source", "TEXT"),

    # Tides
    ("tide_range_spring_m", "REAL"),
    ("tide_range_neap_m", "REAL"),
    ("tide_type", "TEXT"),
    ("tide_source", "TEXT"),
    ("tide_station_id", "TEXT"),

    # Safety
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

    # Facilities
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

    # Ecology
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

    # Popularity & editorial
    ("wikipedia_url", "TEXT"),
    ("wikipedia_page_views_annual", "INTEGER"),
    ("wikidata_id", "TEXT"),
    ("wikidata_sitelinks", "INTEGER"),
    ("photo_count", "INTEGER"),
    ("notability_score", "REAL"),

    # Computed / derived
    ("best_months", "JSON"),
    ("swim_suitability", "TEXT"),
    ("swim_suitability_confidence", "TEXT"),
    ("data_completeness_pct", "REAL"),

    # Metadata
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
    # 1. Add new columns to beaches
    for col_name, col_type in BEACHES_NEW_COLUMNS:
        if not _column_exists(conn, "beaches", col_name):
            conn.execute(f"ALTER TABLE beaches ADD COLUMN {col_name} {col_type}")
            added_cols += 1

    # 2. Create new tables
    for table_name, create_sql in NEW_TABLES.items():
        if not _table_exists(conn, table_name):
            conn.execute(create_sql)

    # 3. Create new indexes on beaches
    for idx_name, idx_def in NEW_INDEXES:
        if not _index_exists(conn, idx_name):
            conn.execute(f"CREATE INDEX {idx_name} ON {idx_def}")

    # 4. Create new indexes on new tables
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
```

- [ ] **Step 4: Run migration tests**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_migration.py -v`
Expected: All 12 tests pass.

- [ ] **Step 5: Run migration against the real database**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m src.db.migrate_to_enriched output/world_beaches.db`
Expected: "Migration complete: ~80 columns added"

Verify: `sqlite3 output/world_beaches.db "PRAGMA table_info(beaches)" | wc -l`
Expected: ~95 rows (14 original + ~80 new)

- [ ] **Step 6: Commit**

```bash
git add src/db/migrate_to_enriched.py tests/test_migration.py
git commit -m "feat: additive schema migration — 80 enrichment columns + 4 new tables"
```

---

### Task 3: Grid Climate — Cell Computation + Cache Table

**Files:**
- Create: `src/enrich/grid_climate.py`
- Create: `tests/test_grid_climate.py`

- [ ] **Step 1: Write grid cell computation tests**

Create `tests/test_grid_climate.py` (uses `enriched_db` fixture from conftest):

```python
import math
import pytest


def test_grid_cell_uses_floor_not_round():
    from src.enrich.grid_climate import grid_cell_id
    # 21.35 should floor to 21.3, not round to 21.4
    assert grid_cell_id(21.35, -157.85) == "21.3_-157.9"


def test_grid_cell_negative_coords():
    from src.enrich.grid_climate import grid_cell_id
    assert grid_cell_id(-33.891, 151.274) == "-33.9_151.2"


def test_grid_cell_zero():
    from src.enrich.grid_climate import grid_cell_id
    assert grid_cell_id(0.05, 0.05) == "0.0_0.0"


def test_grid_cell_boundary():
    from src.enrich.grid_climate import grid_cell_id
    # Two beaches 0.001° apart straddling a boundary should land in same cell
    # floor(21.299 * 10) = 212 → 21.2; floor(21.301 * 10) = 213 → 21.3
    # These DO land in different cells — that's correct behavior for floor-bucketing
    cell_a = grid_cell_id(21.299, -157.8)
    cell_b = grid_cell_id(21.301, -157.8)
    # They may differ — this is expected. The test documents the behavior.
    assert cell_a == "21.2_-157.8"
    assert cell_b == "21.3_-157.8"


def test_compute_unique_cells(enriched_db):
    from src.enrich.grid_climate import compute_grid_cells
    # Insert beaches at known coords
    beaches = [
        ("b1", 21.274, -157.826),  # cell: 21.2_-157.9
        ("b2", 21.275, -157.825),  # same cell (very close)
        ("b3", 63.404, -19.069),   # different cell: 63.4_-19.1
    ]
    for bid, lat, lng in beaches:
        enriched_db.execute(
            "INSERT INTO beaches (id, slug, centroid_lat, centroid_lng) VALUES (?, ?, ?, ?)",
            (bid, bid, lat, lng),
        )
    enriched_db.commit()

    cells = compute_grid_cells(enriched_db)
    assert len(cells) == 2  # Two unique cells
    # Each cell should have its beach IDs
    cell_ids = {c["cell_id"] for c in cells}
    assert "21.2_-157.9" in cell_ids
    assert "63.4_-19.1" in cell_ids


def test_map_climate_to_beaches(enriched_db):
    from src.enrich.grid_climate import map_climate_to_beaches
    # Insert a beach and a matching grid cell
    enriched_db.execute(
        "INSERT INTO beaches (id, slug, centroid_lat, centroid_lng) VALUES ('b1', 'b1', 21.274, -157.826)"
    )
    enriched_db.execute(
        """INSERT INTO climate_grid_cells (cell_id, centroid_lat, centroid_lng,
           climate_air_temp_high, source)
           VALUES ('21.2_-157.9', 21.25, -157.85, '[27,27,27,28,29,30,31,31,31,30,29,27]',
           'open_meteo_era5')"""
    )
    enriched_db.commit()

    count = map_climate_to_beaches(enriched_db)
    assert count == 1

    row = enriched_db.execute("SELECT climate_air_temp_high, climate_grid_cell FROM beaches WHERE id='b1'").fetchone()
    assert row["climate_grid_cell"] == "21.2_-157.9"
    assert row["climate_air_temp_high"] is not None
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_grid_climate.py -v`
Expected: ImportError — `grid_climate` doesn't exist yet.

- [ ] **Step 3: Write the grid climate module**

Create `src/enrich/grid_climate.py`:

```python
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
    try:
        resp = requests.get(url, params=params, timeout=60)
        resp.raise_for_status()
        data = resp.json()
    except Exception:
        return None

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
    try:
        resp = requests.get(url, params=params, timeout=60)
        if resp.status_code == 400:
            return None  # Inland point, no marine data
        resp.raise_for_status()
        data = resp.json()
    except Exception:
        return None

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
```

- [ ] **Step 4: Run tests**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_grid_climate.py -v`
Expected: All 6 tests pass.

- [ ] **Step 5: Smoke test with real DB (5 cells only)**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m src.enrich.grid_climate output/world_beaches.db 5`
Expected: Computes grid cells, fetches 5, maps back. No crashes.

- [ ] **Step 6: Commit**

```bash
git add src/enrich/grid_climate.py tests/test_grid_climate.py
git commit -m "feat: Phase 1 grid climate pipeline — cell dedup + Open-Meteo fetch + beach mapping"
```

---

### Task 4: Computed Fields — Nearest City & Airport

**Files:**
- Create: `src/enrich/computed_fields.py`
- Create: `tests/test_computed_fields.py`

- [ ] **Step 1: Write tests for nearest city/airport**

Create `tests/test_computed_fields.py` (uses `enriched_db` fixture from conftest):

```python
import pytest


@pytest.fixture
def enriched_db_with_beaches(enriched_db):
    """enriched_db with test beaches pre-loaded."""
    beaches = [
        ("b1", "Waikiki Beach", "waikiki", 21.274, -157.826, "US", "ocean"),
        ("b2", "Bondi Beach", "bondi", -33.891, 151.274, "AU", "ocean"),
        ("b3", "Lake Beach", "lake-beach", -44.693, 169.132, "NZ", "lake"),
    ]
    for b in beaches:
        enriched_db.execute(
            """INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng,
               country_code, water_body_type)
               VALUES (?, ?, ?, ?, ?, ?, ?)""", b
        )
    enriched_db.commit()
    return enriched_db


def test_nearest_city_populated(enriched_db_with_beaches):
    from src.enrich.computed_fields import enrich_nearest_city
    count = enrich_nearest_city(enriched_db_with_beaches)
    assert count == 3
    row = enriched_db_with_beaches.execute(
        "SELECT nearest_city, nearest_city_distance_km FROM beaches WHERE id='b1'"
    ).fetchone()
    assert row["nearest_city"] is not None
    assert row["nearest_city_distance_km"] is not None
    assert row["nearest_city_distance_km"] < 50  # Waikiki is near Honolulu


def test_nearest_airport_populated(enriched_db_with_beaches):
    from src.enrich.computed_fields import enrich_nearest_airport
    count = enrich_nearest_airport(enriched_db_with_beaches)
    assert count == 3
    row = enriched_db_with_beaches.execute(
        "SELECT nearest_airport_iata, nearest_airport_distance_km FROM beaches WHERE id='b1'"
    ).fetchone()
    assert row["nearest_airport_iata"] is not None
    assert row["nearest_airport_distance_km"] is not None


def test_substrate_heuristic():
    from src.enrich.computed_fields import substrate_from_name
    assert substrate_from_name("Sandy Beach") == "sand"
    assert substrate_from_name("Rocky Point Beach") == "rock"
    assert substrate_from_name("Pebble Cove") == "pebble"
    assert substrate_from_name("Gravel Beach") == "gravel"
    assert substrate_from_name("Random Name") is None


def test_substrate_heuristic_enrichment(enriched_db_with_beaches):
    from src.enrich.computed_fields import enrich_substrate_heuristic
    enriched_db_with_beaches.execute(
        """INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng, substrate_type)
           VALUES ('bx', 'Sandy Shores', 'sandy-shores', 10, 20, 'unknown')"""
    )
    enriched_db_with_beaches.commit()
    count = enrich_substrate_heuristic(enriched_db_with_beaches)
    assert count >= 1
    row = enriched_db_with_beaches.execute("SELECT substrate_type FROM beaches WHERE id='bx'").fetchone()
    assert row["substrate_type"] == "sand"
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_computed_fields.py -v`
Expected: ImportError.

- [ ] **Step 3: Write computed_fields module**

Create `src/enrich/computed_fields.py`:

```python
"""
Phase 2: Locally-computed enrichment fields.

No external API calls — uses downloaded datasets + computation:
- Nearest city (reverse_geocoder library)
- Nearest airport (OurAirports CSV + KD-tree)
- Substrate type heuristic (name regex)
"""

import csv
import math
import re
from pathlib import Path

import reverse_geocoder as rg
from tqdm import tqdm

DATA_DIR = Path(__file__).parent.parent.parent / "data"

# Haversine distance in km
def _haversine_km(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


def enrich_nearest_city(conn) -> int:
    """Populate nearest_city and nearest_city_distance_km using reverse_geocoder."""
    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches WHERE nearest_city IS NULL"
    ).fetchall()
    if not rows:
        return 0

    coords = [(r["centroid_lat"], r["centroid_lng"]) for r in rows]
    results = rg.search(coords)

    count = 0
    for row, result in zip(rows, results):
        city = result.get("name", "")
        if not city:
            continue
        city_lat = float(result["lat"])
        city_lng = float(result["lon"])
        dist = _haversine_km(row["centroid_lat"], row["centroid_lng"], city_lat, city_lng)
        conn.execute(
            """UPDATE beaches SET nearest_city = ?, nearest_city_distance_km = ?,
               updated_at = datetime('now') WHERE id = ?""",
            (city, round(dist, 1), row["id"]),
        )
        count += 1
        if count % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"Nearest city: enriched {count} beaches")
    return count


def _load_airports():
    """Load airports from OurAirports CSV. Returns list of (iata, name, lat, lng)."""
    airports_path = DATA_DIR / "airports.csv"
    if not airports_path.exists():
        print(f"  airports.csv not found at {airports_path}")
        print("  Download from: https://ourairports.com/data/airports.csv")
        return []

    airports = []
    with open(airports_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            iata = row.get("iata_code", "").strip()
            if not iata or iata == "0" or len(iata) != 3:
                continue
            if row.get("type") not in ("large_airport", "medium_airport"):
                continue
            try:
                lat = float(row["latitude_deg"])
                lng = float(row["longitude_deg"])
            except (ValueError, KeyError):
                continue
            airports.append((iata, row.get("name", ""), lat, lng))
    return airports


def enrich_nearest_airport(conn) -> int:
    """Populate nearest_airport_iata/name/distance using OurAirports + KD-tree."""
    from scipy.spatial import KDTree
    import numpy as np

    airports = _load_airports()
    if not airports:
        return 0

    # Build KD-tree (in radians for haversine-approximate search)
    airport_coords = np.array([(math.radians(a[2]), math.radians(a[3])) for a in airports])
    tree = KDTree(airport_coords)

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches WHERE nearest_airport_iata IS NULL"
    ).fetchall()
    if not rows:
        return 0

    count = 0
    for row in tqdm(rows, desc="Finding nearest airports"):
        query = [math.radians(row["centroid_lat"]), math.radians(row["centroid_lng"])]
        dist_rad, idx = tree.query(query)
        airport = airports[idx]
        dist_km = _haversine_km(row["centroid_lat"], row["centroid_lng"], airport[2], airport[3])
        conn.execute(
            """UPDATE beaches SET nearest_airport_iata = ?, nearest_airport_name = ?,
               nearest_airport_distance_km = ?, updated_at = datetime('now') WHERE id = ?""",
            (airport[0], airport[1], round(dist_km, 1), row["id"]),
        )
        count += 1
        if count % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"Nearest airport: enriched {count} beaches")
    return count


# Substrate heuristic patterns
_SUBSTRATE_PATTERNS = [
    (re.compile(r"\bsand[ys]?\b", re.IGNORECASE), "sand"),
    (re.compile(r"\brock[ys]?\b", re.IGNORECASE), "rock"),
    (re.compile(r"\bpebble[sy]?\b", re.IGNORECASE), "pebble"),
    (re.compile(r"\bgravel\b", re.IGNORECASE), "gravel"),
    (re.compile(r"\bshingle\b", re.IGNORECASE), "pebble"),
    (re.compile(r"\bcobble\b", re.IGNORECASE), "pebble"),
    (re.compile(r"\bstony\b", re.IGNORECASE), "rock"),
    (re.compile(r"\bblack sand\b", re.IGNORECASE), "sand"),
    (re.compile(r"\bwhite sand\b", re.IGNORECASE), "sand"),
]


def substrate_from_name(name: str) -> str | None:
    """Infer substrate type from beach name. Returns type or None."""
    if not name:
        return None
    for pattern, substrate in _SUBSTRATE_PATTERNS:
        if pattern.search(name):
            return substrate
    return None


def enrich_substrate_heuristic(conn) -> int:
    """Upgrade substrate_type from 'unknown' based on beach name patterns."""
    rows = conn.execute(
        "SELECT id, name FROM beaches WHERE substrate_type = 'unknown' AND name IS NOT NULL"
    ).fetchall()
    count = 0
    for row in rows:
        substrate = substrate_from_name(row["name"])
        if substrate:
            conn.execute(
                "UPDATE beaches SET substrate_type = ?, updated_at = datetime('now') WHERE id = ?",
                (substrate, row["id"]),
            )
            count += 1
    conn.commit()
    print(f"Substrate heuristic: upgraded {count} beaches")
    return count


def run_phase2(conn):
    """Run all Phase 2 computed field enrichments."""
    conn.execute(
        """INSERT INTO enrichment_log (script_name, phase, status, started_at)
           VALUES ('computed_fields', 'phase_2', 'running', datetime('now'))"""
    )
    conn.commit()

    total = 0
    total += enrich_nearest_city(conn)
    total += enrich_nearest_airport(conn)
    total += enrich_substrate_heuristic(conn)

    conn.execute(
        """UPDATE enrichment_log SET status='completed', completed_at=datetime('now'),
           total_processed=?
           WHERE script_name='computed_fields' AND status='running'""",
        (total,),
    )
    conn.commit()
    print(f"Phase 2 complete: {total} total enrichments")


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    run_phase2(conn)
    conn.close()
```

- [ ] **Step 4: Run tests**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_computed_fields.py -v`
Expected: All 4 tests pass (nearest_airport test will skip if airports.csv not downloaded yet — that's OK).

- [ ] **Step 5: Download airports.csv**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && curl -o data/airports.csv "https://davidmegginson.github.io/ourairports-data/airports.csv"`
Expected: ~10MB CSV file downloaded.

- [ ] **Step 6: Commit**

```bash
git add src/enrich/computed_fields.py tests/test_computed_fields.py
git commit -m "feat: Phase 2 computed fields — nearest city, nearest airport, substrate heuristic"
```

---

### Task 5: Best Months + Swim Suitability Scoring

**Files:**
- Create: `src/enrich/best_months.py`
- Create: `tests/test_best_months.py`

- [ ] **Step 1: Write scoring tests**

Create `tests/test_best_months.py`:

```python
import json
import pytest


def test_best_months_tropical():
    """Tropical beach with stable climate — most months should be good."""
    from src.enrich.best_months import compute_best_months
    result = compute_best_months(
        air_temp_high=[30, 30, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
        rain_mm=[80, 60, 40, 20, 10, 5, 5, 10, 20, 40, 60, 80],
        sun_hours=[200, 210, 240, 260, 280, 290, 290, 280, 260, 240, 210, 200],
        wind_speed=[15, 15, 14, 12, 10, 10, 10, 10, 12, 14, 15, 15],
    )
    assert isinstance(result, list)
    assert len(result) > 0
    # Dry months should score highest
    assert "jun" in result or "jul" in result


def test_best_months_northern_temperate():
    """Northern Europe — summer months should win."""
    from src.enrich.best_months import compute_best_months
    result = compute_best_months(
        air_temp_high=[5, 6, 10, 14, 18, 22, 25, 24, 20, 15, 9, 6],
        rain_mm=[50, 40, 45, 40, 45, 50, 55, 60, 55, 60, 55, 50],
        sun_hours=[60, 80, 120, 170, 220, 250, 260, 240, 180, 120, 70, 50],
        wind_speed=[25, 24, 22, 18, 15, 14, 13, 14, 16, 20, 23, 25],
    )
    assert "jul" in result
    assert "jan" not in result


def test_best_months_southern_hemisphere():
    """Australian beach — Dec/Jan/Feb should win (southern summer)."""
    from src.enrich.best_months import compute_best_months
    result = compute_best_months(
        air_temp_high=[28, 28, 26, 23, 20, 17, 17, 18, 20, 22, 24, 27],
        rain_mm=[100, 110, 120, 90, 80, 80, 60, 50, 50, 70, 80, 80],
        sun_hours=[260, 240, 220, 190, 170, 150, 160, 180, 200, 220, 240, 260],
        wind_speed=[15, 15, 14, 14, 15, 16, 16, 16, 16, 15, 15, 15],
    )
    assert "dec" in result or "jan" in result
    assert "jun" not in result


def test_best_months_handles_none():
    from src.enrich.best_months import compute_best_months
    result = compute_best_months(None, None, None, None)
    assert result is None


def test_swim_suitability_ocean():
    from src.enrich.best_months import compute_swim_suitability
    rating, confidence = compute_swim_suitability(
        water_body_type="ocean",
        wave_height_m=[1.0, 1.2, 0.8, 0.6, 0.5, 0.4, 0.4, 0.5, 0.6, 0.8, 1.0, 1.1],
        water_quality="excellent",
        tide_range_m=1.5,
    )
    assert rating in ("excellent", "good", "fair", "poor", "dangerous")
    assert confidence == "high"


def test_swim_suitability_inland():
    from src.enrich.best_months import compute_swim_suitability
    rating, confidence = compute_swim_suitability(
        water_body_type="lake",
        wave_height_m=None,
        water_quality="good",
        tide_range_m=None,
    )
    assert rating in ("excellent", "good", "fair", "poor", "dangerous")
    assert confidence in ("medium", "low")


def test_swim_suitability_no_data():
    from src.enrich.best_months import compute_swim_suitability
    rating, confidence = compute_swim_suitability(
        water_body_type="ocean",
        wave_height_m=None,
        water_quality=None,
        tide_range_m=None,
    )
    assert confidence == "low"
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_best_months.py -v`
Expected: ImportError.

- [ ] **Step 3: Write best_months module**

Create `src/enrich/best_months.py`:

```python
"""
Computed enrichment: best_months and swim_suitability.

Both derived from climate profiles already stored on the beach row.
No API calls — pure computation.
"""

import json
from tqdm import tqdm

MONTH_NAMES = ["jan", "feb", "mar", "apr", "may", "jun",
               "jul", "aug", "sep", "oct", "nov", "dec"]


def compute_best_months(
    air_temp_high: list | None,
    rain_mm: list | None,
    sun_hours: list | None,
    wind_speed: list | None,
) -> list[str] | None:
    """Compute best months to visit from climate arrays.

    Scores each month 0-100 based on:
    - Temperature: ideal range 22-30°C (40% weight)
    - Rain: less is better (25% weight)
    - Sunshine: more is better (25% weight)
    - Wind: less is better (10% weight)

    Returns month names with score >= 60% of the best month's score.
    """
    if not air_temp_high:
        return None

    scores = []
    for m in range(12):
        score = 0.0
        components = 0

        # Temperature score (0-40): ideal is 22-30°C
        if air_temp_high and air_temp_high[m] is not None:
            t = air_temp_high[m]
            if 22 <= t <= 30:
                temp_score = 40
            elif t < 22:
                temp_score = max(0, 40 - (22 - t) * 4)
            else:
                temp_score = max(0, 40 - (t - 30) * 4)
            score += temp_score
            components += 1

        # Rain score (0-25): 0mm = 25, 200mm+ = 0
        if rain_mm and rain_mm[m] is not None:
            rain_score = max(0, 25 - rain_mm[m] / 8)
            score += rain_score
            components += 1

        # Sunshine score (0-25): 300hrs = 25, 0hrs = 0
        if sun_hours and sun_hours[m] is not None:
            sun_score = min(25, sun_hours[m] / 12)
            score += sun_score
            components += 1

        # Wind score (0-10): 0km/h = 10, 30+ = 0
        if wind_speed and wind_speed[m] is not None:
            wind_score = max(0, 10 - wind_speed[m] / 3)
            score += wind_score
            components += 1

        scores.append(score if components > 0 else 0)

    if not scores or max(scores) == 0:
        return None

    threshold = max(scores) * 0.6
    return [MONTH_NAMES[m] for m in range(12) if scores[m] >= threshold]


def compute_swim_suitability(
    water_body_type: str,
    wave_height_m: list | None,
    water_quality: str | None,
    tide_range_m: float | None,
) -> tuple[str, str]:
    """Compute swim suitability rating and confidence.

    Returns (rating, confidence) where:
    - rating: excellent, good, fair, poor, dangerous
    - confidence: high (ocean w/ full data), medium (partial), low (sparse)
    """
    score = 50  # Start at neutral
    data_points = 0

    # Water quality (strong signal)
    if water_quality:
        data_points += 1
        quality_scores = {"excellent": 30, "good": 15, "sufficient": 0, "poor": -30}
        score += quality_scores.get(water_quality, 0)

    # Wave height (ocean only — use summer average)
    if wave_height_m and water_body_type == "ocean":
        data_points += 1
        avg_wave = sum(h for h in wave_height_m if h is not None) / max(
            1, sum(1 for h in wave_height_m if h is not None)
        )
        if avg_wave < 0.5:
            score += 20  # Calm
        elif avg_wave < 1.0:
            score += 10
        elif avg_wave < 2.0:
            score += 0
        elif avg_wave < 3.0:
            score -= 15
        else:
            score -= 30  # Dangerous

    # Tide range (ocean only)
    if tide_range_m is not None and water_body_type == "ocean":
        data_points += 1
        if tide_range_m < 2:
            score += 5
        elif tide_range_m > 6:
            score -= 10

    # Lake/river: generally swimmable if water quality is OK
    if water_body_type in ("lake", "river") and not water_quality:
        score += 10  # Assume decent for inland

    # Determine rating
    if score >= 80:
        rating = "excellent"
    elif score >= 60:
        rating = "good"
    elif score >= 40:
        rating = "fair"
    elif score >= 20:
        rating = "poor"
    else:
        rating = "dangerous"

    # Determine confidence
    if water_body_type == "ocean" and data_points >= 3:
        confidence = "high"
    elif data_points >= 1:
        confidence = "medium"
    else:
        confidence = "low"

    return rating, confidence


def enrich_best_months_and_swim(conn) -> int:
    """Compute best_months and swim_suitability for all beaches with climate data."""
    rows = conn.execute(
        """SELECT id, water_body_type, climate_air_temp_high, climate_rain_mm,
           climate_sun_hours, climate_wind_speed, ocean_wave_height_m,
           water_quality_rating, tide_range_spring_m
           FROM beaches WHERE climate_air_temp_high IS NOT NULL AND best_months IS NULL"""
    ).fetchall()

    count = 0
    for row in tqdm(rows, desc="Computing best months + swim suitability"):
        temp_high = json.loads(row["climate_air_temp_high"]) if row["climate_air_temp_high"] else None
        rain = json.loads(row["climate_rain_mm"]) if row["climate_rain_mm"] else None
        sun = json.loads(row["climate_sun_hours"]) if row["climate_sun_hours"] else None
        wind = json.loads(row["climate_wind_speed"]) if row["climate_wind_speed"] else None
        waves = json.loads(row["ocean_wave_height_m"]) if row["ocean_wave_height_m"] else None

        best = compute_best_months(temp_high, rain, sun, wind)
        swim_rating, swim_conf = compute_swim_suitability(
            row["water_body_type"], waves, row["water_quality_rating"], row["tide_range_spring_m"]
        )

        conn.execute(
            """UPDATE beaches SET best_months = ?, swim_suitability = ?,
               swim_suitability_confidence = ?, updated_at = datetime('now')
               WHERE id = ?""",
            (json.dumps(best) if best else None, swim_rating, swim_conf, row["id"]),
        )
        count += 1
        if count % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"Best months + swim suitability: computed for {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    enrich_best_months_and_swim(conn)
    conn.close()
```

- [ ] **Step 4: Run tests**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_best_months.py -v`
Expected: All 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/enrich/best_months.py tests/test_best_months.py
git commit -m "feat: best_months + swim_suitability scoring with inland beach handling"
```

---

### Task 6: Enrichment Orchestrator

**Files:**
- Create: `run_enrichment.py`

- [ ] **Step 1: Write the orchestrator**

Create `run_enrichment.py`:

```python
"""
Enrichment pipeline orchestrator.

Runs enrichment phases in order, tracks progress, supports resuming.

Usage:
    python run_enrichment.py                          # Run all phases
    python run_enrichment.py --phase 1                # Run Phase 1 only
    python run_enrichment.py --phase 1 --max-cells 100  # Phase 1, limit to 100 cells
    python run_enrichment.py --status                 # Show enrichment status
"""

import argparse
import sys

from src.db.schema import get_connection
from src.db.migrate_to_enriched import migrate


def show_status(conn):
    """Print enrichment progress."""
    # Schema check
    cols = [r[1] for r in conn.execute("PRAGMA table_info(beaches)").fetchall()]
    print(f"Schema: {len(cols)} columns on beaches table")

    # Total beaches
    total = conn.execute("SELECT COUNT(*) FROM beaches").fetchone()[0]
    print(f"Total beaches: {total:,}")

    # Climate coverage
    with_climate = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE climate_air_temp_high IS NOT NULL"
    ).fetchone()[0]
    print(f"Climate data: {with_climate:,} / {total:,} ({with_climate * 100 // max(total, 1)}%)")

    # Grid cells
    try:
        cells = conn.execute("SELECT COUNT(*) FROM climate_grid_cells").fetchone()[0]
        print(f"Grid cells fetched: {cells:,}")
    except Exception:
        print("Grid cells: table not yet created")

    # Nearest city
    with_city = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE nearest_city IS NOT NULL"
    ).fetchone()[0]
    print(f"Nearest city: {with_city:,} / {total:,} ({with_city * 100 // max(total, 1)}%)")

    # Nearest airport
    with_airport = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE nearest_airport_iata IS NOT NULL"
    ).fetchone()[0]
    print(f"Nearest airport: {with_airport:,} / {total:,} ({with_airport * 100 // max(total, 1)}%)")

    # Best months
    with_best = conn.execute(
        "SELECT COUNT(*) FROM beaches WHERE best_months IS NOT NULL"
    ).fetchone()[0]
    print(f"Best months: {with_best:,} / {total:,} ({with_best * 100 // max(total, 1)}%)")

    # Enrichment log
    try:
        logs = conn.execute(
            "SELECT script_name, phase, status, total_processed, started_at, completed_at FROM enrichment_log ORDER BY started_at DESC LIMIT 10"
        ).fetchall()
        if logs:
            print("\nRecent enrichment runs:")
            for log in logs:
                print(f"  {log['script_name']} ({log['phase']}): {log['status']} — {log['total_processed']} processed")
    except Exception:
        pass


def main():
    parser = argparse.ArgumentParser(description="Beach enrichment pipeline")
    parser.add_argument("--db", default="output/world_beaches.db", help="Database path")
    parser.add_argument("--phase", type=int, choices=[1, 2], help="Run specific phase only")
    parser.add_argument("--max-cells", type=int, help="Limit grid cells to fetch (Phase 1)")
    parser.add_argument("--status", action="store_true", help="Show enrichment status")
    args = parser.parse_args()

    conn = get_connection(args.db)

    if args.status:
        show_status(conn)
        conn.close()
        return

    # Always migrate first
    migrate(conn)

    if args.phase is None or args.phase == 1:
        from src.enrich.grid_climate import run_phase1
        print("\n=== Phase 1: Grid Climate Fetch ===")
        run_phase1(conn, max_cells=args.max_cells)

    if args.phase is None or args.phase == 2:
        from src.enrich.computed_fields import run_phase2
        print("\n=== Phase 2: Computed Fields ===")
        run_phase2(conn)

        from src.enrich.best_months import enrich_best_months_and_swim
        print("\n=== Phase 2b: Best Months + Swim Suitability ===")
        enrich_best_months_and_swim(conn)

    show_status(conn)
    conn.close()


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Verify it runs**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python run_enrichment.py --status`
Expected: Shows current schema state and beach counts.

- [ ] **Step 3: Commit**

```bash
git add run_enrichment.py
git commit -m "feat: enrichment orchestrator — phases 1-2, resumable, status reporting"
```

---

### Task 7: Data Completeness Scoring

**Files:**
- Modify: `src/enrich/best_months.py` (add `update_data_completeness`)

- [ ] **Step 1: Add data_completeness computation to best_months.py**

Add to the end of `src/enrich/best_months.py`:

```python
# Fields that count toward data completeness (enrichment fields only, not base fields)
_COMPLETENESS_FIELDS = [
    "sand_color", "coastal_type", "orientation_deg", "elevation_m", "nearshore_depth_m",
    "nearest_city", "nearest_airport_iata",
    "climate_air_temp_high", "climate_rain_mm", "climate_sun_hours",
    "ocean_water_temp", "ocean_wave_height_m",
    "tide_range_spring_m", "tide_type",
    "water_quality_rating", "blue_flag",
    "has_parking", "has_restrooms",
    "protected_area_name", "species_observed_count",
    "wikipedia_url", "photo_count",
    "best_months", "swim_suitability",
]


def update_data_completeness(conn) -> int:
    """Compute data_completeness_pct for all beaches."""
    total_fields = len(_COMPLETENESS_FIELDS)
    case_expr = " + ".join(
        f"CASE WHEN {f} IS NOT NULL THEN 1 ELSE 0 END" for f in _COMPLETENESS_FIELDS
    )
    conn.execute(
        f"""UPDATE beaches SET data_completeness_pct =
            ROUND(({case_expr}) * 100.0 / {total_fields}, 1)"""
    )
    conn.commit()
    count = conn.execute("SELECT COUNT(*) FROM beaches WHERE data_completeness_pct > 0").fetchone()[0]
    print(f"Data completeness: {count} beaches have >0% completeness")
    return count
```

- [ ] **Step 2: Run it**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -c "
from src.db.schema import get_connection
from src.db.migrate_to_enriched import migrate
from src.enrich.best_months import update_data_completeness
conn = get_connection('output/world_beaches.db')
migrate(conn)
update_data_completeness(conn)
conn.close()
"`
Expected: Updates completeness percentages.

- [ ] **Step 3: Commit**

```bash
git add src/enrich/best_months.py
git commit -m "feat: data_completeness_pct — tracks enrichment coverage per beach"
```

---

## Execution Summary

| Task | What it delivers | Runtime |
|---|---|---|
| 1. Test infrastructure | pytest fixtures, sample beaches | 5 min |
| 2. Schema migration | 80 new columns + 4 tables, idempotent | 10 min |
| 3. Grid climate pipeline | Grid dedup + Open-Meteo fetch + beach mapping | 20 min (code), days (full run) |
| 4. Computed fields | Nearest city, nearest airport, substrate heuristic | 15 min |
| 5. Best months + swim | Month scoring, swim suitability with inland handling | 10 min |
| 6. Orchestrator | Resumable pipeline runner with status reporting | 10 min |
| 7. Data completeness | Completeness % per beach | 5 min |

After this plan is complete: Phase 1 (grid climate) is implemented except Copernicus Marine SST (complex auth, deferred). Phase 2 is partially implemented (nearest city, nearest airport, substrate heuristic, best months, swim suitability). Still needed in a follow-up plan: GADM spatial join (2a), beach orientation (2d), beach length (2e), and Copernicus SST (1d). The grid climate pipeline can start running against the real 412K database immediately (takes days for full run, but is resumable). Phases 3-5 will be covered in subsequent plans.
