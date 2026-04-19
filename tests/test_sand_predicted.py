"""Unit tests for sand_predicted regime-label logic."""

from src.enrich.sand_predicted import regime_label


def test_regime_lithic_rich():
    assert regime_label(30, 20, 50) == "lithic-rich (volcanic/collisional terrane)"
    assert regime_label(50, 10, 40) == "lithic-rich (volcanic/collisional terrane)"  # tie at threshold


def test_regime_quartz_dominant():
    assert regime_label(80, 10, 10) == "quartz-dominant"
    assert regime_label(75, 15, 10) == "quartz-dominant"


def test_regime_feldspar_rich():
    assert regime_label(40, 50, 10) == "feldspar-rich (plutonic/crystalline terrane)"
    assert regime_label(50, 35, 15) == "feldspar-rich (plutonic/crystalline terrane)"


def test_regime_mixed():
    assert regime_label(60, 25, 15) == "mixed Q-F-L"
    assert regime_label(40, 30, 30) == "mixed Q-F-L"


def test_regime_priority_lithic_over_quartz():
    # Lithic >= 40 wins even if Q is also >= 75 (can't both happen with Q+F+L=100
    # but regex insulates us from that edge anyway)
    assert regime_label(45, 10, 45) == "lithic-rich (volcanic/collisional terrane)"


def test_regime_unknown_when_none():
    assert regime_label(None, 50, 50) == "unknown"
    assert regime_label(50, None, 50) == "unknown"
    assert regime_label(None, None, None) == "unknown"
