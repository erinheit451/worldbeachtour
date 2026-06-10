# World Beach Tour — Data Model

**Version 1.0 · April 2026**
**Companion to:** `spec-v1.2.md`, `tier-system.md`, `components.md`

The content model for a legendary or featured beach page. Foundational — everything else (components, build, CI) reads from this shape.

---

## 1. Three stores, one page

A page is assembled at build time from three stores:

| Store | Owner | Lifecycle | Example |
|---|---|---|---|
| **Pipeline data** — `site/data/beaches/<slug>.json` | Ingestion + enrichment scripts | Rewritten on every pipeline run | Climate arrays, facility tags, OSM attributes |
| **Showcase content** — `site/content/beaches/<slug>/*` | Humans (Erin + AI collaborators) | Edited deliberately; never pipeline-touched | Prose, composition, motifs, photos |
| **Meta** — `site/content/beaches/<slug>/meta.json` | Humans | Edited rarely | Image catalogue + hero selection + tier override |

**Critical rule:** the pipeline MUST NOT write into `site/content/beaches/<slug>/`. That directory is human-only. If the pipeline ever overwrites `showcase.json` or `composition.json`, it's a pipeline bug.

The Vercel-era regeneration wiped Copa's and Brighton's showcase data from the old data/*.json location. The sidecar pattern (§2 below) exists to prevent that.

---

## 2. Per-beach directory layout

```
site/content/beaches/<slug>/
├── composition.json        # Tier, levers, section order, spoke list
├── meta.json               # Image catalogue + hero + role-tagged section images
├── showcase.json           # Narrative content (intro, day-in-time, timeline, zones, landmarks, refs)
├── motif.svg               # Tier 1 only — signature motif for section dividers
├── intro.mdx               # Optional — long-form essays if not inline in showcase.json
├── spike.mdx               # Tier 1 — spike deep-explainer prose with marginalia tags
├── honest-reckoning.mdx    # Optional — honest context section prose with marginalia
├── spokes/
│   └── <spoke-slug>/
│       ├── composition.json
│       ├── content.mdx
│       └── meta.json
└── archive/                # Pre-migration artifacts (old MDX, old photos)
```

**Why MDX for some sections and JSON for others:**
- **JSON** for structured content that renders as cards, lists, tables, or data visualisations (timeline events, zones, landmarks, businesses, cultural refs). These need typed fields for rendering.
- **MDX** for long-form prose with marginalia, pull-quotes, and inline figures. These need rich text with embedded components.
- **Short prose** (intro, context notes, day-in-time vignettes) can live as strings inside `showcase.json`. Promote to MDX when the prose grows past ~800 words or needs marginalia.

---

## 3. `composition.json` schema

The single source of truth for a page's structure.

```jsonc
{
  // Identity
  "slug": "praia-do-norte-6",
  "beach_name": "Nazaré (Praia do Norte)",
  "version": "0.7",                        // "0.x" until done-ness passes, then "1.0"
  "tier": 1,                               // 1 | 2. Tier 3/4 have no composition.json.

  // Editorial axis (Tier 1 only — Tier 2 uses `subtitle` instead)
  "spike": "the-canyon",                   // short id, kebab-case
  "spike_statement": "A submarine canyon produces the world's largest surfable wave.",
  // "subtitle": "..."                     // Tier 2 alternative

  // The six levers
  "levers": {
    "primary_color": "#2B3E50",            // hex, WCAG-AA against body bg
    "supporting_color": "#D4A574",
    "hero_type": "SPIKE",                  // MONUMENT | SPIKE | LAYERED | ABSENCE
    "display_pairing": "AUSTERE",          // CLASSICAL | AUSTERE | VERNACULAR
    "voice_register": "SEVERE",            // CLINICAL | REVERENT | ROMANTIC | SEVERE | WRY
    "motif_path": "/beaches/praia-do-norte-6/motif.svg",
    "photo_tone": "atlantic-storm"         // named tone — see photography doc
  },

  // Provenance
  "byline": "Written by Erin Rose",

  // Section composition (order matters)
  "sections": [
    "hero",
    "quick_facts",
    "story",
    "spike_deep_explainer",
    "data_science",
    "place_anatomy",
    "day_in_life",
    "timeline",
    "comparison",
    "plan_stack",
    "honest_reckoning",
    "gallery",
    "sources"
  ],

  // Spokes (Tier 1 only)
  "spokes": [
    { "slug": "canyon-science", "type": "deep_dive" },
    { "slug": "spectator-guide", "type": "audience_guide" },
    { "slug": "record-rides", "type": "anthology" }
  ],

  // Flags (optional)
  "reference_implementation": true,              // this beach is a design reference
  "motif_cultural_clearance_required": false,   // for motifs drawing on indigenous imagery
  "photography_grading_status": "tier_b_only"   // tier_a_commissioned | tier_b_only | hybrid
}
```

**Validation rules** (to be enforced by the done-ness CI, see §8):

- `slug` matches the directory name and the DB slug
- `tier` in {1, 2}
- `spike_statement` required iff `tier == 1`; ≤160 characters; ends with a period
- `subtitle` required iff `tier == 2`; ≤120 characters
- `levers.primary_color` + `levers.supporting_color` are valid hex, pass contrast check
- `levers.hero_type` in {MONUMENT, SPIKE, LAYERED, ABSENCE}
- `levers.voice_register` in {CLINICAL, REVERENT, ROMANTIC, SEVERE, WRY}
- `sections` is a permutation of a subset of the allowed section ids (see components.md)
- Tier 1: sections must include `hero`, `quick_facts`, `story`, `spike_deep_explainer`, `sources`
- Tier 2: sections must include `hero`, `quick_facts`, `story`, `sources`
- `spokes` empty iff `tier == 2`
- Tier 1: content section count (sections minus hero, quick_facts, sources) in {6..10}
- Tier 2: content section count in {3..7}

---

## 4. `meta.json` schema

The image catalogue. Separate from composition because images change independently of editorial structure.

```jsonc
{
  "tier": 1,
  "showcase": true,
  "images": {
    "hero": {
      "url": "/copa/hero-aerial.jpg",
      "title": "Aerial of Copacabana at sunset",
      "author": "Nilton Souza",
      "license": "CC BY-SA 3.0 de",
      "source_url": "https://commons.wikimedia.org/wiki/File:...",
      "width": 8006,
      "height": 5340,
      "tier": "B",                          // A (editorial-graded) | B (archival)
      "role": "hero"
    },
    "section": {
      // Role-tagged images consumed by specific section types.
      // Keys are the section type or a semantic subrole.
      "spike": { ... },
      "timeline_1970": { ... },
      "day_dawn": { ... },
      "day_midday": { ... },
      "mosaic": { ... },
      "pre_expansion": { ... }
    },
    "gallery": [
      { ... }                               // array of images for the GALLERY section
    ]
  }
}
```

**Per-image required fields:** `url`, `title`, `license`, `width`, `height`, `tier` ("A" or "B").
**Per-image recommended fields:** `author`, `source_url`, `role`.

**Photo tier rule (per spec-v1.2 §Lever 5):**
- Tier A images receive the beach's `photo_tone` grading and no special frame
- Tier B images render with a 1px inset frame in the supporting colour at 40% opacity, and captions use the italicised-date-prefix style

The figure component renders the correct treatment automatically based on the `tier` field.

---

## 5. `showcase.json` schema

Narrative content for structured sections. Lives in `site/content/beaches/<slug>/showcase.json`.

```jsonc
{
  "intro_text": "...",                      // STORY section prose, 400–800 words
  "day_in_life": {
    "dawn":   "...",                        // 80–150 words each
    "midday": "...",
    "golden": "...",
    "night":  "..."
  },
  "honest_reckoning_note": "...",           // If short enough to live inline. Promote to .mdx if >800 words.

  "timeline": [
    {
      "year": 1970,
      "month": null,
      "event_type": "infrastructure",
      "title": "Aterro de Copacabana — the beach doubled",
      "description": "A land-reclamation project dredged offshore sand...",
      "wiki_url": "https://en.wikipedia.org/wiki/...",
      "source": "wiki:Roberto_Burle_Marx",
      "image_role": "mosaic"                // optional — references meta.json.section key
    }
  ],

  "zones": [                                // PLACE ANATOMY
    {
      "zone_code": "posto-2",
      "name": "Posto 2",
      "position_along_beach_pct": 0.22,
      "lat": -22.9650, "lng": -43.1720,
      "character": "...",
      "best_for": "...",
      "notes": "..."
    }
  ],

  "landmarks": [                            // CULTURE or SPIKE DEEP-EXPLAINER
    {
      "name": "Copacabana Palace",
      "landmark_type": "hotel",
      "year_built": 1923,
      "architect_or_designer": "Joseph Gire",
      "description": "...",
      "wikipedia_url": "...",
      "image_role": "palace"
    }
  ],

  "cultural_refs": [                        // CULTURE section
    {
      "ref_type": "film",                   // film | tv | music | literature | historic | brand
      "title": "Flying Down to Rio",
      "creator": "RKO Pictures",
      "year": 1933,
      "description": "...",
      "wikipedia_url": "..."
    }
  ],

  "recurring_events": [                     // CULTURE / CALENDAR
    {
      "name": "Réveillon",
      "when_text": "Dec 31 night",
      "month": 12,
      "description": "...",
      "typical_attendance": 2500000
    }
  ],

  "businesses": [                           // PLAN STACK
    {
      "name": "Cervantes",
      "category": "restaurant",             // restaurant | hotel | bar | museum | kiosk | market | rental
      "description": "...",
      "address": "...",
      "year_established": 1955,
      "external_url": "...",                // null if no verified non-wiki URL
      "source": "..."
    }
  ],

  "food_drink": [                           // CULTURE section kiosk/food items
    {
      "name": "Caipirinha",
      "description": "...",
      "where": "any numbered quiosque"
    }
  ]
}
```

**Rules:**
- Every array field may be absent or empty — sections render null when their data array is below threshold (see components.md for thresholds)
- `image_role` entries must resolve to a key in `meta.json.images.section`; unresolved = log warning, render without image
- `wikipedia_url` values must be real URLs on `en.wikipedia.org` or a language-prefixed wiki
- `source` field is a citation key; accepted formats: `wiki:Article_Title`, `doi:10.xxxx/yyy`, `isbn:9780000000000`, `manual`
- For Tier 2 beaches: the same schema applies but `zones`, `cultural_refs`, `recurring_events`, `food_drink` are typically omitted

---

## 6. MDX content — long-form prose with marginalia

Long prose (spike deep-explainer, honest reckoning expansion, story if it exceeds 800 words) lives as MDX files, not as strings in showcase.json.

**Example `spike.mdx` for Nazaré:**

```mdx
## The Canyon

The Nazaré canyon is a submarine gorge that begins 500 m from the shore and
drops to 5,000 m within twenty kilometres. Most submarine canyons diffuse
swell; this one does the opposite.

<MarginNote audience="geology">
Canyon focusing occurs when bathymetry narrows faster than wavelength
decays. Nazaré's head is unusually abrupt — IPMA (2013).
</MarginNote>

When a North Atlantic storm sends long-period swell onto the canyon, the
topography acts like an acoustic lens. The water at Praia do Norte rises
under the compounded influence of...

<MarginNote audience="surfers">
Best swell angle is 305° at 18 s period. The canyon focuses tightly —
5° off and the wave is half the size.
</MarginNote>

<Figure image="spike_canyon_bathymetry" tier="A" />

[...]
```

**MDX components available to content writers:**

| Component | Purpose | Props |
|---|---|---|
| `<MarginNote>` | Sidebar annotation | `audience` (one of the valid audience tags), `id` (auto-generated) |
| `<Figure>` | Image with caption + Tier A/B treatment | `image` (meta.json role key), `caption` (overrides meta), `size` ("inline" \| "wide" \| "full-bleed") |
| `<PullQuote>` | Editorial pull-quote | `attribution` optional |
| `<Citation>` | Inline source reference | `source` (citation key) |
| `<DataCallout>` | Inline data point | `label`, `value`, `unit` |

The MDX runtime is next-mdx-remote. Components are registered in a shared MDX-components map.

---

## 7. Marginalia — audience taxonomy

Valid `audience` values on `<MarginNote>`. Fixed set (adding a new one is a spec change):

- **surfers** — for anyone catching waves (board selection, swell behaviour, etiquette)
- **spectators** — for visitors watching rather than participating
- **photographers** — angles, timing, light, access
- **geology** — bathymetry, sediment, formation
- **ecology** — species, seasonal patterns, conservation status
- **history** — historical events and context beyond the main prose
- **culture** — music, film, literature, local practice
- **safety** — real risks, protocols, what locals actually do
- **operational** — transit, access, hours, prices, booking
- **families** — child-appropriate, stroller access, pace
- **accessibility** — wheelchair access, mobility considerations, sensory accommodations

A margin note may have **one** audience tag. A paragraph may have multiple margin notes with different tags; they stack in the sidebar in reading order. On mobile they collapse inline beneath the paragraph.

See `marginalia.md` (forthcoming) for the rendering contract.

---

## 8. Spokes

A spoke is a subpage under `/beaches/<slug>/<spoke-slug>`. Each spoke has its own composition + content.

**Spoke directory:**

```
site/content/beaches/<slug>/spokes/<spoke-slug>/
├── composition.json
├── content.mdx           # The spoke's main content
└── meta.json             # Spoke-specific images; inherits parent's tones by default
```

**Spoke `composition.json`:**

```jsonc
{
  "slug": "canyon-science",
  "spoke_name": "Canyon Science",
  "parent_slug": "praia-do-norte-6",
  "version": "0.5",
  "type": "deep_dive",                      // deep_dive | audience_guide | event | anthology |
                                            // honest_reckoning_expansion | operational_essay | photo_essay
  "audience": null,                         // required iff type == audience_guide
  "word_count_target": 4000,
  "sections": [
    "spoke_hero",
    "deep_explainer",
    "data_science",
    "sources"
  ],
  "inherits_parent_levers": true            // if false, specify levers block
}
```

---

## 9. Done-ness CI (derived from this data model)

A script that runs on every build and asserts the following against each composition.json:

| Check | Rule |
|---|---|
| Schema valid | composition.json validates against schema (§3) |
| Hex colors | primary + supporting are valid 6-digit hex |
| Contrast | Both accent colors pass WCAG AA on `#FAFAF7` body bg |
| Section membership | Every id in `sections` exists in the component registry |
| Tier 1 required sections | hero, quick_facts, story, spike_deep_explainer, sources all present |
| Tier 1 section count | Between 6 and 10 content sections |
| Tier 1 spike statement | Present, ≤160 chars, ends with period |
| Tier 2 subtitle | Present, ≤120 chars |
| MDX parses | All MDX files parse without error |
| MDX audience tags | Every `<MarginNote audience="...">` uses a valid audience value |
| Image role resolution | Every `image_role` referenced in showcase.json exists in meta.json |
| Motif exists | Tier 1: motif.svg file exists at declared path |
| Byline present | `byline` field set on Tier 1 and Tier 2 |
| Version format | Matches `\d+\.\d+` |
| Word count | Body prose word count in tier band (§tier-system.md) |
| Source attribution | Every factual claim in MDX has a `<Citation>` OR the section is in the sources list |

Failures at the schema level block the build. Failures at the editorial level (word count, image resolution) log warnings but don't block — they bump the page's version down (`v1.0` → `v0.9`) automatically.

---

## 10. Migration of existing pages

Existing six beaches transition to this data model in this order:

1. **Write composition.json** (done — §composition.json files now exist for all six)
2. **Move existing showcase data** from `site/data/beaches/<slug>.json` to `site/content/beaches/<slug>/showcase.json` (sidecar protection; already done for Copa, Brighton, Nazaré, Waikīkī, Bondi)
3. **Extract long prose** from `showcase.json` strings into `.mdx` files where appropriate (§6 threshold)
4. **Add marginalia** to extracted MDX where multi-audience content exists
5. **Populate meta.json with tier A/B flags** on each image
6. **Create motif.svg** for each Tier 1 beach
7. **Run done-ness CI** — address failures until pass
8. **Bump version to v1.0** in composition.json

Migration is per-beach and can happen in parallel across beaches by different agents.

---

*End of data-model.md v1.0*
