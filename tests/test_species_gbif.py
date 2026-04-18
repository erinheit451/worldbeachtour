def test_map_class_to_group():
    from src.enrich.species_gbif import _map_class_to_group
    assert _map_class_to_group("Aves") == "bird"
    assert _map_class_to_group("Mammalia") == "mammal"
    assert _map_class_to_group("Actinopterygii") == "fish"
    assert _map_class_to_group("Unknown") == "other"
    assert _map_class_to_group(None) == "other"
    assert _map_class_to_group("Reptilia") == "reptile"
    assert _map_class_to_group("Insecta") == "invertebrate"


def test_fetch_returns_list():
    from src.enrich.species_gbif import _fetch_gbif_species
    # Test with a known location (Waikiki) — gracefully returns list even if API is down
    result = _fetch_gbif_species(21.274, -157.826)
    assert isinstance(result, list)
    # Each entry should be a dict with name, count, taxon_class, kingdom
    for item in result:
        assert isinstance(item, dict)
        assert "name" in item
        assert "count" in item
        assert isinstance(item["name"], str)
        assert isinstance(item["count"], int)


def test_enrich_gbif_species_no_beaches(enriched_db):
    """Returns 0 when no beaches need enrichment."""
    from src.enrich.species_gbif import enrich_gbif_species
    # Insert a beach that already has species_observed_count set
    enriched_db.execute(
        """INSERT INTO beaches (id, slug, centroid_lat, centroid_lng, species_observed_count)
           VALUES ('b1', 'test-beach', 21.274, -157.826, 5)"""
    )
    enriched_db.commit()
    result = enrich_gbif_species(enriched_db, limit=10)
    assert result == 0


def test_enrich_gbif_species_inserts(enriched_db, monkeypatch):
    """Species rows are inserted and beach summary is updated."""
    from src.enrich import species_gbif

    # Stub _fetch_gbif_species to return predictable data without HTTP
    monkeypatch.setattr(
        species_gbif,
        "_fetch_gbif_species",
        lambda lat, lng, **kw: [
            {"name": "Chelonia mydas", "count": 12, "taxon_class": "Reptilia", "kingdom": "Animalia"},
            {"name": "Tursiops truncatus", "count": 8, "taxon_class": "Mammalia", "kingdom": "Animalia"},
            {"name": "Caretta caretta", "count": 3, "taxon_class": "Reptilia", "kingdom": "Animalia"},
        ],
    )

    enriched_db.execute(
        """INSERT INTO beaches (id, slug, centroid_lat, centroid_lng)
           VALUES ('b1', 'test-beach', 21.274, -157.826)"""
    )
    enriched_db.commit()

    result = species_gbif.enrich_gbif_species(enriched_db, limit=10)
    assert result == 1

    # Check beach summary updated
    row = enriched_db.execute(
        "SELECT species_observed_count, ecology_sources FROM beaches WHERE id='b1'"
    ).fetchone()
    assert row["species_observed_count"] == 3
    assert "gbif" in row["ecology_sources"]

    # Check species rows inserted
    species = enriched_db.execute(
        "SELECT species_name, observation_count, source FROM beach_species WHERE beach_id='b1'"
        " ORDER BY observation_count DESC"
    ).fetchall()
    assert len(species) == 3
    assert species[0]["species_name"] == "Chelonia mydas"
    assert species[0]["observation_count"] == 12
    assert species[0]["source"] == "gbif"


def test_enrich_gbif_no_duplicate_species(enriched_db, monkeypatch):
    """Does not insert duplicate species rows for a beach."""
    from src.enrich import species_gbif

    monkeypatch.setattr(
        species_gbif,
        "_fetch_gbif_species",
        lambda lat, lng, **kw: [
            {"name": "Chelonia mydas", "count": 12, "taxon_class": "Reptilia", "kingdom": "Animalia"},
        ],
    )

    enriched_db.execute(
        """INSERT INTO beaches (id, slug, centroid_lat, centroid_lng)
           VALUES ('b1', 'test-beach', 21.274, -157.826)"""
    )
    # Pre-insert a species row from iNaturalist
    enriched_db.execute(
        """INSERT INTO beach_species (beach_id, species_name, observation_count, source)
           VALUES ('b1', 'Chelonia mydas', 45, 'inaturalist')"""
    )
    enriched_db.commit()

    species_gbif.enrich_gbif_species(enriched_db, limit=10)

    rows = enriched_db.execute(
        "SELECT * FROM beach_species WHERE beach_id='b1' AND species_name='Chelonia mydas'"
    ).fetchall()
    # Should still be only one row (the original iNaturalist one)
    assert len(rows) == 1
    assert rows[0]["source"] == "inaturalist"
