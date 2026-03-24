# Phase 3: EAV Migration + Spatial Data Enrichment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate 70K existing EAV attributes into flat columns, then add shark incidents, Wikipedia/Wikidata editorial data, and popularity scoring — delivering immediate data richness without large dataset downloads.

**Architecture:** EAV migration reads from beach_attributes and writes to flat columns on beaches. Shark data comes from the Global Shark Attack File CSV (~5MB download). Wikipedia/Wikidata data is already in beach_sources.raw_data. Popularity scoring computes notability_score from available signals.

**Tech Stack:** Python 3, SQLite3, requests (for GSAF CSV download), tqdm

**Spec:** `docs/superpowers/specs/2026-03-23-beach-data-enrichment-design.md`

---

## File Structure

```
src/
  enrich/
    eav_migration.py             -- CREATE: migrate beach_attributes → flat columns
    shark_incidents.py           -- CREATE: GSAF CSV download + proximity matching
    wikidata_editorial.py        -- CREATE: extract wikipedia_url, wikidata_id, image from existing sources
    popularity.py                -- CREATE: notability_score computation
tests/
  test_eav_migration.py          -- CREATE
  test_shark_incidents.py        -- CREATE
  test_wikidata_editorial.py     -- CREATE
  test_popularity.py             -- CREATE
```

---

### Task 1: EAV → Flat Column Migration

**Files:**
- Create: `src/enrich/eav_migration.py`
- Create: `tests/test_eav_migration.py`

This migrates 70,826 existing EAV attributes into the enriched flat columns. Mapping:

| EAV category.key | Flat column | Transform |
|---|---|---|
| environment.water_quality_rating | water_quality_rating | direct copy |
| environment.eu_bathing_water_type | water_quality_source | "eu_bathing" |
| safety.lifeguard | lifeguard | "true"/"yes" → 1, else 0 |
| facilities.access | (skip — too vague) | — |
| facilities.fee_required | (skip — no flat column) | — |
| facilities.wheelchair_access | wheelchair_accessible | "true"/"yes" → 1, else 0 |
| facilities.restrooms | has_restrooms | "true"/"yes" → 1, else 0 |
| facilities.showers | has_showers | "true"/"yes" → 1, else 0 |
| facilities.parking | has_parking | "true"/"yes" → 1, else 0 |
| facilities.drinking_water | (skip — no flat column) | — |
| social.nudist | nudism | "true"/"yes" → "yes", else value |
| social.dog_friendly | dogs_allowed | "true"/"yes" → 1, else 0 |
| social.image_url | (stored in beach_photos later) | — |
| social.wikipedia_url | wikipedia_url | direct copy |
| water_conditions.swimming | swim_suitability | "true" → "good" (low confidence) |
| surfing.surfing_available | (no flat column — informational) | — |

- [ ] **Step 1: Write tests**

Create `tests/test_eav_migration.py`:

```python
import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate


@pytest.fixture
def db_with_eav():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    # Insert a beach
    conn.execute(
        """INSERT INTO beaches (id, slug, name, centroid_lat, centroid_lng)
           VALUES ('b1', 'test-beach', 'Test Beach', 10, 20)"""
    )
    # Insert a source
    conn.execute(
        """INSERT INTO beach_sources (id, beach_id, source_name, source_id)
           VALUES ('s1', 'b1', 'eu_bathing', 'EU123')"""
    )
    # Insert EAV attributes
    attrs = [
        ("a1", "b1", "environment", "water_quality_rating", "excellent", "string", "s1"),
        ("a2", "b1", "safety", "lifeguard", "true", "boolean", "s1"),
        ("a3", "b1", "facilities", "restrooms", "true", "boolean", "s1"),
        ("a4", "b1", "facilities", "showers", "true", "boolean", "s1"),
        ("a5", "b1", "facilities", "wheelchair_access", "false", "boolean", "s1"),
        ("a6", "b1", "social", "nudist", "designated", "string", "s1"),
        ("a7", "b1", "social", "dog_friendly", "true", "boolean", "s1"),
        ("a8", "b1", "social", "wikipedia_url", "https://en.wikipedia.org/wiki/Test", "string", "s1"),
    ]
    for a in attrs:
        conn.execute(
            """INSERT INTO beach_attributes (id, beach_id, category, key, value, value_type, source_id)
               VALUES (?, ?, ?, ?, ?, ?, ?)""", a
        )
    conn.commit()
    return conn


def test_water_quality_migrated(db_with_eav):
    from src.enrich.eav_migration import migrate_eav_to_flat
    count = migrate_eav_to_flat(db_with_eav)
    assert count > 0
    row = db_with_eav.execute("SELECT water_quality_rating, water_quality_source FROM beaches WHERE id='b1'").fetchone()
    assert row["water_quality_rating"] == "excellent"
    assert row["water_quality_source"] == "eu_bathing"


def test_lifeguard_migrated(db_with_eav):
    from src.enrich.eav_migration import migrate_eav_to_flat
    migrate_eav_to_flat(db_with_eav)
    row = db_with_eav.execute("SELECT lifeguard FROM beaches WHERE id='b1'").fetchone()
    assert row["lifeguard"] == 1


def test_facilities_migrated(db_with_eav):
    from src.enrich.eav_migration import migrate_eav_to_flat
    migrate_eav_to_flat(db_with_eav)
    row = db_with_eav.execute(
        "SELECT has_restrooms, has_showers, wheelchair_accessible FROM beaches WHERE id='b1'"
    ).fetchone()
    assert row["has_restrooms"] == 1
    assert row["has_showers"] == 1
    assert row["wheelchair_accessible"] == 0


def test_social_fields_migrated(db_with_eav):
    from src.enrich.eav_migration import migrate_eav_to_flat
    migrate_eav_to_flat(db_with_eav)
    row = db_with_eav.execute(
        "SELECT nudism, dogs_allowed, wikipedia_url FROM beaches WHERE id='b1'"
    ).fetchone()
    assert row["nudism"] == "designated"
    assert row["dogs_allowed"] == 1
    assert row["wikipedia_url"] == "https://en.wikipedia.org/wiki/Test"


def test_idempotent(db_with_eav):
    from src.enrich.eav_migration import migrate_eav_to_flat
    migrate_eav_to_flat(db_with_eav)
    migrate_eav_to_flat(db_with_eav)  # Should not raise or double-count
    row = db_with_eav.execute("SELECT water_quality_rating FROM beaches WHERE id='b1'").fetchone()
    assert row["water_quality_rating"] == "excellent"
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_eav_migration.py -v`

- [ ] **Step 3: Write implementation**

Create `src/enrich/eav_migration.py`:

```python
"""
Migrate EAV beach_attributes data into flat columns on the beaches table.

This is a one-time migration that reads from the existing beach_attributes
table and writes values into the new enriched columns. Idempotent.
"""

from tqdm import tqdm


def _bool_value(val):
    """Convert EAV string boolean to integer 1/0."""
    if val is None:
        return None
    return 1 if str(val).lower() in ("true", "yes", "1") else 0


def migrate_eav_to_flat(conn) -> int:
    """Migrate EAV attributes to flat columns. Returns count of beaches updated."""
    # Get all beach IDs that have attributes
    beach_ids = conn.execute(
        "SELECT DISTINCT beach_id FROM beach_attributes"
    ).fetchall()

    count = 0
    for (beach_id_row,) in tqdm(beach_ids, desc="Migrating EAV → flat columns"):
        beach_id = beach_id_row if isinstance(beach_id_row, str) else beach_id_row[0]

        # Fetch all attributes for this beach
        attrs = conn.execute(
            "SELECT category, key, value, value_type, source_id FROM beach_attributes WHERE beach_id = ?",
            (beach_id,),
        ).fetchall()

        updates = {}
        for attr in attrs:
            cat, key, val, vtype, src_id = attr["category"], attr["key"], attr["value"], attr["value_type"], attr["source_id"]

            if cat == "environment" and key == "water_quality_rating" and val:
                updates["water_quality_rating"] = val
                # Determine source from the source record
                src = conn.execute(
                    "SELECT source_name FROM beach_sources WHERE id = ?", (src_id,)
                ).fetchone()
                if src:
                    updates["water_quality_source"] = src["source_name"]

            elif cat == "safety" and key == "lifeguard":
                updates["lifeguard"] = _bool_value(val)
                src = conn.execute(
                    "SELECT source_name FROM beach_sources WHERE id = ?", (src_id,)
                ).fetchone()
                if src:
                    updates["lifeguard_source"] = src["source_name"]

            elif cat == "facilities" and key == "restrooms":
                updates["has_restrooms"] = _bool_value(val)
            elif cat == "facilities" and key == "showers":
                updates["has_showers"] = _bool_value(val)
            elif cat == "facilities" and key == "parking":
                updates["has_parking"] = _bool_value(val)
            elif cat == "facilities" and key == "wheelchair_access":
                updates["wheelchair_accessible"] = _bool_value(val)
            elif cat == "social" and key == "nudist":
                if str(val).lower() in ("true", "yes", "1"):
                    updates["nudism"] = "yes"
                elif val:
                    updates["nudism"] = val
            elif cat == "social" and key == "dog_friendly":
                updates["dogs_allowed"] = _bool_value(val)
            elif cat == "social" and key == "wikipedia_url" and val:
                updates["wikipedia_url"] = val

        if not updates:
            continue

        # Build UPDATE query
        set_parts = [f"{col} = ?" for col in updates.keys()]
        set_parts.append("updated_at = datetime('now')")
        values = list(updates.values()) + [beach_id]
        conn.execute(
            f"UPDATE beaches SET {', '.join(set_parts)} WHERE id = ?",
            values,
        )
        count += 1
        if count % 5000 == 0:
            conn.commit()

    conn.commit()
    print(f"EAV migration: updated {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    migrate_eav_to_flat(conn)
    conn.close()
```

- [ ] **Step 4: Run tests**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_eav_migration.py -v`
Expected: All 5 tests pass.

- [ ] **Step 5: Run against real DB**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m src.enrich.eav_migration output/world_beaches.db`
Expected: "EAV migration: updated ~30K+ beaches"

- [ ] **Step 6: Commit**

```bash
git add src/enrich/eav_migration.py tests/test_eav_migration.py
git commit -m "feat: EAV → flat column migration — water quality, lifeguards, facilities, social"
```

---

### Task 2: Wikidata Editorial Extraction

**Files:**
- Create: `src/enrich/wikidata_editorial.py`
- Create: `tests/test_wikidata_editorial.py`

Extracts wikipedia_url, wikidata_id, and sitelinks count from existing beach_sources raw_data for wikidata-sourced beaches.

- [ ] **Step 1: Write tests**

Create `tests/test_wikidata_editorial.py`:

```python
import json
import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate


@pytest.fixture
def db_with_wikidata():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    conn.execute(
        """INSERT INTO beaches (id, slug, name, centroid_lat, centroid_lng)
           VALUES ('b1', 'test-beach', 'Test Beach', 10, 20)"""
    )
    raw = json.dumps({
        "wikidata_id": "Q123456",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Test_Beach",
        "image_url": "https://commons.wikimedia.org/wiki/File:Test.jpg",
        "labels": {"en": "Test Beach", "fr": "Plage Test"},
    })
    conn.execute(
        """INSERT INTO beach_sources (id, beach_id, source_name, source_id, raw_data)
           VALUES ('s1', 'b1', 'wikidata', 'Q123456', ?)""",
        (raw,),
    )
    conn.commit()
    return conn


def test_wikidata_id_extracted(db_with_wikidata):
    from src.enrich.wikidata_editorial import enrich_wikidata_editorial
    count = enrich_wikidata_editorial(db_with_wikidata)
    assert count >= 1
    row = db_with_wikidata.execute("SELECT wikidata_id, wikipedia_url FROM beaches WHERE id='b1'").fetchone()
    assert row["wikidata_id"] == "Q123456"
    assert row["wikipedia_url"] == "https://en.wikipedia.org/wiki/Test_Beach"


def test_sitelinks_counted(db_with_wikidata):
    from src.enrich.wikidata_editorial import enrich_wikidata_editorial
    enrich_wikidata_editorial(db_with_wikidata)
    row = db_with_wikidata.execute("SELECT wikidata_sitelinks FROM beaches WHERE id='b1'").fetchone()
    # labels dict has 2 entries = 2 sitelinks
    assert row["wikidata_sitelinks"] == 2
```

- [ ] **Step 2: Write implementation**

Create `src/enrich/wikidata_editorial.py`:

```python
"""
Extract Wikidata editorial signals from existing beach_sources raw_data.

No API calls — reads from already-ingested wikidata source records.
"""

import json
from tqdm import tqdm


def enrich_wikidata_editorial(conn) -> int:
    """Extract wikidata_id, wikipedia_url, sitelinks from raw_data."""
    rows = conn.execute(
        """SELECT bs.beach_id, bs.source_id, bs.raw_data
           FROM beach_sources bs
           WHERE bs.source_name = 'wikidata' AND bs.raw_data IS NOT NULL"""
    ).fetchall()

    count = 0
    for row in tqdm(rows, desc="Extracting Wikidata editorial"):
        raw = row["raw_data"]
        try:
            data = json.loads(raw) if isinstance(raw, str) else raw
        except (json.JSONDecodeError, TypeError):
            continue

        wikidata_id = data.get("wikidata_id") or row["source_id"]
        wikipedia_url = data.get("wikipedia_url")
        labels = data.get("labels", {})
        sitelinks = len(labels) if isinstance(labels, dict) else 0

        updates = {"wikidata_id": wikidata_id}
        if wikipedia_url:
            updates["wikipedia_url"] = wikipedia_url
        if sitelinks > 0:
            updates["wikidata_sitelinks"] = sitelinks

        set_parts = [f"{col} = ?" for col in updates.keys()]
        set_parts.append("updated_at = datetime('now')")
        values = list(updates.values()) + [row["beach_id"]]
        conn.execute(
            f"UPDATE beaches SET {', '.join(set_parts)} WHERE id = ?",
            values,
        )
        count += 1
        if count % 5000 == 0:
            conn.commit()

    conn.commit()
    print(f"Wikidata editorial: enriched {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    enrich_wikidata_editorial(conn)
    conn.close()
```

- [ ] **Step 3: Run tests**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_wikidata_editorial.py -v`
Expected: Both tests pass.

- [ ] **Step 4: Run against real DB**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m src.enrich.wikidata_editorial`

- [ ] **Step 5: Commit**

```bash
git add src/enrich/wikidata_editorial.py tests/test_wikidata_editorial.py
git commit -m "feat: extract wikidata_id, wikipedia_url, sitelinks from existing source data"
```

---

### Task 3: Shark Incident Data

**Files:**
- Create: `src/enrich/shark_incidents.py`
- Create: `tests/test_shark_incidents.py`

Downloads the Global Shark Attack File and matches incidents to nearby beaches within 10km.

- [ ] **Step 1: Write tests**

Create `tests/test_shark_incidents.py`:

```python
import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate


@pytest.fixture
def enriched_db_sharks():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    # Bondi Beach, Sydney — known shark area
    conn.execute(
        """INSERT INTO beaches (id, slug, name, centroid_lat, centroid_lng)
           VALUES ('b1', 'bondi', 'Bondi Beach', -33.891, 151.274)"""
    )
    # Remote beach, no incidents nearby
    conn.execute(
        """INSERT INTO beaches (id, slug, name, centroid_lat, centroid_lng)
           VALUES ('b2', 'remote', 'Remote Beach', 0.0, 0.0)"""
    )
    conn.commit()
    return conn


def test_haversine():
    from src.enrich.shark_incidents import _haversine_km
    # Sydney to nearby point (~1km)
    d = _haversine_km(-33.891, 151.274, -33.900, 151.274)
    assert 0.5 < d < 2.0


def test_parse_incident():
    from src.enrich.shark_incidents import _parse_incident_row
    row = {
        "Latitude": "-33.89",
        "Longitude": "151.27",
        "Year": "2020",
    }
    result = _parse_incident_row(row)
    assert result is not None
    assert result["lat"] == pytest.approx(-33.89)
    assert result["year"] == 2020


def test_parse_incident_bad_data():
    from src.enrich.shark_incidents import _parse_incident_row
    assert _parse_incident_row({"Latitude": "", "Longitude": "", "Year": ""}) is None
    assert _parse_incident_row({"Latitude": "abc", "Longitude": "def", "Year": "xyz"}) is None
```

- [ ] **Step 2: Write implementation**

Create `src/enrich/shark_incidents.py`:

```python
"""
Enrich beaches with shark incident data from the Global Shark Attack File (GSAF).

Downloads CSV from GitHub, parses incidents with coordinates, matches to
nearest beaches within 10km radius.
"""

import csv
import io
import math
from collections import defaultdict

import requests
from tqdm import tqdm

GSAF_URL = "https://raw.githubusercontent.com/cjabradshaw/GSharkAttackData/main/data/GSAF_attackdata.csv"
MATCH_RADIUS_KM = 10
GRID_SIZE = 0.1  # ~11km grid cells for spatial indexing


def _haversine_km(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(a))


def _parse_incident_row(row):
    """Parse a GSAF CSV row. Returns dict or None if unparseable."""
    try:
        lat = float(row.get("Latitude", "").strip())
        lng = float(row.get("Longitude", "").strip())
        year = int(row.get("Year", "0").strip())
    except (ValueError, TypeError):
        return None
    if lat == 0 and lng == 0:
        return None
    if not (-90 <= lat <= 90 and -180 <= lng <= 180):
        return None
    return {"lat": lat, "lng": lng, "year": year}


def _download_gsaf():
    """Download and parse GSAF CSV. Returns list of incident dicts."""
    print("Downloading GSAF data...")
    resp = requests.get(GSAF_URL, timeout=60)
    resp.raise_for_status()
    reader = csv.DictReader(io.StringIO(resp.text))
    incidents = []
    for row in reader:
        parsed = _parse_incident_row(row)
        if parsed:
            incidents.append(parsed)
    print(f"  Parsed {len(incidents)} incidents with coordinates")
    return incidents


def enrich_shark_incidents(conn, incidents=None) -> int:
    """Match shark incidents to nearest beaches. Returns count updated."""
    if incidents is None:
        incidents = _download_gsaf()

    if not incidents:
        print("No shark incidents to process")
        return 0

    # Build spatial grid of incidents
    grid = defaultdict(list)
    for inc in incidents:
        key = (round(inc["lat"] / GRID_SIZE), round(inc["lng"] / GRID_SIZE))
        grid[key].append(inc)

    # Process each beach
    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches WHERE shark_incidents_total IS NULL"
    ).fetchall()

    count = 0
    for row in tqdm(rows, desc="Matching shark incidents"):
        lat, lng = row["centroid_lat"], row["centroid_lng"]
        gx, gy = round(lat / GRID_SIZE), round(lng / GRID_SIZE)

        # Search 9-cell neighborhood
        nearby = []
        for di in (-1, 0, 1):
            for dj in (-1, 0, 1):
                nearby.extend(grid.get((gx + di, gy + dj), []))

        # Filter by actual distance
        matches = [inc for inc in nearby if _haversine_km(lat, lng, inc["lat"], inc["lng"]) <= MATCH_RADIUS_KM]

        if matches:
            total = len(matches)
            last_year = max(inc["year"] for inc in matches if inc["year"] > 0) if any(inc["year"] > 0 for inc in matches) else None
            conn.execute(
                """UPDATE beaches SET shark_incidents_total = ?, shark_incident_last_year = ?,
                   shark_source = 'gsaf', updated_at = datetime('now') WHERE id = ?""",
                (total, last_year, row["id"]),
            )
        else:
            conn.execute(
                """UPDATE beaches SET shark_incidents_total = 0,
                   shark_source = 'gsaf', updated_at = datetime('now') WHERE id = ?""",
                (0, row["id"]),
            )
        count += 1
        if count % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"Shark incidents: enriched {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    enrich_shark_incidents(conn)
    conn.close()
```

- [ ] **Step 3: Run tests**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_shark_incidents.py -v`
Expected: All 3 tests pass.

- [ ] **Step 4: Run against real DB**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m src.enrich.shark_incidents`

- [ ] **Step 5: Commit**

```bash
git add src/enrich/shark_incidents.py tests/test_shark_incidents.py
git commit -m "feat: shark incident matching — GSAF data within 10km of each beach"
```

---

### Task 4: Notability Score + Data Completeness Update

**Files:**
- Create: `src/enrich/popularity.py`
- Create: `tests/test_popularity.py`
- Modify: `run_enrichment.py` (add Phase 3 to orchestrator)

- [ ] **Step 1: Write tests**

Create `tests/test_popularity.py`:

```python
import pytest


def test_notability_score_basic():
    from src.enrich.popularity import compute_notability_score
    score = compute_notability_score(
        wikipedia_page_views=500000,
        wikidata_sitelinks=30,
        photo_count=50,
        source_count=3,
        blue_flag=True,
        water_quality="excellent",
        species_count=100,
    )
    assert 50 < score <= 100


def test_notability_score_empty():
    from src.enrich.popularity import compute_notability_score
    score = compute_notability_score(
        wikipedia_page_views=0,
        wikidata_sitelinks=0,
        photo_count=0,
        source_count=1,
        blue_flag=False,
        water_quality=None,
        species_count=0,
    )
    assert 0 <= score < 20


def test_notability_score_blue_flag_boost():
    from src.enrich.popularity import compute_notability_score
    without = compute_notability_score(0, 0, 0, 1, False, None, 0)
    with_bf = compute_notability_score(0, 0, 0, 1, True, None, 0)
    assert with_bf > without


def test_normalize():
    from src.enrich.popularity import _normalize
    assert _normalize(0, 0, 100) == 0.0
    assert _normalize(100, 0, 100) == 1.0
    assert _normalize(50, 0, 100) == 0.5
    assert _normalize(200, 0, 100) == 1.0  # Capped at 1.0
    assert _normalize(-10, 0, 100) == 0.0  # Capped at 0.0
```

- [ ] **Step 2: Write implementation**

Create `src/enrich/popularity.py`:

```python
"""
Compute notability_score for all beaches based on available signals.
"""

from tqdm import tqdm


def _normalize(value, min_val, max_val):
    """Normalize value to 0.0-1.0 range, clamped."""
    if value is None or max_val == min_val:
        return 0.0
    return max(0.0, min(1.0, (value - min_val) / (max_val - min_val)))


def compute_notability_score(
    wikipedia_page_views=0,
    wikidata_sitelinks=0,
    photo_count=0,
    source_count=1,
    blue_flag=False,
    water_quality=None,
    species_count=0,
) -> float:
    """Compute notability score 0-100."""
    score = (
        _normalize(wikipedia_page_views or 0, 0, 1_000_000) * 30 +
        _normalize(wikidata_sitelinks or 0, 0, 50) * 20 +
        _normalize(photo_count or 0, 0, 100) * 15 +
        _normalize(source_count or 1, 1, 5) * 10 +
        (10 if blue_flag else 0) +
        (10 if water_quality == "excellent" else 0) +
        _normalize(species_count or 0, 0, 500) * 5
    )
    return round(score, 1)


def enrich_notability(conn) -> int:
    """Compute notability_score for all beaches."""
    rows = conn.execute(
        """SELECT b.id, b.wikipedia_page_views_annual, b.wikidata_sitelinks,
           b.photo_count, b.blue_flag, b.water_quality_rating, b.species_observed_count,
           (SELECT COUNT(*) FROM beach_sources WHERE beach_id = b.id) as source_count
           FROM beaches b"""
    ).fetchall()

    count = 0
    for row in tqdm(rows, desc="Computing notability scores"):
        score = compute_notability_score(
            wikipedia_page_views=row["wikipedia_page_views_annual"],
            wikidata_sitelinks=row["wikidata_sitelinks"],
            photo_count=row["photo_count"],
            source_count=row["source_count"],
            blue_flag=bool(row["blue_flag"]),
            water_quality=row["water_quality_rating"],
            species_count=row["species_observed_count"],
        )
        conn.execute(
            "UPDATE beaches SET notability_score = ?, updated_at = datetime('now') WHERE id = ?",
            (score, row["id"]),
        )
        count += 1
        if count % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"Notability: scored {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    enrich_notability(conn)
    conn.close()
```

- [ ] **Step 3: Run tests**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python -m pytest tests/test_popularity.py -v`
Expected: All 4 tests pass.

- [ ] **Step 4: Add Phase 3 to orchestrator**

Add to `run_enrichment.py`, after the Phase 2 block and before `show_status`:

```python
    if args.phase is None or args.phase == 3:
        from src.enrich.eav_migration import migrate_eav_to_flat
        print("\n=== Phase 3a: EAV Migration ===")
        migrate_eav_to_flat(conn)

        from src.enrich.wikidata_editorial import enrich_wikidata_editorial
        print("\n=== Phase 3b: Wikidata Editorial ===")
        enrich_wikidata_editorial(conn)

        from src.enrich.shark_incidents import enrich_shark_incidents
        print("\n=== Phase 3c: Shark Incidents ===")
        enrich_shark_incidents(conn)

        from src.enrich.popularity import enrich_notability
        print("\n=== Phase 3d: Notability Scoring ===")
        enrich_notability(conn)

        from src.enrich.best_months import update_data_completeness
        print("\n=== Phase 3e: Data Completeness ===")
        update_data_completeness(conn)
```

Also update `choices=[1, 2]` to `choices=[1, 2, 3]` in the argparse.

- [ ] **Step 5: Run against real DB**

Run: `cd /c/Users/Roci/Desktop/worldbeachtour && python run_enrichment.py --phase 3`

- [ ] **Step 6: Commit**

```bash
git add src/enrich/popularity.py tests/test_popularity.py run_enrichment.py
git commit -m "feat: notability scoring + Phase 3 orchestrator integration"
```

---

## Execution Summary

| Task | What it delivers | Runtime |
|---|---|---|
| 1. EAV migration | 70K attributes → flat columns (water quality, lifeguards, facilities) | 5 min |
| 2. Wikidata editorial | wikidata_id, wikipedia_url, sitelinks for ~17K beaches | 2 min |
| 3. Shark incidents | GSAF download + 228K beach proximity matching | 5 min |
| 4. Notability + orchestrator | Scoring for all beaches, Phase 3 in orchestrator | 5 min |

After this plan: every beach has nearest city + airport (100%), ~30K have water quality/facilities/lifeguard data, ~17K have Wikidata IDs, all have shark incident counts and notability scores. Data completeness % is updated for all.

**Still needs separate plans (large downloads required):**
- GADM spatial join (1.5GB) → admin_level_2/3
- GEBCO bathymetry (7GB) → nearshore depth
- FES2022 tidal model (2GB) → tide ranges
- GCC coastal transects (200MB) → substrate classification
- WDPA protected areas (1GB) → protected area status
- Ecological APIs (iNaturalist, eBird, OBIS) → species data
- Wikimedia/Flickr photo search → beach photos
- Wikipedia page views API → popularity signal
