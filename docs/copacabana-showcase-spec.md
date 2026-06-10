# Copacabana Showcase — Page Spec

**Goal:** Build the definitive, comprehensive, beautiful page for Copacabana Beach. Use what we learn to establish the data model + render layer for every other beach.

**Non-goal:** Backfill 300 other beaches right now. This page is the reference implementation.

---

## Design Principles

1. **Content-led, not metadata-led.** The current template renders fields ("nearest airport: 6.6 km"). The new page leads with story, atmosphere, and lived experience, with data as supporting evidence.
2. **Local knowledge > tourist info.** What a Carioca wishes visitors understood, not a restate of Wikipedia's first paragraph.
3. **Every section earns its space.** If a module is empty for a given beach, it disappears — no "coming soon" stubs.
4. **Progressive density.** Hero/intro is broad and emotional; deeper sections are specific and dense.
5. **The page teaches the data model.** Sections map 1:1 to DB tables/columns so we can scale.

---

## Visual Direction

- **Hero:** full-bleed modern photo of the arc-with-Sugarloaf. Large italic-display title, place-subtitle above, subtle downward gradient. Parallax-light, no video yet.
- **Signature motif: the Burle Marx wave mosaic.** Black-white wave pattern appears as:
  - Section dividers (SVG, 32px tall strip)
  - Page loading indicator
  - Subtle watermark behind the timeline
  - The design language of the entire site, not a one-off Easter egg
- **Palette:** Keep existing ocean / volcanic / reef tokens. Add `sand` (warm neutral #F0E5D4) and `mosaic-black` (#1a1a1a) + `mosaic-white` (#F5F2EB) for the pattern.
- **Typography:** DM Serif Display (headings) + Inter (body) — already in place. Add a mono (JetBrains Mono) for data labels to give data-cards their own voice.
- **Photography:** Large, bleed edges, no rounded corners on hero shots. Gallery uses masonry. Everything attributed inline — license chip, author name, source link.

---

## Information Architecture

The page is one long scroll with deep-linkable sections. Top tab nav ("lenses") disappears in favor of in-page anchors. The posto system becomes the IA spine.

```
┌─ HERO (full-bleed photo, title, location, "Rio de Janeiro, Brasil")
├─ ATMOSPHERE STRIP (one poetic sentence, key stats inline: length, founded, NYE crowd, Olympics host)
├─ BURLE MARX DIVIDER
│
├─ 1. SENSE OF PLACE (400 words)
│   ├─ narrative intro — why this beach matters
│   └─ mini-map with Leme/Central/Fort + Sugarloaf sightline
│
├─ 2. THE POSTO CODE (interactive)
│   ├─ SVG map of the beach arc, 6 posto markers
│   ├─ hover/click each → sub-card: character, typical crowd, best for, nearest kiosk
│   └─ caption: "Cariocas sort themselves by posto the way New Yorkers sort by subway stop"
│
├─ 3. A DAY IN COPACABANA TIME (sensory)
│   ├─ dawn (fishermen at Posto 6, joggers, surfers)
│   ├─ midday (peak beach, beach soccer, vendor calls)
│   ├─ golden hour (capoeira circles, caipirinha carts)
│   ├─ night (promenade walks, bar overflow, lit fort)
│   └─ Each with its own photo
│
├─ 4. HISTORY TIMELINE (vertical)
│   Fishing village (pre-1890) → 1892 tunnel → 1908 first bathers → 1923 Copacabana Palace
│   → 1930s–60s glamour → 1942 Stefan Zweig's exile → 1958 bossa nova
│   → 1970 Burle Marx wave pavement → 1970s decline → 2016 Olympic beach volleyball
│   → present day. Each event a photo + 2-sentence story.
│
├─ 5. THE PALACE, THE FORT, THE MOSAIC (architecture triptych)
│   Three landmarks, each a rich card: Copacabana Palace, Forte de Copacabana, Calçadão.
│
├─ 6. WHEN TO GO (climate visualization)
│   ├─ 12-month line chart: air temp high/low, water temp, rain, sun hours
│   ├─ "Best months" auto-computed call-out
│   └─ Special dates: NYE (fireworks), Carnaval, Iemanjá (Feb 2)
│
├─ 7. WILDLIFE OVERHEAD (species card grid)
│   The Magnificent Frigatebird, Black Vulture, Common Marmoset — 3–6 highlighted with photos
│
├─ 8. EATING + DRINKING AT THE KIOSKS
│   Caipirinha, biscoito Globo, queijo coalho, água de coco — 4 icon cards
│   (NOTE: generic Brazilian, not business-specific. No invented restaurant names.)
│
├─ 9. PRACTICAL (the current travel.mdx content, restructured)
│   Getting there · Where to stay (by section) · Costs · Safety nuance
│
├─ 10. NYE & CARNAVAL (editorial feature)
│   Full-bleed NYE fireworks photo, 3M-person crowd, all-white Yemanjá tradition,
│   20-min synchronized show. Same treatment for Carnaval Baile do Copa.
│
├─ 11. CULTURAL FOOTPRINT (sidebar-style)
│   Barry Manilow's song · Stefan Zweig's last year · Astrud Gilberto ·
│   Simpsons in Rio · Fast Five · Olympic volleyball 2016 · Lady Gaga 2025.
│
├─ 12. THE FAVELA ABOVE (honest note)
│   Cantagalo/Pavão-Pavãozinho visible from the beach. Acknowledge the class
│   geography; this is part of the beach's meaning. 150 words, no voyeurism.
│
├─ 13. MAP + NEARBY BEACHES
│   Interactive map, pins for Ipanema, Leblon, Leme, Arpoador, Botafogo, Flamengo
│
├─ 14. DATA & SOURCES (footer-style)
│   iNaturalist (species), Wikipedia (pageviews + narrative), OSM (geometry/facilities),
│   Open-Meteo (climate), GSAF (shark), Wikimedia Commons (photos, by image).
│   License + author for every image. Last-updated timestamp.
│
└─ FOOTER
```

**What disappears:** the current "Explore Copacabana" lens grid (overview, travel, diving, family...). Those lenses are for beaches without this depth of content. Copacabana's content is inlined.

---

## Content Inventory

| Section | Source | Who writes |
|---|---|---|
| 1. Sense of Place (400w) | Fresh, narrative | Claude, new MDX `intro.mdx` |
| 2. Posto Code (6 cards × ~80w) | Cultural knowledge + Wikipedia | Claude, new `postos.json` + MDX |
| 3. A Day in Time (4 vignettes × ~120w) | Fresh, narrative | Claude, new `day.mdx` |
| 4. History Timeline (12 events × ~40w) | Wikipedia + research | Claude, new `timeline.json` |
| 5. Triptych (3 cards × ~200w) | Wikipedia | Claude, new `landmarks.json` |
| 6. When to Go | DB data, backfilled | Rendered from DB |
| 7. Wildlife | `beach_species` table | Rendered from DB |
| 8. Kiosks (4 cards × ~50w) | Fresh, generic (no business names) | Claude, new `food.json` |
| 9. Practical | Reuse existing `travel.mdx` | Existing, restructured |
| 10. NYE/Carnaval (2 × ~150w) | Wikipedia | Claude, new `events.mdx` |
| 11. Cultural Footprint | Wikipedia + pop-culture lookup | Claude, new `culture.json` |
| 12. Favela Above (150w) | Thoughtful, researched | Claude, new `context.mdx` |
| 13. Nearby beaches | DB query by proximity | Rendered from DB |
| 14. Sources | `beach_sources` + `beach_photos` | Rendered from DB |

---

## DB Schema Additions (generalize to every beach)

These are the tables/columns that today are narrative-only. Formalizing them means any beach can earn this treatment.

### New tables

```sql
-- Timeline events (history, design milestones, cultural moments)
CREATE TABLE beach_timeline_events (
  id INTEGER PRIMARY KEY,
  beach_id TEXT NOT NULL REFERENCES beaches(id),
  year INTEGER NOT NULL,           -- 1923
  month INTEGER,                   -- optional
  event_type TEXT NOT NULL,        -- 'founded'|'built'|'cultural'|'sport'|'political'|'natural'
  title TEXT NOT NULL,             -- "Copacabana Palace opens"
  description TEXT NOT NULL,       -- ~40 words
  wiki_url TEXT,
  photo_id INTEGER REFERENCES beach_photos(id),
  source TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sub-zones (postos, coves, sections) — social/spatial micro-geography
CREATE TABLE beach_zones (
  id INTEGER PRIMARY KEY,
  beach_id TEXT NOT NULL REFERENCES beaches(id),
  zone_code TEXT NOT NULL,         -- 'posto-1', 'leme-end', 'fort'
  name TEXT NOT NULL,              -- "Posto 2 — Families"
  position_along_beach_pct REAL,   -- 0.0 = north end, 1.0 = south end
  lat REAL, lng REAL,
  character TEXT NOT NULL,         -- "Families and first-timers. Calmest water. Few vendors."
  best_for TEXT,                   -- "swimming, kids, morning shade"
  notes TEXT,
  source TEXT,
  UNIQUE(beach_id, zone_code)
);

-- Landmarks (buildings, monuments, features)
CREATE TABLE beach_landmarks (
  id INTEGER PRIMARY KEY,
  beach_id TEXT NOT NULL REFERENCES beaches(id),
  name TEXT NOT NULL,              -- "Copacabana Palace"
  landmark_type TEXT NOT NULL,     -- 'hotel'|'fort'|'monument'|'natural'|'design'
  year_built INTEGER,
  architect_or_designer TEXT,
  description TEXT NOT NULL,
  wikipedia_url TEXT,
  lat REAL, lng REAL,
  photo_id INTEGER REFERENCES beach_photos(id),
  source TEXT
);

-- Cultural references (films, books, songs, famous events)
CREATE TABLE beach_cultural_refs (
  id INTEGER PRIMARY KEY,
  beach_id TEXT NOT NULL REFERENCES beaches(id),
  ref_type TEXT NOT NULL,          -- 'song'|'film'|'book'|'tv'|'event'|'person'
  title TEXT NOT NULL,             -- "Copacabana (song)"
  creator TEXT,                    -- "Barry Manilow"
  year INTEGER,
  description TEXT,                -- 1-sentence context
  wikipedia_url TEXT,
  external_url TEXT,
  source TEXT
);

-- Recurring events (NYE, Carnaval, festivals)
CREATE TABLE beach_recurring_events (
  id INTEGER PRIMARY KEY,
  beach_id TEXT NOT NULL REFERENCES beaches(id),
  name TEXT NOT NULL,              -- "Réveillon"
  when_text TEXT NOT NULL,         -- "Dec 31 night"
  month INTEGER,                   -- 12
  description TEXT NOT NULL,
  typical_attendance INTEGER,      -- 3000000
  photo_id INTEGER REFERENCES beach_photos(id),
  source TEXT
);
```

### New columns on `beaches`

```sql
ALTER TABLE beaches ADD COLUMN intro_text TEXT;          -- the ~400-word "sense of place"
ALTER TABLE beaches ADD COLUMN favela_note TEXT;         -- thoughtful context where applicable
ALTER TABLE beaches ADD COLUMN day_in_time_json TEXT;    -- JSON: {dawn, midday, golden, night}
ALTER TABLE beaches ADD COLUMN food_drink_json TEXT;     -- JSON array of 4 kiosk-level items
ALTER TABLE beaches ADD COLUMN hero_photo_id INTEGER REFERENCES beach_photos(id);
ALTER TABLE beaches ADD COLUMN gallery_photo_ids TEXT;   -- JSON array of photo_ids
ALTER TABLE beaches ADD COLUMN signature_motif TEXT;     -- 'burle-marx-wave' for Copacabana
```

**Why in DB vs. MDX files:** so scaling to 100+ beaches doesn't require a writer. Subagents fill cells, page renders them. MDX remains for the one free-form narrative (`intro_text`).

---

## Component Inventory

### Exists today (site/components/)
- ✅ `BeachHero` — takes `imageUrl`; today we pass `undefined`. One-line fix.
- ✅ `DataCard`, `MapEmbed`, `Breadcrumbs`, `Footer`, `Nav`
- ✅ `LensSummaryCard`, `LensTabs` — **will be unused on Copacabana**
- 🟡 `WeatherWidget`, `TideChart` — stubs; need real implementation with data

### New components needed
- `HeroPhoto` — full-bleed, attribution pill in corner, loads from `hero_photo_id`
- `AtmosphereStrip` — 1-liner + 4 key stats in mono type
- `BurleMarxDivider` — SVG wave pattern, 32px tall
- `PostoMap` — interactive SVG of the arc, posto markers, hover-cards
- `Timeline` — vertical timeline rendering `beach_timeline_events`
- `LandmarkTriptych` — 3-up grid, each a card from `beach_landmarks`
- `MonthlyClimateChart` — Recharts multi-line (temp_high, temp_low, water_temp, rain_mm); auto-computed "best months" callout
- `SpeciesGrid` — 3-6 cards from `beach_species`; taxon icon, common name, observation count, wiki link
- `FoodIconRow` — 4 cards from `food_drink_json`
- `EventFeature` — full-bleed event feature (NYE, Carnaval), photo + story
- `CulturalFootprint` — compact list of `beach_cultural_refs` grouped by type
- `PhotoGallery` — masonry, lightbox, full attribution
- `SourcesFooter` — data provenance + "last updated"
- `NearbyBeaches` — proximity query, card row

### Components NOT to build yet
- Live webcam embed (future when webcam data ingested)
- Tide chart real version (backfill first, component second)
- User reviews (no data model for this)

---

## Execution Order

1. **Backfill climate + tide + ocean for Copacabana row** (Open-Meteo single-cell). Unblocks MonthlyClimateChart.
2. **Add 5 new tables + 7 new columns** to DB. One migration file.
3. **Populate new tables for Copacabana** — timeline (~12 rows), zones (6 postos), landmarks (3), cultural_refs (~10), recurring_events (2). Hand-curated from Wikipedia + knowledge.
4. **Curate hero photo** — pick from 81, or source permissioned from Unsplash.
5. **Update export pipeline** to ship all new tables + columns into `site/data/beaches/copacabana-7.json`.
6. **Build components** — start with HeroPhoto, Timeline, PostoMap, MonthlyClimateChart.
7. **Build Copacabana-specific page** at `app/beaches/copacabana-7/page.tsx` (overrides the generic template).
8. **Deploy + iterate.**
9. **Fix the metadata-leakage bug** across all 301 overview.mdx files.
10. **Later:** generalize the template so other top-tier beaches inherit the structure.

---

## What we'll know after Copacabana

- Whether the DB schema generalizes or needs to split by beach archetype (urban beach vs. remote paradise vs. surf break)
- How much content is hand-written vs. subagent-batched
- Whether an editorial/publishing workflow is needed (draft → review → publish)
- Production cost per beach: photo curation, cultural research, climate backfill
- The quality bar that future Haiku prompts can reference concretely
