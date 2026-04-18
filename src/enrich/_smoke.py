"""
Canonical smoke-test beach slugs and expected values per enrichment field.

Every pipeline should check: when run on the real DB, do these slugs come out
with the expected values? If not, the pipeline is broken regardless of what
enrichment_log says.
"""

# slug → {column → expected approximate value (or range, or predicate)}
# Only add a field here once the pipeline that fills it has been built.
SMOKE_BEACHES = {
    # Washington, USA — sand, semidiurnal, cool Pacific, easily checkable on Wikipedia
    "waikiki-beach":      {"country_code": "US"},
    # Spain, Galicia — known for extreme tidal range (Catedrais only visible at low tide)
    "catedrais":          {"country_code": "ES"},
    # Zakynthos, Greece — famous shipwreck beach, Bond location, cliff-enclosed
    "navagio":            {"country_code": "GR"},
    # Tanzania, Zanzibar — ferry-only, Indian Ocean
    "oppenheimer-beach":  {"country_code": "TZ"},
}


def lookup_beach_id(conn, slug: str) -> str | None:
    """Get a smoke-test beach's id by slug, or None if not in DB."""
    row = conn.execute("SELECT id FROM beaches WHERE slug = ?", (slug,)).fetchone()
    return row["id"] if row else None


def smoke_check(conn, column: str, predicate) -> list[str]:
    """
    Run `predicate(value)` for each smoke beach's value in `column`.
    Returns list of slugs that failed. Empty list = all pass.
    """
    failed = []
    for slug in SMOKE_BEACHES:
        beach_id = lookup_beach_id(conn, slug)
        if beach_id is None:
            continue  # smoke beach not in this DB (e.g., test fixture)
        row = conn.execute(f"SELECT {column} FROM beaches WHERE id=?", (beach_id,)).fetchone()
        value = row[column] if row else None
        if not predicate(value):
            failed.append(f"{slug}:{column}={value!r}")
    return failed
