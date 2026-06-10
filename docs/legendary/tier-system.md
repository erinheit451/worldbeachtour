# World Beach Tour — Four-Tier Architecture

**Version 1.0 · April 2026**
**Companion to:** `spec-v1.2.md`, `data-model.md`, `components.md`

---

## Why four tiers

The current site has two modes: six great legendary pages and ~300 generic-template pages that look like a different site. The gap between them makes the good pages look isolated and the bad pages look worse. Four tiers give every beach a defensible shelf and a consistent design language from top to bottom.

**Rule:** every beach falls in exactly one tier. Tier is declared in `composition.json` (or implied for Tier 3/4). Tier determines treatment, not the other way around.

---

## Tier 1 — Legendary

**What it is:** the canonical page on the internet about a specific beach. Monument-grade. Reference: Nazaré, Copacabana, Brighton, Waikīkī, Bondi.

**Eligibility:** the beach has a **spike** — a single unique legendary fact that justifies monument-grade treatment. The spike is declared in `composition.json` as a short spike_statement (§spec-v1.2 §7). Approximate total: 30–50 beaches globally.

**Page characteristics:**
- Hero with one of 4 archetypes (MONUMENT / SPIKE / LAYERED / ABSENCE)
- 6–10 content sections (excluding hero, quick-facts, sources)
- 5,000–8,500 words
- Full six-lever variation (color, hero, display, motif, photo tone, voice)
- Marginalia for multi-audience content
- Signature motif rendered as section divider (2–5 appearances max)
- Spokes: 2–5 subpages (deep dives, audience guides, anthologies, event-specific)
- Erin Rose byline in footer
- Version-labeled in footer (`v0.x — in editorial development` until done-ness passes, then `v1.0`)

**Section menu (all available; pages use subset):**
STORY · SPIKE DEEP-EXPLAINER · PLACE ANATOMY · DAY-IN-LIFE · TIMELINE · DATA+SCIENCE · COMPARISON · PLAN STACK · CULTURE · HONEST RECKONING · GALLERY · SOURCES

---

## Tier 2 — Featured

**What it is:** a beach notable enough to warrant editorial depth but not a spike-monument. Reference: Glass Beach.

**Eligibility:** the beach has one or more of: distinctive character, rich visual subject matter, strong local-culture story, a specific draw that non-generic readers remember. Approximate total: 500–1,000 beaches.

**Page characteristics:**
- Hero with one of 4 archetypes (same as Tier 1)
- 4–7 content sections
- 1,500–4,000 words
- **Same invariants** as Tier 1 (typography base, grid, neutral palette, component library)
- **Simplified lever set:** primary + supporting color, hero archetype, voice register, photo tone. No signature motif required. No display-pairing variance (uses CLASSICAL by default).
- **No spike statement required.** A one-line *subtitle* under the hero serves the same editorial purpose at lower register.
- **No spokes.** If a Tier 2 beach warrants a subpage, promote it to Tier 1.
- Erin Rose byline in footer
- Version-labeled same as Tier 1

**Section menu (core set, narrower than Tier 1):**
STORY · FEATURE DEEP-EXPLAINER · DATA+SCIENCE · HONEST RECKONING · PLAN STACK · GALLERY · SOURCES

Tier 2 replaces Tier 1's SPIKE DEEP-EXPLAINER with FEATURE DEEP-EXPLAINER — same component, different editorial framing (a feature to describe, not a spike to prove).

**Marginalia:** optional. Use when the beach has genuinely multi-audience content. Many Tier 2 beaches have one audience.

**Photography:** Tier A / Tier B rules apply (same as Tier 1). Honest labeling in the colophon.

---

## Tier 3 — Field Guide

**What it is:** a real catalog page for a beach that doesn't warrant monument treatment but deserves better than a stub. The page beats a Google Maps listing. Reference implementations (built by parallel workstream, April 2026): **Praia de Susolmos** (Galicia, polygon-geom), **Vromólithos** (Greek Aegean, point-geom), **Gio Hải** (Vietnam, tropical typhoon coast).

**Eligibility:** the beach has name + admin region + climate data + at least one photo-able neighbor OR its own polygon geometry. Approximate total: 10,000–30,000 beaches as the enrichment pipeline runs.

**Page characteristics:**
- **~1,500–2,500 words** (predominantly generated from structured data + one hand-curated regional paragraph)
- 10–12 sections, templated (not composed per-beach)
- **Shared component** — all Tier 3 pages render from `<FieldGuidePage data={beach} />`; per-beach variance lives entirely in data
- No voice register — generic neutral tone
- No byline (auto-assembled)
- Visible version-like status through provenance-table confidence tags (verified / computed / predicted) rather than a v0.x / v1.0 label

**Section menu (ordered, conditional on data):**
1. **Field-guide header** — dual-track breadcrumbs (Place / Type), English + local name, editorial subtitle, deterministic sand-swatch SVG generated from Q/F/L mineralogy percentages
2. **Field-guide card** — 8-cell data grid (Type / Size / Tide / Water body / Climate / Access / Airport / Services), every cell tagged with confidence (verified / computed / predicted)
3. **Typical conditions · [current month]** — 4 headline numbers (water temp / air / tide / rain), labelled honestly as climatology
4. **The shape of it** — SVG coastline diagram from OSM polygon vertices (polygon-geom beaches) OR a locator map with bathymetry hint (point-geom beaches). Scale bar + N arrow.
5. **Context · what's around** — up to 4 Commons-geosearch photos of named nearby features (NOT the beach itself, if no image exists — honest about absence)
6. **Setting — [regional geography]** — one paragraph of regional geography, looked up from a ~300-entry `admin_level_1 + coastal_type` table
7. **A year here** — 12-month SVG with water-temp line + rainfall bars + swim-window band
8. **Beaches like this one** — 5 typological siblings from a feature-vector similarity index, each with a deterministic mini-coastline sketch and a similarity bar
9. **Around here** — walking-distance nearby-features list
10. **What we don't know** — specific questions the page wants answered, with a contribution-form CTA (slug pre-filled)
11. **Other beaches on this shoreline** — real 0.17–2 km neighbors from the DB, with "write-up →" indicators where a Tier 1/2 page exists
12. **Where this page comes from** — provenance table, each row tagged with confidence

**Marginalia:** none.

**Photography:** Tier B only. Wikimedia Commons geosearch within 1 km of beach centroid, cached at enrichment time. Honest labelling when the beach itself isn't photographed.

**Enrichment pipeline prerequisites** (established by parallel workstream, April 2026):
- Deterministic sand swatch from Q/F/L percentages — free at scale
- OSM polygon ingest per beach (already in DB for most)
- Commons geosearch-within-1km enrichment pass (cached)
- Regional geography lookup table (~300 entries, `admin_level_1 + coastal_type` keyed)
- Typological-sibling feature vector + FAISS index (one-time ~30 min compute)
- Rule-based type/coastal_type/micro_type classifier (~1 day)
- Open-Meteo Marine + EOT20 serverless endpoints for live conditions (deferred)

---

## Tier 4 — Minimal

**What it is:** a bare geometric entry for a beach that lacks even the Tier-3 eligibility floor — no admin region, no climate, no nearby photos, no polygon geometry, no enrichment at all. Reference: a subset of the long-tail OSM ingests.

**Eligibility:** any beach in the geometry DB that fails Tier 3 eligibility criteria. Default tier for fresh ingestions before enrichment runs.

**Page characteristics:**
- Single-component page. No hero photo (OSM map tile instead).
- 1–2 sections, 100–200 words auto-generated from geometry fields only
- No levers. No byline. No sources section.
- Map + coordinates + country + length (if known) + nearest named place (if resolved)
- `<meta name="robots" content="index,follow">` — still indexed for geographic long-tail queries

**Section menu (fixed):**
MAP · GEO FACTS

**No photos, no editorial, no marginalia, no voice.**

**Purpose:** quality floor. Every beach in the DB has a real URL; Tier 4 is the honest "we don't know much yet" treatment. As the enrichment pipeline runs, Tier 4 beaches get promoted to Tier 3 automatically once they pass the eligibility threshold.

**Promotion to Tier 3 is automatic** when: name resolved + admin region resolved + climate backfilled + at least one photo-able neighbor cached. The enrichment pipeline bumps the beach's render tier on every run.

---

## Tier determination

**Per-beach declaration (Tiers 1 and 2):** `composition.json` declares tier explicitly.

**Implicit (Tiers 3 and 4):** a beach with no composition.json falls to Tier 3 if it has enrichment data, Tier 4 otherwise. The rendering logic checks for a composition.json first and routes accordingly.

**Promotion / demotion:** changing a beach's tier is an editorial decision. Promotion from 2→1 requires a spike statement and a spokes declaration. Demotion from 1→2 requires archiving spokes. No automated tier changes.

---

## Cross-tier invariants

These are **identical** across all four tiers:

- **Typography base:** same serif for body prose, same sans for UI, same scale
- **Color neutrals:** same background, body text, muted text, rule lines
- **Component library:** Tier 1 uses the full set; Tier 2 a subset; Tier 3 a fixed template; Tier 4 a minimal template. All derived from the same primitives.
- **Footer:** identical colophon treatment, identical source attribution patterns
- **Map embed:** same component across tiers where present
- **Image caption style:** same typography and placement rules
- **Accessibility:** WCAG AA across all tiers
- **Performance:** Lighthouse ≥90 across all tiers. Tier 4 pages should be particularly fast (minimal JS).

The point: a reader scrolling from a Tier 1 legendary page to a Tier 4 stub should feel they're on the same publication — thinner content, same publisher.

---

## Tier treatment summary table

| Aspect | Tier 1 Legendary | Tier 2 Featured | Tier 3 Standard | Tier 4 Stub |
|---|---|---|---|---|
| Count target | 30–50 | 500–1,000 | 10,000–30,000 | 200,000+ |
| Word count | 5,000–8,500 | 1,500–4,000 | 500–1,200 | 100–200 |
| Sections | 6–10 | 4–7 | 2–4 (fixed template) | 1 |
| Hero archetypes | 4 | 4 | 1 (standard) | 0 (map) |
| Levers active | 6 | 4 | 0 | 0 |
| Marginalia | required | optional | none | none |
| Motif | required | optional | none | none |
| Spokes | required | none | none | none |
| Byline | Erin Rose | Erin Rose | none | none |
| Spike statement | required | none (subtitle instead) | none | none |
| Photography | Tier A/B curated | Tier A/B curated | Tier B only | none |
| Rendering | per-beach composed | per-beach composed | shared template | minimal template |
| Maintenance | quarterly review | annual review | automated refresh | automated only |

---

## Tier-to-slug mapping at launch

Initial tier assignments (as of lock date):

- **Tier 1:** copacabana-7, brighton-beach-1, waikiki-beach-1, bondi-beach, praia-do-norte-6
- **Tier 2:** glass-beach-4 (reference implementation)
- **Tier 3:** praia-de-susolmos, bromolithos, gio-hai (reference implementations, April 2026). The ~300 beaches with current lens pages migrate to Tier 3 after legendary rebuild. Eligibility threshold: name + admin region + climate + at least one photo-able neighbor or polygon.
- **Tier 4:** all remaining beaches below the Tier 3 eligibility threshold (~200,000+). Auto-promote to Tier 3 as enrichment pipeline runs.

The promotion pipeline for future Tier 1 candidates lives in `docs/next-signature-beaches.md`.

---

*End of tier-system.md v1.0*
