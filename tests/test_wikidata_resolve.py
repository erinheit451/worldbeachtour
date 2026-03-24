def test_sparql_batch_parses_response():
    from src.enrich.wikidata_resolve import _sparql_batch
    # Just test it doesn't crash on a real small batch
    result = _sparql_batch(["Q275194"])  # Waikiki
    # May or may not find English Wikipedia — depends on network
    assert isinstance(result, dict)
