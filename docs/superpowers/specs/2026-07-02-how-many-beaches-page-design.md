# Design: "How Many Beaches Are There in the World?" — authoritative answer page

**Date:** 2026-07-02
**Status:** Draft for review (brainstorming gate — do NOT implement until approved)
**Author:** Claude (with Erin)

## 1. Goal

Own the query **"how many beaches are there in the world?"** as the single most
authoritative, most citable answer on the internet — quotable by both people and
LLMs. The page's authority comes from one fact no competitor has: World Beach
Tour holds the only cross-referenced, de-duplicated global beach database
(**228,612** beaches, 249 countries), married from six independent sources.

**Why we can win:** Google currently surfaces an unsourced "at least 300,000"
from a travel blog (Beachfarer), inferred from "31% of coastline is sandy" — it
is not a count of beaches and has no provenance. Every genuinely authoritative
source counts a *different subset*:

| Source | What it measures | Number | As of |
|---|---|---|---|
| OpenStreetMap `natural=beach` | Crowd-mapped beach *features* (split segments inflate this) | ~246,801 objects | live (taginfo) |
| **World Beach Tour** | **Unique beaches after cross-source dedup** | **228,612** | 2026 build |
| EU bathing waters (EEA) | Officially *designated* EU bathing sites (~⅔ coastal) | 21,848 | 2024 season |
| US EPA BEACON | US *monitored* coastal & Great Lakes beaches | 6,000+ | 2023 |
| Blue Flag | *Certified* clean/safe beaches | 4,323 | 2025 |
| Luijendijk et al. 2018 | % of ice-free shoreline that is sandy (not a count) | 31% | 2018 |

Our 228,612 is the only number that *reconciles* these. It is lower than raw OSM
(we de-dup split segments and merge cross-source duplicates) and higher than any
single registry (we merge all of them). The page's job is to **show that
reconciliation**, not assert one more orphan number.

## 2. Placement & URL

- **URL:** `/how-many-beaches-in-the-world` (exact-match the query; clean, stable).
- **Route type:** a static top-level `app/how-many-beaches-in-the-world/page.tsx`
  (Server Component; may read the live DB counts at build like the other pages).
- **Internal links:** link to it from the homepage ("228,612 beaches" stat) and
  from `/beaches` and `/regions`; link *out* to `/regions` (country breakdown),
  `/sand` (substrate/what-counts-as-a-beach), and relevant beach pages. Add to
  the sitemap (automatic — it's a route) and IndexNow ping on publish.
- **Cluster seed (future, out of scope now):** this page is the hub for a small
  "beach facts" cluster whose spokes are the PAA questions (longest beach, most
  beaches by country, US beach count, sandy %). Not built in this pass.

## 3. Page structure (sections, in order)

1. **Direct answer (above the fold).**
   - `<h1>` = "How many beaches are there in the world?"
   - First sentence = the ~45-word direct answer with the number in bold, a range,
     and a "because" clause. Self-contained so it reads true quoted in isolation.
   - Draft shape (final copy in implementation): *"There is no single official
     count — it depends on what you count as a beach. The most complete
     cross-referenced database identifies **228,612** distinct beaches across 249
     countries. Estimates range from ~4,300 certified beaches to ~247,000 mapped
     coastal features, depending on definition."*

2. **The comparison table** (the §1 table, rendered on-page). This is the block
   LLMs and featured snippets lift. Every row cited inline.

3. **Why there's no single answer** (the definitional spine — what Erin asked for).
   Three sub-parts, each a "tier"/lens of counting:
   - **What counts as a beach?** Sand vs shingle/pebble; named vs unnamed;
     ocean vs lake/river. (Ties to `/sand`.)
   - **Where does one beach end and the next begin?** The coastline paradox —
     one arc of sand vs many segments (why OSM shows ~247k features). Longest-beach
     ambiguity (Praia do Cassino 212–254 km).
   - **Beaches move.** Tidal/seasonal/erosion — 24% of sandy beaches eroding,
     28% accreting (Luijendijk). An honest answer is a *range anchored to a
     definition*, not a decimal.

4. **The tiers of "how many"** (the backbone, as an explicit ladder). From
   narrowest to broadest, each with a real number and what it excludes:
   certified (4,323) → designated/monitored (EU 21,848 / US 6,000+) → named
   (GeoNames/Wikidata subset) → **all mapped & de-duplicated (our 228,612)** →
   physically, effectively uncountable (31%-sandy coastline).

5. **How we got to 228,612 (methodology = the moat).** Plain-language: six
   sources (OSM/Overture, EU bathing register, EPA BEACON, Wikidata, GeoNames,
   Blue Flag) → spatial (500 m) + fuzzy-name dedup in `dedup/matcher.py` →
   unique beaches. State it honestly as "the most comprehensive count assembled,"
   not "the definitive number of beaches on Earth."

6. **Related questions (FAQ).** 6–10 PAA-style Q&As, each a concise sourced
   answer (country with most beaches → Australia ~11,761; longest → Praia do
   Cassino; US → 6,000+ monitored; sandy % → 31%; Blue Flag → 4,323; etc.).
   Doubles as FAQPage schema and internal-link anchors to future spokes.

7. **Sources.** Visible citation list (EEA, EPA, Blue Flag, OSM taginfo,
   Luijendijk 2018 / Nature Sci Reports, NASA Earth Observatory). Visible cites
   are an E-E-A-T and LLM-trust signal.

## 4. Structured data (JSON-LD)

- **FAQPage** — from the §6 Q&As (PAA capture / rich result).
- **Article** (or **Dataset**) — headline, author/publisher = World Beach Tour
  Organization (reuse the sitewide `@id`), datePublished/dateModified.
- **BreadcrumbList** — Home → (Reference?) → this page.
- Reuse the existing `Organization`/`WebSite` sitewide graph via `@id` refs.

## 5. On-page SEO

- `<title>`: "How Many Beaches Are There in the World? (228,612, and why it's
  complicated)" — direct, number-forward, honest.
- Meta description: the direct answer, ~155 chars.
- `alternates.canonical`: `/how-many-beaches-in-the-world`.
- OpenGraph/Twitter: title + description (image is a separate gap — see §7).
- Semantic HTML: one `<h1>`, `<h2>` per section, a real `<table>`, an FAQ list.

## 6. Voice & integrity (non-negotiable)

- Anti-AI-slop honest voice (house style): no "nestled," no "hidden gem," no
  filler. Lead with the answer. Admit the uncertainty — that admission *is* the
  authority here.
- **Every number cited to a primary source, inline.** This is a
  Your-Money-or-Your-Life-adjacent factual page; a wrong number kills the trust
  play. See §8.

## 7. Known gaps / follow-ups (not blocking)

- No sitewide OpenGraph/social image or Organization logo asset exists; this page
  (and the site) would benefit from an OG image. Flagged separately.

## 8. Verification required BEFORE publish (evidence-before-done)

The research brief flagged these as inferred or drifting — verify live and cite
the checked value:
- [ ] Re-pull OSM `natural=beach` taginfo count near publish (was 246,801 on
      2026-07-02; drifts daily).
- [ ] Confirm the live US Featured Snippet text + actual People-Also-Ask
      questions in an incognito SERP (research inferred these).
- [ ] Confirm Blue Flag season total (4,323 = 2025; check 2026 N. Hemisphere if
      publishing mid/late 2026).
- [ ] Confirm the exact `228,612` against the current DB/site constant and that
      the methodology description matches `dedup/matcher.py` (6 sources, 500 m +
      0.75 fuzzy).
- [ ] Spot-check EEA 21,848, EPA 6,000+, Luijendijk 31% against the cited pages.

## 9. Out of scope (YAGNI)

- Building the PAA spokes as separate pages (this is the hub only).
- OG image generation.
- Any change to the beach/region/sand routes beyond linking in.

## 10. Success criteria

- Page live, in sitemap, IndexNow-pinged.
- Passes Rich Results test for FAQPage.
- Direct answer is self-contained and quotable; every number cited.
- Over time: ranks for "how many beaches are there in the world" and is cited by
  AI answer engines as the source of the 228,612 figure.
