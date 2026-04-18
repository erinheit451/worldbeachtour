# Enrichment v2 — Milestone A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Milestone A of the v2 enrichment spec — schema migrations + Track 1 steps 1–5 (GADM, geometry, WDPA, FES2022, GEBCO) + Wikipedia pageviews expansion. Result: structural enrichment columns filled across the 228K-beach DB, Wikipedia pageviews 15×ed, verification infrastructure in place for Milestones B/C/D.

**Architecture:** Each new pipeline is a module in `src/enrich/` with a top-level `enrich_<name>(conn, ...)` function, mirrors `shark_incidents.py`. Tests use the in-memory DB fixtures in `tests/conftest.py`. Schema changes go through the existing idempotent `src/db/migrate_to_enriched.py`. Every pipeline writes a row to `enrichment_log` and fails loudly on HTTP 429/5xx/auth errors (never `except Exception: return None`). Smoke-test beach IDs (`waikiki-beach`, `catedrais`, `navagio`, `oppenheimer-beach`) have expected-value assertions.

**Tech Stack:** Python 3.11+, SQLite (WAL mode), `requests`, `pytest`, `geopandas`, `shapely`, `rtree`, `xarray`, `netCDF4`, `pyfes`, `tqdm`.

**Spec reference:** `docs/superpowers/specs/2026-04-18-enrichment-v2-design.md`

**File structure for this milestone:**

| File | Purpose |
|---|---|
| `src/db/migrate_to_enriched.py` | Extend with new columns + `admin_regions`, `beach_hazards`, `beach_webcams` tables |
| `src/enrich/_common.py` | NEW — shared verification helpers (log_run, pre/post coverage SQL, smoke-test fixtures) |
| `src/enrich/wikipedia_pageviews.py` | EXTEND — batch resolver for Wikidata→Wikipedia for the 15K unresolved wikidata_ids |
| `src/enrich/geometry_derived.py` | NEW — beach_length_m, orientation_deg, sunset_visible from existing polygons |
| `src/enrich/gadm_admin.py` | NEW — spatial join beaches → GADM L2/L3 polygons; populate admin_regions |
| `src/enrich/wdpa_protected.py` | NEW — spatial join beaches → WDPA polygons |
| `src/enrich/fes2022_tides.py` | NEW — pyfes tidal constituents per beach → spring/neap range + type |
| `src/enrich/gebco_bathymetry.py` | NEW — nearshore_depth_m, slope_pct, drop_off_flag from GEBCO NetCDF |
| `src/enrich/_smoke.py` | NEW — canonical smoke-test beach IDs + expected values per field |
| `scripts/milestone_a_report.py` | NEW — coverage delta report (before/after) for the whole milestone |
| `tests/test_<each>.py` | NEW — one test file per new pipeline module, following `test_shark_incidents.py` pattern |

Each pipeline follows the same shape: test first, implementation second, coverage-delta assertion third, smoke-test fixture fourth, commit fifth.

---

## Task 1: Schema migrations — new tables + columns

**Files:**
- Modify: `src/db/migrate_to_enriched.py` (append to `BEACHES_NEW_COLUMNS` and `NEW_TABLES`)
- Test: `tests/test_migration.py` (existing file — add new assertions)

- [ ] **Step 1: Write the failing test**

Append to `tests/test_migration.py`:

```python
def test_migration_adds_v2_columns():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    cols = [r[1] for r in conn.execute("PRAGMA table_info(beaches)").fetchall()]
    for c in [
        "parking_capacity", "parking_fee_usd",
        "ferry_terminal_id", "ferry_terminal_distance_km",
        "transit_stops_500m_count",
        "slope_pct", "drop_off_flag",
        "bathing_water_grade", "blue_flag_latest_year",
    ]:
        assert c in cols, f"missing column {c}"


def test_migration_creates_v2_tables():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    for t in ["admin_regions", "beach_hazards", "beach_webcams"]:
        assert conn.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (t,)
        ).fetchone() is not None, f"missing table {t}"


def test_migration_is_idempotent():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    added_second = migrate(conn)
    assert added_second == 0
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pytest tests/test_migration.py::test_migration_adds_v2_columns tests/test_migration.py::test_migration_creates_v2_tables -v`
Expected: both FAIL with "missing column" / "missing table".

- [ ] **Step 3: Extend the migration module**

In `src/db/migrate_to_enriched.py`, append to `BEACHES_NEW_COLUMNS` (preserving existing entries):

```python
# v2 enrichment columns (2026-04-18 spec)
("parking_capacity", "INTEGER"),
("parking_fee_usd", "REAL"),
("ferry_terminal_id", "TEXT"),
("ferry_terminal_distance_km", "REAL"),
("transit_stops_500m_count", "INTEGER"),
("slope_pct", "REAL"),
("drop_off_flag", "INTEGER"),
("bathing_water_grade", "TEXT"),
("blue_flag_latest_year", "INTEGER"),
```

Append to `NEW_TABLES` dict:

```python
"admin_regions": """
    CREATE TABLE admin_regions (
        id TEXT PRIMARY KEY,
        country_code TEXT,
        admin_l1 TEXT,
        admin_l2 TEXT,
        admin_l3 TEXT,
        cuisine_json JSON,
        festivals_json JSON,
        transit_system_note TEXT,
        source_url TEXT,
        extracted_at TEXT
    )
""",
"beach_hazards": """
    CREATE TABLE beach_hazards (
        id INTEGER PRIMARY KEY,
        beach_id TEXT REFERENCES beaches(id),
        hazard_type TEXT NOT NULL,
        severity TEXT,
        observed_date TEXT,
        source TEXT,
        source_url TEXT,
        expires_at TEXT
    )
""",
"beach_webcams": """
    CREATE TABLE beach_webcams (
        id INTEGER PRIMARY KEY,
        beach_id TEXT REFERENCES beaches(id),
        url TEXT NOT NULL,
        network TEXT,
        license TEXT,
        last_verified TEXT
    )
""",
```

Append to `NEW_TABLE_INDEXES`:

```python
("idx_admin_regions_country", "admin_regions(country_code, admin_l2)"),
("idx_hazards_beach", "beach_hazards(beach_id)"),
("idx_hazards_type_date", "beach_hazards(hazard_type, observed_date)"),
("idx_webcams_beach", "beach_webcams(beach_id)"),
```

- [ ] **Step 4: Run all three tests, verify pass**

Run: `pytest tests/test_migration.py -v`
Expected: all PASS.

- [ ] **Step 5: Run the migration on the real DB**

Run: `python -m src.db.migrate_to_enriched output/world_beaches.db`
Expected output: `Migration complete: 9 columns added`.
Verify tables: `python -c "import sqlite3; c=sqlite3.connect('output/world_beaches.db'); print([r[0] for r in c.execute(\"SELECT name FROM sqlite_master WHERE type='table'\").fetchall()])"`
Expected: includes `admin_regions`, `beach_hazards`, `beach_webcams`.

- [ ] **Step 6: Commit**

```bash
git add src/db/migrate_to_enriched.py tests/test_migration.py
git commit -m "schema: v2 migration — admin_regions, beach_hazards, beach_webcams + 9 new beaches cols"
```

---

## Task 2: Verification helpers (`_common.py`) + smoke-test fixtures

This module is reused by every pipeline below. Build it first so later tasks can reference it.

**Files:**
- Create: `src/enrich/_common.py`
- Create: `src/enrich/_smoke.py`
- Test: `tests/test_enrich_common.py`

- [ ] **Step 1: Write the failing test**

Create `tests/test_enrich_common.py`:

```python
import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate
from src.enrich._common import (
    coverage_count, log_run_start, log_run_finish, CoverageAssertionError,
    assert_coverage_delta,
)


@pytest.fixture
def db():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    conn.execute("INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng) VALUES ('b1','A','a',0,0)")
    conn.execute("INSERT INTO beaches (id, name, slug, centroid_lat, centroid_lng) VALUES ('b2','B','b',0,0)")
    conn.commit()
    return conn


def test_coverage_count_none(db):
    assert coverage_count(db, "beaches", "notability_score") == 0


def test_coverage_count_one(db):
    db.execute("UPDATE beaches SET notability_score=1.0 WHERE id='b1'")
    assert coverage_count(db, "beaches", "notability_score") == 1


def test_log_run_lifecycle(db):
    run_id = log_run_start(db, "test_pipeline", phase="A")
    assert isinstance(run_id, int)
    log_run_finish(db, run_id, status="ok", total_processed=42)
    row = db.execute("SELECT status, total_processed FROM enrichment_log WHERE id=?", (run_id,)).fetchone()
    assert row["status"] == "ok"
    assert row["total_processed"] == 42


def test_assert_coverage_delta_ok(db):
    db.execute("UPDATE beaches SET notability_score=1.0 WHERE id='b1'")
    assert_coverage_delta(db, "beaches", "notability_score", before=0, min_delta=1)


def test_assert_coverage_delta_fails(db):
    with pytest.raises(CoverageAssertionError):
        assert_coverage_delta(db, "beaches", "notability_score", before=0, min_delta=10)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pytest tests/test_enrich_common.py -v`
Expected: FAIL with `ImportError` (module doesn't exist).

- [ ] **Step 3: Implement `_common.py`**

Create `src/enrich/_common.py`:

```python
"""
Shared verification + logging helpers for all enrichment pipelines.

Every pipeline should:
  1. Call coverage_count() to measure baseline BEFORE running
  2. Call log_run_start() to register the run
  3. Do its work, RAISING on HTTP 429/5xx/auth (never swallow)
  4. Call log_run_finish() at the end
  5. Call assert_coverage_delta() to fail loudly if no rows were actually written
"""

import datetime as _dt


class CoverageAssertionError(AssertionError):
    """Raised when a pipeline's post-run coverage delta is below the minimum threshold."""


def coverage_count(conn, table: str, column: str) -> int:
    """Count rows where `column` is not null. Used before/after a pipeline run."""
    return conn.execute(
        f"SELECT COUNT(*) FROM {table} WHERE {column} IS NOT NULL"
    ).fetchone()[0]


def log_run_start(conn, script_name: str, phase: str = "A") -> int:
    """Insert a row in enrichment_log, return its id."""
    now = _dt.datetime.utcnow().isoformat(timespec="seconds")
    cur = conn.execute(
        """INSERT INTO enrichment_log
           (script_name, phase, status, started_at, updated_at)
           VALUES (?, ?, 'running', ?, ?)""",
        (script_name, phase, now, now),
    )
    conn.commit()
    return cur.lastrowid


def log_run_finish(conn, run_id: int, status: str, total_processed: int = 0, total_errors: int = 0) -> None:
    """Mark the run finished. status in {'ok','error','partial'}."""
    now = _dt.datetime.utcnow().isoformat(timespec="seconds")
    conn.execute(
        """UPDATE enrichment_log
           SET status=?, total_processed=?, total_errors=?, completed_at=?, updated_at=?
           WHERE id=?""",
        (status, total_processed, total_errors, now, now, run_id),
    )
    conn.commit()


def assert_coverage_delta(conn, table: str, column: str, before: int, min_delta: int) -> None:
    """Fail loudly if the pipeline didn't actually fill at least `min_delta` rows."""
    after = coverage_count(conn, table, column)
    delta = after - before
    if delta < min_delta:
        raise CoverageAssertionError(
            f"{table}.{column}: expected delta >= {min_delta}, got {delta} "
            f"(before={before}, after={after}). Pipeline failed silently."
        )


class HttpError(RuntimeError):
    """Raise on any HTTP 429, 5xx, or auth failure. Never swallow these silently."""


def raise_for_http(resp) -> None:
    """Call after requests.get/post. Raises HttpError on 429/auth/5xx."""
    if resp.status_code == 429:
        raise HttpError(f"rate-limited ({resp.url}): {resp.text[:200]}")
    if resp.status_code in (401, 403):
        raise HttpError(f"auth failure {resp.status_code} ({resp.url})")
    if 500 <= resp.status_code < 600:
        raise HttpError(f"server error {resp.status_code} ({resp.url}): {resp.text[:200]}")
    resp.raise_for_status()
```

- [ ] **Step 4: Implement `_smoke.py`**

Create `src/enrich/_smoke.py`:

```python
"""
Canonical smoke-test beach slugs and expected values per enrichment field.

Every pipeline should check: when run on the real DB, do these slugs come out
with the expected values? If not, the pipeline is broken regardless of what
enrichment_log says.
"""

# slug → {column → expected approximate value (or range, or predicate)}
# Only add a field here once the pipeline that fills it has been built.
SMOKE_BEACHES = {
    # Washington, USA — sand, semidiurnal, cool Pacific, easily checkable on Wikipedia
    "waikiki-beach":      {"country_code": "US"},
    # Spain, Galicia — known for extreme tidal range (Catedrais only visible at low tide)
    "catedrais":          {"country_code": "ES"},
    # Zakynthos, Greece — famous shipwreck beach, Bond location, cliff-enclosed
    "navagio":            {"country_code": "GR"},
    # Tanzania, Zanzibar — ferry-only, Indian Ocean
    "oppenheimer-beach":  {"country_code": "TZ"},
}


def lookup_beach_id(conn, slug: str) -> str | None:
    """Get a smoke-test beach's id by slug, or None if not in DB."""
    row = conn.execute("SELECT id FROM beaches WHERE slug = ?", (slug,)).fetchone()
    return row["id"] if row else None


def smoke_check(conn, column: str, predicate) -> list[str]:
    """
    Run `predicate(value)` for each smoke beach's value in `column`.
    Returns list of slugs that failed. Empty list = all pass.
    """
    failed = []
    for slug in SMOKE_BEACHES:
        beach_id = lookup_beach_id(conn, slug)
        if beach_id is None:
            continue  # smoke beach not in this DB (e.g., test fixture)
        row = conn.execute(f"SELECT {column} FROM beaches WHERE id=?", (beach_id,)).fetchone()
        value = row[column] if row else None
        if not predicate(value):
            failed.append(f"{slug}:{column}={value!r}")
    return failed
```

- [ ] **Step 5: Run tests, verify pass**

Run: `pytest tests/test_enrich_common.py -v`
Expected: all 5 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/enrich/_common.py src/enrich/_smoke.py tests/test_enrich_common.py
git commit -m "enrich: shared verification helpers + smoke-test beach fixtures"
```

---

## Task 3: Wikipedia pageviews expansion (the cheap fast win)

Current state: 1,069 beaches have `wikipedia_page_views_annual`; 16,699 have `wikidata_id`. For ~15K beaches with a Wikidata ID but no Wikipedia URL, resolve Wikidata entity → Wikipedia page title via Wikidata entity API (`P31` + sitelinks), then batch-fetch pageviews.

**Files:**
- Modify: `src/enrich/wikipedia_pageviews.py` (add a resolver + a driver that runs over existing wikidata_ids)
- Test: `tests/test_wikipedia_pageviews.py` (extend)

- [ ] **Step 1: Read the existing module**

Run: `cat src/enrich/wikipedia_pageviews.py` (or Read).
Note the current function signatures and HTTP call patterns.

- [ ] **Step 2: Write the failing test**

Append to `tests/test_wikipedia_pageviews.py`:

```python
def test_resolve_wikidata_to_wikipedia_title(monkeypatch):
    """Given a Wikidata QID, return the English Wikipedia page title via sitelinks."""
    from src.enrich import wikipedia_pageviews as wp

    fake_response = {
        "entities": {
            "Q180402": {
                "sitelinks": {
                    "enwiki": {"title": "Bondi Beach"},
                    "eswiki": {"title": "Playa Bondi"},
                }
            }
        }
    }

    class FakeResp:
        status_code = 200
        def json(self): return fake_response
        def raise_for_status(self): pass

    monkeypatch.setattr(wp.requests, "get", lambda *a, **k: FakeResp())
    assert wp.resolve_wikidata_to_wikipedia_title("Q180402") == "Bondi Beach"


def test_resolve_wikidata_raises_on_429(monkeypatch):
    from src.enrich import wikipedia_pageviews as wp
    from src.enrich._common import HttpError

    class FakeResp:
        status_code = 429
        text = "rate limited"
        url = "https://wikidata.org/..."

    monkeypatch.setattr(wp.requests, "get", lambda *a, **k: FakeResp())
    import pytest
    with pytest.raises(HttpError):
        wp.resolve_wikidata_to_wikipedia_title("Q180402")


def test_expand_pageviews_coverage(db_with_beaches, monkeypatch):
    """Driver: for beaches with wikidata_id but no wikipedia_url, resolve + fetch."""
    from src.enrich import wikipedia_pageviews as wp

    # Set up one beach with a Wikidata ID but no URL
    db_with_beaches.execute(
        "UPDATE beaches SET wikidata_id='Q180402' WHERE id='b3'"
    )
    db_with_beaches.commit()

    monkeypatch.setattr(wp, "resolve_wikidata_to_wikipedia_title", lambda qid: "Bondi Beach")
    monkeypatch.setattr(wp, "fetch_pageviews_annual", lambda title, lang="en": 50000)

    count = wp.expand_pageviews(db_with_beaches)
    assert count == 1

    row = db_with_beaches.execute(
        "SELECT wikipedia_url, wikipedia_page_views_annual FROM beaches WHERE id='b3'"
    ).fetchone()
    assert row["wikipedia_url"] == "https://en.wikipedia.org/wiki/Bondi_Beach"
    assert row["wikipedia_page_views_annual"] == 50000
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `pytest tests/test_wikipedia_pageviews.py -v -k "resolve or expand"`
Expected: FAIL with `AttributeError` — `resolve_wikidata_to_wikipedia_title` and `expand_pageviews` do not exist yet.

- [ ] **Step 4: Implement the resolver + driver**

Append to `src/enrich/wikipedia_pageviews.py`:

```python
import requests
from src.enrich._common import (
    raise_for_http, log_run_start, log_run_finish,
    coverage_count, assert_coverage_delta,
)

WIKIDATA_ENTITY_URL = "https://www.wikidata.org/wiki/Special:EntityData/{qid}.json"


def resolve_wikidata_to_wikipedia_title(qid: str, lang: str = "en") -> str | None:
    """Resolve a Wikidata QID to the Wikipedia page title in the given language.
    Returns None if the entity has no sitelink for that language.
    Raises HttpError on 429/auth/5xx (no silent swallow)."""
    url = WIKIDATA_ENTITY_URL.format(qid=qid)
    resp = requests.get(url, timeout=20, headers={"User-Agent": "worldbeachtour/1.0"})
    raise_for_http(resp)
    data = resp.json()
    sitelinks = data.get("entities", {}).get(qid, {}).get("sitelinks", {})
    entry = sitelinks.get(f"{lang}wiki")
    return entry["title"] if entry else None


def expand_pageviews(conn, limit: int | None = None) -> int:
    """For every beach with wikidata_id but no wikipedia_url, resolve + fetch pageviews.
    Returns count of beaches updated. Assertion-fails if zero updated when targets exist."""
    run_id = log_run_start(conn, "wikipedia_pageviews_expand", phase="A")
    before = coverage_count(conn, "beaches", "wikipedia_page_views_annual")

    q = """SELECT id, wikidata_id FROM beaches
           WHERE wikidata_id IS NOT NULL AND wikipedia_url IS NULL"""
    if limit:
        q += f" LIMIT {int(limit)}"
    targets = conn.execute(q).fetchall()
    if not targets:
        log_run_finish(conn, run_id, "ok", total_processed=0)
        return 0

    updated = 0
    errors = 0
    from tqdm import tqdm
    for row in tqdm(targets, desc="resolving wikidata→wiki pageviews"):
        try:
            title = resolve_wikidata_to_wikipedia_title(row["wikidata_id"])
            if not title:
                continue
            views = fetch_pageviews_annual(title)
            url = f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}"
            conn.execute(
                """UPDATE beaches SET wikipedia_url=?, wikipedia_page_views_annual=?,
                   updated_at=datetime('now') WHERE id=?""",
                (url, views, row["id"]),
            )
            updated += 1
            if updated % 500 == 0:
                conn.commit()
        except Exception as e:
            errors += 1
            # Raise on rate-limit/auth/5xx — but let 404s and empty-sitelink cases pass
            from src.enrich._common import HttpError
            if isinstance(e, HttpError):
                conn.commit()
                log_run_finish(conn, run_id, "error", total_processed=updated, total_errors=errors)
                raise

    conn.commit()
    log_run_finish(conn, run_id, "ok", total_processed=updated, total_errors=errors)

    # Coverage assertion: if we had targets, we must have filled *something*
    if len(targets) >= 100:
        assert_coverage_delta(conn, "beaches", "wikipedia_page_views_annual",
                              before=before, min_delta=max(1, len(targets) // 10))
    return updated
```

Note: `fetch_pageviews_annual(title, lang="en")` already exists in this file from prior work — this driver reuses it. If it doesn't exist, check the existing module and adapt to its current function name (e.g., `_fetch_pageviews`).

- [ ] **Step 5: Run tests, verify pass**

Run: `pytest tests/test_wikipedia_pageviews.py -v`
Expected: all PASS.

- [ ] **Step 6: Dry-run on real DB with a small limit**

Run: `python -c "
import sqlite3
from src.enrich.wikipedia_pageviews import expand_pageviews
conn = sqlite3.connect('output/world_beaches.db')
conn.row_factory = sqlite3.Row
n = expand_pageviews(conn, limit=50)
print(f'updated {n} beaches')
"`
Expected: `updated 50 beaches` (or fewer if not all resolve). Check one in `output/world_beaches.db`:
```
sqlite3 output/world_beaches.db "SELECT name, wikipedia_url, wikipedia_page_views_annual FROM beaches WHERE wikipedia_url IS NOT NULL ORDER BY updated_at DESC LIMIT 5"
```

- [ ] **Step 7: Full run**

Run: `python -c "
import sqlite3
from src.enrich.wikipedia_pageviews import expand_pageviews
conn = sqlite3.connect('output/world_beaches.db')
conn.row_factory = sqlite3.Row
n = expand_pageviews(conn)
print(f'updated {n} beaches')
"`
Expected runtime: ~30–60 min (15K × ~0.2s). Expected updated: 8,000–14,000 (some wikidata entities have no enwiki sitelink).

Post-run verification:
```
sqlite3 output/world_beaches.db "SELECT COUNT(*) FROM beaches WHERE wikipedia_page_views_annual IS NOT NULL"
```
Must be ≥ 8,000. If under 2,000, investigate — pipeline likely silently-failed partway through.

- [ ] **Step 8: Commit**

```bash
git add src/enrich/wikipedia_pageviews.py tests/test_wikipedia_pageviews.py
git commit -m "enrich: expand Wikipedia pageviews via Wikidata sitelinks (1K→~10K beaches)"
```

---

## Task 4: Geometry-derived enrichment (beach length, orientation, sunset visibility)

No downloads. Reads existing `geometry_geojson` column. Computes oriented minimum bounding rectangle → longer side = length; waterfront bearing → sunset visibility (coast facing 225°–315° sees sunset).

**Files:**
- Create: `src/enrich/geometry_derived.py`
- Test: `tests/test_geometry_derived.py`

- [ ] **Step 1: Write the failing test**

Create `tests/test_geometry_derived.py`:

```python
import json
import pytest
from src.enrich.geometry_derived import (
    compute_length_and_orientation,
    enrich_geometry_derived,
    _orientation_label,
)


def _square_around(lat, lng, half_deg=0.001):
    return {
        "type": "Polygon",
        "coordinates": [[
            [lng - half_deg, lat - half_deg],
            [lng + half_deg, lat - half_deg],
            [lng + half_deg, lat + half_deg],
            [lng - half_deg, lat + half_deg],
            [lng - half_deg, lat - half_deg],
        ]],
    }


def _wide_rect(lat, lng, half_lng=0.005, half_lat=0.0005):
    """East-west rect: longer side along longitude (east-west orientation)."""
    return {
        "type": "Polygon",
        "coordinates": [[
            [lng - half_lng, lat - half_lat],
            [lng + half_lng, lat - half_lat],
            [lng + half_lng, lat + half_lat],
            [lng - half_lng, lat + half_lat],
            [lng - half_lng, lat - half_lat],
        ]],
    }


def test_length_computed_in_meters():
    geom = _wide_rect(0, 0)
    length, orientation = compute_length_and_orientation(geom)
    # 0.01° of longitude at equator ≈ 1110 m
    assert 900 < length < 1300


def test_orientation_east_west():
    geom = _wide_rect(0, 0)
    _, orientation = compute_length_and_orientation(geom)
    # Rect with long side along longitude → orientation ~90 or ~270
    assert orientation is not None
    normalized = orientation % 180
    assert 80 <= normalized <= 100


def test_orientation_label_west():
    assert _orientation_label(270) == "W"
    assert _orientation_label(269) == "W"
    assert _orientation_label(361 % 360) == "N"


def test_enrich_geometry_updates_db(db_with_beaches):
    db_with_beaches.execute(
        "UPDATE beaches SET geometry_geojson=? WHERE id='b1'",
        (json.dumps(_wide_rect(21.274, -157.826)),),
    )
    db_with_beaches.commit()

    n = enrich_geometry_derived(db_with_beaches)
    assert n == 1
    row = db_with_beaches.execute(
        "SELECT beach_length_m, orientation_deg, orientation_label, sunset_visible "
        "FROM beaches WHERE id='b1'"
    ).fetchone()
    assert 900 < row["beach_length_m"] < 1300
    assert row["orientation_deg"] is not None
    assert row["orientation_label"] in ("N","NE","E","SE","S","SW","W","NW")
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pytest tests/test_geometry_derived.py -v`
Expected: `ImportError` — module missing.

- [ ] **Step 3: Implement**

Create `src/enrich/geometry_derived.py`:

```python
"""Derive beach_length_m, orientation_deg, orientation_label, sunset_visible from existing polygon geometry."""

import json
import math
from tqdm import tqdm
from shapely.geometry import shape
from shapely.geometry.polygon import orient
from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)


COMPASS = ["N","NE","E","SE","S","SW","W","NW"]


def _orientation_label(deg: float) -> str:
    idx = int(((deg % 360) + 22.5) // 45) % 8
    return COMPASS[idx]


def _meters_per_deg(lat: float) -> tuple[float, float]:
    """Approx meters per degree of lat, lng at a given latitude. Good enough for beach-scale."""
    lat_m = 111_320
    lng_m = 111_320 * math.cos(math.radians(lat))
    return lat_m, lng_m


def compute_length_and_orientation(geometry_geojson: dict) -> tuple[float, float]:
    """Oriented minimum bounding rectangle in meters. Longer side = length.
    Bearing of long axis (0°=N, 90°=E) = orientation_deg."""
    geom = shape(geometry_geojson)
    if geom.is_empty:
        return 0.0, None

    mbr = geom.minimum_rotated_rectangle
    coords = list(orient(mbr).exterior.coords)

    # Project to local meters using centroid latitude
    cx, cy = geom.centroid.x, geom.centroid.y
    lat_m, lng_m = _meters_per_deg(cy)
    pts_m = [((x - cx) * lng_m, (y - cy) * lat_m) for x, y in coords[:4]]

    # Two side lengths of the rectangle
    def _dist(a, b): return math.hypot(a[0]-b[0], a[1]-b[1])
    side_a = _dist(pts_m[0], pts_m[1])
    side_b = _dist(pts_m[1], pts_m[2])

    if side_a >= side_b:
        length = side_a
        dx, dy = pts_m[1][0]-pts_m[0][0], pts_m[1][1]-pts_m[0][1]
    else:
        length = side_b
        dx, dy = pts_m[2][0]-pts_m[1][0], pts_m[2][1]-pts_m[1][1]

    # Bearing from (dx, dy): atan2(dx east-component, dy north-component)
    bearing = (math.degrees(math.atan2(dx, dy)) + 360) % 180
    return length, bearing


def enrich_geometry_derived(conn) -> int:
    run_id = log_run_start(conn, "geometry_derived", phase="A")
    before_len = coverage_count(conn, "beaches", "beach_length_m")

    rows = conn.execute(
        "SELECT id, geometry_geojson, centroid_lat FROM beaches "
        "WHERE geometry_geojson IS NOT NULL "
        "AND (beach_length_m IS NULL OR orientation_deg IS NULL)"
    ).fetchall()

    updated = 0
    errors = 0
    for row in tqdm(rows, desc="geometry-derived"):
        try:
            geom = json.loads(row["geometry_geojson"])
            length, bearing = compute_length_and_orientation(geom)
            if length is None or length <= 0:
                continue
            label = _orientation_label(bearing) if bearing is not None else None
            sunset = 1 if bearing is not None and 225 <= bearing <= 315 else 0
            conn.execute(
                """UPDATE beaches SET beach_length_m=?, orientation_deg=?,
                   orientation_label=?, sunset_visible=?, updated_at=datetime('now')
                   WHERE id=?""",
                (length, bearing, label, sunset, row["id"]),
            )
            updated += 1
            if updated % 5000 == 0:
                conn.commit()
        except Exception:
            errors += 1

    conn.commit()
    log_run_finish(conn, run_id, "ok", total_processed=updated, total_errors=errors)
    if rows:
        assert_coverage_delta(conn, "beaches", "beach_length_m",
                              before=before_len, min_delta=max(1, len(rows) // 10))
    return updated


if __name__ == "__main__":
    import sqlite3, sys
    db = sqlite3.connect(sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db")
    db.row_factory = sqlite3.Row
    enrich_geometry_derived(db)
    db.close()
```

- [ ] **Step 4: Run tests, verify pass**

Run: `pytest tests/test_geometry_derived.py -v`
Expected: all 4 tests PASS.

- [ ] **Step 5: Run on real DB**

Run: `python -m src.enrich.geometry_derived output/world_beaches.db`
Expected: ~30 min. Post-run:
```
sqlite3 output/world_beaches.db "SELECT COUNT(*) FROM beaches WHERE beach_length_m IS NOT NULL"
```
Must be ≥ 50,000 (most OSM beach features have polygon geometry).

Spot-check orientation on a known beach:
```
sqlite3 output/world_beaches.db "SELECT name, beach_length_m, orientation_deg, orientation_label, sunset_visible FROM beaches WHERE slug='waikiki-beach'"
```
Waikiki faces SW — should be orientation ~120–150 label `S` or `SE`, sunset_visible likely 0 (Waikiki is south-facing; sunset is over the ocean only at winter). Orientation **per se** can vary with polygon — just make sure it's plausible.

- [ ] **Step 6: Commit**

```bash
git add src/enrich/geometry_derived.py tests/test_geometry_derived.py
git commit -m "enrich: beach length + orientation + sunset_visible from polygon geometry"
```

---

## Task 5: GADM admin join + seed `admin_regions`

Download GADM world GeoPackage (`gadm_410-levels.gpkg`, ~1.5GB), spatial-join beaches → L2/L3 polygons, populate `admin_level_2`, `admin_level_3`, and create one `admin_regions` row per distinct (country_code, admin_l1, admin_l2, admin_l3) tuple.

**Files:**
- Create: `src/enrich/gadm_admin.py`
- Test: `tests/test_gadm_admin.py`
- Modify: `.gitignore` (ignore `data/gadm/*.gpkg`)

- [ ] **Step 1: Write the failing test**

Create `tests/test_gadm_admin.py`:

```python
import pytest
from src.enrich.gadm_admin import (
    _build_spatial_index, _lookup_admin, seed_admin_regions,
)


def test_spatial_index_matches_point_inside_polygon():
    """A beach inside a polygon's bbox gets the polygon's admin names."""
    from shapely.geometry import Polygon
    import geopandas as gpd

    gdf = gpd.GeoDataFrame(
        {
            "COUNTRY": ["Greece"],
            "GID_0": ["GRC"],
            "NAME_1": ["Ionian Islands"],
            "NAME_2": ["Zakynthos"],
            "NAME_3": ["Volimes"],
        },
        geometry=[Polygon([(20.0, 37.8), (21.0, 37.8), (21.0, 38.0), (20.0, 38.0)])],
        crs="EPSG:4326",
    )
    idx = _build_spatial_index(gdf)
    admin = _lookup_admin(idx, lat=37.86, lng=20.62)
    assert admin is not None
    assert admin["country_code"] == "GRC"
    assert admin["admin_l2"] == "Zakynthos"


def test_seed_admin_regions_from_beaches(db_with_beaches):
    # Two beaches in same admin_l2 → one region row
    db_with_beaches.execute("UPDATE beaches SET admin_level_2='X', admin_level_3='Y', country_code='US' WHERE id IN ('b1','b2')")
    db_with_beaches.execute("UPDATE beaches SET admin_level_2='Q', admin_level_3='R', country_code='AU' WHERE id='b3'")
    db_with_beaches.commit()

    n = seed_admin_regions(db_with_beaches)
    assert n == 2
    rows = db_with_beaches.execute("SELECT * FROM admin_regions ORDER BY country_code").fetchall()
    assert rows[0]["country_code"] == "AU"
    assert rows[1]["admin_l2"] == "X"
```

- [ ] **Step 2: Run tests, verify fail**

Run: `pytest tests/test_gadm_admin.py -v`
Expected: `ImportError`.

- [ ] **Step 3: Implement**

Create `src/enrich/gadm_admin.py`:

```python
"""
GADM spatial join: attach admin_level_2 + admin_level_3 to every beach,
then seed admin_regions table.

Download: https://gadm.org/download_world.html → gadm_410-levels.gpkg (~1.5GB)
Place at: data/gadm/gadm_410-levels.gpkg
"""

import os
from pathlib import Path
from tqdm import tqdm
import geopandas as gpd
from shapely.geometry import Point
from rtree import index as rtree_index

from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)

GADM_PATH = Path("data/gadm/gadm_410-levels.gpkg")
GADM_LAYER = "ADM_3"  # fall back to ADM_2 if country has no L3


def _build_spatial_index(gdf):
    """R-tree over polygon bboxes. Returns (rtree, gdf) so lookup can do exact within-test."""
    idx = rtree_index.Index()
    for i, geom in enumerate(gdf.geometry):
        if geom is not None and not geom.is_empty:
            idx.insert(i, geom.bounds)
    return {"rtree": idx, "gdf": gdf}


def _lookup_admin(idx, lat: float, lng: float) -> dict | None:
    pt = Point(lng, lat)
    candidates = list(idx["rtree"].intersection((lng, lat, lng, lat)))
    gdf = idx["gdf"]
    for cand in candidates:
        geom = gdf.geometry.iloc[cand]
        if geom is not None and geom.contains(pt):
            row = gdf.iloc[cand]
            return {
                "country_code": row.get("GID_0"),
                "admin_l1": row.get("NAME_1"),
                "admin_l2": row.get("NAME_2"),
                "admin_l3": row.get("NAME_3"),
            }
    return None


def enrich_gadm_admin(conn, gpkg_path: Path = GADM_PATH, layer: str = GADM_LAYER) -> int:
    if not gpkg_path.exists():
        raise FileNotFoundError(
            f"GADM not found at {gpkg_path}. Download from https://gadm.org/download_world.html "
            f"→ 'Geopackage' and place at that path."
        )
    run_id = log_run_start(conn, "gadm_admin", phase="A")
    before = coverage_count(conn, "beaches", "admin_level_2")

    print(f"Loading GADM {layer}...")
    gdf = gpd.read_file(gpkg_path, layer=layer)
    idx = _build_spatial_index(gdf)

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches "
        "WHERE admin_level_2 IS NULL AND centroid_lat IS NOT NULL"
    ).fetchall()

    updated = 0
    for row in tqdm(rows, desc="gadm join"):
        admin = _lookup_admin(idx, row["centroid_lat"], row["centroid_lng"])
        if admin is None:
            continue
        conn.execute(
            """UPDATE beaches
               SET admin_level_2 = COALESCE(admin_level_2, ?),
                   admin_level_3 = COALESCE(admin_level_3, ?),
                   updated_at = datetime('now')
               WHERE id = ?""",
            (admin["admin_l2"], admin["admin_l3"], row["id"]),
        )
        updated += 1
        if updated % 10000 == 0:
            conn.commit()
    conn.commit()

    seed_count = seed_admin_regions(conn)
    log_run_finish(conn, run_id, "ok", total_processed=updated)
    assert_coverage_delta(conn, "beaches", "admin_level_2",
                          before=before, min_delta=len(rows) // 2)
    print(f"GADM: {updated} beaches matched; {seed_count} admin_regions seeded")
    return updated


def seed_admin_regions(conn) -> int:
    """Insert one admin_regions row per distinct (country, l1, l2, l3) tuple from beaches."""
    rows = conn.execute(
        """SELECT DISTINCT country_code, admin_level_1, admin_level_2, admin_level_3
           FROM beaches WHERE admin_level_2 IS NOT NULL"""
    ).fetchall()
    inserted = 0
    for r in rows:
        region_id = f"{r['country_code']}|{r['admin_level_1'] or ''}|{r['admin_level_2'] or ''}|{r['admin_level_3'] or ''}"
        try:
            conn.execute(
                """INSERT INTO admin_regions (id, country_code, admin_l1, admin_l2, admin_l3)
                   VALUES (?, ?, ?, ?, ?)""",
                (region_id, r["country_code"], r["admin_level_1"],
                 r["admin_level_2"], r["admin_level_3"]),
            )
            inserted += 1
        except Exception:
            pass  # IGNORE duplicates on re-run
    conn.commit()
    return inserted


if __name__ == "__main__":
    import sqlite3, sys
    db = sqlite3.connect(sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db")
    db.row_factory = sqlite3.Row
    enrich_gadm_admin(db)
    db.close()
```

Note on ADM_2 fallback: if the running machine doesn't have `pyogrio` or `fiona`, install `pip install geopandas rtree pyogrio`. Some countries publish only up to ADM_2 — consider running ADM_2 as a second pass if ADM_3 coverage is thin.

- [ ] **Step 4: Run tests, verify pass**

Run: `pip install geopandas rtree pyogrio shapely` then `pytest tests/test_gadm_admin.py -v`
Expected: both tests PASS.

- [ ] **Step 5: Download GADM + add to .gitignore**

```bash
mkdir -p data/gadm
curl -L https://geodata.ucdavis.edu/gadm/gadm4.1/gadm_410-levels.gpkg -o data/gadm/gadm_410-levels.gpkg
```

Add to `.gitignore`:
```
data/gadm/
```

- [ ] **Step 6: Run on real DB**

Run: `python -m src.enrich.gadm_admin output/world_beaches.db`
Expected: ~1–2 hr. Post-run:
```
sqlite3 output/world_beaches.db "SELECT COUNT(*) FROM beaches WHERE admin_level_2 IS NOT NULL"
sqlite3 output/world_beaches.db "SELECT COUNT(*) FROM admin_regions"
```
Must be ≥ 180,000 (coastal beaches should be in populated admin areas) and ≥ 3,000 respectively.

- [ ] **Step 7: Commit**

```bash
git add src/enrich/gadm_admin.py tests/test_gadm_admin.py .gitignore
git commit -m "enrich: GADM spatial join → admin_level_2/3 + seed admin_regions"
```

---

## Task 6: WDPA protected areas

Download World Database on Protected Areas (https://www.protectedplanet.net/en/thematic-areas/wdpa), spatial-join beaches → WDPA polygons, populate `protected_area_name/type/iucn`, `unesco_site`.

**Files:**
- Create: `src/enrich/wdpa_protected.py`
- Test: `tests/test_wdpa_protected.py`

- [ ] **Step 1: Write the failing test**

Create `tests/test_wdpa_protected.py`:

```python
import pytest
from src.enrich.wdpa_protected import _match_beach_to_wdpa


def test_match_inside_polygon():
    from shapely.geometry import Polygon
    import geopandas as gpd

    gdf = gpd.GeoDataFrame(
        {
            "NAME": ["Cousteau Marine Park"],
            "DESIG_ENG": ["Marine Protected Area"],
            "IUCN_CAT": ["II"],
            "DESIG_TYPE": ["National"],
            "WDPAID": [12345],
        },
        geometry=[Polygon([(10, 40), (11, 40), (11, 41), (10, 41)])],
        crs="EPSG:4326",
    )
    match = _match_beach_to_wdpa(gdf, lat=40.5, lng=10.5)
    assert match is not None
    assert match["name"] == "Cousteau Marine Park"
    assert match["iucn"] == "II"


def test_match_outside_returns_none():
    from shapely.geometry import Polygon
    import geopandas as gpd
    gdf = gpd.GeoDataFrame(
        {"NAME": ["X"], "DESIG_ENG": ["Y"], "IUCN_CAT": ["III"], "DESIG_TYPE": ["National"], "WDPAID": [1]},
        geometry=[Polygon([(10, 40), (11, 40), (11, 41), (10, 41)])],
        crs="EPSG:4326",
    )
    assert _match_beach_to_wdpa(gdf, lat=50, lng=50) is None
```

- [ ] **Step 2–3: Implement and pass**

Create `src/enrich/wdpa_protected.py` (structure mirrors `gadm_admin.py`). Key differences:
- Input file: `data/wdpa/WDPA_*.shp` (Jan 2026 release). Download page: https://www.protectedplanet.net/en/thematic-areas/wdpa (choose shapefile, extract all three `WDPA_*_shp_*.zip` into `data/wdpa/`).
- Column names on WDPA shp: `NAME`, `DESIG_ENG`, `IUCN_CAT`, `DESIG_TYPE`, `WDPAID`.
- `unesco_site` = copy `NAME` only when `DESIG_ENG` contains "World Heritage".

Function signature:

```python
def enrich_wdpa_protected(conn, shp_glob: str = "data/wdpa/WDPA_*.shp") -> int:
    ...
```

Follow the same run_start/coverage/run_finish/assert_coverage_delta pattern as GADM. Add to `.gitignore`: `data/wdpa/`.

- [ ] **Step 4: Test + download + run + commit**

```bash
pytest tests/test_wdpa_protected.py -v
mkdir -p data/wdpa && # manual: unzip WDPA downloads into this dir
python -m src.enrich.wdpa_protected output/world_beaches.db
```
Post-run: `sqlite3 output/world_beaches.db "SELECT COUNT(*) FROM beaches WHERE protected_area_name IS NOT NULL"`. Expected ≥ 10,000.

```bash
git add src/enrich/wdpa_protected.py tests/test_wdpa_protected.py .gitignore
git commit -m "enrich: WDPA protected-area + UNESCO spatial join"
```

---

## Task 7: FES2022 tides

Use `pyfes` with the FES2022 finite-element tidal atlas to compute tidal amplitude at each beach → spring range, neap range, tide type (diurnal / semidiurnal / mixed).

**Prereq:** AVISO+ free research account at https://www.aviso.altimetry.fr/en/data/data-access.html (approval takes a few business days — apply early).

**Files:**
- Create: `src/enrich/fes2022_tides.py`
- Test: `tests/test_fes2022_tides.py`

- [ ] **Step 1: Write the failing test**

Create `tests/test_fes2022_tides.py`:

```python
import pytest
from src.enrich.fes2022_tides import _classify_tide_type


def test_classify_semidiurnal():
    # M2 and S2 dominate; K1 and O1 small → semidiurnal
    amps = {"M2": 1.0, "S2": 0.3, "K1": 0.1, "O1": 0.05}
    assert _classify_tide_type(amps) == "semidiurnal"


def test_classify_diurnal():
    # K1 + O1 dominate → diurnal
    amps = {"M2": 0.1, "S2": 0.05, "K1": 0.7, "O1": 0.5}
    assert _classify_tide_type(amps) == "diurnal"


def test_classify_mixed():
    # Form factor between 0.25 and 1.5 → mixed
    amps = {"M2": 0.5, "S2": 0.2, "K1": 0.3, "O1": 0.2}
    assert _classify_tide_type(amps) == "mixed"
```

- [ ] **Step 2: Implement**

Create `src/enrich/fes2022_tides.py`:

```python
"""
FES2022 tidal atlas → spring range, neap range, tide type per beach.

Setup:
  1. Register at https://www.aviso.altimetry.fr → "FES2022" product
  2. Download ocean_tide NetCDFs to data/fes2022/
  3. `pip install pyfes`

Form-factor classification (Courtier 1938):
  F = (K1 + O1) / (M2 + S2)
  F < 0.25 → semidiurnal
  0.25 ≤ F < 1.5 → mixed
  F ≥ 1.5 → diurnal
"""

from pathlib import Path
from tqdm import tqdm
from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)

FES_DIR = Path("data/fes2022")
CONSTITUENTS = ["M2", "S2", "K1", "O1", "N2", "K2", "P1", "Q1"]


def _classify_tide_type(amps: dict) -> str:
    m2 = amps.get("M2", 0)
    s2 = amps.get("S2", 0)
    k1 = amps.get("K1", 0)
    o1 = amps.get("O1", 0)
    denom = m2 + s2
    if denom == 0:
        return "unknown"
    f = (k1 + o1) / denom
    if f < 0.25:
        return "semidiurnal"
    if f < 1.5:
        return "mixed"
    return "diurnal"


def _compute_ranges(amps: dict) -> tuple[float, float]:
    """Spring range ≈ 2*(M2+S2), neap range ≈ 2*(M2-S2). Both in meters."""
    m2, s2 = amps.get("M2", 0), amps.get("S2", 0)
    spring = 2 * (m2 + s2)
    neap = 2 * abs(m2 - s2)
    return spring, neap


def _load_fes_atlas():
    """Returns a pyfes.Handler loaded with FES2022 constituents."""
    try:
        import pyfes
    except ImportError as e:
        raise RuntimeError(
            "pyfes not installed. Run: pip install pyfes"
        ) from e
    if not FES_DIR.exists():
        raise FileNotFoundError(
            f"FES2022 NetCDFs not found at {FES_DIR}. Download from AVISO+ (free research account)."
        )
    # pyfes configuration: see its docs. Constructs a handler from an INI file listing each constituent's NetCDF.
    config = FES_DIR / "fes2022.ini"
    return pyfes.Handler("ocean", "io", str(config))


def enrich_fes2022_tides(conn, batch_size: int = 1000) -> int:
    handler = _load_fes_atlas()  # lazy import
    import numpy as np

    run_id = log_run_start(conn, "fes2022_tides", phase="A")
    before = coverage_count(conn, "beaches", "tide_range_spring_m")

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches "
        "WHERE tide_range_spring_m IS NULL AND centroid_lat IS NOT NULL"
    ).fetchall()

    updated = 0
    errors = 0
    for i in tqdm(range(0, len(rows), batch_size), desc="fes2022"):
        batch = rows[i:i+batch_size]
        lats = np.array([r["centroid_lat"] for r in batch])
        lngs = np.array([r["centroid_lng"] for r in batch])
        # Evaluate at one reference date — amplitudes don't depend on time
        import datetime as _dt
        dates = np.array([_dt.datetime(2026, 1, 1)] * len(batch))
        try:
            amp_dict = handler.vector_constituents(dates, lats, lngs, CONSTITUENTS)
        except Exception as e:
            errors += len(batch)
            raise RuntimeError(f"FES2022 evaluation failed at batch {i}: {e}") from e

        for j, row in enumerate(batch):
            try:
                amps = {c: float(abs(amp_dict[c][j])) for c in CONSTITUENTS}
                spring, neap = _compute_ranges(amps)
                tide_type = _classify_tide_type(amps)
                if spring == 0 and neap == 0:
                    continue  # landlocked or masked cell
                conn.execute(
                    """UPDATE beaches SET tide_range_spring_m=?, tide_range_neap_m=?,
                       tide_type=?, tide_source='fes2022', updated_at=datetime('now')
                       WHERE id=?""",
                    (spring, neap, tide_type, row["id"]),
                )
                updated += 1
            except Exception:
                errors += 1

        conn.commit()

    log_run_finish(conn, run_id, "ok", total_processed=updated, total_errors=errors)
    if rows:
        assert_coverage_delta(conn, "beaches", "tide_range_spring_m",
                              before=before, min_delta=len(rows) // 3)
    return updated


if __name__ == "__main__":
    import sqlite3, sys
    db = sqlite3.connect(sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db")
    db.row_factory = sqlite3.Row
    enrich_fes2022_tides(db)
    db.close()
```

- [ ] **Step 3: Run tests, verify pass**

Run: `pytest tests/test_fes2022_tides.py -v`
Expected: 3 PASS (these tests are unit-only; no AVISO+ account needed for them).

- [ ] **Step 4: Download FES2022 + dry run**

After AVISO+ approval:
- Download FES2022 ocean_tide NetCDFs (M2, S2, K1, O1, N2, K2, P1, Q1 minimum) to `data/fes2022/`
- Create `data/fes2022/fes2022.ini` per pyfes docs
- Add `data/fes2022/` to `.gitignore`

Dry run on 100 beaches:
```
python -c "
import sqlite3
from src.enrich.fes2022_tides import enrich_fes2022_tides
db = sqlite3.connect('output/world_beaches.db')
db.row_factory = sqlite3.Row
# limit manually by selecting 100 ids to tide_range_spring_m=0 beforehand, or patch the query
"
```

Known-answer smoke check after full run:
```
sqlite3 output/world_beaches.db "SELECT name, tide_range_spring_m, tide_type FROM beaches WHERE slug='catedrais'"
```
Catedrais must show tide_range_spring_m > 3.0 and `tide_type='semidiurnal'` — the beach only becomes accessible at low tide precisely because it has extreme tidal range. If spring range < 1m, pipeline is broken.

- [ ] **Step 5: Full run + commit**

Expected full runtime: ~6 hr for 228K beaches.
Post-run: ≥ 100,000 rows with tide_range_spring_m.

```bash
git add src/enrich/fes2022_tides.py tests/test_fes2022_tides.py .gitignore
git commit -m "enrich: FES2022 tides — spring/neap range + tide type per beach"
```

---

## Task 8: GEBCO bathymetry → nearshore depth + slope + drop-off flag

Download GEBCO 2024 global grid (https://download.gebco.net/), extract elevation at beach centroid + 500m offshore, derive slope percent and drop-off flag (slope > 15% = dangerous drop).

**Files:**
- Create: `src/enrich/gebco_bathymetry.py`
- Test: `tests/test_gebco_bathymetry.py`

- [ ] **Step 1: Write the failing test**

Create `tests/test_gebco_bathymetry.py`:

```python
import numpy as np
import pytest
from src.enrich.gebco_bathymetry import _compute_slope_and_flag, _offshore_point


def test_slope_gentle():
    # Shore = 0m, 500m offshore = -2m → slope = 2/500 = 0.4%
    slope, flag = _compute_slope_and_flag(shore_depth=0, offshore_depth=-2, distance_m=500)
    assert 0.3 < slope < 0.5
    assert flag == 0


def test_slope_dropoff():
    # Shore = 0m, 500m offshore = -100m → slope = 20%
    slope, flag = _compute_slope_and_flag(shore_depth=0, offshore_depth=-100, distance_m=500)
    assert 19 < slope < 21
    assert flag == 1


def test_offshore_point_moves_north():
    lat2, lng2 = _offshore_point(lat=0, lng=0, bearing_deg=0, distance_m=500)
    assert lat2 > 0
    assert abs(lng2) < 0.001
```

- [ ] **Step 2: Implement**

Create `src/enrich/gebco_bathymetry.py`:

```python
"""
GEBCO 2024 bathymetry → nearshore_depth_m, slope_pct, drop_off_flag.

Download (7GB NetCDF): https://download.gebco.net/ → "GEBCO_2024 Grid (NetCDF)"
Place at: data/gebco/GEBCO_2024.nc

Algorithm (per beach):
  1. Sample elevation at centroid (shore_depth)
  2. Compute offshore direction (perpendicular to beach orientation; seaward)
     — if orientation_deg unavailable, default bearing=180° (south) and retry N/E/W if on land
  3. Sample elevation 500m offshore (offshore_depth; should be negative)
  4. slope_pct = (shore_depth - offshore_depth) / 500 * 100
  5. drop_off_flag = 1 if slope_pct > 15 else 0
  6. nearshore_depth_m = abs(offshore_depth)
"""

import math
from pathlib import Path
from tqdm import tqdm
from src.enrich._common import (
    log_run_start, log_run_finish, coverage_count, assert_coverage_delta,
)

GEBCO_PATH = Path("data/gebco/GEBCO_2024.nc")
DROP_OFF_THRESHOLD_PCT = 15.0
OFFSHORE_DISTANCE_M = 500


def _offshore_point(lat: float, lng: float, bearing_deg: float, distance_m: float):
    """Move `distance_m` along `bearing_deg` from (lat, lng). Bearing 0=N, 90=E."""
    R = 6_371_000
    bearing = math.radians(bearing_deg)
    lat1 = math.radians(lat)
    lng1 = math.radians(lng)
    ang = distance_m / R
    lat2 = math.asin(math.sin(lat1)*math.cos(ang) + math.cos(lat1)*math.sin(ang)*math.cos(bearing))
    lng2 = lng1 + math.atan2(math.sin(bearing)*math.sin(ang)*math.cos(lat1),
                             math.cos(ang) - math.sin(lat1)*math.sin(lat2))
    return math.degrees(lat2), math.degrees(lng2)


def _compute_slope_and_flag(shore_depth: float, offshore_depth: float, distance_m: float):
    """shore_depth and offshore_depth are elevations (negative = below sea level)."""
    drop_m = shore_depth - offshore_depth
    slope_pct = (drop_m / distance_m) * 100
    flag = 1 if slope_pct > DROP_OFF_THRESHOLD_PCT else 0
    return slope_pct, flag


def _load_gebco():
    import xarray as xr
    if not GEBCO_PATH.exists():
        raise FileNotFoundError(f"GEBCO not found at {GEBCO_PATH}. Download from https://download.gebco.net/")
    return xr.open_dataset(GEBCO_PATH)


def _sample_elevation(ds, lat: float, lng: float) -> float:
    """Nearest-neighbor sample of GEBCO elevation grid."""
    pt = ds.elevation.sel(lat=lat, lon=lng, method="nearest")
    return float(pt.values)


def enrich_gebco_bathymetry(conn) -> int:
    ds = _load_gebco()

    run_id = log_run_start(conn, "gebco_bathymetry", phase="A")
    before = coverage_count(conn, "beaches", "nearshore_depth_m")

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng, orientation_deg "
        "FROM beaches WHERE nearshore_depth_m IS NULL AND centroid_lat IS NOT NULL"
    ).fetchall()

    updated = 0
    for row in tqdm(rows, desc="gebco"):
        lat, lng = row["centroid_lat"], row["centroid_lng"]
        # If orientation is known, offshore = orientation + 90° (seaward-perpendicular)
        # If not, try 4 cardinal bearings and pick whichever is deepest (= actually in water)
        orient = row["orientation_deg"]
        bearings = [orient + 90] if orient is not None else [0, 90, 180, 270]

        best_depth = None
        for bearing in bearings:
            olat, olng = _offshore_point(lat, lng, bearing, OFFSHORE_DISTANCE_M)
            try:
                depth = _sample_elevation(ds, olat, olng)
            except Exception:
                continue
            if depth < 0 and (best_depth is None or depth < best_depth):
                best_depth = depth

        if best_depth is None:
            continue

        try:
            shore = _sample_elevation(ds, lat, lng)
        except Exception:
            continue

        slope, flag = _compute_slope_and_flag(shore, best_depth, OFFSHORE_DISTANCE_M)
        conn.execute(
            """UPDATE beaches SET nearshore_depth_m=?, slope_pct=?, drop_off_flag=?,
               updated_at=datetime('now') WHERE id=?""",
            (abs(best_depth), slope, flag, row["id"]),
        )
        updated += 1
        if updated % 5000 == 0:
            conn.commit()

    conn.commit()
    log_run_finish(conn, run_id, "ok", total_processed=updated)
    if rows:
        assert_coverage_delta(conn, "beaches", "nearshore_depth_m",
                              before=before, min_delta=len(rows) // 2)
    return updated


if __name__ == "__main__":
    import sqlite3, sys
    db = sqlite3.connect(sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db")
    db.row_factory = sqlite3.Row
    enrich_gebco_bathymetry(db)
    db.close()
```

- [ ] **Step 3: Run unit tests**

Run: `pytest tests/test_gebco_bathymetry.py -v`
Expected: 3 PASS.

- [ ] **Step 4: Download GEBCO + run**

```bash
pip install xarray netCDF4
mkdir -p data/gebco
curl -L "https://www.bodc.ac.uk/data/open_download/gebco/gebco_2024/geotiff/" -o data/gebco/GEBCO_2024.nc
# (use the actual GEBCO NetCDF download URL from the site — URL may require a form)
echo "data/gebco/" >> .gitignore
python -m src.enrich.gebco_bathymetry output/world_beaches.db
```
Expected runtime: ~4 hr. Post-run: ≥ 150,000 rows with `nearshore_depth_m`.

Smoke-check: Catedrais (sits in an embayment, should have shallow near-shore depth + moderate slope):
```
sqlite3 output/world_beaches.db "SELECT name, nearshore_depth_m, slope_pct, drop_off_flag FROM beaches WHERE slug='catedrais'"
```
Reasonable value: 2–15m, slope < 10%, flag=0.

- [ ] **Step 5: Commit**

```bash
git add src/enrich/gebco_bathymetry.py tests/test_gebco_bathymetry.py .gitignore
git commit -m "enrich: GEBCO bathymetry → nearshore depth + slope + drop-off flag"
```

---

## Task 9: Milestone A coverage report script

A single command that prints the before/after coverage numbers for every field Milestone A touches. This is the thing you show to decide if we ship the milestone.

**Files:**
- Create: `scripts/milestone_a_report.py`

- [ ] **Step 1: Write the script**

```python
"""Milestone A coverage report — run after all pipelines complete."""

import sqlite3
import sys

DB = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"

FIELDS = [
    ("admin_level_2", 180_000),
    ("beach_length_m", 50_000),
    ("orientation_deg", 50_000),
    ("sunset_visible", 50_000),
    ("protected_area_name", 10_000),
    ("unesco_site", 100),
    ("tide_range_spring_m", 100_000),
    ("tide_range_neap_m", 100_000),
    ("tide_type", 100_000),
    ("nearshore_depth_m", 150_000),
    ("slope_pct", 150_000),
    ("drop_off_flag", 150_000),
    ("wikipedia_url", 8_000),
    ("wikipedia_page_views_annual", 8_000),
]

TABLES = [
    ("admin_regions", 3_000),
]


def main():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    total = conn.execute("SELECT COUNT(*) FROM beaches").fetchone()[0]
    print(f"DB: {DB}  ({total:,} beaches)\n")
    print(f"{'Field':35s} {'Filled':>12s} {'Target':>12s} {'%':>7s} {'Status':>10s}")
    print("-" * 80)
    all_ok = True
    for field, target in FIELDS:
        filled = conn.execute(
            f"SELECT COUNT(*) FROM beaches WHERE {field} IS NOT NULL"
        ).fetchone()[0]
        pct = 100 * filled / total if total else 0
        ok = filled >= target
        all_ok &= ok
        print(f"{field:35s} {filled:>12,} {target:>12,} {pct:>6.1f}%  {'OK' if ok else 'FAIL':>10s}")
    print()
    for table, target in TABLES:
        try:
            n = conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        except Exception:
            n = 0
        ok = n >= target
        all_ok &= ok
        print(f"{table:35s} {n:>12,} {target:>12,} {'':>7s}  {'OK' if ok else 'FAIL':>10s}")

    print()
    # Smoke beaches
    print("Smoke beaches:")
    for slug in ["waikiki-beach", "catedrais", "navagio", "oppenheimer-beach"]:
        row = conn.execute(
            """SELECT name, admin_level_2, beach_length_m, tide_range_spring_m,
               nearshore_depth_m, wikipedia_page_views_annual
               FROM beaches WHERE slug=?""", (slug,)
        ).fetchone()
        if row:
            print(f"  {slug:22s}: {dict(row)}")
        else:
            print(f"  {slug:22s}: NOT FOUND")

    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run after all pipelines complete**

Run: `python scripts/milestone_a_report.py output/world_beaches.db`
Expected: every row shows `OK`. If any show `FAIL`, the corresponding pipeline didn't deliver — rerun or investigate before declaring Milestone A complete.

- [ ] **Step 3: Commit**

```bash
git add scripts/milestone_a_report.py
git commit -m "scripts: milestone A coverage report with smoke-beach check"
```

---

## Self-Review (completed inline before saving)

**Spec coverage** — Milestone A per spec = schema migrations + Track 1 steps 1–5 + Wikipedia pageviews expansion. Tasks 1–9 cover all of it. Blue Flag and EEA bathing are in Milestone B per the spec, so intentionally out of this plan. Webcams, ERA5, OSM planet are in later milestones.

**Placeholder scan** — no TBDs. The GEBCO download URL is noted as "may require form" — that's honest; the engineer will complete the download interactively. No vague "add error handling" directives; each pipeline has a concrete `raise_for_http` call or `assert_coverage_delta` call.

**Type consistency** — `assert_coverage_delta` / `log_run_start` / `log_run_finish` / `raise_for_http` signatures match across all tasks. `compute_length_and_orientation` signature consistent in test + implementation. `_match_beach_to_wdpa` referenced in test matches the pattern from `_lookup_admin`.

**Scope** — 9 tasks, one-to-two week milestone, all tasks produce working + tested code. Appropriately scoped for a single plan.
