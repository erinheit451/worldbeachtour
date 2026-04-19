# Beach Page Architecture — locked design

> The system for how World Beach Tour renders 227,780 beaches. One canonical URL per beach, tiered rendering density, composable signatures, overflow subpages where warranted.
>
> Decided: 2026-04-19. Replaces earlier ad-hoc patterns (LegendaryBeach + glass-beach bespoke component + generic `[slug]` page + 9 unused lens subroutes).

## The model in one paragraph

Every beach gets a single canonical URL (`/beaches/<slug>`). What renders on that URL depends on the beach's **tier** — a data-driven classification from 0 to 3. The page component is **composable**, not templated: the same system renders Copacabana (monument) and a rural Estonian strand (stub), differing only in which sections populate and how richly. For a small set of beaches, a single lens carries more content than fits comfortably on the main page; those beaches get a **dedicated subpage** (`/beaches/<slug>/<lens>`) with specialist-depth writing. Subpages are overflow for the main page, never duplicates of it. **Topic hubs** (`/sand`, `/surf`, `/travel`) curate editorial destinations that deep-link into the per-beach content.

## The four tiers

| Tier | Count (2026-04-19) | Criteria | Page shape |
|---|---|---|---|
| **T3 — Monument** | 13 in DB / 19 planned | Hand-curated override list (hit-list.md) | Full Legendary treatment: spine + 3-6 bespoke signature components + expanded lens sections + optional subpages on secondary lenses. Hand-written editorial. |
| **T2 — Featured** | 71 | `wikipedia_pageviews ≥ 50K` OR `wikidata+wikipedia+notability ≥ 30` OR `notability ≥ 40` | Spine + **one dominant-lens section** (heavily expanded with MDX) + brief other lenses. May have one subpage on the dominant lens. Haiku-drafted prose, human-reviewed. |
| **T1 — Standard** | 1,046 | `wikidata+notability≥15`, or `wikipedia+pv≥1000`, or `wikidata+photos≥5`, or `notability≥20` | Spine only: map, facts, weather, tides, neighbors, 1-2 auto-generated paragraphs from data. No subpages. No lens expansion unless specific signals fire. |
| **T0 — Stub** | 226,650 | Everything else (OSM-only) | Minimal: map, admin location, facts card, "this beach has limited information — help us enrich" honesty block, list of 5 nearby better-documented beaches. No subpages. |

**Tier assignment is an implementation of `computeTier(beach) → 0-3`**, with explicit hand-override for T3. The hit-list is the canonical override source. T1/T2 are computed. T0 is the default.

## The page component architecture

One component: `BeachPage`. Composable from smaller pieces. Never a god-component.

```
<BeachPage slug={slug}>
  ├── <Hero>                        (always)
  ├── <QuickDecision>               (T1+)
  ├── <Story>                       (T1+, density scales with tier)
  ├── <SignatureSlot[]>             (T3 only — bespoke per-beach)
  ├── <ZonesSection>                (T2+ if data present)
  ├── <DayInTime>                   (T2+)
  ├── <Timeline>                    (T2+ if timeline[] length ≥ 3)
  ├── <LensSection dominant>        (T2+ — the dominant lens gets the biggest block)
  ├── <LensSection secondary[]>     (T2+ — other lenses get brief blocks with read-more links to subpages if present)
  ├── <Calendar>                    (T1+ if climate populated)
  ├── <Water>                       (T2+)
  ├── <Planner>                     (T2+)
  ├── <Safety>                      (T2+)
  ├── <ViewBack>                    (T3)
  ├── <HonestContext>               (T3)
  └── <Sources>                     (always — even T0 says where the map came from)
</BeachPage>
```

**Composition rule:** each section is a real component. Sections decide their own render density based on what data is available. `BeachPage` is a ~150-line shell that decides *which* sections appear based on tier + data. Individual section components can be 50 lines or 500 lines — that's their problem.

**Signature slots are the flexibility valve for T3.** A T3 beach's `page.tsx` explicitly composes its signatures. Copacabana passes `[CopaCalcadao, CopaAterro, CopaMusic]`. Glass Beach passes `[GlassGeology, GlassHistory, GlassErosion]`. The shell is the same; the signatures are bespoke components. **This is how you absorb different versions of legendary pages.** New T3 → write 2-4 new signature components, pass them in. No framework changes.

### What this does to existing code

- `components/showcase/legendary-beach.tsx` (1448 lines) → refactored to be the T3-density version of `BeachPage`, with the signature array passed in as prop (mostly already works this way)
- `app/beaches/[slug]/page.tsx` (generic lens-summary page) → deleted, replaced by `BeachPage` at T1 density
- `app/beaches/glass-beach-4/page.tsx` + `components/showcase/glass-beach.tsx` → refactored into `BeachPage` with sand as dominant lens + sand-specific signature components
- 9 `app/beaches/[slug]/<lens>/page.tsx` stubs → **kept but only render when a dedicated subpage exists** (dominant-lens has MDX ≥ 300 words AND beach is T2 or T3)

## Subpage policy — locked rules

Subpages (`/beaches/<slug>/<lens>`) exist to deliver **overflow depth** on a specific lens when it exceeds what fits on the main page.

1. **Rule 1 — overflow, not duplicate.** Subpage MDX is the canonical source for that lens's long-form content. Main-page lens section displays a rendered excerpt (first 150-200 words) with "Read more →" link. Never maintain two copies.
2. **Rule 2 — earned, not automatic.** A subpage only exists when its content is ≥2× the length of the main-page section would be. If Sand at a given beach can be said in 200 words, no subpage.
3. **Rule 3 — dominant-lens paradox.** If a beach's `dominant_lens` is the ONLY thing it's known for (Glass Beach = sand), the main page IS the lens essay. No separate `/sand` subpage. Subpages are for beaches where a secondary lens has its own depth (Copa's surf — secondary because Copa is a culture beach, not a surf beach).
4. **Rule 4 — canonical always points to main.** `rel=canonical` on every subpage points to the main beach URL. Main page is the thing Google ranks.
5. **Rule 5 — hub linking preference.** Sand Hub / Surf Hub / Travel Hub link to `/beaches/<slug>` (main), not to subpages. If the dominant lens is sand and Glass Beach has no /sand subpage, the link still works. If Copa has a /surf subpage, users who want surf depth click through the in-page read-more, not from the hub directly.
6. **Rule 6 — T1 and T0 never have subpages.** The infrastructure stays but the routes 404 for anything below T2.
7. **Rule 7 — voice.** Subpage prose has to match the main page's voice. Same hand-touched editorial quality. Haiku drafts, humans ship.

## Topic hubs

Already built: `/sand` (20 curated entries). Remaining: `/surf`, `/travel`. Each hub:

- Has its own editorial POV and long-form intro
- Curates 30-80 beaches at launch
- Data structure: `site/data/<hub>_hub.json` (per the sand_hub.json template)
- Links to `/beaches/<slug>` (canonical)
- The hub is the destination for users who entered via search for "best surf beaches" or "pink sand beaches" — it's the answer to a topic question, not a list of beach pages

**Hub primacy question deferred.** For now, hubs are secondary to per-beach pages. If they grow into primary destinations later, no architecture change needed.

## URL canonicalization

| URL | Status | Canonical |
|---|---|---|
| `/beaches/<slug>` | Primary | self |
| `/beaches/<slug>/<lens>` | Secondary, where exists | `/beaches/<slug>` |
| `/sand`, `/surf`, `/travel` | Primary for topic | self |
| `/sand/<slug>` | Legacy | redirect to `/beaches/<slug>#sand` OR `/beaches/<slug>/sand` if subpage exists |
| `/regions/...` | Secondary discovery | self |

Tier changes never break URLs. Content presence inside a beach page changes; canonical URL stays stable.

## Content pipeline — who writes what

```
                        source of truth         render target
                        ───────────────         ─────────────
DB enrichment data   →  data/beaches/<slug>.json  →  facts on all pages
Tier + meta          →  content/beaches/<slug>/meta.json  →  routing + dominant_lens
T3 signatures        →  content/beaches/<slug>/showcase.json  →  bespoke sections
T2 lens prose        →  content/beaches/<slug>/<lens>.mdx  →  dominant section + subpage body
Hub curation         →  data/<hub>_hub.json  →  hub pages
Images               →  content/beaches/<slug>/meta.json (attribution) + site/public/<slug>/ (files)  →  every page
```

**Pipeline rule:** pipeline scripts write to `data/` only. `content/` is editorial territory. If a pipeline wants to propose content for a beach, it writes into `data/<beach>_pipeline_suggestions.json` — human reviews and copies into `content/`.

## Migration order

The locked execution order. Each step is independent; don't parallelize until the previous finishes.

### Phase 0 — Immediate (does not depend on Legendary redesign)

1. **Lock tier thresholds** in code — port `computeTier` from the analysis script into `site/lib/tier.ts`. Generates tier for every beach at build time. ~30 min.
2. **Add `dominant_lens` field to meta.json schema** and migrate existing 304 files (default: `"travel"` for existing; hand-assign for T3/T2). Script + 15 min review per T2. ~2 hours total.
3. **Delete 9 lens subroute stubs** (`app/beaches/[slug]/<lens>/page.tsx`) and **replace with a single dynamic `[lens]/page.tsx` that 404s unless beach.tier ≥ 2 AND lens MDX ≥ 300 words**. ~1 hour.
4. **Write the architecture doc** — this one. Done.

### Phase 1 — Pilot T2 (validates the whole model)

5. **Pick one T2 beach, build it fully.** Recommend **Whitehaven Beach** (AU, sand-dominant, high photogenic signal). Build:
   - Full main page at T2 density using current components (no `BeachPage` refactor yet)
   - Dominant-lens sand section with rich MDX
   - Decide: does it need a `/whitehaven-beach/sand` subpage? Probably yes.
   - Cross-link from Sand Hub
   - Target: 1 day of work including photo sourcing
6. **Measure:** does it feel earned? Does the subpage deliver ≥2× depth? How long did it take?

### Phase 2 — Refactor (only after Legendary design is stable)

7. **Unify into `BeachPage`.** Refactor `LegendaryBeach` to accept tier prop. Fold Glass Beach's bespoke component in. Delete the generic `[slug]/page.tsx`. Replace with tier-driven `BeachPage`.
8. **T0 stub renderer.** The 226K honest-minimal page. One component, ~80 lines.
9. **Build Surf Hub.** Copy sand_hub structure, 40-60 curated.
10. **Build Travel Hub.** 50-80 curated.

### Phase 3 — Content at scale

11. T2 MDX generation via Haiku subagents, human review per dominant lens.
12. T3 backlog — Maya Bay, Omaha, Pipeline, remaining hit-list items.
13. Seed the 6 missing T3s into DB (banzai-pipeline, teahupo'o already done, still need sipadan, anse-source-d-argent, whitehaven-beach, maya-bay, cannon-beach, jeffreys-bay, tulum-beach).

## Pre-mortem risks (tracked)

Unresolved risks carried from the pre-mortem, with owner and target resolution:

| Risk | Status | Owner |
|---|---|---|
| Haiku-slop at T2 scale | Mitigated by rule 7 (human review always). Validate in Phase 1 pilot. | pipeline |
| Refactor-during-iteration | Phase 2 explicitly deferred until Legendary design is stable | sequencing |
| Hub graveyard | Deferred decision — hubs secondary for now | product |
| SEO canonical split | Rule 4 resolves | done |
| Tier-promotion URL breaks | Rule 5 + stable URLs | done |
| Subpage feels thin | Rule 2 (≥2× main-page content) | editorial |
| Dominant-lens paradox | Rule 3 resolves | done |

## Open decisions — for Erin

The items that block Phase 0+ and can only be answered by you:

1. **Is the Legendary page design still in flux?** If yes, Phase 2 defers indefinitely. Phase 0+1 proceed. If no, Phase 2 can start after Phase 1 pilot.
2. **Is Whitehaven Beach the right Phase 1 pilot,** or would you prefer Maya Bay / Navagio / Reynisfjara? Whitehaven is recommended because sand-dominant + we already have Sand Hub infrastructure to cross-link.
3. **For the 226,650 T0 stubs: should they be published at all,** or should we block the long tail from Google indexing (robots.txt or `noindex` until we have more to say)? Two defensible answers. My preference: publish, but `noindex` until content improves. The URL exists (someone might link to it), but it doesn't compete for rankings.
4. **Do we keep `site/public/nazare/*.meta.json` sidecar files** (the attribution metadata from my Commons download scripts)? Safer to keep as documentation of provenance; harmless if not referenced.

## What this doc isn't

- Not the Legendary page DESIGN. This is the architecture the design lives inside. You iterate the design; the architecture absorbs it.
- Not the content plan. The hit-list is the content plan.
- Not the hub curation strategy. Each hub gets its own content plan when it's built.

## Reference files

- Hit-list: `docs/hit-list.md`, `docs/hit-list-crosscheck.md`, `docs/hit-list-longlist.md`
- Legendary playbook: `docs/legendary-beach-playbook.md`
- Current LegendaryBeach component: `site/components/showcase/legendary-beach.tsx` (1448 lines)
- Sand Hub: `site/app/sand/page.tsx` + `site/data/sand_hub.json`
- Copa /surf subpage (the subpage pattern reference): `site/app/beaches/copacabana-7/surf/page.tsx`
