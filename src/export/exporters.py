"""Export the beach database to various formats."""

import json
import os


def export_geojson(conn, output_path):
    """Export all beaches as a GeoJSON FeatureCollection."""
    print(f"Exporting GeoJSON to {output_path}...")

    features = []
    rows = conn.execute("""
        SELECT b.*, GROUP_CONCAT(DISTINCT bs.source_name) as sources
        FROM beaches b
        LEFT JOIN beach_sources bs ON bs.beach_id = b.id
        GROUP BY b.id
    """).fetchall()

    for row in rows:
        row = dict(row)
        geometry = json.loads(row["geometry_geojson"]) if row["geometry_geojson"] else None
        if not geometry:
            continue

        # Gather attributes
        attrs = conn.execute(
            "SELECT category, key, value FROM beach_attributes WHERE beach_id = ?",
            (row["id"],)
        ).fetchall()

        attr_dict = {}
        for a in attrs:
            a = dict(a)
            cat = a["category"]
            if cat not in attr_dict:
                attr_dict[cat] = {}
            attr_dict[cat][a["key"]] = a["value"]

        properties = {
            "id": row["id"],
            "name": row["name"],
            "slug": row["slug"],
            "country_code": row["country_code"],
            "admin_level_1": row["admin_level_1"],
            "admin_level_2": row["admin_level_2"],
            "water_body_type": row["water_body_type"],
            "substrate_type": row["substrate_type"],
            "beach_length_m": row["beach_length_m"],
            "source_layer": row["source_layer"],
            "sources": row["sources"].split(",") if row["sources"] else [],
            "attributes": attr_dict,
        }

        features.append({
            "type": "Feature",
            "geometry": geometry,
            "properties": properties,
        })

    collection = {
        "type": "FeatureCollection",
        "features": features,
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(collection, f)

    print(f"  Exported {len(features)} beaches to GeoJSON")
    return len(features)


def export_stats(conn):
    """Print database statistics."""
    total = conn.execute("SELECT COUNT(*) as cnt FROM beaches").fetchone()["cnt"]
    named = conn.execute(
        "SELECT COUNT(*) as cnt FROM beaches WHERE name IS NOT NULL"
    ).fetchone()["cnt"]

    print("\n=== Database Statistics ===")
    print(f"  Total beaches: {total:,}")
    print(f"  Named beaches: {named:,}")
    print(f"  Unnamed beaches: {total - named:,}")

    # By source
    print("\n  By source:")
    sources = conn.execute("""
        SELECT source_name, COUNT(DISTINCT beach_id) as cnt
        FROM beach_sources GROUP BY source_name ORDER BY cnt DESC
    """).fetchall()
    for s in sources:
        print(f"    {s['source_name']}: {s['cnt']:,}")

    # By water body type
    print("\n  By water body type:")
    types = conn.execute("""
        SELECT water_body_type, COUNT(*) as cnt
        FROM beaches GROUP BY water_body_type ORDER BY cnt DESC
    """).fetchall()
    for t in types:
        print(f"    {t['water_body_type']}: {t['cnt']:,}")

    # By country (top 20)
    print("\n  Top 20 countries:")
    countries = conn.execute("""
        SELECT country_code, COUNT(*) as cnt
        FROM beaches WHERE country_code IS NOT NULL
        GROUP BY country_code ORDER BY cnt DESC LIMIT 20
    """).fetchall()
    for c in countries:
        print(f"    {c['country_code']}: {c['cnt']:,}")

    # Attribute coverage
    print("\n  Attribute coverage:")
    cats = conn.execute("""
        SELECT category, COUNT(DISTINCT beach_id) as beaches, COUNT(*) as attrs
        FROM beach_attributes GROUP BY category ORDER BY beaches DESC
    """).fetchall()
    for c in cats:
        print(f"    {c['category']}: {c['beaches']:,} beaches, {c['attrs']:,} attributes")

    return total
