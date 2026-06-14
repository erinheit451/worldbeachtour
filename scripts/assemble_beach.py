"""Assemble the data + meta for a beach so it renders as a legendary page.

The non-LLM half of scaled production. The content agent writes composition.json
+ showcase.json; this script writes the legendary data file (climate, tides,
sand, waves, comparisons, safety, nearest_airport — via the same build_stub used
for the preview) and meta.json (hero + gallery from Commons photos). Then the
unified [slug] route auto-renders it — no page.tsx, no SHOWCASE_SLUGS.

Usage: python scripts/assemble_beach.py <slug> [<slug> ...]
"""

import json
import sqlite3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from export_preview_samples import precompute_distributions, build_stub, build_photos  # noqa

REPO = Path(__file__).resolve().parents[1]
DB = Path("C:/Users/Roci/worldbeachtour/output/world_beaches.db")
DATA = REPO / "site" / "data" / "beaches"
CONTENT = REPO / "site" / "content" / "beaches"


def to_img(ph):
    return {
        "url": ph["url"], "thumbnail": ph.get("thumb"),
        "title": ph.get("title") or "Beach", "author": ph.get("author_html"),
        "license": ph.get("license") or "", "width": ph.get("width") or 1600,
        "height": ph.get("height") or 1067, "tier": "B",
    }


def main(slugs):
    conn = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    print("Precomputing distributions…")
    dist = precompute_distributions(conn)

    for slug in slugs:
        row = conn.execute("SELECT id FROM beaches WHERE slug = ?", (slug,)).fetchone()
        if not row:
            print(f"  MISSING {slug} — not in DB"); continue
        bundle, status = build_stub(conn, slug, dist)
        if status != "OK":
            print(f"  {status} {slug}"); continue

        # data file (the legendary renderer reads this shape)
        DATA.mkdir(parents=True, exist_ok=True)
        (DATA / f"{slug}.json").write_text(
            json.dumps(bundle["data"], indent=2, ensure_ascii=False), encoding="utf-8")

        # meta.json — only (re)build if missing or has no hero
        cdir = CONTENT / slug
        cdir.mkdir(parents=True, exist_ok=True)
        meta_path = cdir / "meta.json"
        need_meta = True
        if meta_path.exists():
            try:
                m = json.loads(meta_path.read_text(encoding="utf-8"))
                need_meta = not (m.get("images") or {}).get("hero")
            except Exception:
                need_meta = True
        if need_meta:
            photos = build_photos(conn, row["id"], limit=9)
            meta = {"tier": 2, "showcase": True, "images": {
                "hero": to_img(photos[0]) if photos else None,
                "section": {},
                "gallery": [to_img(x) for x in photos[1:]],
            }}
            meta_path.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")

        has_content = (cdir / "composition.json").exists() and (cdir / "showcase.json").exists()
        d = bundle["data"]
        print(f"  OK {slug:32} data✓ meta{'✓' if not need_meta else '+'} "
              f"waves={'waves' in d} comparisons={len(d.get('comparisons') or [])} "
              f"content={'✓' if has_content else 'PENDING(agent)'}")
    conn.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: python scripts/assemble_beach.py <slug> [<slug> ...]"); sys.exit(1)
    main(sys.argv[1:])
