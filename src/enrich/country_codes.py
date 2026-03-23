"""Reverse geocode country codes for beaches missing them.

Uses the reverse_geocoder library which has an offline dataset
of city/country coordinates — no API calls needed.
"""

import reverse_geocoder as rg
from tqdm import tqdm


def enrich_country_codes(conn):
    """Add country_code to all beaches that lack one."""
    print("=== Enriching Country Codes ===")

    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches WHERE country_code IS NULL"
    ).fetchall()

    print(f"  {len(rows)} beaches need country codes")

    if not rows:
        return 0

    # Batch lookup — much faster than one-by-one
    coords = [(r["centroid_lat"], r["centroid_lng"]) for r in rows]

    print("  Running reverse geocode (batch)...")
    results = rg.search(coords)

    updated = 0
    for i, row in enumerate(tqdm(rows, desc="Updating countries")):
        cc = results[i].get("cc", None)
        admin1 = results[i].get("admin1", None)

        if cc:
            conn.execute(
                """UPDATE beaches SET country_code = ?,
                   admin_level_1 = COALESCE(admin_level_1, ?),
                   updated_at = datetime('now')
                   WHERE id = ? AND country_code IS NULL""",
                (cc, admin1, row["id"]),
            )
            updated += 1

        if updated % 10000 == 0 and updated > 0:
            conn.commit()

    conn.commit()
    print(f"  Updated {updated} beaches with country codes")

    # Print coverage
    total = conn.execute("SELECT COUNT(*) as cnt FROM beaches").fetchone()["cnt"]
    with_cc = conn.execute(
        "SELECT COUNT(*) as cnt FROM beaches WHERE country_code IS NOT NULL"
    ).fetchone()["cnt"]
    print(f"  Coverage: {with_cc}/{total} ({100*with_cc/total:.1f}%)")

    return updated
