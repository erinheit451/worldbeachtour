# World Beach Tour — Legendary Page Design System

**Version 1.2 · April 2026**
**Reads alongside:** `tier-system.md`, `data-model.md`, `components.md` (pending), `marginalia.md` (pending)

This version integrates v1.1 with the April 2026 decisions (scaffold fork, 4-tier architecture, hybrid photography, Erin Rose byline, Glass Beach → Tier 2, six locked-in beach axes) and fixes the gaps identified in v1.1's implementation critique.

---

## 1. What changed from v1.1 — summary

**Strategic decisions locked:**
- **Four tiers, not two.** Legendary / Featured / Standard / Stub. Entire site inherits the same typography, grid, and neutral palette; per-tier treatment diverges in section menu, word budget, and component richness. See `tier-system.md`.
- **Fork, don't parameterize.** The existing `<LegendaryBeach>` scaffold stays in place powering current pages; Nazaré v1.0 is built in a new `<LegendaryBeachV2>` (or freshly-named) component. Old scaffold retires after all legendary pages migrate.
- **Photography is hybrid, honestly labelled.** Tier A (editorial-graded, commissioned or licensed) is aspirational; Tier B (archival, Wikimedia, period-original) is the current-state reality. Every page's colophon names which tier its images come from. Budget for Tier A commissioning is a future decision.
- **Editorial review = Erin + Claude.** Two-reviewer loop. Automated done-ness CI (§3 below) handles structural checks; humans handle voice and taste.
- **Erin Rose byline** in the footer of every Tier 1 and Tier 2 page.
- **Glass Beach → Tier 2.** Not legendary; reference implementation for Tier 2 alongside Nazaré's Tier 1 reference.

**Gap fixes:**
- **Spike vs. page scope clarified.** Spike = narrow legendary fact. Page = wider (covers more threads). The SPIKE DEEP-EXPLAINER section addresses the spike; other sections serve other threads. Done-ness test revised: *"The spike gets the biggest share of real estate after the hero, and the page has a convincing answer to why this is legendary."* Not: *"every section serves the spike statement."*
- **Brighton added** to migration order (§8).
- **Two gates before full propagation**, not one. Nazaré v1.0 + rebuilt Copa v1.0 both pass sibling-drift audit before Waikīkī / Bondi / etc. See §8.
- **Automated done-ness testing spec** (§3) — structural checks lint at build; editorial checks logged as warnings that bump public version label (v1.0 → v0.9).
- **Technical gaps addressed** in companion docs: `data-model.md` (folder layout, schemas, binding rules), `tier-system.md` (four-tier treatment), `components.md` + `marginalia.md` (prop contracts, rendering).

---

## 2. Locked beach axes (the six levers per beach)

| Beach | Tier | Spike / subtitle | Primary | Supporting | Hero | Display | Voice |
|---|---|---|---|---|---|---|---|
| **Copacabana** | 1 | *The beach the world pictures when it pictures a beach.* | `#1A1A1A` | `#F4F1EC` | MONUMENT | CLASSICAL | ROMANTIC |
| **Brighton** | 1 | *Two Victorian piers: one working, one a burnt skeleton in the sea.* | `#3A4E5C` | `#8B5A3C` | LAYERED | CLASSICAL | WRY |
| **Waikīkī** | 1 | *The two miles of Pacific sand where modern surfing was reintroduced to the world.* | `#E8B4B8` | `#1E5F74` | LAYERED | CLASSICAL | REVERENT |
| **Bondi** | 1 | *The beach Australian surf lifesaving was born on.* | `#D9B66B` | `#0D3B5C` | MONUMENT | AUSTERE | WRY |
| **Nazaré** | 1 | *A submarine canyon produces the world's largest surfable wave.* | `#2B3E50` | `#D4A574` | SPIKE | AUSTERE | SEVERE |
| **Glass Beach** | 2 | *Sand of rounded gemstone-coloured sea glass.* | `#4A7B6A` | `#C5885B` | ABSENCE | AUSTERE | CLINICAL |

All six are locked in `composition.json` files. The Waikīkī motif's kapa-inspired pattern requires cultural clearance before build.

---

## 3. Automated done-ness CI

Every build runs a done-ness linter against each composition.json and its paired content. See `data-model.md` §9 for the full checklist. Key behaviours:

- **Schema failures** (invalid JSON, missing required fields, malformed hex) **block the build**.
- **Editorial failures** (word count under/over tier band, orphaned image roles, word-count under section target) **log warnings and auto-downgrade the page's visible version label** from v1.0 to v0.9. This turns soft failures into public promises of unfinished work.
- **A page ships** when the linter passes at v1.0 level AND Erin + Claude review has signed off in a sibling `reviews.md` file.

The linter source lives at `scripts/lint-pages.ts` and runs as part of `npm run build`.

---

## 4. Spike vs. page scope (clarified from v1.1)

**Spike** is a narrow legendary fact. Brighton's spike is *two piers, one working, one a ruin*. The page also covers: the Royal Pavilion, Mods/Rockers 1964, Graham Greene, Kemptown, the Great Storm of 1987, ABBA at the Dome. These are **other threads** the page carries. They are not violations of the spike; they are the beach.

**Done-ness rule (revised from v1.1):**
- The SPIKE DEEP-EXPLAINER section gets the biggest content share after the hero
- The spike statement appears as the first pull-quote on the page
- The page contains a convincing answer to *why this beach is legendary*
- Other threads may occupy any remaining sections

**The old v1.1 rule** that "every section must serve the spike statement" was too strict and led me to write over-narrow spike statements. It is withdrawn.

---

## 5. The six per-beach levers (unchanged from v1.1 — see full spec there)

1. **Accent palette** — `primary_color` + `supporting_color`
2. **Hero treatment** — MONUMENT / SPIKE / LAYERED / ABSENCE
3. **Display typography pairing** — CLASSICAL / AUSTERE / VERNACULAR
4. **Signature motif** — SVG unique to the beach
5. **Photographic tone** — named tone + Tier A/B split
6. **Voice register** — CLINICAL / REVERENT / ROMANTIC / SEVERE / WRY

---

## 6. Section library (unchanged from v1.1 — see full spec there, plus Tier 2 FEATURE DEEP-EXPLAINER as alias)

---

## 7. Body / sidebar split, marginalia, signature motif (unchanged from v1.1)

---

## 8. Build order (revised)

Two gates before full propagation. Brighton was missing from v1.1.

1. Finalize the six beach axes. **Done.** (§2 above.)
2. Remove lens system from legendary pages only. Archive MDX files to `/archive/lenses/` per-beach for potential spoke reuse.
3. Implement the constant system: grid, typography, component library (see `components.md`), conditional rendering, sidebar, marginalia (see `marginalia.md`), two-tier photography treatment, version labeling, done-ness CI.
4. **Build Nazaré v1.0** as the Tier 1 reference implementation. Fresh `<LegendaryBeachV2>` component. Reading composition.json, showcase.json, meta.json, MDX files per the data model.
5. **Build three Nazaré spokes** (one each of: deep_dive, audience_guide, anthology) as the spoke reference.
6. **Build Glass Beach v1.0** as the Tier 2 reference implementation. Validates that Tier 2 inherits the invariants cleanly.
7. **Gate 1: Nazaré sibling-drift audit.** Place Nazaré v1.0 beside the current Copa page. Run the sibling test honestly.
8. **Rebuild Copa v1.0** using the same components. Migrate its showcase data to the new data model.
9. **Gate 2: two-legendary-pages sibling-drift audit.** Place Nazaré v1.0 and Copa v1.0 side by side at full size. If they don't feel like siblings, tighten invariants / reduce levers / fix the constant system. Document spec adjustments as v1.3 if needed.
10. After Gate 2 passes, build Brighton v1.0, Waikīkī v1.0, Bondi v1.0 in parallel.
11. Retire the old `<LegendaryBeach>` scaffold once all five legendary pages are migrated.
12. **Tier 2 propagation.** After Glass Beach v1.0 ships, queue 3–5 additional Tier 2 beaches as second-wave validation.
13. **Tier 3 template build.** Spec + build a shared Tier 3 component. Migrate the ~300 current generic pages. Target: every current lens-template page reaches Tier 3 quality.
14. **Tier 4 template build.** Minimal stub template for the long tail.

---

## 9. Migration of existing pages

Per `data-model.md` §10. Every existing beach goes through the same steps:
1. composition.json written and validated
2. Showcase data moved to sidecar showcase.json (pipeline-proof)
3. Long prose extracted to MDX where appropriate
4. Marginalia added
5. Tier A/B labels on every image
6. Motif.svg created (Tier 1 only)
7. Done-ness CI passes
8. Version bumped to v1.0

Pages display their current version in the footer throughout migration. `v0.x — in editorial development toward v1.0` is the honest-during-migration label.

---

## 10. Decisions deferred (unchanged from v1.1, minor updates)

- **Editorial scores** — still deferred
- **Named editor bylines** — decided: Erin Rose
- **Photography commissioning budget** — future decision; Tier A is aspirational for now
- **Community corrections layer** — out of scope
- **Localization** — out of scope for v1.2; design tokens respect direction-agnostic layouts
- **Phase 2/3 lens decisions** — Phase 1 (legendary lens removal) happens in step 2 of §8 above; Phase 2 (Tier 3 template) handled in step 13
- **Cultural clearance for Waikīkī motif** — required before Waikīkī v1.0 ships

---

## 11. Change management

Spec changes require:
- Documented decision + rationale in changelog
- Check that existing pages don't silently break
- Version bump

Verbal "just do X" instructions to Claude Code are local to a single page. System changes happen in this doc.

---

## 12. Changelog

- **v1.2 (2026-04-19):** Four-tier architecture. Fork scaffold strategy. Hybrid photography with honest labeling. Erin Rose byline locked. Six beach axes locked and condensed to factual spike statements (not narrative-pull-quote-ish). Spike-vs-page-scope clarified — withdrew v1.1's "every section serves the spike" rule. Two sibling-drift gates instead of one. Brighton added to migration order. Glass Beach → Tier 2. Automated done-ness CI spec added. Three companion docs named (tier-system, data-model, components + marginalia pending).
- **v1.1 (2026-04-19):** Added spike_statement, day-in-life rule, photography tiers, voice register lever, version labeling, section count ceiling, spoke schema, migration rules, sibling-drift gate.
- **v1.0 (2026-04-19):** Initial spec.

---

*End of spec v1.2*
