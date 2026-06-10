# World Beach Tour — Component Specifications

**Version 1.0 · April 2026**
**Companion to:** `spec-v1.2.md`, `tier-system.md`, `data-model.md`, `marginalia.md`

Prop contracts and rendering rules for every component in the legendary-page system. Organised from primitives → section components → page shells.

---

## Conventions

- All components are React functional components with TypeScript.
- All components accept a `className` prop for escape-hatch styling; escape-hatch use must be justified in PR.
- All components that render images accept a `priority` prop (`boolean`, default `false`) to control LCP preloading.
- All components respect `prefers-reduced-motion`.
- Components live at `site/components/legendary/` (new-scaffold target, per spec-v1.2 fork strategy).
- Shared primitives live at `site/components/primitives/`.

---

## PART A — Primitives

These are the small vocabulary every section component composes with. Used across all four tiers where relevant.

### `<SectionDivider>`

**Purpose.** The horizontal punctuation between major sections. On Tier 1 pages, uses the beach's signature motif. On Tiers 2–4, a simple rule line.

**Used by tier.** 1 · 2 · 3

**Props.**
```ts
interface SectionDividerProps {
  motifPath?: string;       // Tier 1 only — path to motif.svg
  variant?: "motif" | "rule" | "full-bleed";  // default: "motif" if motifPath else "rule"
  label?: string;           // accessible label, e.g. "Section break"
}
```

**Rendering rules.**
- `motif` renders the SVG at 40px intrinsic height, centred, in `--beach-primary` at 70% opacity.
- `rule` renders a 1px horizontal line, `--color-rule` (`#E5E5E5`).
- `full-bleed` renders a full-viewport-width variant with increased vertical spacing. Used for chapter-level transitions (entering and exiting HONEST RECKONING, typically).
- Maximum **5 appearances per page** (enforced in lint). Overuse turns signature into wallpaper.

**Responsive.** Same across breakpoints.
**Accessibility.** `role="separator"` + `aria-label={label ?? "Section break"}`. Decorative motif marked `aria-hidden="true"`.

---

### `<PullQuote>`

**Purpose.** Editorial call-out in display typography. The first pull-quote on a Tier 1 page is (by convention) the spike statement.

**Used by tier.** 1 · 2

**Props.**
```ts
interface PullQuoteProps {
  children: ReactNode;
  attribution?: string;     // small caps, e.g. "— Graham Greene, Brighton Rock (1938)"
  size?: "default" | "hero"; // hero for the spike-statement pull-quote
}
```

**Rendering rules.**
- Display font (`--display-family` from lever 3), not body serif.
- `default`: 28px/36px, left-aligned, left border 4px in `--beach-primary`.
- `hero`: 42px/52px on desktop, 32px/40px on mobile, no border, centred, with 80px vertical margin.
- Quotation marks rendered as curly typographic, not straight ASCII.
- Attribution on its own line, 12px, small caps, `--color-muted`.

**Responsive.** Scales per size variant above.
**Accessibility.** `<blockquote>` element with `<cite>` for attribution if present.

---

### `<Figure>`

**Purpose.** Image with caption + Tier A/B photographic treatment. The single image primitive; all section components that render images use this under the hood.

**Used by tier.** 1 · 2 · 3

**Props.**
```ts
interface FigureProps {
  imageRole: string;         // key into meta.json.images.section
  // OR direct pass-through:
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  tier?: "A" | "B";          // photography tier; determines treatment
  author?: string;
  license?: string;
  sourceUrl?: string;
  // Rendering options:
  size?: "inline" | "wide" | "full-bleed";  // default "wide"
  caption?: ReactNode;       // override meta.json caption
  datePrefix?: string;       // e.g. "1916" — used for Tier B archival framing
  priority?: boolean;
}
```

**Rendering rules.**
- **Tier A (editorial-graded):** no inset frame. Caption uses body italic. Attribution in small-caps after caption with `·` separator.
- **Tier B (archival):** 1px inset frame in `--beach-supporting` at 40% opacity. Caption prefixed with italicised date (e.g. *"1916. Aerial view of Copacabana before the 1970 land reclamation..."*). Attribution treatment same as Tier A.
- `size=inline`: max 50% column width, wraps with prose.
- `size=wide`: 100% of prose column.
- `size=full-bleed`: 100% of viewport, breaks out of content max-width.
- Lazy loaded by default; `priority` forces eager + preload.

**Data resolution.** If `imageRole` is set, look up `meta.json.images.section[imageRole]` and populate `src`, `tier`, `author`, `license`, `width`, `height`. If `imageRole` unresolved, log warning + render nothing (fail soft).

**Responsive.** `size=wide` reflows to viewport width on mobile. `size=full-bleed` keeps aspect ratio.
**Accessibility.** `alt` required (enforced in lint). Caption in `<figcaption>`. Decorative images must pass `alt=""` explicitly.

---

### `<Citation>`

**Purpose.** Inline reference to a source. Renders as a small-superscript numeric reference; the number resolves to an entry in the Sources section.

**Used by tier.** 1 · 2

**Props.**
```ts
interface CitationProps {
  source: string;            // citation key: "wiki:Copacabana_Palace", "doi:10.xxx/yyy", "manual"
  label?: string;            // override display text if needed
}
```

**Rendering rules.**
- Renders a superscript number in the body typography, `--beach-primary` color.
- Click scrolls to the corresponding entry in the Sources section with visual highlight (3s fade).
- Build process collects all `<Citation>` usages per page and compiles the Sources section list in order-of-first-use.

**Accessibility.** `<sup><a href="#source-N" aria-label="Source N">N</a></sup>`.

---

### `<DataCallout>`

**Purpose.** Inline data point as a small stat card. For numbers that deserve emphasis but don't warrant a full data-science section.

**Used by tier.** 1 · 2

**Props.**
```ts
interface DataCalloutProps {
  label: string;             // "Spring tide range"
  value: string;             // "0.94 m"
  unit?: string;             // rarely used — prefer value to include unit
  source?: string;           // citation key, renders as caption
  variant?: "inline" | "strip"; // inline = inline-block beside prose; strip = row of callouts
}
```

**Rendering rules.**
- Value in display font, 28px (inline) or 36px (strip).
- Label in 12px uppercase tracked, `--color-muted`.
- Source in 10px italic, `--color-muted`.

---

### `<MarginNote>`

**Purpose.** Audience-tagged sidebar annotation. See `marginalia.md` for the full rendering contract.

**Used by tier.** 1 · 2

**Props.**
```ts
interface MarginNoteProps {
  audience: Audience;        // fixed taxonomy, see marginalia.md
  id?: string;               // auto-generated if omitted
  anchorParagraph?: string;  // paragraph id to anchor to; auto-inferred if omitted
  children: ReactNode;
}
```

See `marginalia.md` §B for author experience, §C for technical pipeline.

---

## PART B — Tier 1 + Tier 2 section components

Each section component reads from `showcase.json` and/or MDX content and renders per its contract. Each accepts a `tier` prop to adjust density.

### `<Hero>`

**Purpose.** The page's opening visual moment. One of four archetypes per lever 2.

**Used by tier.** 1 · 2

**Props.**
```ts
interface HeroProps {
  beachName: string;
  location: string;                 // "Rio de Janeiro, BR" — rendered above name
  tagline?: string;                 // "The beach the world imagines..." — rendered below
  heroType: "MONUMENT" | "SPIKE" | "LAYERED" | "ABSENCE";
  primary: Figure | [Figure, Figure];  // LAYERED takes 2; others take 1
  version: string;                  // "v0.7" — renders small in footer overlay
  tier: 1 | 2;
}
```

**Rendering rules per archetype.**
- **MONUMENT:** full-bleed photo, 88vh (Tier 1) / 66vh (Tier 2), linear gradient bottom-to-top `black/80 → transparent/20`. Text stack at bottom-left: location (eyebrow) → beach name (display, 7xl/5xl) → tagline (serif italic, 20px).
- **SPIKE:** photo cropped tight on the spike subject. Same text stack as MONUMENT but right-aligned on desktop, left-aligned on mobile.
- **LAYERED:** two images side-by-side (50/50 desktop, stacked mobile). Shared text stack across bottom.
- **ABSENCE:** photo of the beach with no or minimal people visible. Lower visual intensity — no gradient at top, dark-text-on-light option. Text stack at bottom-centre.

**Responsive.**
- Desktop: full archetype rendering per above
- Tablet: heights reduce to 70vh / 50vh
- Mobile: text stack always at bottom-left, size reduces to 5xl/4xl

**Accessibility.** Hero images must have meaningful `alt`. Beach name in `<h1>`. Tagline is not an h-tag.

---

### `<QuickFactsStrip>`

**Purpose.** 5–7 data points immediately under the hero. A reader's first orientation.

**Used by tier.** 1 · 2

**Props.**
```ts
interface QuickFactsStripProps {
  facts: Array<{
    label: string;     // "Length"
    value: string;     // "4 km"
    source?: string;   // citation key
  }>;
  tier: 1 | 2;
}
```

**Rendering rules.**
- Horizontal grid, 5–7 cells. On mobile, 2-column grid stacking.
- Each cell: label in 10px mono uppercase (`--color-muted`); value in display font 24px (`--color-body`).
- Bottom border on the whole strip in `--beach-primary` at 40% opacity, 2px.
- No scrolling. If content exceeds 7 facts, the component throws in dev build (editorial decision: fewer facts are better).

**Responsive.** Single row desktop; 2-col grid mobile; 3-col grid tablet.
**Accessibility.** `<dl>` with `<dt>` + `<dd>` pairs.

---

### `<Story>`

**Purpose.** The page's opening editorial prose. 400–800 words. Sets voice register.

**Used by tier.** 1 · 2

**Props.**
```ts
interface StoryProps {
  text?: string;             // inline from showcase.json.intro_text
  mdxSlug?: string;          // OR MDX file reference (intro.mdx)
  pullQuote?: {              // first pull-quote on page
    text: string;
    attribution?: string;
  };
  tier: 1 | 2;
}
```

**Rendering rules.**
- Prose column, max 65ch.
- First paragraph renders with a drop cap (4 lines tall, serif display, `--beach-primary`).
- Pull-quote (if present) renders after the 2nd paragraph in `<PullQuote size="hero">`.
- Paragraphs separated by 24px.
- If both `text` and `mdxSlug` are provided, `mdxSlug` wins.

**Data binding.** Prefers MDX when prose exceeds ~800 words or needs marginalia. Short prose stays inline in `showcase.json.intro_text`.

---

### `<DeepExplainer>`

**Purpose.** The signature section of a Tier 1 page (SPIKE DEEP-EXPLAINER) or the Tier 2 equivalent (FEATURE DEEP-EXPLAINER). Densest editorial + visual content on the page.

**Used by tier.** 1 · 2

**Props.**
```ts
interface DeepExplainerProps {
  slug: "spike" | "feature";  // determines section id (#spike / #feature)
  title: string;              // the section heading
  mdxSlug: string;            // required — this is long-form with marginalia and figures
  embeddedDataScience?: boolean;  // if true, data-science renders inline, not as separate section
  tier: 1 | 2;
}
```

**Rendering rules.**
- Prose column width 65ch, sidebar 320px (marginalia + operational), 96px gutter.
- On Tier 1, this section claims **at least 30% of content-section real estate**. Lint warns below.
- Section header in display font, 40px, with a short underline in `--beach-primary`.
- MDX content rendered with full primitive set (Figure, Citation, PullQuote, DataCallout, MarginNote).
- Responsive: sidebar collapses to inline collapsibles on tablet and below.

**Data binding.** Reads `site/content/beaches/<slug>/spike.mdx` (Tier 1) or `feature.mdx` (Tier 2).

---

### `<PlaceAnatomy>`

**Purpose.** Named sub-locations locals use as coordinates. Postos on Copa, zones on Brighton, breaks on Pipeline.

**Used by tier.** 1 · (rare on Tier 2)

**Props.**
```ts
interface PlaceAnatomyProps {
  zones: Array<Zone>;         // see data-model.md §5
  beachLat: number;
  beachLng: number;
  mapVariant?: "schematic" | "osm";  // default: "schematic"
  tier: 1 | 2;
}
```

**Rendering rules.**
- Two-column layout: map on one side (60%), zone cards stacked on the other (40%).
- Map `schematic`: SVG diagram of the beach with numbered markers. `osm`: interactive Leaflet with OSM tiles.
- Each zone card: number badge → name → character prose → "Best for" → notes.
- **Conditional rendering:** returns null if `zones.length < 3`.

**Responsive.** Map and cards stack on mobile; map comes first.
**Accessibility.** Map has `aria-label` describing the beach. Each zone card is keyboard-focusable and has an anchor id (`#zone-posto-2`).

---

### `<DayInLife>`

**Purpose.** Four time-of-day vignettes establishing the rhythm of the place.

**Used by tier.** 1 · 2 · (as spine on audience_guide spokes)

**Props.**
```ts
interface DayInLifeProps {
  vignettes: {
    dawn:   { text: string; imageRole?: string };
    midday: { text: string; imageRole?: string };
    golden: { text: string; imageRole?: string };
    night:  { text: string; imageRole?: string };
  };
  variant?: "module" | "spine";  // default: "module"
  tier: 1 | 2;
}
```

**Rendering rules (module variant — on main pages).**
- 2×2 grid on desktop, 1-column stack on mobile.
- Each card: time-of-day label + time range → image (if provided) → prose.
- Colour tint per vignette: dawn → cool blue gradient, midday → warm cream, golden → amber/coral gradient, night → deep dark.

**Rendering rules (spine variant — on audience_guide spokes).**
- Vertical scroll with day progressing. Each vignette is a full-section with 75vh height.
- Parallax background image per vignette.
- Narrative prose flows as the reader scrolls through the day.

**Rule:** a given beach uses module on its main page OR spine on a spoke. Not both.

**Data binding.** `showcase.json.day_in_time` object.

---

### `<Timeline>`

**Purpose.** Annotated chronology of turning points.

**Used by tier.** 1 · (rare on Tier 2)

**Props.**
```ts
interface TimelineProps {
  events: TimelineEvent[];     // see data-model.md §5
  tier: 1 | 2;
}
```

**Rendering rules.**
- Vertical timeline on the left, prose beside each event.
- Each event: year → event-type glyph → title → description → optional image → optional Wikipedia link.
- Images resolve via `event.image_role` from the event's declared image role.
- Events rendered in chronological order (oldest first).
- **Conditional rendering:** returns null if `events.length < 6`.

---

### `<DataScience>`

**Purpose.** Charts, measurements, scientific framing. Used for beaches with measurable legendary-ness (Nazaré's canyon bathymetry, Copa's climate arrays, Glass Beach's particle analysis).

**Used by tier.** 1 · 2

**Props.**
```ts
interface DataScienceProps {
  title: string;
  content: ReactNode;          // free-form: charts, diagrams, prose
  chartData?: Record<string, unknown>;  // for generic chart components
  citations: string[];         // source keys
  tier: 1 | 2;
  embedded?: boolean;          // if true, rendered inline within DeepExplainer, not as standalone
}
```

**Rendering rules.**
- Section header same as other sections.
- Content is varied — charts, before/after images, diagrams.
- Chart components (line, bar, scatter) live at `site/components/charts/` and inherit `--beach-primary` / `--beach-supporting` for series colours.
- Citations render in the Sources section via `<Citation>`.

---

### `<Comparison>`

**Purpose.** This beach versus peer beaches. Copa vs Ipanema vs Leblon. Pipeline vs Teahupo'o.

**Used by tier.** 1 · (rare on Tier 2)

**Props.**
```ts
interface ComparisonProps {
  cards: Array<{
    tag: string;               // "Copacabana"
    tagTone?: "ocean" | "sand" | "volcanic" | "coral";
    headline: string;          // "The event beach"
    image?: FigureProps;
    rows: Array<{ label: string; value: string }>;
  }>;
  tier: 1 | 2;
}
```

**Rendering rules.**
- N cards in a grid (typically 3, but 2 and 4 allowed).
- Each card: tag pill → optional image → headline → stat rows.
- **Conditional rendering:** returns null if `cards.length < 2`.

---

### `<PlanStack>`

**Purpose.** Operational reference for a visitor. Stay, eat, get-there, safety, plan-your-time.

**Used by tier.** 1 · 2 (smaller on Tier 2)

**Props.**
```ts
interface PlanStackProps {
  stayZones?: Array<StayZone>;
  businesses?: Array<Business>;
  plannerRows?: Array<{
    heading: string;
    items: Array<[string, string]>;
  }>;
  safetyCopy?: { whatLocalsDo: string; inTheWater: string };
  mapComponent?: ReactNode;    // optional embedded interactive map
  tier: 1 | 2;
}
```

**Rendering rules.**
- Multi-subsection, each with its own heading.
- Stay subsection: if `stayZones` has ≥3 zones, render spatial (map + zone cards). If <3, render as a single list.
- Eat subsection: list of named places with address + one-line description. Links open new tab.
- Planner rows: 2-column responsive grid of operational fact blocks (airports, payment, language, visa).
- Safety: two-column prose block with water-safety icons.
- **Conditional rendering per subsection:**
  - Stay renders if `stayZones.length ≥ 3` or sidebar-list if <3 & ≥1
  - Eat renders if `businesses.length ≥ 4`
  - Planner renders if `plannerRows.length ≥ 2`
  - Safety always renders if `safetyCopy` present

**Responsive.** All sub-sections stack on mobile.

---

### `<Culture>`

**Purpose.** The page's cross-connections — film, music, literature, historic events, brands.

**Used by tier.** 1 · 2 (smaller menu)

**Props.**
```ts
interface CultureProps {
  refs: CulturalRef[];
  header?: {
    eyebrow?: string;
    title?: string;
    kicker?: string;
  };
  tier: 1 | 2;
}
```

**Rendering rules.**
- Group refs by `ref_type` in fixed order: film → tv → music → literature → historic → brand → other.
- Each group renders as 2-column card grid.
- Each card: title + year → creator → description → Wikipedia link.
- **Conditional rendering:** returns null if `refs.length < 4`.

---

### `<HonestReckoning>`

**Purpose.** The section where the page carries the uncomfortable or complex truth — colonial history, displacement, violence, contested present. The Favela Above, Kemptown, Mālama Hawaiʻi, Gadigal Country.

**Used by tier.** 1 · 2 (where warranted)

**Props.**
```ts
interface HonestReckoningProps {
  title: string;               // per-beach, e.g. "The Favela Above"
  eyebrow?: string;            // default: "· Honest Context"
  mdxSlug?: string;            // preferred — supports marginalia + figures
  text?: string;               // fallback — plain prose from showcase.json
  images?: {
    access?: FigureProps;      // e.g. the Plano Inclinado
    view?: FigureProps;        // e.g. the Mirante view
  };
  tier: 1 | 2;
}
```

**Rendering rules.**
- Prose column at 65ch.
- Access image renders inline with the access paragraph; view image renders as full-width figure.
- Section header treatment subtly different: `--beach-primary` at full opacity on the header rule (other sections use 40%).

**Editorial rule.** Always placed near the end of the page, before Sources. Never in the middle — interruptive.

---

### `<Gallery>`

**Purpose.** Curated visual record. Where the beach's visual history is itself the story.

**Used by tier.** 1 · 2

**Props.**
```ts
interface GalleryProps {
  images: FigureProps[];
  layout?: "masonry" | "grid" | "essay";  // default: "masonry"
  tier: 1 | 2;
}
```

**Rendering rules.**
- Masonry: variable heights, Pinterest-like.
- Grid: uniform aspect ratios.
- Essay: vertical stack with rich captions — for photo-essay style sections.
- Click opens lightbox (full-screen overlay with next/prev + caption).
- **Conditional rendering:** returns null if `images.length < 5`.

---

### `<Sources>`

**Purpose.** Provenance and attribution footer. Every factual claim on the page lands here.

**Used by tier.** 1 · 2 · (3 with reduced form)

**Props.**
```ts
interface SourcesProps {
  citations: Array<{
    key: string;                // "wiki:Copacabana_Palace"
    type: "wiki" | "doi" | "isbn" | "manual" | "url";
    display: string;            // human-readable label
    url?: string;
    accessedDate?: string;      // ISO date
  }>;
  provenance: {
    geography: string;          // "OpenStreetMap (ODbL)"
    climate: string;
    photos: string;             // per-image licensing summary
    narrative: string;
    lastReviewed: string;       // ISO date
    version: string;            // "v0.9"
    byline: string;             // "Written by Erin Rose"
    photographyTier: "A" | "B" | "hybrid";
  };
  tier: 1 | 2 | 3;
}
```

**Rendering rules.**
- Small type, dense.
- Citations listed numbered (auto-indexed from `<Citation>` order-of-first-use in the page).
- Provenance block separate from citations — it's the *colophon*, not the bibliography.
- Version label prominent. Byline prominent.
- Photography tier honestly declared.

---

## PART C — Tier 3 fixed template

Unlike Tiers 1 and 2, Tier 3 is a **single shared component** that renders uniformly across all Tier 3 pages. No composition.json; data shape below.

### `<Tier3Page>`

**Purpose.** Standard page for beaches that don't warrant Tier 1/2 editorial but deserve more than a stub.

**Props.**
```ts
interface Tier3PageProps {
  beach: {
    slug: string;
    name: string;
    country_code: string;
    admin_level_1?: string;
    centroid_lat: number;
    centroid_lng: number;
    length_m?: number;
    water_body_type?: string;
    substrate_type?: string;
    nearest_city?: string;
    nearest_city_distance_km?: number;
    nearest_airport?: { iata: string; name: string; distance_km: number };
    climate?: ClimateData;
    species?: SpeciesEntry[];
    photos: FigureProps[];      // from beach_photos
    wikipedia_summary?: string; // ~150 words
    manual_paragraph?: string;  // one hand-curated paragraph, optional
  };
}
```

**Sections rendered (in order, conditional on data):**
1. **Tier-3 hero.** Single Commons photo, 16:9 aspect, 45vh. Title + location overlay.
2. **Quick facts strip** (same component as Tier 1/2 with reduced styling).
3. **Overview.** `wikipedia_summary` + `manual_paragraph` (if present). ~300–600 words combined.
4. **Climate card** (if climate data present). 12-month temperature + rain line chart.
5. **Photos** (if ≥5 photos). Masonry gallery.
6. **Species** (if iNaturalist data present with ≥10 obs). Simple card grid.
7. **Facilities** (if OSM tags present). Badge row — parking, restrooms, etc.
8. **Nearby beaches** (always). 3–6 nearest beaches with thumbnails + distances.
9. **Sources.** Reduced colophon — data provenance only, no citations (there's no editorial prose to cite).

**Styling.** Inherits constant typography + neutral palette from `spec-v1.2`. No per-beach color lever — uses the site's default ocean-blue accent. No motif. No marginalia. No byline.

**Shared component** — all Tier 3 pages render the same component with different data. Composition is not per-beach for Tier 3.

---

## PART D — Tier 4 minimal template

### `<Tier4Page>`

**Purpose.** The long-tail stub page. Exists for SEO + completeness.

**Props.**
```ts
interface Tier4PageProps {
  beach: {
    slug: string;
    name?: string;              // may be null — "Unnamed beach at <coord>"
    country_code?: string;
    centroid_lat: number;
    centroid_lng: number;
    length_m?: number;
  };
}
```

**Sections rendered:**
1. **Map.** OSM tile at zoom 13, marker on beach centroid. ~400px tall.
2. **Geo facts.** Name (or coordinates), country, length (if known), coordinates, nearby place name (if any).
3. **Footer.** Link back to parent region + sitemap.

**Styling.** Single-column, 640px max. Text-heavy, image-light.

---

## PART E — Editorial MDX components

Usable inside MDX files. Already specified in PART A primitives:

- `<Figure>`
- `<Citation>`
- `<DataCallout>`
- `<PullQuote>`
- `<MarginNote>` — see `marginalia.md`

Registered in `site/components/legendary/mdx-components.tsx` and passed to `<MDXRemote components={...}>`.

---

## PART F — Page shell + navigation

### `<LegendaryShell>`

**Purpose.** The page shell for Tier 1 + Tier 2. Renders: meta tags, favicons, sticky nav, applies CSS custom properties from composition.json, wraps page body, renders global footer.

**Props.**
```ts
interface LegendaryShellProps {
  composition: Composition;    // full composition.json
  children: ReactNode;
}
```

**Responsibilities.**
- Generates `<meta>` tags including OG + Twitter cards from composition.json.
- Injects CSS custom properties: `--beach-primary`, `--beach-supporting`, `--display-family`.
- Renders `<StickyNav groups={...}>` (see below).
- Wraps children in the 12-column grid.
- Renders footer with byline + version + links.

---

### `<StickyNav>`

**Purpose.** The page's section nav, grouped and sticky. Same component used across all Tier 1 + Tier 2.

**Props.**
```ts
interface StickyNavProps {
  groups: NavGroup[];          // see spec-v1.2 §3
  currentSection?: string;     // highlighted; auto-tracked via IntersectionObserver
}
```

**Rendering rules.**
- Horizontal row of links, grouped with separators.
- Active section highlighted in `--beach-primary`.
- Sticky at top with backdrop-blur.
- Collapses to hamburger on mobile, opening a full-screen menu.

Already implemented in current codebase; kept with minor refinement for v2 scaffold.

---

## Tier → component matrix (quick reference)

| Component | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|---|
| Hero | ✓ (4 archetypes) | ✓ (4 archetypes) | Fixed template | Map only |
| QuickFactsStrip | ✓ | ✓ | ✓ | ✗ |
| Story | ✓ | ✓ | Reduced (Wikipedia summary) | ✗ |
| DeepExplainer | ✓ (spike) | ✓ (feature) | ✗ | ✗ |
| PlaceAnatomy | ✓ | rare | ✗ | ✗ |
| DayInLife | ✓ | optional | ✗ | ✗ |
| Timeline | ✓ | rare | ✗ | ✗ |
| DataScience | ✓ | ✓ | Climate card only | ✗ |
| Comparison | ✓ | rare | Nearby beaches (simple list) | ✗ |
| PlanStack | ✓ | ✓ (reduced) | Facilities badge row | ✗ |
| Culture | ✓ | ✓ (smaller) | ✗ | ✗ |
| HonestReckoning | ✓ | ✓ | ✗ | ✗ |
| Gallery | ✓ | ✓ | ✓ (if ≥5 photos) | ✗ |
| Sources | ✓ | ✓ | Reduced colophon | ✗ |
| SectionDivider | motif | motif (optional) | rule | ✗ |
| PullQuote | ✓ | ✓ | ✗ | ✗ |
| Figure | ✓ (A+B) | ✓ (A+B) | ✓ (B only) | ✗ |
| Citation | ✓ | ✓ | ✗ | ✗ |
| DataCallout | ✓ | ✓ | Inline only | ✗ |
| MarginNote | ✓ | optional | ✗ | ✗ |

---

## Implementation sequence

When building `<LegendaryBeachV2>` (the fresh scaffold per spec-v1.2 fork strategy), order of implementation:

1. Primitives (SectionDivider, PullQuote, Figure, Citation, DataCallout, MarginNote)
2. Page shell (LegendaryShell, StickyNav)
3. Hero (all 4 archetypes)
4. Story, QuickFactsStrip, Sources (the always-present components)
5. DeepExplainer (the signature section — most load-bearing)
6. PlaceAnatomy, DayInLife, Timeline, DataScience, Comparison, PlanStack, Culture, HonestReckoning, Gallery (in roughly this order of difficulty)
7. Tier3Page and Tier4Page (separate simpler scaffolds, done later)

Approximate effort: 2–3 weeks of focused implementation to get all Tier 1 + Tier 2 components to a usable state. Nazaré is the first concrete page built against it; iterate primitives and section components as Nazaré reveals gaps.

---

*End of components.md v1.0*
