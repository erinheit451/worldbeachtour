"""
Extract structured data from MDX content files back into the database.

The LLM-generated content contains hundreds of data points in prose that
should be queryable. This script uses regex to extract key facts.

Currently only overview.mdx and travel.mdx exist per beach; the extraction
logic is written to handle surf.mdx, sand.mdx, environment.mdx, and
family.mdx as well so they work automatically once those files are generated.
"""

import json
import os
import re
import sqlite3
from pathlib import Path

CONTENT_DIR = Path("site/content/beaches")

# ---------------------------------------------------------------------------
# Compiled patterns
# ---------------------------------------------------------------------------

# Length patterns: "X miles", "X km", "X meters", "X-meter"
LENGTH_PATTERNS = [
    (re.compile(r'(\d+(?:\.\d+)?)\s*(?:miles?|mi)\b', re.I), lambda m: float(m.group(1)) * 1609.34),
    (re.compile(r'(\d+(?:\.\d+)?)\s*(?:kilometers?|km)\b', re.I), lambda m: float(m.group(1)) * 1000),
    (re.compile(r'(\d+(?:,\d+)?)\s*(?:meters?|m)\b', re.I), lambda m: float(m.group(1).replace(',', ''))),
]

# Sand color patterns
SAND_COLORS = {
    'white': re.compile(r'\bwhite\s+sand\b', re.I),
    'golden': re.compile(r'\b(?:golden|gold)\s+sand\b', re.I),
    'black': re.compile(r'\bblack\s+sand\b', re.I),
    'pink': re.compile(r'\bpink\s+sand\b', re.I),
    'red': re.compile(r'\bred\s+sand\b', re.I),
    'gray': re.compile(r'\bgr[ae]y\s+sand\b', re.I),
}

# Visitor count patterns
VISITOR_PATTERNS = [
    re.compile(r'(\d+(?:\.\d+)?)\s*million\s+(?:visitors?|tourists?|people)', re.I),
    re.compile(
        r'(?:draws?|attracts?|receives?|welcomes?)\s+(?:about\s+|approximately\s+|over\s+|nearly\s+)?'
        r'(\d+(?:,\d+)*)\s+(?:visitors?|tourists?)',
        re.I,
    ),
]

# IATA airport code: 3 uppercase letters, often in parens or bold
IATA_PATTERN = re.compile(r'\b([A-Z]{3})\b(?=\)|\s*\)|\s*airport|\s*International)', re.I)

# Named surf breaks: "X Break", "X Point", "X Reef", "X Left/Right"
# Use a non-capturing wrapper so findall returns the full name string.
SURF_BREAK_PATTERN = re.compile(
    r'\b((?:[A-Z][a-zA-Z\'\-]+)(?:\s+[A-Z][a-zA-Z\'\-]+)*)\s+'
    r'(?:Break|Point|Reef|Left|Right|Peak|Pipe|Bowl|Barrels?|Pass)\b'
)

# Wave height: "X-Y foot", "X-Y feet", "X-Y metres", "X-Y meters"
WAVE_HEIGHT_PATTERN = re.compile(
    r'(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)\s*(?:foot|feet|ft|metres?|meters?|m)\b',
    re.I,
)

# Sand composition keywords
SAND_COMPOSITION = {
    'calcium carbonate': re.compile(r'calcium\s+carbonate', re.I),
    'volcanic': re.compile(r'\bvolcanic\b', re.I),
    'quartz': re.compile(r'\bquartz\b', re.I),
    'coral': re.compile(r'\bcoral\s+(?:sand|fragments?|debris)\b', re.I),
    'shell': re.compile(r'\bshell\s+(?:sand|fragments?|debris)\b', re.I),
    'granite': re.compile(r'\bgranite\b', re.I),
    'feldspar': re.compile(r'\bfeldspar\b', re.I),
}

# Reef type
REEF_TYPE_PATTERNS = {
    'fringing': re.compile(r'\bfringing\s+reef\b', re.I),
    'barrier': re.compile(r'\bbarrier\s+reef\b', re.I),
    'atoll': re.compile(r'\batoll\b', re.I),
    'patch': re.compile(r'\bpatch\s+reef\b', re.I),
}

# Lifeguard coverage
LIFEGUARD_PATTERNS = [
    re.compile(r'\blifeguards?\s+(?:are\s+)?(?:on\s+)?(?:duty|present|patrol|stationed)\b', re.I),
    re.compile(r'\bpatrolled\s+by\s+lifeguards?\b', re.I),
    re.compile(r'\bno\s+lifeguards?\b', re.I),
]

# Admission/entry price: "$X", "USD X", "entry fee", "admission"
ADMISSION_PATTERN = re.compile(
    r'(?:admission|entry(?:\s+fee)?|ticket).*?(?:USD?\s*\$?|ZAR\s*)?(\d+(?:\.\d+)?)',
    re.I,
)

# Public transit mentions
TRANSIT_PATTERN = re.compile(
    r'\b(?:bus|train|tram|metro|subway|ferry|shuttle|transit)\b',
    re.I,
)


# ---------------------------------------------------------------------------
# File I/O helpers
# ---------------------------------------------------------------------------

def _read_mdx(slug: str, lens: str, content_dir: Path = CONTENT_DIR) -> str | None:
    """Read an MDX file for a beach/lens. Returns content or None."""
    path = content_dir / slug / f"{lens}.mdx"
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")


# ---------------------------------------------------------------------------
# Individual field extractors
# ---------------------------------------------------------------------------

def _extract_beach_length(content: str) -> float | None:
    """Extract beach length in meters from content. Returns first match."""
    for pattern, converter in LENGTH_PATTERNS:
        match = pattern.search(content)
        if match:
            try:
                return round(converter(match), 0)
            except (ValueError, TypeError):
                continue
    return None


def _extract_sand_color(content: str) -> str | None:
    """Extract sand color from content. Returns first matching color name."""
    for color, pattern in SAND_COLORS.items():
        if pattern.search(content):
            return color
    return None


def _extract_visitor_count(content: str) -> int | None:
    """Extract annual visitor count. Returns integer or None."""
    for pattern in VISITOR_PATTERNS:
        match = pattern.search(content)
        if match:
            val = match.group(1).replace(',', '')
            try:
                num = float(val)
                if 'million' in match.group(0).lower():
                    return int(num * 1_000_000)
                return int(num)
            except ValueError:
                continue
    return None


def _extract_iata_codes(content: str) -> list[str]:
    """Extract IATA airport codes from travel content."""
    codes = IATA_PATTERN.findall(content)
    # Filter to plausible IATA codes: 3 uppercase letters, not common English words
    _skip = {'THE', 'FOR', 'AND', 'BUT', 'NOT', 'ARE', 'WAS', 'HAS', 'USD', 'ZAR',
             'GBP', 'EUR', 'AUD', 'CAD', 'JPY', 'CNY', 'INR', 'KM', 'GPS', 'ATM',
             'VAT', 'DNA', 'BBQ', 'VIP', 'SUV', '4WD', 'GPS', 'SPA', 'GYM'}
    seen = set()
    result = []
    for code in codes:
        code_upper = code.upper()
        if code_upper not in _skip and code_upper not in seen:
            seen.add(code_upper)
            result.append(code_upper)
    return result


def _extract_surf_breaks(content: str) -> list[str]:
    """Extract named surf breaks from surf content."""
    matches = SURF_BREAK_PATTERN.findall(content)
    seen = set()
    result = []
    for name_tuple in matches:
        name = name_tuple[0] if isinstance(name_tuple, tuple) else name_tuple
        name = name.strip()
        if name and name.lower() not in seen:
            seen.add(name.lower())
            result.append(name)
    return result


def _extract_wave_height(content: str) -> tuple[float, float] | None:
    """Extract wave height range in meters. Returns (min_m, max_m) or None."""
    match = WAVE_HEIGHT_PATTERN.search(content)
    if not match:
        return None
    lo, hi = float(match.group(1)), float(match.group(2))
    unit = match.group(0).split()[-1].lower()
    if unit in ('foot', 'feet', 'ft'):
        lo, hi = lo * 0.3048, hi * 0.3048
    return (round(lo, 2), round(hi, 2))


def _extract_sand_composition(content: str) -> str | None:
    """Extract primary sand composition keyword."""
    for comp, pattern in SAND_COMPOSITION.items():
        if pattern.search(content):
            return comp
    return None


def _extract_reef_type(content: str) -> str | None:
    """Extract reef type from environment content."""
    for reef_type, pattern in REEF_TYPE_PATTERNS.items():
        if pattern.search(content):
            return reef_type
    return None


def _extract_has_lifeguard(content: str) -> int | None:
    """Extract lifeguard presence. Returns 1 (present), 0 (absent), or None."""
    for pattern in LIFEGUARD_PATTERNS:
        match = pattern.search(content)
        if match:
            text = match.group(0).lower()
            if text.startswith('no '):
                return 0
            return 1
    return None


def _extract_has_transit(content: str) -> bool:
    """Return True if public transit is mentioned in travel content."""
    return bool(TRANSIT_PATTERN.search(content))


# ---------------------------------------------------------------------------
# Per-beach aggregator
# ---------------------------------------------------------------------------

def extract_beach_data(slug: str, content_dir: Path = CONTENT_DIR) -> dict:
    """
    Extract all structured data from a beach's MDX files.

    Returns a dict of field_name -> value for fields that were found.
    Fields not found are omitted (caller decides whether to update DB).
    """
    data: dict = {}

    overview = _read_mdx(slug, "overview", content_dir)
    sand = _read_mdx(slug, "sand", content_dir)
    travel = _read_mdx(slug, "travel", content_dir)
    surf = _read_mdx(slug, "surf", content_dir)
    environment = _read_mdx(slug, "environment", content_dir)
    family = _read_mdx(slug, "family", content_dir)

    # --- beach_length_m ---
    for src in [overview, sand, travel]:
        if src:
            length = _extract_beach_length(src)
            if length:
                data["beach_length_m"] = length
                break

    # --- sand_color ---
    for src in [sand, overview]:
        if src:
            color = _extract_sand_color(src)
            if color:
                data["sand_color"] = color
                break

    # --- annual_visitors (no DB column yet — logged only) ---
    if overview:
        visitors = _extract_visitor_count(overview)
        if visitors:
            data["_annual_visitors"] = visitors  # prefix _ = informational only

    # --- nearest_airport_iata (fill if missing) ---
    if travel:
        codes = _extract_iata_codes(travel)
        if codes:
            data["_iata_candidates"] = codes
            if len(codes) >= 1:
                # First plausible code is typically the primary airport
                data["nearest_airport_iata"] = codes[0]

    # --- surf breaks (no DB column yet — logged only) ---
    if surf:
        breaks = _extract_surf_breaks(surf)
        if breaks:
            data["_surf_breaks"] = breaks
        wave_range = _extract_wave_height(surf)
        if wave_range:
            data["_wave_height_range_m"] = wave_range

    # --- sand composition (no DB column yet — logged only) ---
    if sand:
        comp = _extract_sand_composition(sand)
        if comp:
            data["_sand_composition"] = comp

    # --- reef type (no DB column yet — logged only) ---
    if environment:
        reef = _extract_reef_type(environment)
        if reef:
            data["_reef_type"] = reef

    # --- lifeguard ---
    for src in [family, overview, travel]:
        if src:
            lg = _extract_has_lifeguard(src)
            if lg is not None:
                data["lifeguard"] = lg
                break

    # --- public transit flag (no DB column yet — logged only) ---
    if travel:
        data["_has_transit"] = _extract_has_transit(travel)

    return data


# ---------------------------------------------------------------------------
# Database updater
# ---------------------------------------------------------------------------

# Columns in the beaches table that this script is allowed to update
_UPDATABLE_COLUMNS = {
    "beach_length_m",
    "sand_color",
    "nearest_airport_iata",
    "lifeguard",
}


def enrich_from_mdx(conn: sqlite3.Connection, content_dir: Path = CONTENT_DIR) -> int:
    """
    Extract structured data from MDX files and update NULL fields in the DB.

    Only writes to fields that are currently NULL — never overwrites existing data.
    Returns the number of rows updated.
    """
    if not content_dir.exists():
        print(f"Content directory not found: {content_dir}")
        return 0

    slugs = [
        d.name for d in sorted(content_dir.iterdir())
        if d.is_dir() and (d / "meta.json").exists()
    ]

    # Fetch current DB state for all relevant columns in one query
    col_list = ", ".join(_UPDATABLE_COLUMNS)
    db_rows = {
        row["slug"]: row
        for row in conn.execute(
            f"SELECT slug, {col_list} FROM beaches"
        ).fetchall()
    }

    count = 0
    for slug in slugs:
        data = extract_beach_data(slug, content_dir)
        if not data:
            continue

        row = db_rows.get(slug)
        if not row:
            # Beach is in content dir but not in DB — skip
            continue

        # Build UPDATE only for NULL columns
        updates: dict = {}
        for col in _UPDATABLE_COLUMNS:
            if col in data and row[col] is None:
                updates[col] = data[col]

        # Log informational-only extractions
        info_keys = [k for k in data if k.startswith("_")]
        if info_keys and updates:
            info_str = ", ".join(f"{k[1:]}={data[k]}" for k in info_keys)
            print(f"  {slug} [info] {info_str}")

        if updates:
            set_parts = [f"{col} = ?" for col in updates] + ["updated_at = datetime('now')"]
            values = list(updates.values()) + [slug]
            conn.execute(
                f"UPDATE beaches SET {', '.join(set_parts)} WHERE slug = ?",
                values,
            )
            count += 1
            print(f"  {slug}: {updates}")

    conn.commit()
    print(f"\nMDX extraction complete — updated {count} beaches")
    return count


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import sys

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    print(f"Opening database: {db_path}")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    enrich_from_mdx(conn)
    conn.close()
