"""
Compute notability_score for all beaches based on available signals.
"""

from tqdm import tqdm


def _normalize(value, min_val, max_val):
    """Normalize value to 0.0-1.0 range, clamped."""
    if value is None or max_val == min_val:
        return 0.0
    return max(0.0, min(1.0, (value - min_val) / (max_val - min_val)))


def compute_notability_score(
    wikipedia_page_views=0,
    wikidata_sitelinks=0,
    photo_count=0,
    source_count=1,
    blue_flag=False,
    water_quality=None,
    species_count=0,
) -> float:
    """Compute notability score 0-100.

    Rebalanced: Wikipedia views use log scale (100K views = ~50 points)
    so world-famous beaches clearly outrank local EU bathing sites.
    """
    import math
    # Log-scale for page views: log10(100K) = 5, log10(1M) = 6, log10(10K) = 4
    # Normalize log10(views) from 2 (100 views) to 6 (1M views) → 0-1
    views = wikipedia_page_views or 0
    if views > 0:
        log_views = math.log10(max(views, 1))
        views_score = _normalize(log_views, 2, 6) * 45  # 45% weight, log scale
    else:
        views_score = 0

    score = (
        views_score +
        _normalize(wikidata_sitelinks or 0, 0, 50) * 15 +
        _normalize(photo_count or 0, 0, 100) * 10 +
        _normalize(source_count or 1, 1, 5) * 10 +
        (5 if blue_flag else 0) +
        (5 if water_quality == "excellent" else 0) +
        _normalize(species_count or 0, 0, 500) * 10
    )
    return round(score, 1)


def enrich_notability(conn) -> int:
    """Compute notability_score for all beaches."""
    rows = conn.execute(
        """SELECT b.id, b.wikipedia_page_views_annual, b.wikidata_sitelinks,
           b.photo_count, b.blue_flag, b.water_quality_rating, b.species_observed_count,
           (SELECT COUNT(*) FROM beach_sources WHERE beach_id = b.id) as source_count
           FROM beaches b"""
    ).fetchall()

    count = 0
    for row in tqdm(rows, desc="Computing notability scores"):
        score = compute_notability_score(
            wikipedia_page_views=row["wikipedia_page_views_annual"],
            wikidata_sitelinks=row["wikidata_sitelinks"],
            photo_count=row["photo_count"],
            source_count=row["source_count"],
            blue_flag=bool(row["blue_flag"]),
            water_quality=row["water_quality_rating"],
            species_count=row["species_observed_count"],
        )
        conn.execute(
            "UPDATE beaches SET notability_score = ?, updated_at = datetime('now') WHERE id = ?",
            (score, row["id"]),
        )
        count += 1
        if count % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"Notability: scored {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    enrich_notability(conn)
    conn.close()
