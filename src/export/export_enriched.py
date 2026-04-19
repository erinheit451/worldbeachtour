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

        # Sand sub-object — composition, description, curated story, measured samples
        sand: dict = {}
        if row.get("sand_regime_label"):
            sand["predicted"] = {
                "q_pct": row.get("sand_q_pct"),
                "f_pct": row.get("sand_f_pct"),
                "l_pct": row.get("sand_l_pct"),
                "regime": row.get("sand_regime_label"),
                "source": row.get("sand_predicted_source"),
            }
        if row.get("sand_color"):
            sand["color"] = row.get("sand_color")
        if row.get("sand_description"):
            sand["description"] = row.get("sand_description")

        curated = conn.execute(
            """SELECT sand_story, sand_story_citations, showcase_rank,
                      reference_photo_url, reference_photo_attribution
               FROM beach_sand_curated WHERE beach_id = ?""",
            (row["id"],),
        ).fetchone()
        if curated:
            c = dict(curated)
            sand["curated"] = {
                "story": c.get("sand_story"),
                "citations": json.loads(c["sand_story_citations"]) if c.get("sand_story_citations") else [],
                "showcase_rank": c.get("showcase_rank"),
                "reference_photo_url": c.get("reference_photo_url"),
                "reference_photo_attribution": c.get("reference_photo_attribution"),
            }

        samples = conn.execute(
            """SELECT source, distance_m, grain_size_mean_mm, folk_class,
                      q_pct, f_pct, l_pct, citation_url
               FROM beach_sand_samples WHERE beach_id = ?
               ORDER BY distance_m ASC LIMIT 10""",
            (row["id"],),
        ).fetchall()
        if samples:
            sand["measured_samples"] = [dict(s) for s in samples]

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
            "sand": sand if sand else None,
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


def export_sand_hub(db_path: Path, output_path: Path) -> int:
    """Export a single JSON file driving the /sand category hub.

    Shape:
      {
        "generated_at": "...",
        "curated": [ { slug, name, country_code, story, rank, color, regime, ... }, ... ],
        "categories": { "black": [slugs], "pink": [slugs], ... }
      }
    """
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row

    curated_rows = conn.execute(
        """SELECT b.slug, b.name, b.country_code, b.centroid_lat, b.centroid_lng,
                  b.sand_color, b.sand_regime_label, b.sand_q_pct, b.sand_f_pct, b.sand_l_pct,
                  b.sand_description,
                  c.sand_story, c.showcase_rank, c.reference_photo_url, c.reference_photo_attribution,
                  c.sand_story_citations
           FROM beach_sand_curated c
           JOIN beaches b ON b.id = c.beach_id
           ORDER BY c.showcase_rank ASC"""
    ).fetchall()

    curated = []
    categories: dict[str, list[str]] = {}
    for r in curated_rows:
        r = dict(r)
        entry = {
            "slug": r["slug"],
            "name": r["name"],
            "country_code": r["country_code"],
            "lat": r["centroid_lat"],
            "lng": r["centroid_lng"],
            "color": r["sand_color"],
            "regime": r["sand_regime_label"],
            "q_pct": r["sand_q_pct"],
            "f_pct": r["sand_f_pct"],
            "l_pct": r["sand_l_pct"],
            "description": r["sand_description"],
            "story": r["sand_story"],
            "showcase_rank": r["showcase_rank"],
            "reference_photo_url": r["reference_photo_url"],
            "reference_photo_attribution": r["reference_photo_attribution"],
            "citations": json.loads(r["sand_story_citations"]) if r["sand_story_citations"] else [],
        }
        curated.append(entry)
        if r["sand_color"]:
            categories.setdefault(r["sand_color"], []).append(r["slug"])

    # Also include high-notability beaches with a known sand_color but no curated story
    # so the hub categories aren't limited to curated seeds.
    extra_rows = conn.execute(
        """SELECT b.slug, b.sand_color
           FROM beaches b
           LEFT JOIN beach_sand_curated c ON c.beach_id = b.id
           WHERE b.sand_color IS NOT NULL AND c.beach_id IS NULL
             AND b.notability_score >= 10
           ORDER BY b.notability_score DESC
           LIMIT 500"""
    ).fetchall()
    for r in extra_rows:
        categories.setdefault(r["sand_color"], []).append(r["slug"])

    hub = {
        "generated_at": __import__("datetime").datetime.now(
            __import__("datetime").timezone.utc
        ).isoformat(timespec="seconds"),
        "curated": curated,
        "categories": categories,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(hub, f, indent=2, ensure_ascii=False)
    conn.close()
    print(f"Sand hub: {len(curated)} curated + {len(extra_rows)} extra → {output_path}")
    return len(curated)


if __name__ == "__main__":
    repo_root = Path(__file__).resolve().parents[2]
    db_path = repo_root / "output" / "world_beaches.db"
    site_content_dir = repo_root / "site" / "content" / "beaches"
    output_dir = repo_root / "content-pipeline" / "data" / "beaches"

    export_enriched(db_path, site_content_dir, output_dir)

    # Sand hub export — site-local path for the /sand page
    sand_hub_path = repo_root / "site" / "data" / "sand_hub.json"
    export_sand_hub(db_path, sand_hub_path)
