"""
Bulk photo enrichment for all beaches that already have a content guide
(site/content/beaches/{slug}/). Fetches Wikimedia candidates, scores, and
auto-wires top-5 gallery + auto-selected hero into each meta.json.

Hero selection: top-scored candidate with min_dim >= 2000px. If none meet
that bar, falls back to top-scored overall. Legendary beaches may want
human override — meta.json includes _enrichment.hero_auto_selected flag.
"""

import json
import os
import sqlite3
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from src.enrich.photo_enrichment import enrich_beach_photos

DB = "output/world_beaches.db"
SITE_CONTENT = Path("site/content/beaches")


def pick_hero_and_gallery(candidates):
    """From a scored candidate list, pick 1 hero + up to 5 gallery."""
    if not candidates:
        return None, []
    # Hero preference: highest-scored candidate with min_dim >= 2000px
    high_res = [c for c in candidates if min(c.width or 0, c.height or 0) >= 2000]
    hero = high_res[0] if high_res else candidates[0]
    # Gallery: top 5 excluding the hero
    gallery = [c for c in candidates if c.url != hero.url][:5]
    return hero, gallery


def build_meta(hero, gallery, stats: dict) -> dict:
    return {
        "tier": 2,
        "lenses": ["overview", "travel"],
        "custom": [],
        "images": {
            "hero": {
                "url": hero.url,
                "title": hero.title.replace("File:", ""),
                "author": (hero.author or "")[:200],
                "license": hero.license or "CC BY-SA",
                "width": hero.width,
                "height": hero.height,
                "score": hero.score,
            } if hero else None,
            "gallery": [
                {
                    "url": c.url,
                    "title": c.title.replace("File:", ""),
                    "license": c.license or "CC BY-SA",
                    "source_tier": c.source_tier,
                    "score": c.score,
                    "width": c.width,
                    "height": c.height,
                }
                for c in gallery
            ],
            "_enrichment": {
                "pipeline_version": "photo_enrichment.py v1",
                "candidates_evaluated": stats.get("total", 0),
                "tier_breakdown": stats.get("tiers", {}),
                "hero_auto_selected": True,
            },
        },
    }


def main():
    conn = sqlite3.connect(DB, timeout=30)
    conn.row_factory = sqlite3.Row

    if not SITE_CONTENT.exists():
        print(f"Missing {SITE_CONTENT}", flush=True)
        sys.exit(1)

    slugs = sorted([d.name for d in SITE_CONTENT.iterdir() if d.is_dir()])
    print(f"[{time.strftime('%H:%M:%S')}] Found {len(slugs)} beach guides", flush=True)

    enriched_count = 0
    empty_count = 0
    error_count = 0
    total_photos = 0

    for i, slug in enumerate(slugs, 1):
        try:
            candidates = enrich_beach_photos(conn, slug, verbose=False)
        except Exception as exc:
            print(f"  [{i}/{len(slugs)}] {slug}: ERROR {exc}", flush=True)
            error_count += 1
            continue

        if not candidates:
            empty_count += 1
            continue

        tier_breakdown = {}
        for c in candidates:
            key = f"tier{c.source_tier}"
            tier_breakdown[key] = tier_breakdown.get(key, 0) + 1

        hero, gallery = pick_hero_and_gallery(candidates)
        meta = build_meta(hero, gallery, {
            "total": len(candidates), "tiers": tier_breakdown,
        })

        meta_path = SITE_CONTENT / slug / "meta.json"
        meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")

        enriched_count += 1
        total_photos += len(candidates)

        if i % 10 == 0 or i == len(slugs):
            print(
                f"[{time.strftime('%H:%M:%S')}] [{i}/{len(slugs)}] "
                f"enriched={enriched_count} empty={empty_count} errors={error_count} "
                f"photos={total_photos}", flush=True,
            )

    print(
        f"\n[{time.strftime('%H:%M:%S')}] DONE. "
        f"enriched={enriched_count}/{len(slugs)}  "
        f"empty={empty_count}  errors={error_count}  "
        f"total_candidates_inserted={total_photos}", flush=True,
    )
    conn.close()


if __name__ == "__main__":
    main()
