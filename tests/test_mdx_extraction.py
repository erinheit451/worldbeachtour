"""Tests for MDX content extraction utilities."""

import sqlite3
from pathlib import Path

import pytest

from src.enrich.mdx_extraction import (
    _extract_beach_length,
    _extract_has_lifeguard,
    _extract_has_transit,
    _extract_iata_codes,
    _extract_reef_type,
    _extract_sand_color,
    _extract_sand_composition,
    _extract_surf_breaks,
    _extract_visitor_count,
    _extract_wave_height,
    enrich_from_mdx,
    extract_beach_data,
)


# ---------------------------------------------------------------------------
# Beach length
# ---------------------------------------------------------------------------

def test_extract_beach_length_miles():
    assert _extract_beach_length("The beach stretches 2 miles along the coast") == 3219.0


def test_extract_beach_length_km():
    assert _extract_beach_length("A 3.2 km stretch of sand") == 3200.0


def test_extract_beach_length_meters():
    assert _extract_beach_length("approximately 800 meters long") == 800.0


def test_extract_beach_length_meters_comma():
    assert _extract_beach_length("a 1,200 meters of coastline") == 1200.0


def test_extract_beach_length_none():
    assert _extract_beach_length("no length info here") is None


# ---------------------------------------------------------------------------
# Sand color
# ---------------------------------------------------------------------------

def test_extract_sand_color_black():
    assert _extract_sand_color("famous for its black sand beaches") == "black"


def test_extract_sand_color_white():
    assert _extract_sand_color("pristine white sand beach") == "white"


def test_extract_sand_color_golden():
    assert _extract_sand_color("a golden sand shoreline") == "golden"


def test_extract_sand_color_pink():
    assert _extract_sand_color("the pink sand is striking") == "pink"


def test_extract_sand_color_gray():
    assert _extract_sand_color("grey sand meets the sea") == "gray"


def test_extract_sand_color_none():
    assert _extract_sand_color("just a regular beach") is None


# ---------------------------------------------------------------------------
# Visitor count
# ---------------------------------------------------------------------------

def test_extract_visitor_count_millions():
    assert _extract_visitor_count("draws 4.5 million visitors annually") == 4_500_000


def test_extract_visitor_count_thousands():
    assert _extract_visitor_count("attracts approximately 500,000 visitors") == 500_000


def test_extract_visitor_count_welcomes():
    assert _extract_visitor_count("welcomes over 1 million tourists each year") == 1_000_000


def test_extract_visitor_count_none():
    assert _extract_visitor_count("no visitor data available") is None


# ---------------------------------------------------------------------------
# IATA codes
# ---------------------------------------------------------------------------

def test_extract_iata_codes_basic():
    content = "Most visitors fly into Cape Town International Airport (CPT), the main hub."
    codes = _extract_iata_codes(content)
    assert "CPT" in codes


def test_extract_iata_codes_filters_common_words():
    content = "THE beach AND the FOR the BUT airport (LAX) was busy."
    codes = _extract_iata_codes(content)
    assert "THE" not in codes
    assert "AND" not in codes
    assert "LAX" in codes


def test_extract_iata_codes_empty():
    codes = _extract_iata_codes("no airport mentioned here")
    assert codes == []


# ---------------------------------------------------------------------------
# Surf breaks
# ---------------------------------------------------------------------------

def test_extract_surf_breaks_basic():
    content = "Locals favor Pipeline Break and Rocky Point for big waves."
    breaks = _extract_surf_breaks(content)
    # At least one of the named breaks should be found
    assert len(breaks) > 0


def test_extract_surf_breaks_deduplicates():
    # "Sunset" is extracted as the name (Reef is the break-type keyword).
    # Appearing twice in the text, deduplication should yield exactly one entry.
    content = "Sunset Reef is famous. Many surfers visit Sunset Reef daily."
    breaks = _extract_surf_breaks(content)
    names_lower = [b.lower() for b in breaks]
    assert names_lower.count("sunset") == 1


# ---------------------------------------------------------------------------
# Wave height
# ---------------------------------------------------------------------------

def test_extract_wave_height_feet():
    result = _extract_wave_height("waves of 4-6 feet are common")
    assert result is not None
    lo, hi = result
    assert round(lo, 2) == 1.22
    assert round(hi, 2) == 1.83


def test_extract_wave_height_meters():
    result = _extract_wave_height("swells reach 2-3 meters in winter")
    assert result is not None
    assert result == (2.0, 3.0)


def test_extract_wave_height_none():
    assert _extract_wave_height("calm flat water") is None


# ---------------------------------------------------------------------------
# Sand composition
# ---------------------------------------------------------------------------

def test_extract_sand_composition_volcanic():
    assert _extract_sand_composition("formed from volcanic activity") == "volcanic"


def test_extract_sand_composition_quartz():
    assert _extract_sand_composition("high quartz content gives bright white color") == "quartz"


def test_extract_sand_composition_none():
    assert _extract_sand_composition("sandy beach with no details") is None


# ---------------------------------------------------------------------------
# Reef type
# ---------------------------------------------------------------------------

def test_extract_reef_type_fringing():
    assert _extract_reef_type("a fringing reef runs parallel to the shore") == "fringing"


def test_extract_reef_type_barrier():
    assert _extract_reef_type("separated by the barrier reef") == "barrier"


def test_extract_reef_type_atoll():
    assert _extract_reef_type("the atoll formation creates calm lagoons") == "atoll"


def test_extract_reef_type_none():
    assert _extract_reef_type("no reef information") is None


# ---------------------------------------------------------------------------
# Lifeguard
# ---------------------------------------------------------------------------

def test_extract_has_lifeguard_present():
    assert _extract_has_lifeguard("lifeguards are on duty from 9am to 5pm") == 1


def test_extract_has_lifeguard_patrolled():
    assert _extract_has_lifeguard("the beach is patrolled by lifeguards") == 1


def test_extract_has_lifeguard_absent():
    assert _extract_has_lifeguard("there are no lifeguards on this beach") == 0


def test_extract_has_lifeguard_none():
    assert _extract_has_lifeguard("bring sunscreen and enjoy the waves") is None


# ---------------------------------------------------------------------------
# Transit
# ---------------------------------------------------------------------------

def test_extract_has_transit_true():
    assert _extract_has_transit("take the bus from downtown to the beach") is True


def test_extract_has_transit_false():
    assert _extract_has_transit("only accessible by private car or boat") is False


# ---------------------------------------------------------------------------
# Integration: extract_beach_data with fake MDX files
# ---------------------------------------------------------------------------

def test_extract_beach_data_integration(tmp_path):
    """Full integration test using temporary MDX files."""
    slug = "test-beach"
    beach_dir = tmp_path / slug
    beach_dir.mkdir()
    (beach_dir / "meta.json").write_text('{"slug": "test-beach"}', encoding="utf-8")
    (beach_dir / "overview.mdx").write_text(
        "A beautiful beach with white sand stretching 3.2 km along the coast. "
        "It draws 2 million visitors each year.",
        encoding="utf-8",
    )
    (beach_dir / "travel.mdx").write_text(
        "Fly into Honolulu International Airport (HNL), 15 km away. "
        "Lifeguards are on duty during summer months.",
        encoding="utf-8",
    )

    data = extract_beach_data(slug, content_dir=tmp_path)

    assert data["beach_length_m"] == 3200.0
    assert data["sand_color"] == "white"
    assert data["_annual_visitors"] == 2_000_000
    assert "HNL" in data.get("_iata_candidates", [])
    assert data["lifeguard"] == 1


# ---------------------------------------------------------------------------
# Integration: enrich_from_mdx writes to DB
# ---------------------------------------------------------------------------

def test_enrich_from_mdx_writes_null_fields(tmp_path):
    """enrich_from_mdx should fill NULL fields and leave non-NULL alone."""
    slug = "sandy-cove"
    beach_dir = tmp_path / slug
    beach_dir.mkdir()
    (beach_dir / "meta.json").write_text('{}', encoding="utf-8")
    (beach_dir / "overview.mdx").write_text(
        "golden sand stretches 1.5 km. Attracts 300,000 visitors.",
        encoding="utf-8",
    )

    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE beaches (
            slug TEXT PRIMARY KEY,
            beach_length_m REAL,
            sand_color TEXT,
            nearest_airport_iata TEXT,
            lifeguard INTEGER,
            updated_at TEXT DEFAULT (datetime('now'))
        )
    """)
    conn.execute("INSERT INTO beaches (slug) VALUES (?)", (slug,))
    conn.commit()

    updated = enrich_from_mdx(conn, content_dir=tmp_path)

    assert updated == 1
    row = conn.execute("SELECT * FROM beaches WHERE slug = ?", (slug,)).fetchone()
    assert row["beach_length_m"] == 1500.0
    assert row["sand_color"] == "golden"


def test_enrich_from_mdx_skips_existing_values(tmp_path):
    """enrich_from_mdx must not overwrite existing (non-NULL) values."""
    slug = "rocky-point"
    beach_dir = tmp_path / slug
    beach_dir.mkdir()
    (beach_dir / "meta.json").write_text('{}', encoding="utf-8")
    (beach_dir / "overview.mdx").write_text(
        "black sand beach stretching 2 km.",
        encoding="utf-8",
    )

    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE beaches (
            slug TEXT PRIMARY KEY,
            beach_length_m REAL,
            sand_color TEXT,
            nearest_airport_iata TEXT,
            lifeguard INTEGER,
            updated_at TEXT DEFAULT (datetime('now'))
        )
    """)
    # Pre-populate both fields — neither should be overwritten
    conn.execute(
        "INSERT INTO beaches (slug, beach_length_m, sand_color) VALUES (?, ?, ?)",
        (slug, 999.0, "white"),
    )
    conn.commit()

    enrich_from_mdx(conn, content_dir=tmp_path)

    row = conn.execute("SELECT * FROM beaches WHERE slug = ?", (slug,)).fetchone()
    assert row["beach_length_m"] == 999.0   # unchanged
    assert row["sand_color"] == "white"      # unchanged


def test_enrich_from_mdx_missing_content_dir(tmp_path):
    """enrich_from_mdx returns 0 gracefully if content dir is absent."""
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    conn.execute("CREATE TABLE beaches (slug TEXT PRIMARY KEY)")
    result = enrich_from_mdx(conn, content_dir=tmp_path / "nonexistent")
    assert result == 0
