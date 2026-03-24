import json
import sqlite3
import pytest
from src.db.schema import init_db
from src.db.migrate_to_enriched import migrate


@pytest.fixture
def db_with_wikidata():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    init_db(conn)
    migrate(conn)
    conn.execute(
        """INSERT INTO beaches (id, slug, name, centroid_lat, centroid_lng)
           VALUES ('b1', 'test-beach', 'Test Beach', 10, 20)"""
    )
    raw = json.dumps({
        "wikidata_id": "Q123456",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Test_Beach",
        "image_url": "https://commons.wikimedia.org/wiki/File:Test.jpg",
        "labels": {"en": "Test Beach", "fr": "Plage Test"},
    })
    conn.execute(
        """INSERT INTO beach_sources (id, beach_id, source_name, source_id, raw_data)
           VALUES ('s1', 'b1', 'wikidata', 'Q123456', ?)""",
        (raw,),
    )
    conn.commit()
    return conn


def test_wikidata_id_extracted(db_with_wikidata):
    from src.enrich.wikidata_editorial import enrich_wikidata_editorial
    count = enrich_wikidata_editorial(db_with_wikidata)
    assert count >= 1
    row = db_with_wikidata.execute("SELECT wikidata_id, wikipedia_url FROM beaches WHERE id='b1'").fetchone()
    assert row["wikidata_id"] == "Q123456"
    assert row["wikipedia_url"] == "https://en.wikipedia.org/wiki/Test_Beach"


def test_sitelinks_counted(db_with_wikidata):
    from src.enrich.wikidata_editorial import enrich_wikidata_editorial
    enrich_wikidata_editorial(db_with_wikidata)
    row = db_with_wikidata.execute("SELECT wikidata_sitelinks FROM beaches WHERE id='b1'").fetchone()
    # labels dict has 2 entries = 2 sitelinks
    assert row["wikidata_sitelinks"] == 2
