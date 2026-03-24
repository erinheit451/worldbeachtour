def test_map_taxon_group():
    from src.enrich.species_inaturalist import _map_taxon_group
    assert _map_taxon_group("Aves") == "bird"
    assert _map_taxon_group("Mammalia") == "mammal"
    assert _map_taxon_group("Actinopterygii") == "fish"
    assert _map_taxon_group("Unknown") == "other"


def test_iucn_status():
    from src.enrich.species_inaturalist import _iucn_status
    assert _iucn_status({"status": "EN"}) == "EN"
    assert _iucn_status({"status": "LC"}) == "LC"
    assert _iucn_status(None) is None
    assert _iucn_status({}) is None


def test_classify_species(enriched_db):
    """Test species insertion into beach_species table."""
    from src.enrich.species_inaturalist import _map_taxon_group
    enriched_db.execute(
        "INSERT INTO beaches (id, slug, centroid_lat, centroid_lng) VALUES ('b1', 'test', 0, 0)"
    )
    enriched_db.execute(
        """INSERT INTO beach_species (beach_id, species_name, common_name, taxon_group, observation_count, source)
           VALUES ('b1', 'Chelonia mydas', 'Green Sea Turtle', 'reptile', 45, 'inaturalist')"""
    )
    enriched_db.commit()
    row = enriched_db.execute("SELECT * FROM beach_species WHERE beach_id='b1'").fetchone()
    assert row["species_name"] == "Chelonia mydas"
    assert row["common_name"] == "Green Sea Turtle"
