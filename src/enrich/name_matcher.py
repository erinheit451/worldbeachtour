"""Name enrichment for unnamed beaches.

Phase 1: Match unnamed OSM beaches to nearby named beaches (GeoNames, Overture,
         Wikidata, EU Bathing) via spatial proximity (<1km).
Phase 2: Generate descriptive names from reverse geocoding for the rest.
Phase 3: Regenerate slugs from new names.
"""

import math
from collections import defaultdict

import reverse_geocoder as rg
from slugify import slugify
from tqdm import tqdm


# --- Config ---
MATCH_RADIUS_M = 1000  # Max distance for name transfer
GRID_SIZE = 0.01       # ~1.1km grid cells


def _haversine(lat1, lng1, lat2, lng2):
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lng2 - lng1)
    a = (math.sin(dphi / 2) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _grid_key(lat, lng):
    return (round(lat / GRID_SIZE), round(lng / GRID_SIZE))


def phase1_proximity_match(conn):
    """Match unnamed beaches to nearby named beaches across all sources."""
    print("\n=== Phase 1: Proximity Name Matching ===")

    # Load all named beaches into a spatial grid
    print("  Loading named beaches...")
    named_rows = conn.execute("""
        SELECT id, name, centroid_lat, centroid_lng
        FROM beaches
        WHERE name IS NOT NULL AND name != ''
    """).fetchall()

    grid = defaultdict(list)
    for row in named_rows:
        key = _grid_key(row["centroid_lat"], row["centroid_lng"])
        grid[key].append({
            "id": row["id"],
            "name": row["name"],
            "lat": row["centroid_lat"],
            "lng": row["centroid_lng"],
        })

    print(f"  {len(named_rows)} named beaches in spatial grid")

    # Load unnamed beaches
    unnamed_rows = conn.execute("""
        SELECT id, centroid_lat, centroid_lng
        FROM beaches
        WHERE name IS NULL OR name = ''
    """).fetchall()

    print(f"  {len(unnamed_rows)} unnamed beaches to match")

    matched = 0
    for row in tqdm(unnamed_rows, desc="  Matching"):
        lat, lng = row["centroid_lat"], row["centroid_lng"]
        key = _grid_key(lat, lng)

        best_name = None
        best_dist = MATCH_RADIUS_M + 1

        # Check this cell and neighbors
        for di in (-1, 0, 1):
            for dj in (-1, 0, 1):
                nkey = (key[0] + di, key[1] + dj)
                for named in grid.get(nkey, []):
                    dist = _haversine(lat, lng, named["lat"], named["lng"])
                    if dist < best_dist:
                        best_dist = dist
                        best_name = named["name"]

        if best_name:
            conn.execute(
                """UPDATE beaches SET name = ?, updated_at = datetime('now')
                   WHERE id = ? AND (name IS NULL OR name = '')""",
                (best_name, row["id"]),
            )
            matched += 1

            if matched % 10000 == 0:
                conn.commit()

    conn.commit()
    print(f"  Phase 1 complete: {matched} beaches matched to nearby names")

    remaining = conn.execute(
        "SELECT COUNT(*) as c FROM beaches WHERE name IS NULL OR name = ''"
    ).fetchone()["c"]
    print(f"  {remaining} still unnamed")

    return matched


def phase2_reverse_geocode_names(conn):
    """Generate descriptive names for remaining unnamed beaches using reverse geocoding."""
    print("\n=== Phase 2: Reverse Geocode Naming ===")

    rows = conn.execute("""
        SELECT id, centroid_lat, centroid_lng, country_code, admin_level_1, water_body_type
        FROM beaches
        WHERE name IS NULL OR name = ''
    """).fetchall()

    print(f"  {len(rows)} unnamed beaches to name")

    if not rows:
        return 0

    # Batch reverse geocode
    coords = [(r["centroid_lat"], r["centroid_lng"]) for r in rows]

    print("  Running batch reverse geocode...")
    results = rg.search(coords)

    updated = 0
    for i, row in enumerate(tqdm(rows, desc="  Naming")):
        geo = results[i]
        place_name = geo.get("name", "")
        admin1 = geo.get("admin1", "")
        cc = row["country_code"] or geo.get("cc", "")
        water_type = row["water_body_type"] or "ocean"

        # Build a descriptive name
        if place_name:
            if water_type in ("lake", "river"):
                name = f"{water_type.title()} Beach near {place_name}"
            else:
                name = f"Beach near {place_name}"
        elif admin1:
            name = f"Beach in {admin1}"
        elif cc:
            name = f"Beach in {cc}"
        else:
            name = f"Beach at {row['centroid_lat']:.3f}, {row['centroid_lng']:.3f}"

        conn.execute(
            """UPDATE beaches SET name = ?, updated_at = datetime('now')
               WHERE id = ?""",
            (name, row["id"]),
        )
        updated += 1

        if updated % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"  Phase 2 complete: {updated} beaches given descriptive names")

    remaining = conn.execute(
        "SELECT COUNT(*) as c FROM beaches WHERE name IS NULL OR name = ''"
    ).fetchone()["c"]
    print(f"  {remaining} still unnamed (should be 0)")

    return updated


def phase3_regenerate_slugs(conn):
    """Regenerate slugs for beaches that have coordinate-based slugs now that they have names."""
    print("\n=== Phase 3: Slug Regeneration ===")

    # Find beaches with coordinate-based slugs (pattern: beach-XX.XXXX-YY.YYYY)
    rows = conn.execute("""
        SELECT id, name, slug, country_code
        FROM beaches
        WHERE slug LIKE 'beach-%'
        AND name IS NOT NULL AND name != ''
    """).fetchall()

    print(f"  {len(rows)} beaches need slug regeneration")

    # Build a set of all existing slugs for uniqueness checks
    all_slugs = set(
        r[0] for r in conn.execute("SELECT slug FROM beaches").fetchall()
    )

    updated = 0
    for row in tqdm(rows, desc="  Regenerating slugs"):
        base = slugify(row["name"])
        if not base:
            continue

        # Add country code suffix for uniqueness
        cc = row["country_code"]
        if cc:
            base = f"{base}-{cc.lower()}"

        slug = base
        counter = 1
        while slug in all_slugs and slug != row["slug"]:
            slug = f"{base}-{counter}"
            counter += 1

        if slug != row["slug"]:
            all_slugs.discard(row["slug"])
            all_slugs.add(slug)

            conn.execute(
                "UPDATE beaches SET slug = ?, updated_at = datetime('now') WHERE id = ?",
                (slug, row["id"]),
            )
            updated += 1

            if updated % 10000 == 0:
                conn.commit()

    conn.commit()
    print(f"  Phase 3 complete: {updated} slugs regenerated")

    return updated


def enrich_names(conn):
    """Run the full name enrichment pipeline."""
    print("=" * 60)
    print("  NAME ENRICHMENT PIPELINE")
    print("=" * 60)

    # Stats before
    total = conn.execute("SELECT COUNT(*) as c FROM beaches").fetchone()["c"]
    unnamed_before = conn.execute(
        "SELECT COUNT(*) as c FROM beaches WHERE name IS NULL OR name = ''"
    ).fetchone()["c"]
    print(f"\n  Before: {total} total, {unnamed_before} unnamed ({100*unnamed_before/total:.1f}%)")

    p1 = phase1_proximity_match(conn)
    p2 = phase2_reverse_geocode_names(conn)
    p3 = phase3_regenerate_slugs(conn)

    # Stats after
    unnamed_after = conn.execute(
        "SELECT COUNT(*) as c FROM beaches WHERE name IS NULL OR name = ''"
    ).fetchone()["c"]
    named_after = total - unnamed_after

    print(f"\n{'=' * 60}")
    print(f"  ENRICHMENT COMPLETE")
    print(f"  Phase 1 (proximity match): {p1} beaches")
    print(f"  Phase 2 (reverse geocode): {p2} beaches")
    print(f"  Phase 3 (slug regen):      {p3} slugs")
    print(f"  Named: {named_after}/{total} ({100*named_after/total:.1f}%)")
    print(f"  Unnamed: {unnamed_after}")
    print(f"{'=' * 60}")

    return {"proximity_matched": p1, "geocode_named": p2, "slugs_regenerated": p3}


if __name__ == "__main__":
    from src.db.schema import get_connection
    import sys
    import os

    db_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        os.path.dirname(__file__), "..", "..", "output", "beaches_v2.db"
    )
    print(f"Using database: {db_path}")
    conn = get_connection(db_path)
    enrich_names(conn)
    conn.close()
