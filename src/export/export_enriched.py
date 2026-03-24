"""Export enriched beach data to per-beach JSON files for site consumption.

Only exports beaches that have MDX content (i.e., a directory in site/content/beaches/).
Writes to content-pipeline/data/beaches/{slug}.json with the full enriched schema.
"""

import json
import os
import sqlite3
from pathlib import Path


def get_site_slugs(site_content_dir: Path) -> set[str]:
    """Return slugs that have a directory in site/content/beaches/."""
    if not site_content_dir.exists():
        return set()
    slugs = set()
    for entry in site_content_dir.iterdir():
        if entry.is_dir() and (entry / "meta.json").exists():
            slugs.add(entry.name)
    return slugs


def parse_bool(val) -> bool | None:
    """Convert SQLite integer or None to Python bool or None."""
    if val is None:
        return None
    return bool(val)


def export_enriched(db_path: Path, site_content_dir: Path, output_dir: Path) -> int:
    """Export enriched JSON files for beaches that have MDX content.

    Args:
        db_path: Path to world_beaches.db
        site_content_dir: Path to site/content/beaches/
        output_dir: Path to content-pipeline/data/beaches/

    Returns:
        Number of files exported.
    """
    site_slugs = get_site_slugs(site_content_dir)
    if not site_slugs:
        print("No site slugs found — check site_content_dir path.")
        return 0

    print(f"Found {len(site_slugs)} beach(es) with MDX content: {', '.join(sorted(site_slugs))}")

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row

    output_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    for slug in sorted(site_slugs):
        row = conn.execute(
            "SELECT * FROM beaches WHERE slug = ?", (slug,)
        ).fetchone()

        if not row:
            print(f"  WARNING: slug '{slug}' not found in DB — skipping")
            continue

        row = dict(row)

        # Sources
        sources = conn.execute("""
            SELECT source_name, source_id, source_url
            FROM beach_sources WHERE beach_id = ?
        """, (row["id"],)).fetchall()

        # Attributes grouped by category
        attrs = conn.execute("""
            SELECT category, key, value, value_type
            FROM beach_attributes WHERE beach_id = ?
        """, (row["id"],)).fetchall()

        attr_dict: dict = {}
        for a in attrs:
            a = dict(a)
            cat = a["category"]
            if cat not in attr_dict:
                attr_dict[cat] = {}
            val = a["value"]
            if a["value_type"] == "number":
                try:
                    fval = float(val)
                    val = int(fval) if fval == int(fval) else fval
                except (ValueError, TypeError):
                    pass
            elif a["value_type"] == "boolean":
                val = str(val).lower() in ("true", "1", "yes")
            attr_dict[cat][a["key"]] = val

        # Build nearest_airport sub-object only if we have IATA
        nearest_airport = None
        if row.get("nearest_airport_iata"):
            nearest_airport = {
                "iata": row["nearest_airport_iata"],
                "name": row["nearest_airport_name"],
                "distance_km": row["nearest_airport_distance_km"],
            }

        # Safety sub-object — only include keys with values
        safety: dict = {}
        if row.get("water_quality_rating") is not None:
            safety["water_quality_rating"] = row["water_quality_rating"]
        lifeguard = parse_bool(row.get("lifeguard"))
        if lifeguard is not None:
            safety["lifeguard"] = lifeguard
        if row.get("shark_incidents_total") is not None:
            safety["shark_incidents_total"] = row["shark_incidents_total"]

        # Facilities sub-object — only include keys with values
        facilities: dict = {}
        for db_key, out_key in [
            ("has_parking", "parking"),
            ("has_restrooms", "restrooms"),
            ("has_showers", "showers"),
            ("wheelchair_accessible", "wheelchair_accessible"),
            ("dogs_allowed", "dogs_allowed"),
        ]:
            val = parse_bool(row.get(db_key))
            if val is not None:
                facilities[out_key] = val

        beach_data: dict = {
            "slug": row["slug"],
            "name": row["name"],
            "centroid_lat": row["centroid_lat"],
            "centroid_lng": row["centroid_lng"],
            "country_code": row["country_code"],
            "admin_level_1": row["admin_level_1"],
            "admin_level_2": row["admin_level_2"],
            "water_body_type": row["water_body_type"],
            "substrate_type": row["substrate_type"],
            "beach_length_m": row["beach_length_m"],
            "sources": [
                {
                    "source_name": dict(s)["source_name"],
                    "source_id": dict(s)["source_id"],
                    "source_url": dict(s)["source_url"],
                }
                for s in sources
            ],
            "attributes": attr_dict,
            # Enriched fields
            "nearest_city": row.get("nearest_city"),
            "nearest_city_distance_km": row.get("nearest_city_distance_km"),
            "nearest_airport": nearest_airport,
            "safety": safety if safety else None,
            "facilities": facilities if facilities else None,
            "wikipedia_url": row.get("wikipedia_url"),
            "notability_score": row.get("notability_score"),
            "data_completeness_pct": row.get("data_completeness_pct"),
        }

        # Strip enriched optional fields that are entirely absent (None)
        # but keep core fields always (even if None)
        CORE_FIELDS = {
            "slug", "name", "centroid_lat", "centroid_lng", "country_code",
            "admin_level_1", "admin_level_2", "water_body_type", "substrate_type",
            "beach_length_m", "sources", "attributes",
        }
        beach_data = {
            k: v for k, v in beach_data.items()
            if k in CORE_FIELDS or v is not None
        }

        out_path = output_dir / f"{slug}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(beach_data, f, indent=2, ensure_ascii=False)

        print(f"  Exported {slug}.json")
        count += 1

    conn.close()
    print(f"\nDone — exported {count} enriched beach JSON file(s) to {output_dir}")
    return count


if __name__ == "__main__":
    repo_root = Path(__file__).resolve().parents[2]
    db_path = repo_root / "output" / "world_beaches.db"
    site_content_dir = repo_root / "site" / "content" / "beaches"
    output_dir = repo_root / "content-pipeline" / "data" / "beaches"

    export_enriched(db_path, site_content_dir, output_dir)
