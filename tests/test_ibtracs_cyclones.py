"""
Tests for ibtracs_cyclones enrichment pipeline.

All 5 tests run without requiring the real IBTrACS CSV file.
"""

import io
import csv
import math
import sqlite3
import textwrap
from pathlib import Path

import pytest

from src.enrich.ibtracs_cyclones import (
    _saffir_simpson,
    _category_rank,
    _haversine_km,
    enrich_ibtracs_cyclones,
)


# ---------------------------------------------------------------------------
# Test 1: _saffir_simpson wind-to-category mapping
# ---------------------------------------------------------------------------
@pytest.mark.parametrize(
    "wind_kt, expected",
    [
        (137.0, "5"),   # exact Cat 5 threshold
        (150.0, "5"),   # above Cat 5
        (113.0, "4"),   # exact Cat 4 threshold
        (120.0, "4"),
        (96.0, "3"),    # exact Cat 3 threshold
        (100.0, "3"),
        (83.0, "2"),    # exact Cat 2 threshold
        (90.0, "2"),
        (64.0, "1"),    # exact Cat 1 threshold
        (70.0, "1"),
        (34.0, "TS"),   # exact TS threshold
        (45.0, "TS"),
        (33.9, "TD"),   # just below TS
        (0.0, "TD"),
    ],
)
def test_saffir_simpson_mapping(wind_kt, expected):
    assert _saffir_simpson(wind_kt) == expected


# ---------------------------------------------------------------------------
# Test 2: _saffir_simpson(None) returns None
# ---------------------------------------------------------------------------
def test_saffir_simpson_none():
    assert _saffir_simpson(None) is None


# ---------------------------------------------------------------------------
# Test 3: _category_rank orders categories correctly
# ---------------------------------------------------------------------------
def test_category_rank_ordering():
    cats = ["TD", "TS", "1", "2", "3", "4", "5"]
    ranks = [_category_rank(c) for c in cats]
    # Each rank should be strictly greater than the previous
    for i in range(1, len(ranks)):
        assert ranks[i] > ranks[i - 1], (
            f"Expected {cats[i]} rank > {cats[i-1]} rank, "
            f"got {ranks[i]} vs {ranks[i-1]}"
        )
    # None / unknown should rank below TD
    assert _category_rank(None) < _category_rank("TD")
    assert _category_rank("XX") < _category_rank("TD")


# ---------------------------------------------------------------------------
# Test 4: _haversine_km sanity — Sydney to Brisbane ~750 km ± 50 km
# ---------------------------------------------------------------------------
def test_haversine_sydney_brisbane():
    # Sydney: -33.8688, 151.2093   Brisbane: -27.4698, 153.0251
    d = _haversine_km(-33.8688, 151.2093, -27.4698, 153.0251)
    assert 700 <= d <= 800, f"Expected ~750 km, got {d:.1f} km"


def test_haversine_zero_distance():
    assert _haversine_km(10.0, 50.0, 10.0, 50.0) == pytest.approx(0.0, abs=0.001)


# ---------------------------------------------------------------------------
# Test 5: enrich_ibtracs_cyclones raises FileNotFoundError when CSV missing
# ---------------------------------------------------------------------------
def test_enrich_raises_on_missing_csv(tmp_path):
    missing = tmp_path / "no_such_file.csv"
    db = sqlite3.connect(":memory:")
    db.row_factory = sqlite3.Row
    from src.db.schema import init_db
    from src.db.migrate_to_enriched import migrate
    init_db(db)
    migrate(db)
    with pytest.raises(FileNotFoundError, match="IBTrACS CSV not found"):
        enrich_ibtracs_cyclones(db, csv_path=missing)
    db.close()


# ---------------------------------------------------------------------------
# Bonus test: end-to-end with a synthetic mini-CSV
# ---------------------------------------------------------------------------
def _make_ibtracs_csv(tmp_path: Path) -> Path:
    """
    Write a minimal valid IBTrACS CSV with two storms:
      - KATRINA: Cat 5, crosses within 50 km of Waikiki (21.274, -157.826)
        → placed at (21.3, -157.8) which is ~6 km away
      - REMOTE: Cat 1, track near (0, 0) — no beach nearby
    """
    header_names = [
        "SID", "SEASON", "NUMBER", "BASIN", "SUBBASIN", "NAME",
        "ISO_TIME", "NATURE", "LAT", "LON", "WMO_WIND", "WMO_PRES",
        "WMO_AGENCY", "TRACK_TYPE", "DIST2LAND", "LANDFALL",
        "IFLAG", "USA_AGENCY", "USA_ATCF_ID", "USA_LAT",
    ]
    header_units = [""] * len(header_names)

    rows = [
        # KATRINA — Cat 5 storm, close to Waikiki
        ["2005220N10135", "2005", "1", "EP", "CP", "KATRINA",
         "2005-08-29 12:00:00", "TS", "21.3", "-157.8", "140", "910",
         "NHC", "main", "5", "0",
         "___________", "", "", "21.3"],
        # REMOTE — Cat 1, nowhere near any test beach
        ["2000001N00180", "2000", "2", "WP", "WP", "REMOTE",
         "2000-01-15 00:00:00", "TS", "5.0", "160.0", "70", "990",
         "JTWC", "main", "500", "0",
         "___________", "", "", "5.0"],
    ]

    csv_path = tmp_path / "ibtracs_test.csv"
    with open(csv_path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(header_names)
        w.writerow(header_units)
        for r in rows:
            w.writerow(r)
    return csv_path


def test_enrich_end_to_end(tmp_path):
    """
    Minimal end-to-end: one storm near Waikiki → 1 beach_hazards row,
    1 EAV count row, 1 EAV max_category row.
    """
    csv_path = _make_ibtracs_csv(tmp_path)

    db = sqlite3.connect(":memory:")
    db.row_factory = sqlite3.Row
    from src.db.schema import init_db
    from src.db.migrate_to_enriched import migrate
    init_db(db)
    migrate(db)

    # Insert Waikiki Beach (within 50 km of the KATRINA track point)
    db.execute(
        """INSERT INTO beaches (id, slug, name, centroid_lat, centroid_lng)
           VALUES ('waikiki', 'waikiki', 'Waikiki Beach', 21.274, -157.826)"""
    )
    # Insert a remote beach that should NOT be matched
    db.execute(
        """INSERT INTO beaches (id, slug, name, centroid_lat, centroid_lng)
           VALUES ('remote', 'remote', 'Remote Beach', 80.0, 10.0)"""
    )
    db.commit()

    inserted = enrich_ibtracs_cyclones(db, csv_path=csv_path)

    # Should have matched exactly 1 beach × storm
    assert inserted == 1, f"Expected 1 inserted row, got {inserted}"

    hazard = db.execute(
        "SELECT * FROM beach_hazards WHERE beach_id = 'waikiki'"
    ).fetchone()
    assert hazard is not None
    assert hazard["hazard_type"] == "tropical_cyclone"
    assert hazard["severity"] == "5"   # 140 kt → Cat 5
    assert hazard["source"] == "ibtracs_v04r01"

    # EAV: count_50yr should be 1 (2005 >= 1975) and max_category = '5'
    attrs = {
        r["key"]: r["value"]
        for r in db.execute(
            "SELECT key, value FROM beach_attributes WHERE beach_id = 'waikiki'"
        ).fetchall()
    }
    assert "cyclone_count_50yr" in attrs, f"Missing cyclone_count_50yr, got: {attrs}"
    assert attrs["cyclone_count_50yr"] == "1"
    assert attrs.get("cyclone_max_category") == "5"

    db.close()
