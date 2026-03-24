import json
import pytest


def test_best_months_tropical():
    from src.enrich.best_months import compute_best_months
    result = compute_best_months(
        air_temp_high=[30, 30, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
        rain_mm=[80, 60, 40, 20, 10, 5, 5, 10, 20, 40, 60, 80],
        sun_hours=[200, 210, 240, 260, 280, 290, 290, 280, 260, 240, 210, 200],
        wind_speed=[15, 15, 14, 12, 10, 10, 10, 10, 12, 14, 15, 15],
    )
    assert isinstance(result, list)
    assert len(result) > 0
    assert "jun" in result or "jul" in result


def test_best_months_northern_temperate():
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
