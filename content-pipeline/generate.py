"""
LLM content generation for beach pages.

Usage:
    python -m content_pipeline.generate                    # Generate for top 100 beaches
    python -m content_pipeline.generate --limit 10         # Generate for top 10
    python -m content_pipeline.generate --lenses overview   # Overview only
    python -m content_pipeline.generate --slug bondi-beach  # Specific beach
"""

import argparse
import json
import os
import sqlite3
import time
from pathlib import Path

import anthropic

TEMPLATES_DIR = Path(__file__).parent / "templates"
CONTENT_DIR = Path(__file__).parent.parent / "site" / "content" / "beaches"
DB_PATH = Path(__file__).parent.parent / "output" / "world_beaches.db"

DEFAULT_LENSES = ["overview", "travel"]
ALL_LENSES = ["overview", "travel", "surf", "environment", "family", "photography", "diving", "history", "sand"]

MODEL = "claude-haiku-4-5-20251001"

# Travel lens needs more tokens — it targets 800-1500 words
LENS_MAX_TOKENS = {
    "overview": 2000,
    "travel": 4000,
    "surf": 3000,
    "environment": 3000,
    "family": 3000,
    "photography": 2500,
    "diving": 3000,
    "history": 3000,
    "sand": 2000,
}


def sanitize_mdx(content: str) -> str:
    """Remove truncated/malformed JSX component tags from end of content."""
    import re
    lines = content.splitlines()
    # Drop any trailing lines that contain an unclosed JSX tag (has < but no />)
    while lines:
        last = lines[-1].strip()
        # Check for an opening JSX-like tag that isn't closed
        if re.search(r"<[A-Z][A-Za-z]+", last) and not last.endswith("/>") and not last.endswith(">"):
            lines.pop()
        else:
            break
    return "\n".join(lines)


def load_template(lens: str) -> str:
    """Load a prompt template for a given lens."""
    template_path = TEMPLATES_DIR / f"{lens}.md"
    if not template_path.exists():
        return None
    return template_path.read_text(encoding="utf-8")


def get_beach_context(conn, slug: str) -> dict | None:
    """Load enriched beach data from DB for prompt context."""
    conn.row_factory = sqlite3.Row
    row = conn.execute("SELECT * FROM beaches WHERE slug = ?", (slug,)).fetchone()
    if not row:
        return None

    data = dict(row)
    # Add sources
    sources = conn.execute(
        "SELECT source_name, source_id, source_url FROM beach_sources WHERE beach_id = ?",
        (data["id"],)
    ).fetchall()
    data["sources"] = [dict(s) for s in sources]

    # Remove internal fields that aren't useful for content generation
    for key in ["id", "source_layer", "created_at", "updated_at", "enrichment_version",
                "climate_grid_cell", "climate_source", "ocean_source", "tide_source",
                "water_quality_source", "blue_flag_source", "lifeguard_source",
                "shark_source", "facilities_source", "protected_area_source",
                "ecology_sources", "swim_suitability_confidence"]:
        data.pop(key, None)

    # Remove None values for cleaner prompt
    data = {k: v for k, v in data.items() if v is not None}

    return data


def generate_lens_content(client, beach_data: dict, lens: str) -> str | None:
    """Generate MDX content for a single lens using Claude."""
    template = load_template(lens)
    if not template:
        return None

    beach_name = beach_data.get("name", beach_data.get("slug", "Unknown Beach"))
    beach_json = json.dumps(beach_data, indent=2, ensure_ascii=False, default=str)

    prompt = template.replace("{{beach_name}}", beach_name).replace("{{beach_json}}", beach_json)

    max_tokens = LENS_MAX_TOKENS.get(lens, 2000)

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text
        return sanitize_mdx(raw)
    except Exception as e:
        print(f"    ERROR generating {lens}: {e}")
        return None


def create_meta_json(slug: str, lenses: list) -> dict:
    """Create meta.json for a beach."""
    return {
        "tier": 2,  # LLM-generated content = tier 2 (hand-written = tier 1)
        "lenses": lenses,
        "custom": [],
        "images": {"hero": "", "gallery": []}
    }


def generate_beach_content(client, conn, slug: str, lenses: list, force: bool = False) -> int:
    """Generate content for a single beach. Returns number of lenses generated."""
    beach_dir = CONTENT_DIR / slug

    # Skip if already has content (unless force)
    if beach_dir.exists() and (beach_dir / "meta.json").exists() and not force:
        existing_meta = json.loads((beach_dir / "meta.json").read_text())
        existing_lenses = set(existing_meta.get("lenses", []))
        lenses = [l for l in lenses if l not in existing_lenses]
        if not lenses:
            return 0

    beach_data = get_beach_context(conn, slug)
    if not beach_data:
        print(f"  {slug}: not found in DB")
        return 0

    beach_dir.mkdir(parents=True, exist_ok=True)
    generated = []

    for lens in lenses:
        content = generate_lens_content(client, beach_data, lens)
        if content:
            mdx_path = beach_dir / f"{lens}.mdx"
            mdx_path.write_text(content, encoding="utf-8")
            generated.append(lens)
            print(f"    {lens}.mdx written ({len(content)} chars)")
            time.sleep(1)  # Rate limit

    if generated:
        # Update or create meta.json
        meta_path = beach_dir / "meta.json"
        if meta_path.exists():
            meta = json.loads(meta_path.read_text())
            meta["lenses"] = sorted(set(meta["lenses"] + generated))
        else:
            meta = create_meta_json(slug, generated)
        meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")

    return len(generated)


def main():
    parser = argparse.ArgumentParser(description="Generate beach content with Claude")
    parser.add_argument("--limit", type=int, default=100, help="Number of beaches to process")
    parser.add_argument("--lenses", default=",".join(DEFAULT_LENSES), help="Comma-separated lenses")
    parser.add_argument("--slug", help="Generate for a specific beach slug")
    parser.add_argument("--force", action="store_true", help="Regenerate even if content exists")
    parser.add_argument("--db", default=str(DB_PATH), help="Database path")
    args = parser.parse_args()

    lenses = args.lenses.split(",")

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY environment variable not set")
        return

    client = anthropic.Anthropic(api_key=api_key)
    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row

    if args.slug:
        slugs = [args.slug]
    else:
        # Get top beaches by page views
        rows = conn.execute("""
            SELECT slug FROM beaches
            WHERE wikipedia_page_views_annual > 0
            ORDER BY wikipedia_page_views_annual DESC
            LIMIT ?
        """, (args.limit,)).fetchall()
        slugs = [r["slug"] for r in rows]

    print(f"Generating content for {len(slugs)} beaches, lenses: {lenses}")

    total_generated = 0
    for i, slug in enumerate(slugs):
        print(f"[{i+1}/{len(slugs)}] {slug}")
        count = generate_beach_content(client, conn, slug, lenses, args.force)
        total_generated += count

    print(f"\nDone — generated {total_generated} lens pages across {len(slugs)} beaches")
    conn.close()


if __name__ == "__main__":
    main()
