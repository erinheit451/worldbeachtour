"""
Migrate EAV beach_attributes data into flat columns on the beaches table.

This is a one-time migration that reads from the existing beach_attributes
table and writes values into the new enriched columns. Idempotent.
"""

from tqdm import tqdm


def _bool_value(val):
    """Convert EAV string boolean to integer 1/0."""
    if val is None:
        return None
    return 1 if str(val).lower() in ("true", "yes", "1") else 0


def migrate_eav_to_flat(conn) -> int:
    """Migrate EAV attributes to flat columns. Returns count of beaches updated."""
    # Get all beach IDs that have attributes
    beach_ids = conn.execute(
        "SELECT DISTINCT beach_id FROM beach_attributes"
    ).fetchall()

    count = 0
    for (beach_id_row,) in tqdm(beach_ids, desc="Migrating EAV → flat columns"):
        beach_id = beach_id_row if isinstance(beach_id_row, str) else beach_id_row[0]

        # Fetch all attributes for this beach
        attrs = conn.execute(
            "SELECT category, key, value, value_type, source_id FROM beach_attributes WHERE beach_id = ?",
            (beach_id,),
        ).fetchall()

        updates = {}
        for attr in attrs:
            cat, key, val, vtype, src_id = attr["category"], attr["key"], attr["value"], attr["value_type"], attr["source_id"]

            if cat == "environment" and key == "water_quality_rating" and val:
                updates["water_quality_rating"] = val
                # Determine source from the source record
                src = conn.execute(
                    "SELECT source_name FROM beach_sources WHERE id = ?", (src_id,)
                ).fetchone()
                if src:
                    updates["water_quality_source"] = src["source_name"]

            elif cat == "safety" and key == "lifeguard":
                updates["lifeguard"] = _bool_value(val)
                src = conn.execute(
                    "SELECT source_name FROM beach_sources WHERE id = ?", (src_id,)
                ).fetchone()
                if src:
                    updates["lifeguard_source"] = src["source_name"]

            elif cat == "facilities" and key == "restrooms":
                updates["has_restrooms"] = _bool_value(val)
            elif cat == "facilities" and key == "showers":
                updates["has_showers"] = _bool_value(val)
            elif cat == "facilities" and key == "parking":
                updates["has_parking"] = _bool_value(val)
            elif cat == "facilities" and key == "wheelchair_access":
                updates["wheelchair_accessible"] = _bool_value(val)
            elif cat == "social" and key == "nudist":
                if str(val).lower() in ("true", "yes", "1"):
                    updates["nudism"] = "yes"
                elif val:
                    updates["nudism"] = val
            elif cat == "social" and key == "dog_friendly":
                updates["dogs_allowed"] = _bool_value(val)
            elif cat == "social" and key == "wikipedia_url" and val:
                updates["wikipedia_url"] = val

        if not updates:
            continue

        # Build UPDATE query
        set_parts = [f"{col} = ?" for col in updates.keys()]
        set_parts.append("updated_at = datetime('now')")
        values = list(updates.values()) + [beach_id]
        conn.execute(
            f"UPDATE beaches SET {', '.join(set_parts)} WHERE id = ?",
            values,
        )
        count += 1
        if count % 5000 == 0:
            conn.commit()

    conn.commit()
    print(f"EAV migration: updated {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    migrate_eav_to_flat(conn)
    conn.close()
