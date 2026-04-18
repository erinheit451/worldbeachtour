"""
Canonical smoke-test beach slugs.

Every Milestone A pipeline should run its own sanity check against these
slugs when it finishes. The notes below describe why each slug is canonical
— they are documentation for humans, not a machine-checked contract.
"""

from src.enrich._common import _check_ident

SMOKE_BEACHES = {
    "waikiki-beach":     "Honolulu, USA — sandy Pacific beach, well-documented, easily verifiable",
    "catedrais":         "Galicia, Spain — only accessible at low tide, so tide_range_spring_m must be large",
    "navagio":           "Zakynthos, Greece — cliff-enclosed Ionian Sea beach, featured in Bond",
    "oppenheimer-beach": "Zanzibar, Tanzania — ferry-only Indian Ocean beach",
}


def lookup_beach_id(conn, slug: str) -> str | None:
    """Get a smoke-test beach's id by slug, or None if not in DB."""
    row = conn.execute("SELECT id FROM beaches WHERE slug = ?", (slug,)).fetchone()
    return row["id"] if row else None


def smoke_check(conn, column: str, predicate) -> list[str]:
    """Run `predicate(value)` on `column` for every smoke-test beach that exists in `conn`.
    Returns list of failing "slug:column=value" strings. Empty list = all pass or not in DB."""
    _check_ident(column)
    failed = []
    for slug in SMOKE_BEACHES:
        beach_id = lookup_beach_id(conn, slug)
        if beach_id is None:
            continue
        row = conn.execute(f"SELECT {column} FROM beaches WHERE id=?", (beach_id,)).fetchone()
        value = row[column] if row else None
        if not predicate(value):
            failed.append(f"{slug}:{column}={value!r}")
    return failed
