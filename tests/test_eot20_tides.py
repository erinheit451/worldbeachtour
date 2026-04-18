import sqlite3
from pathlib import Path

import pytest

from src.enrich.eot20_tides import (
    enrich_eot20_tides, _amp_dict_for_beach,
    CONSTITUENTS, NEIGHBORHOOD_CELLS,
)


def test_constituents_include_principals():
    for c in ("M2", "S2", "K1", "O1", "N2", "K2", "P1", "Q1"):
        assert c in CONSTITUENTS


def test_neighborhood_is_nonzero():
    assert NEIGHBORHOOD_CELLS > 0


def test_enrich_raises_when_netcdfs_missing():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    with pytest.raises(FileNotFoundError) as ei:
        enrich_eot20_tides(conn, eot20_dir=Path("data/eot20/NOT_HERE"))
    assert "EOT20" in str(ei.value) or "seanoe" in str(ei.value).lower()


def test_amp_dict_returns_empty_for_landlocked():
    """If every constituent sample returns None/NaN, amp dict is empty."""
    class FakeDS:
        """Minimal fake dataset where every .amplitude.sel returns NaN."""
        class _Amp:
            class _Val:
                values = float("nan")
            def sel(self, **kwargs): return self._Val()
        amplitude = _Amp()
        class _LAT:
            def searchsorted(self, v): return type("X", (), {"item": lambda self: 0})()
            def __len__(self): return 1
        class _LON:
            def searchsorted(self, v): return type("X", (), {"item": lambda self: 0})()
            def __len__(self): return 1
        lat = _LAT()
        lon = _LON()

    # Feed a fully-NaN dataset for every constituent -> empty dict
    datasets = {c: FakeDS() for c in CONSTITUENTS}
    # isel fallback also returns NaN via the isel path — we simulate by patching
    import src.enrich.eot20_tides as mod
    original = mod._sample_amp
    try:
        mod._sample_amp = lambda ds, lat, lng: None
        d = _amp_dict_for_beach(datasets, 0.0, 0.0)
        assert d == {}
    finally:
        mod._sample_amp = original
