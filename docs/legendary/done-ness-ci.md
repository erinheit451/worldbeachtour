# World Beach Tour — Done-ness CI

**Version 1.0 · April 2026**
**Companion to:** `data-model.md` §9, `spec-v1.2.md` §3

Concrete specification for `scripts/lint-pages.ts` — the build-time validator that enforces the data model's invariants, catches editorial drift, and manages each page's public version label.

---

## What it does

Run on every `npm run build` before Next.js compilation. Walks `site/content/beaches/*/composition.json` and:

1. Validates each composition file against the schema.
2. Reads paired `showcase.json`, `meta.json`, any MDX files.
3. Runs the check list below.
4. Emits one of three outcomes per page:
   - **Clean (pass v1.0):** no changes; page stays at its declared version.
   - **Editorial warning:** page's declared version is auto-downgraded to `v0.<next-lower>` in the built output (footer label reflects this). Build succeeds.
   - **Schema failure:** build fails. Fix required.

The page's `composition.json` is **not rewritten**; the downgrade is applied at render-time via a parallel build artifact (`out/.done-ness.json`) that the footer component reads.

---

## Check list (runs in order; first schema failure aborts)

### Tier 1 — Schema / blocking

These fail the build.

| # | Check | How |
|---|---|---|
| S1 | composition.json valid JSON | `JSON.parse` |
| S2 | `slug` matches directory name | string equality |
| S3 | `slug` exists in `site/data/beaches/<slug>.json` | file existence |
| S4 | `tier` ∈ {1, 2} | value check |
| S5 | `levers.primary_color` + `levers.supporting_color` are 6-digit hex | regex `^#[0-9A-Fa-f]{6}$` |
| S6 | `levers.hero_type` ∈ {MONUMENT, SPIKE, LAYERED, ABSENCE} | value check |
| S7 | `levers.display_pairing` ∈ {CLASSICAL, AUSTERE, VERNACULAR} | value check |
| S8 | `levers.voice_register` ∈ {CLINICAL, REVERENT, ROMANTIC, SEVERE, WRY} | value check |
| S9 | `version` matches `^\d+\.\d+$` | regex |
| S10 | `sections` is non-empty array of strings | type check |
| S11 | Every `sections[]` id is a valid section id | registry lookup |
| S12 | Tier 1: `hero`, `quick_facts`, `story`, `spike_deep_explainer`, `sources` all in sections | subset check |
| S13 | Tier 2: `hero`, `quick_facts`, `story`, `sources` all in sections | subset check |
| S14 | Tier 1: content-section count (sections minus hero/quick_facts/sources) ∈ [6..10] | count |
| S15 | Tier 2: content-section count ∈ [3..7] | count |
| S16 | Tier 1: `spike_statement` present, 1..160 chars, ends with period | string checks |
| S17 | Tier 2: `subtitle` present, 1..120 chars | string checks |
| S18 | Tier 1: `spokes` non-empty; each spoke has `slug` + `type` + `type` ∈ valid-spoke-types | structure check |
| S19 | Tier 2: `spokes` absent or empty | structure check |
| S20 | `meta.json` exists and parses | file + JSON |
| S21 | `meta.json.images.hero` present with `url`, `title`, `license`, `width`, `height`, `tier` ∈ {A, B} | structure check |
| S22 | Every MDX file referenced (intro.mdx / spike.mdx / etc.) parses without error | MDX compile |
| S23 | Every `<MarginNote audience="X">` uses X from the fixed 11-value taxonomy | AST walk |
| S24 | `byline` present on Tier 1 and Tier 2 pages | string check |

### Tier 2 — Editorial / warning-and-downgrade

These log warnings, do not fail the build, but downgrade the page's public version label.

| # | Check | Downgrade |
|---|---|---|
| E1 | Tier 1 word count in `intro.mdx` + `spike.mdx` + other MDX + `showcase.json` prose fields ∈ [5000..8500] | v1.0 → v0.9 if out of band |
| E2 | Tier 2 word count ∈ [1500..4000] | v1.0 → v0.9 if out of band |
| E3 | Tier 1 SPIKE DEEP-EXPLAINER section exists and has ≥ 800 words | v1.0 → v0.9 |
| E4 | Every `image_role` reference in `showcase.json` resolves to a key in `meta.json.images.section` | v1.0 → v0.9 per unresolved |
| E5 | Tier 1: `motif.svg` file exists at `levers.motif_path` | v1.0 → v0.9 |
| E6 | `<Figure>` components all have non-empty `alt` (explicit `alt=""` allowed for decorative) | v1.0 → v0.9 per violation |
| E7 | No `<MarginNote>` exceeds 80 words (soft warn at 60) | v1.0 → v0.9 if >80 |
| E8 | No paragraph is referenced by more than 3 margin notes | v1.0 → v0.9 |
| E9 | Tier 1: `SectionDivider` usage count ≤ 5 across the page | v1.0 → v0.9 |
| E10 | Sources section exists and `citations` array is non-empty where `<Citation>` appears in prose | v1.0 → v0.9 |
| E11 | `photography_grading_status` declared in composition (`tier_a_commissioned` / `tier_b_only` / `hybrid`) | v1.0 → v0.9 if absent |
| E12 | Every Tier A image has a grading tone that matches `levers.photo_tone` | v1.0 → v0.9 per mismatch |

### Tier 3 — Informational (logged but no impact)

| # | Check |
|---|---|
| I1 | Accent-color contrast against `#FAFAF7` passes WCAG AA (informational unless failing) |
| I2 | Hero image native dimensions ≥ 2000 px wide |
| I3 | Nav group of `StickyNav` contains section ids that match rendered sections |
| I4 | No duplicate section ids in `sections` array |

---

## Version-label logic

Each page has a declared version in `composition.json.version`. At build time:

```
final_version = declared_version
if any E-level check fires:
    final_version = declared_version with 0.x patch number reduced by 1 per warning family, minimum 0.1
```

The footer component reads `out/.done-ness.json` (build-time artifact) and renders the final_version, not the declared version. This turns editorial warnings into a public honesty signal without requiring manual file edits.

A page cannot reach public "v1.0" unless ALL E-level checks pass.

---

## Output format

`lint-pages.ts` produces:

1. **Console output** (color-coded):
   ```
   🔍 Linting legendary pages...

   ✓ praia-do-norte-6            v0.7 declared → v0.7 final   (13 checks clean)
   ⚠ copacabana-7                v0.9 declared → v0.8 final   (2 warnings)
       E1 word count 9241 exceeds [5000..8500] band
       E4 image_role "palace_1923" not in meta.json.images.section

   ✗ brighton-beach-1            SCHEMA FAILURE
       S23 <MarginNote audience="tourist"> not in fixed taxonomy

   Summary: 1 passed, 1 warned, 1 failed
   ```

2. **Build artifact** at `site/.next/done-ness.json`:
   ```json
   {
     "generated_at": "2026-04-19T23:15:00Z",
     "pages": {
       "copacabana-7": {
         "declared_version": "0.9",
         "final_version": "0.8",
         "warnings": ["E1: word count 9241 exceeds 5000–8500", "E4: image_role palace_1923 unresolved"],
         "clean": false
       },
       ...
     }
   }
   ```

The Sources component reads this artifact and renders the final_version.

3. **Exit code:**
   - `0` if all pages are Clean or Warned
   - `1` if any page has a Schema Failure (build stops)

---

## Running

### Locally
```bash
npm run lint:pages
```
Added to `package.json` scripts. Runs before `next build` via pre-hook.

### CI
Same command. Build fails on schema errors; warnings surface in CI logs but do not block merge.

### Manually (dev iteration)
```bash
node_modules/.bin/tsx scripts/lint-pages.ts --slug=praia-do-norte-6 --verbose
```

Filters to a single beach; shows all checks with pass/fail detail.

---

## Adding a new check

1. Decide tier: schema (blocking), editorial (warning), informational (logged).
2. Give it an id: `S25` / `E13` / `I5`.
3. Add entry to the registry in `scripts/lint-pages.ts`.
4. Write a function: `(composition, showcase, meta, mdxFiles) => CheckResult`.
5. Add to this doc.
6. Bump this doc's version.

---

## What this doesn't do

- **Does not edit files.** Ever. Composition files remain hand-authored.
- **Does not judge prose quality.** Voice register consistency, sourcing adequacy, "would a Carioca nod" — these are human editorial checks.
- **Does not validate the DB.** The pipeline enrichment has its own tests.
- **Does not run visual regression.** That's a separate Percy/Playwright step, not a content check.

---

*End of done-ness-ci.md v1.0*
