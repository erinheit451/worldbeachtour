"""
Ingest data/sand_curated.yaml into beach_sand_curated.

Idempotent — DELETE + INSERT per beach_id. Validates that every slug exists
in the beaches table.
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

from src.enrich._common import open_db, log_run_start, log_run_finish


def load_curated(path: Path) -> list[dict]:
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    if not isinstance(data, list):
        raise ValueError(f"expected a YAML list, got {type(data).__name__}")
    return data


def ingest_curated(conn, yaml_path: Path) -> dict:
    run_id = log_run_start(conn, "sand_curated", phase="A")
    entries = load_curated(yaml_path)

    # Validate every slug exists.
    missing = []
    for e in entries:
        slug = e.get("slug")
        if not slug:
            raise ValueError(f"entry has no slug: {e}")
        row = conn.execute("SELECT id FROM beaches WHERE slug = ?", (slug,)).fetchone()
        if row is None:
            missing.append(slug)
    if missing:
        raise ValueError(f"curated slugs not in beaches table: {missing}")

    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    inserted = 0
    for e in entries:
        beach_id = conn.execute(
            "SELECT id FROM beaches WHERE slug = ?", (e["slug"],)
        ).fetchone()["id"]
        conn.execute("DELETE FROM beach_sand_curated WHERE beach_id = ?", (beach_id,))
        conn.execute(
            """INSERT INTO beach_sand_curated
               (beach_id, sand_story, sand_story_citations, showcase_rank,
                reference_photo_url, reference_photo_attribution, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                beach_id,
                e.get("sand_story"),
                json.dumps(e.get("citations", [])),
                e.get("showcase_rank"),
                e.get("reference_photo_url"),
                e.get("reference_photo_attribution"),
                now,
            ),
        )
        inserted += 1

    conn.commit()
    log_run_finish(conn, run_id, "ok", total_processed=inserted)
    return {"inserted": inserted, "total": len(entries)}


if __name__ == "__main__":
    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    yaml_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("data/sand_curated.yaml")
    conn = open_db(db_path)
    result = ingest_curated(conn, yaml_path)
    print("Curated seeds:", result)
    conn.close()
