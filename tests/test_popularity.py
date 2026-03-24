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
