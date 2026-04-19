"""Unit tests for sand_wikipedia extractors."""

from src.enrich.sand_wikipedia import (
    extract_sand_color,
    extract_sand_description,
    _title_from_url,
)


def test_title_from_url():
    assert _title_from_url("https://en.wikipedia.org/wiki/Bondi_Beach") == "Bondi_Beach"
    assert _title_from_url(None) is None
    assert _title_from_url("https://fr.wikipedia.org/wiki/Plage") is None
    assert _title_from_url("https://en.wikipedia.org/") is None


def test_extract_color_direct():
    # Direct "<color> sand(s)"
    assert extract_sand_color("The beach has black sand from basalt.") == "black"
    assert extract_sand_color("white sands of pure quartz") == "white"
    assert extract_sand_color("pink sandy shore") == "pink"


def test_extract_color_with_modifier():
    # "<color> <modifier> sand" — e.g. "white silica sands"
    assert extract_sand_color("famous for its white silica sands and aqua waters") == "white"
    assert extract_sand_color("fine pink coral sand covers the cove") == "pink"


def test_extract_color_rejects_place_names():
    # "Gold Beach" or "Red Sea" should NOT trigger — no 'sand' nearby
    assert extract_sand_color(
        "Ophir Beach is north of Gold Beach in Curry County."
    ) is None
    assert extract_sand_color(
        "The Red Sea borders Egypt and Sudan."
    ) is None


def test_extract_description_requires_substance():
    # Generic opener with no substrate info → None
    assert extract_sand_description(
        "X Beach is a beach on the coast of Y."
    ) is None


def test_extract_description_accepts_composition_language():
    text = "The beach is famous for its white silica sands and turquoise water."
    desc = extract_sand_description(text)
    assert desc is not None
    assert "silica" in desc


def test_extract_description_accepts_compose_language():
    text = "The cove's sand is composed of ground coral and pink foraminifera fragments."
    desc = extract_sand_description(text)
    assert desc is not None
    assert "composed" in desc.lower()
