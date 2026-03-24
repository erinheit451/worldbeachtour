import math
import pytest


def test_grid_cell_uses_floor_not_round():
    from src.enrich.grid_climate import grid_cell_id
    assert grid_cell_id(21.35, -157.85) == "21.3_-157.9"


def test_grid_cell_negative_coords():
    from src.enrich.grid_climate import grid_cell_id
    assert grid_cell_id(-33.891, 151.274) == "-33.9_151.2"


def test_grid_cell_zero():
    from src.enrich.grid_climate import grid_cell_id
    assert grid_cell_id(0.05, 0.05) == "0.0_0.0"


def test_grid_cell_boundary():
    from src.enrich.grid_climate import grid_cell_id
    cell_a = grid_cell_id(21.299, -157.8)
    cell_b = grid_cell_id(21.301, -157.8)
    assert cell_a == "21.2_-157.8"
    assert cell_b == "21.3_-157.8"


def test_compute_unique_cells(enriched_db):
    from src.enrich.grid_climate import compute_grid_cells
    beaches = [
        ("b1", 21.274, -157.826),
        ("b2", 21.275, -157.825),
        ("b3", 63.404, -19.069),
    ]
    for bid, lat, lng in beaches:
        enriched_db.execute(
            "INSERT INTO beaches (id, slug, centroid_lat, centroid_lng) VALUES (?, ?, ?, ?)",
            (bid, bid, lat, lng),
        )
    enriched_db.commit()
    cells = compute_grid_cells(enriched_db)
    assert len(cells) == 2
    cell_ids = {c["cell_id"] for c in cells}
    assert "21.2_-157.9" in cell_ids
    assert "63.4_-19.1" in cell_ids


def test_map_climate_to_beaches(enriched_db):
    from src.enrich.grid_climate import map_climate_to_beaches
    enriched_db.execute(
        "INSERT INTO beaches (id, slug, centroid_lat, centroid_lng) VALUES ('b1', 'b1', 21.274, -157.826)"
    )
    enriched_db.execute(
        """INSERT INTO climate_grid_cells (cell_id, centroid_lat, centroid_lng,
           climate_air_temp_high, source)
           VALUES ('21.2_-157.9', 21.25, -157.85, '[27,27,27,28,29,30,31,31,31,30,29,27]',
           'open_meteo_era5')"""
    )
    enriched_db.commit()
    count = map_climate_to_beaches(enriched_db)
    assert count == 1
    row = enriched_db.execute("SELECT climate_air_temp_high, climate_grid_cell FROM beaches WHERE id='b1'").fetchone()
    assert row["climate_grid_cell"] == "21.2_-157.9"
    assert row["climate_air_temp_high"] is not None
