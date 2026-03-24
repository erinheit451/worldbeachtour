"""
Extract Wikidata editorial signals from existing beach_sources raw_data.

No API calls — reads from already-ingested wikidata source records.
"""

import json
from tqdm import tqdm


def enrich_wikidata_editorial(conn) -> int:
    """Extract wikidata_id, wikipedia_url, sitelinks from raw_data."""
    rows = conn.execute(
        """SELECT bs.beach_id, bs.source_id, bs.raw_data
           FROM beach_sources bs
           WHERE bs.source_name = 'wikidata' AND bs.raw_data IS NOT NULL"""
    ).fetchall()

    count = 0
    for row in tqdm(rows, desc="Extracting Wikidata editorial"):
        raw = row["raw_data"]
        try:
            data = json.loads(raw) if isinstance(raw, str) else raw
        except (json.JSONDecodeError, TypeError):
            continue

        wikidata_id = data.get("wikidata_id") or row["source_id"]
        wikipedia_url = data.get("wikipedia_url")
        labels = data.get("labels", {})
        sitelinks = len(labels) if isinstance(labels, dict) else 0

        updates = {"wikidata_id": wikidata_id}
        if wikipedia_url:
            updates["wikipedia_url"] = wikipedia_url
        if sitelinks > 0:
            updates["wikidata_sitelinks"] = sitelinks

        set_parts = [f"{col} = ?" for col in updates.keys()]
        set_parts.append("updated_at = datetime('now')")
        values = list(updates.values()) + [row["beach_id"]]
        conn.execute(
            f"UPDATE beaches SET {', '.join(set_parts)} WHERE id = ?",
            values,
        )
        count += 1
        if count % 5000 == 0:
            conn.commit()

    conn.commit()
    print(f"Wikidata editorial: enriched {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    enrich_wikidata_editorial(conn)
    conn.close()
