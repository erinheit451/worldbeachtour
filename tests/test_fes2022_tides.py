import pytest

from src.enrich.fes2022_tides import _classify_tide_type, _compute_ranges


def test_classify_semidiurnal():
    # M2 and S2 dominate; K1 and O1 small → semidiurnal
    amps = {"M2": 1.0, "S2": 0.3, "K1": 0.1, "O1": 0.05}
    assert _classify_tide_type(amps) == "semidiurnal"


def test_classify_diurnal():
    amps = {"M2": 0.1, "S2": 0.05, "K1": 0.7, "O1": 0.5}
    assert _classify_tide_type(amps) == "diurnal"


def test_classify_mixed():
    amps = {"M2": 0.5, "S2": 0.2, "K1": 0.3, "O1": 0.2}
    assert _classify_tide_type(amps) == "mixed"


def test_classify_unknown_when_zero():
    """Landlocked / masked cells have zero M2+S2 → classify as unknown."""
    amps = {"M2": 0, "S2": 0, "K1": 0, "O1": 0}
    assert _classify_tide_type(amps) == "unknown"


def test_compute_ranges_spring_and_neap():
    # Catedrais-like: M2=1.4m, S2=0.5m → spring ≈ 3.8m, neap ≈ 1.8m
    amps = {"M2": 1.4, "S2": 0.5}
    spring, neap = _compute_ranges(amps)
    assert spring == pytest.approx(3.8, rel=0.01)
    assert neap == pytest.approx(1.8, rel=0.01)


def test_compute_ranges_zero_when_empty():
    spring, neap = _compute_ranges({})
    assert spring == 0
    assert neap == 0


def test_enrich_raises_when_pyfes_or_ini_missing():
    """Without pyfes installed OR fes2022.ini present, the pipeline fails loudly."""
    import sqlite3
    from src.enrich.fes2022_tides import enrich_fes2022_tides
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    # Either ImportError→RuntimeError or FileNotFoundError is acceptable
    with pytest.raises((RuntimeError, FileNotFoundError)):
        enrich_fes2022_tides(conn)
