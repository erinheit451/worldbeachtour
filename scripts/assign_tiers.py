"""Tier assignment — sort every beach into its rung by the data/story it has.

The gating logic for scaled production (see docs/tier-ladder-deep-dive.md):
  Tier 1 Legendary  — hand-curated allowlist only (editorial, never auto)
  Tier 2 Featured   — strong signal: high notability / pageviews / named+wikidata
  Tier 3 Field Guide— named + climate (documentable from structured data)
  Tier 4 Stub       — unnamed or data-thin (the long tail)

Read-only against the main-clone DB. Writes per-tier cohort slug lists to
site/data/cohorts/<tier>.json and prints the distribution.
"""

import json
import sqlite3
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DB = Path("C:/Users/Roci/worldbeachtour/output/world_beaches.db")
OUT = REPO / "site" / "data" / "cohorts"

# Tier 1 is curated — the built legendary pages + the hit-list marquee candidates.
TIER1_ALLOWLIST = {
    "copacabana-7", "waikiki-beach-1", "bondi-beach", "praia-do-norte-6",
    "pipeline", "teahupoo", "glass-beach-4", "malibu", "brighton-beach-1",
    "sao-martinho-do-porto", "peniche", "navagio-1", "boulders-beach",
    "whitehaven-beach-1", "varkala-beach", "patong", "huntington-city-beach",
    "reynisfjara",
}


def assign(row):
    slug = row["slug"]
    if slug in TIER1_ALLOWLIST:
        return 1
    name = (row["name"] or "").strip()
    notab = row["notability_score"] or 0
    pv = row["wikipedia_page_views_annual"] or 0
    has_wd = row["wikidata_id"] is not None
    has_climate = row["climate_air_temp_high"] is not None

    # Tier 2 — Featured: a strong story/fame signal.
    if name and (pv >= 15000 or notab >= 25 or (has_wd and notab >= 15)):
        return 2
    # Tier 3 — Field Guide: named + documentable from structured data.
    if name and has_climate:
        return 3
    # Tier 4 — Stub: unnamed or data-thin.
    return 4


def main():
    conn = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        "SELECT slug, name, notability_score, wikipedia_page_views_annual, "
        "wikidata_id, climate_air_temp_high FROM beaches"
    ).fetchall()

    cohorts = {1: [], 2: [], 3: [], 4: []}
    for r in rows:
        cohorts[assign(r)].append(r["slug"])

    total = len(rows)
    print(f"Total beaches: {total:,}\n")
    names = {1: "Legendary", 2: "Featured", 3: "Field Guide", 4: "Stub"}
    for t in (1, 2, 3, 4):
        n = len(cohorts[t])
        print(f"  Tier {t} {names[t]:12} {n:>8,}  ({100*n/total:5.1f}%)")

    OUT.mkdir(parents=True, exist_ok=True)
    for t in (1, 2, 3, 4):
        (OUT / f"tier{t}.json").write_text(
            json.dumps(cohorts[t], ensure_ascii=False), encoding="utf-8"
        )
    print(f"\nCohort slug lists -> {OUT}")
    # The Tier-2 cohort is the next production target (manageable, high-value).
    print(f"\nTier-2 production cohort: {len(cohorts[2]):,} beaches")
    conn.close()


if __name__ == "__main__":
    main()
