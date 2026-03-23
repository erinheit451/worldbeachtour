# WorldBeachTour.com — Site Design Spec

## Vision

The definitive, comprehensive resource for every beach on Earth. Each beach is presented through multiple **lenses** — travel, surf, environment, family, photography, diving, history, sand/geology — so the same beach serves different audiences with purpose-built content. Monetization follows naturally from each vertical later; the goal is to build something genuinely useful that doesn't exist yet.

## Core Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Revenue model | Authority-first, monetize per vertical later | Build the resource, revenue follows naturally from each lens |
| URL architecture | Distinct routes per lens (SEO-indexable) + client-side lens toggle | Maximizes search surface (50K beaches x 8 lenses) while enabling fast lens switching |
| Tech approach | Monorepo, build-time content pipeline | Simple, debuggable, file-based content, no CMS overhead |
| Framework | Next.js 14+ (App Router, SSG + ISR) | Familiar ecosystem, handles SSG + client-side hydration in one framework |
| Content generation | Claude Max conversations using prompt templates per lens | No API costs, human-in-the-loop review |
| DB consumption | JSON export from SpatiaLite, consumed at build time | Clean separation between DB project and site project |
| Page design | Not locked — prototype first, design from real content | Two prototype beaches inform final design decisions |
| Content tiering | Tier 1 (1K rich) → Tier 2 (5-10K generated) → Tier 3 (on-demand template) | Avoids SEO penalty from thin content at scale |

## URL Architecture

```
worldbeachtour.com/
├── /                                → Homepage (search, featured beaches, editorial)
├── /beaches/                        → Browse/search all beaches (filterable)
├── /beaches/[slug]/                 → Beach overview page (hub for all lenses)
├── /beaches/[slug]/travel           → Travel lens
├── /beaches/[slug]/surf             → Surf lens
├── /beaches/[slug]/environment      → Environment lens
├── /beaches/[slug]/family           → Family lens
├── /beaches/[slug]/photography      → Photography lens
├── /beaches/[slug]/diving           → Diving/Snorkeling lens
├── /beaches/[slug]/history          → History lens
├── /beaches/[slug]/sand             → Sand & geology lens
├── /beaches/[slug]/[custom]         → One-off custom pages (future)
├── /regions/[country]/              → Country landing pages
├── /regions/[country]/[state]       → State/province landing pages
└── /[editorial]/                    → Blog/guides (future)
```

The **overview page** (`/beaches/[slug]/`) is the canonical landing page. It shows a summary card per lens with a "deep dive" link. All backlinks consolidate here. Each lens page cross-links siblings via a persistent tab bar.

**Region pages** aggregate beaches by geography — auto-generated index pages with editorial intros. Key SEO targets ("beaches in Thailand").

## Lenses

### 1. Travel
Getting there, nearby hotels/airports, best time to visit, costs, visa info, safety.

### 2. Surf
Wave type, swell direction, season, difficulty level, reef vs sand break, crowd factor.

### 3. Environment
Water quality, erosion trends, protected status, wildlife, pollution data.

### 4. Family
Gentle slope, lifeguards, facilities (toilets/showers/parking), calm water, nearby amenities.

### 5. Photography
Sunrise/sunset orientation, scenic rating, best light times, iconic shots.

### 6. Diving/Snorkeling
Visibility, marine life, reef health, depth, current strength.

### 7. History
Cultural history, events, notable stories, indigenous significance, timelines.

### 8. Sand & Geology
Grain type, color, mineral composition, geological formation, origin story.

### 9. Custom (Future)
One-off pages for beaches with unique stories (e.g., Daytona racing history).

## Content Architecture

### Data Flow

```
Beach DB (SpatiaLite)
    │
    ▼ [export pipeline — JSON per beach]
    │
content-pipeline/
    │
    ├── data/beaches/[slug].json         ← structured data from DB
    │
    ├── [Claude Max generates editorial via prompt templates]
    │
    └── content/beaches/[slug]/
        ├── overview.mdx
        ├── travel.mdx
        ├── surf.mdx
        ├── environment.mdx
        ├── family.mdx
        ├── photography.mdx
        ├── diving.mdx
        ├── history.mdx
        ├── sand.mdx
        └── meta.json                    ← active lenses, quality tier, custom pages
```

### How a Page Gets Built

1. DB pipeline exports each beach as a JSON file (structured attributes, coordinates, sources)
2. Content pipeline reads the JSON, determines which lenses have sufficient data
3. Claude Max writes editorial MDX for each viable lens using **prompt templates** — narrative content with component placeholders (`<TideChart />`, `<WeatherWidget />`, `<MapEmbed />`)
4. `meta.json` tracks which lenses exist, quality tier, custom page slugs
5. Next.js reads MDX + JSON at build time, generates static pages
6. Live widgets hydrate client-side from third-party APIs

### Content Tiering

- **Tier 1** (~1,000 beaches): Full editorial across all viable lenses, reviewed, rich media
- **Tier 2** (~5,000-10,000): AI-generated editorial, less review, core lenses only
- **Tier 3** (everything else): Template page with structured data only, generated on-demand via ISR

### Prompt Templates

Each lens gets a crafted prompt template that takes structured JSON data and produces consistent MDX. Templates define tone, length, coverage areas, and MDX component syntax. These are iterated during the prototype phase until quality is locked.

## Page Anatomy

Every lens page follows a common skeleton:

1. **Hero** — image + beach name + location
2. **Lens tab bar** — always visible, highlights current lens, client-side navigation
3. **Editorial section** — AI-written narrative (800-1500 words), the content that ranks
4. **Structured data widgets** — static cards from DB attributes (wave type, grain size, etc.)
5. **Live widgets** — client-side fetches (tide, weather, water quality)
6. **Map** — beach location + contextual points of interest
7. **Related** — nearby beaches, similar beaches worldwide, link to overview

The weight of each section varies per lens. History is editorial-heavy with timelines. Environment is widget-heavy with live data. Sand is editorial + photography. **Final layout is determined during prototype iteration, not upfront.**

The **overview page** shows a condensed card per lens: 2-3 sentence summary + top 3 data points + "Read more" link.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14+ (App Router, SSG + ISR) |
| Content | MDX files per beach/lens |
| Data | JSON exports from SpatiaLite DB |
| Content generation | Claude Max via prompt templates |
| Styling | Tailwind CSS |
| Maps | Mapbox or Leaflet |
| Live data — tide/swell | Stormglass or NOAA |
| Live data — weather | Open-Meteo (free) |
| Live data — water quality | EPA BEACON (US), EU Bathing Water API (Europe) |
| Hosting | Cloudflare Pages |
| Site search | Pagefind (static search index) |
| Domain | WorldBeachTour.com (owned, currently on Squarespace DNS) |

## Build Phases

### Phase 1 — Framework + Prototype (Current Scope)

- Next.js site skeleton with full URL architecture
- Homepage (search, featured beaches, editorial intro)
- `/beaches/` browse/search page
- Beach overview page template
- All 8 lens page templates (functional, not design-locked)
- Content pipeline tooling (JSON export → prompt templates → MDX)
- Two complete prototype beaches: **Waikiki** and **Reynisfjara** (black sand, Iceland)
- All viable lenses generated for both prototypes
- Region page template (`/regions/[country]/`)
- Global layout: nav, footer, lens tab bar, map integration

### Phase 2 — Design Iteration

- Review real content on real pages
- Iterate on layout, typography, widget placement, mobile experience
- Lock page design

### Phase 3 — Scale Content

- Generate Tier 1 beaches (~1,000) in waves
- Build out region pages with editorial intros
- Integrate live widgets with third-party APIs
- Editorial/guide pages for SEO

### Not In Scope Yet

- Monetization integrations (affiliate links, ads)
- User accounts or personalization
- Custom one-off pages
- Live widget integrations beyond placeholder components

## Prototype Strategy

**Why two beaches:** Waikiki and Reynisfjara stress-test opposite extremes.

- **Waikiki**: tropical, tourist-heavy, data-rich across every lens, famous surf, well-documented history and sand
- **Reynisfjara**: volcanic, remote, geology-dominant, sparse surf/family data, incredible sand/history/photography stories

Designing from these two real content sets reveals what works and what doesn't before committing to page design at scale.
