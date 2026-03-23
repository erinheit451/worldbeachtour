"""Deduplication engine for the World Beach Database.

Uses spatial proximity + fuzzy name matching to identify and merge
duplicate beach records from different sources.

Optimized: only compares cross-source pairs to avoid O(n^2) blowup
in dense grid cells where a single source has many unnamed entries.
"""

import math
from collections import defaultdict

from rapidfuzz import fuzz


# Configurable thresholds
MAX_DISTANCE_M = 500
NAME_SIMILARITY_THRESHOLD = 0.75
GRID_SIZE = 0.01  # ~1.1km grid cells


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


def _name_similarity(name1, name2):
    if not name1 or not name2:
        return 0.0
    n1 = name1.lower().strip()
    n2 = name2.lower().strip()
    for prefix in ["beach ", "plage ", "playa ", "praia ", "strand ", "spiaggia "]:
        if n1.startswith(prefix):
            n1 = n1[len(prefix):]
        if n2.startswith(prefix):
            n2 = n2[len(prefix):]
    return fuzz.ratio(n1, n2) / 100.0


def _should_merge(beach_a, beach_b):
    dist = _haversine(
        beach_a["lat"], beach_a["lng"],
        beach_b["lat"], beach_b["lng"],
    )
    if dist > MAX_DISTANCE_M:
        return False

    name_a = beach_a.get("name")
    name_b = beach_b.get("name")

    if name_a and name_b:
        return _name_similarity(name_a, name_b) >= NAME_SIMILARITY_THRESHOLD

    # One or both unnamed and very close
    if dist < 200:
        return True

    return False


SOURCE_PRIORITY = {
    "osm": 1,
    "eu_bathing": 2,
    "epa_beacon": 3,
    "wikidata": 4,
    "geonames": 5,
    "blue_flag": 6,
}


def deduplicate(conn):
    """Run deduplication across all beach records.

    Only compares beaches from DIFFERENT sources to avoid
    quadratic blowup in dense same-source cells.
    """
    print("=== Deduplication ===")

    rows = conn.execute("""
        SELECT b.id, b.name, b.centroid_lat, b.centroid_lng, bs.source_name
        FROM beaches b
        JOIN beach_sources bs ON bs.beach_id = b.id
        GROUP BY b.id
    """).fetchall()

    print(f"  {len(rows)} total records before dedup")

    # Build spatial grid, indexed by source
    grid = defaultdict(lambda: defaultdict(list))  # grid_key -> source -> [beach]
    beaches = {}

    for row in rows:
        bid = row["id"]
        src = row["source_name"]
        b = {"id": bid, "name": row["name"],
             "lat": row["centroid_lat"], "lng": row["centroid_lng"],
             "source": src}
        beaches[bid] = b
        key = _grid_key(b["lat"], b["lng"])
        grid[key][src].append(bid)

    # Union-Find
    parent = {}

    def find(x):
        while parent.get(x, x) != x:
            parent[x] = parent.get(parent[x], parent[x])
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    merge_count = 0
    cells_processed = 0
    total_cells = len(grid)

    # For each grid cell, compare beaches across different sources
    for key, sources_in_cell in grid.items():
        cells_processed += 1
        if cells_processed % 10000 == 0:
            print(f"  Processed {cells_processed}/{total_cells} grid cells, {merge_count} merges so far")

        # Collect all beaches from neighboring cells
        neighbor_sources = defaultdict(list)
        for di in (-1, 0, 1):
            for dj in (-1, 0, 1):
                nkey = (key[0] + di, key[1] + dj)
                if nkey in grid:
                    for src, ids in grid[nkey].items():
                        neighbor_sources[src].extend(ids)

        # Get list of sources present in this cell
        cell_sources = list(sources_in_cell.keys())

        # For each source in this cell, compare against OTHER sources in neighbors
        for src_a in cell_sources:
            ids_a = sources_in_cell[src_a]

            for src_b, ids_b in neighbor_sources.items():
                if src_b <= src_a:  # Only compare each source pair once
                    continue

                for id_a in ids_a:
                    for id_b in ids_b:
                        if find(id_a) == find(id_b):
                            continue
                        if _should_merge(beaches[id_a], beaches[id_b]):
                            union(id_a, id_b)
                            merge_count += 1

    # Group merged beaches
    groups = defaultdict(list)
    for bid in beaches:
        groups[find(bid)].append(bid)

    multi_groups = {k: v for k, v in groups.items() if len(v) > 1}
    print(f"  Found {merge_count} merge pairs in {len(multi_groups)} groups")

    # Merge groups
    merged_away = 0
    for i, group_ids in enumerate(multi_groups.values()):
        if i % 1000 == 0 and i > 0:
            print(f"  Merging group {i}/{len(multi_groups)}...")
            conn.commit()

        # Pick primary by source priority + has name
        best_id = None
        best_score = 999
        for bid in group_ids:
            b = beaches[bid]
            score = SOURCE_PRIORITY.get(b["source"], 10)
            if not b.get("name"):
                score += 5
            if best_id is None or score < best_score:
                best_id = bid
                best_score = score

        for sec_id in group_ids:
            if sec_id == best_id:
                continue

            sec = beaches[sec_id]

            # Transfer name if primary lacks one
            if not beaches[best_id].get("name") and sec.get("name"):
                conn.execute(
                    "UPDATE beaches SET name = ?, updated_at = datetime('now') WHERE id = ?",
                    (sec["name"], best_id),
                )
                beaches[best_id]["name"] = sec["name"]

            # Re-link sources
            conn.execute(
                "UPDATE beach_sources SET beach_id = ? WHERE beach_id = ?",
                (best_id, sec_id),
            )

            # Re-link non-duplicate attributes
            conn.execute(
                """UPDATE beach_attributes SET beach_id = ?
                   WHERE beach_id = ? AND NOT EXISTS (
                       SELECT 1 FROM beach_attributes ba2
                       WHERE ba2.beach_id = ? AND ba2.category = beach_attributes.category
                       AND ba2.key = beach_attributes.key
                   )""",
                (best_id, sec_id, best_id),
            )
            conn.execute(
                "DELETE FROM beach_attributes WHERE beach_id = ?",
                (sec_id,),
            )

            # Delete secondary
            conn.execute("DELETE FROM beaches WHERE id = ?", (sec_id,))
            merged_away += 1

    conn.commit()

    remaining = conn.execute("SELECT COUNT(*) as cnt FROM beaches").fetchone()["cnt"]
    print(f"  Merged away {merged_away} duplicates")
    print(f"  {remaining} unique beaches after dedup")

    return remaining
