# WorldBeachTour.com Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Next.js site framework with full URL architecture, content pipeline tooling, and two complete prototype beaches (Waikiki + Reynisfjara) with all viable lens pages.

**Architecture:** Monorepo with `site/` (Next.js app) alongside existing Python DB pipeline. JSON export script dumps per-beach files from SpatiaLite. MDX content files live in `site/content/`. Prompt templates in `content-pipeline/templates/` generate editorial MDX via Claude Max.

**Tech Stack:** Next.js 15 (App Router, SSG), Tailwind CSS, MDX (`next-mdx-remote`), Leaflet (maps), Pagefind (search — deferred to post-Phase 1), Cloudflare Pages.

**Important Notes:**
- Next.js 15 requires `params` to be awaited in all dynamic routes (it's a Promise now). All page/layout functions using params must be `async`.
- Prototype beach slugs (`waikiki-hawaii-us`, `reynisfjara-south-is`) are assumed. After Task 1 Step 2, update all subsequent slug references to match actual DB slugs.
- Content lives at `site/content/` (co-located with the site, not in `content-pipeline/`) — deliberate deviation from spec for simpler builds.

**Spec:** `docs/superpowers/specs/2026-03-23-worldbeachtour-site-design.md`

---

## File Structure

```
worldbeachtour/
├── src/export/exporters.py          ← MODIFY: add per-beach JSON export
├── site/                            ← CREATE: Next.js app
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── app/
│   │   ├── layout.tsx               ← Root layout (nav, footer)
│   │   ├── page.tsx                 ← Homepage
│   │   ├── globals.css
│   │   ├── not-found.tsx            ← 404 page
│   │   ├── beaches/
│   │   │   ├── page.tsx             ← Browse/search all beaches
│   │   │   └── [slug]/
│   │   │       ├── page.tsx         ← Beach overview
│   │   │       ├── layout.tsx       ← Beach layout (hero, lens tab bar)
│   │   │       ├── travel/page.tsx
│   │   │       ├── surf/page.tsx
│   │   │       ├── environment/page.tsx
│   │   │       ├── family/page.tsx
│   │   │       ├── photography/page.tsx
│   │   │       ├── diving/page.tsx
│   │   │       ├── history/page.tsx
│   │   │       └── sand/page.tsx
│   │   └── regions/
│   │       ├── page.tsx             ← All regions
│   │       └── [country]/
│   │           ├── page.tsx         ← Country page
│   │           └── [state]/
│   │               └── page.tsx     ← State page
│   ├── components/
│   │   ├── nav.tsx                  ← Site navigation
│   │   ├── footer.tsx               ← Site footer
│   │   ├── lens-tabs.tsx            ← Lens tab bar component
│   │   ├── beach-hero.tsx           ← Hero section (image + name + location)
│   │   ├── beach-card.tsx           ← Beach preview card (used in browse, related)
│   │   ├── lens-summary-card.tsx    ← Condensed lens card (used on overview page)
│   │   ├── map-embed.tsx            ← Leaflet map component
│   │   ├── data-card.tsx            ← Structured data display card
│   │   ├── mdx-components.tsx       ← MDX component registry
│   │   ├── tide-chart.tsx           ← Placeholder live widget
│   │   ├── weather-widget.tsx       ← Placeholder live widget
│   │   ├── water-quality-widget.tsx ← Placeholder live widget
│   │   └── lens-page-template.tsx  ← Shared lens page renderer
│   ├── lib/
│   │   ├── beaches.ts               ← Load beach JSON data + MDX content
│   │   ├── lenses.ts                ← Lens definitions, metadata, icons
│   │   └── regions.ts               ← Aggregate beaches by region
│   └── content/
│       └── beaches/
│           ├── waikiki-hawaii-us/
│           │   ├── meta.json
│           │   ├── overview.mdx
│           │   ├── travel.mdx
│           │   ├── surf.mdx
│           │   ├── environment.mdx
│           │   ├── family.mdx
│           │   ├── photography.mdx
│           │   ├── diving.mdx
│           │   ├── history.mdx
│           │   └── sand.mdx
│           └── reynisfjara-south-is/
│               ├── meta.json
│               ├── overview.mdx
│               ├── history.mdx
│               ├── sand.mdx
│               ├── photography.mdx
│               └── environment.mdx
├── content-pipeline/
│   ├── data/                        ← JSON exports from DB land here
│   │   └── beaches/
│   │       ├── waikiki-hawaii-us.json
│   │       └── reynisfjara-south-is.json
│   └── templates/                   ← Prompt templates per lens
│       ├── overview.md
│       ├── travel.md
│       ├── surf.md
│       ├── environment.md
│       ├── family.md
│       ├── photography.md
│       ├── diving.md
│       ├── history.md
│       └── sand.md
└── output/                          ← Existing DB output directory
    └── world_beaches.db
```

---

## Task 1: JSON Export Script

Add a per-beach JSON exporter to the existing Python pipeline that dumps denormalized JSON files matching the spec schema.

**Files:**
- Modify: `src/export/exporters.py`
- Create: `content-pipeline/data/beaches/` (output directory)
- Test: manual — run export, verify JSON shape

- [ ] **Step 1: Add `export_beach_json` function to exporters.py**

Add after the existing `export_geojson` function:

```python
def export_beach_json(conn, output_dir, slugs=None):
    """Export individual JSON files per beach for the site content pipeline.

    Args:
        conn: SQLite connection
        output_dir: Directory to write JSON files to
        slugs: Optional list of slugs to export. If None, exports all.
    """
    os.makedirs(output_dir, exist_ok=True)

    query = """
        SELECT b.*, GROUP_CONCAT(DISTINCT bs.source_name) as source_names
        FROM beaches b
        LEFT JOIN beach_sources bs ON bs.beach_id = b.id
    """
    params = []
    if slugs:
        placeholders = ",".join("?" for _ in slugs)
        query += f" WHERE b.slug IN ({placeholders})"
        params = slugs
    query += " GROUP BY b.id"

    rows = conn.execute(query, params).fetchall()
    count = 0

    for row in rows:
        row = dict(row)
        if not row["slug"]:
            continue

        # Gather sources
        sources = conn.execute("""
            SELECT source_name, source_id, source_url
            FROM beach_sources WHERE beach_id = ?
        """, (row["id"],)).fetchall()

        # Gather attributes grouped by category
        attrs = conn.execute("""
            SELECT category, key, value, value_type
            FROM beach_attributes WHERE beach_id = ?
        """, (row["id"],)).fetchall()

        attr_dict = {}
        for a in attrs:
            a = dict(a)
            cat = a["category"]
            if cat not in attr_dict:
                attr_dict[cat] = {}
            val = a["value"]
            if a["value_type"] == "number":
                try:
                    val = float(val)
                    if val == int(val):
                        val = int(val)
                except (ValueError, TypeError):
                    pass
            elif a["value_type"] == "boolean":
                val = val.lower() in ("true", "1", "yes")
            attr_dict[cat][a["key"]] = val

        beach_data = {
            "slug": row["slug"],
            "name": row["name"],
            "centroid_lat": row["centroid_lat"],
            "centroid_lng": row["centroid_lng"],
            "country_code": row["country_code"],
            "admin_level_1": row["admin_level_1"],
            "admin_level_2": row["admin_level_2"],
            "water_body_type": row["water_body_type"],
            "substrate_type": row["substrate_type"],
            "beach_length_m": row["beach_length_m"],
            "sources": [
                {"source_name": dict(s)["source_name"],
                 "source_id": dict(s)["source_id"],
                 "source_url": dict(s)["source_url"]}
                for s in sources
            ],
            "attributes": attr_dict,
        }

        filepath = os.path.join(output_dir, f"{row['slug']}.json")
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(beach_data, f, indent=2, ensure_ascii=False)
        count += 1

    print(f"  Exported {count} beach JSON files to {output_dir}")
    return count
```

- [ ] **Step 2: Run the export for the two prototype beaches**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
python -c "
from src.db.schema import get_connection
from src.export.exporters import export_beach_json
conn = get_connection()
# Check what slugs exist for our prototype beaches
rows = conn.execute(\"SELECT slug, name FROM beaches WHERE name LIKE '%Waikiki%' OR name LIKE '%Reynisfjara%'\").fetchall()
for r in rows:
    print(dict(r))
"
```

Note: The exact slugs may differ from what we assumed. Adjust based on output.

- [ ] **Step 3: Export and verify JSON shape**

```bash
python -c "
from src.db.schema import get_connection
from src.export.exporters import export_beach_json
conn = get_connection()
export_beach_json(conn, 'content-pipeline/data/beaches')
"
```

Verify one of the output files matches the spec schema shape.

- [ ] **Step 4: Commit**

```bash
git add src/export/exporters.py content-pipeline/data/
git commit -m "feat: add per-beach JSON export for site content pipeline"
```

---

## Task 2: Next.js Project Scaffold

Initialize the Next.js app with Tailwind, TypeScript, and MDX support.

**Files:**
- Create: `site/` directory with Next.js scaffold
- Create: `site/package.json`, `site/next.config.mjs`, `site/tailwind.config.ts`, `site/tsconfig.json`

- [ ] **Step 1: Initialize Next.js app**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
npx create-next-app@latest site --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-turbopack
```

- [ ] **Step 2: Install MDX and map dependencies**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour/site
npm install next-mdx-remote gray-matter
npm install react-leaflet leaflet
npm install -D @types/leaflet @tailwindcss/typography
```

Then add `@tailwindcss/typography` to `tailwind.config.ts` plugins array:

```typescript
plugins: [require("@tailwindcss/typography")],
```

- [ ] **Step 3: Configure next.config.mjs for static export**

Replace `site/next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 4: Verify the app builds and runs**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour/site
npm run dev
```

Visit http://localhost:3000 — confirm default Next.js page loads.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
git add site/
git commit -m "feat: scaffold Next.js app with Tailwind, MDX, Leaflet"
```

---

## Task 3: Data Loading Library

Build the TypeScript functions that load beach JSON data and MDX content at build time.

**Files:**
- Create: `site/lib/beaches.ts`
- Create: `site/lib/lenses.ts`
- Create: `site/lib/regions.ts`

- [ ] **Step 1: Create lens definitions**

Create `site/lib/lenses.ts`:

```typescript
export const LENSES = [
  { id: "travel", label: "Travel", icon: "✈️" },
  { id: "surf", label: "Surf", icon: "🏄" },
  { id: "environment", label: "Environment", icon: "🌿" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: "photography", label: "Photography", icon: "📷" },
  { id: "diving", label: "Diving", icon: "🤿" },
  { id: "history", label: "History", icon: "📜" },
  { id: "sand", label: "Sand & Geology", icon: "🏖️" },
] as const;

export type LensId = (typeof LENSES)[number]["id"];

export function getLens(id: string) {
  return LENSES.find((l) => l.id === id);
}
```

- [ ] **Step 2: Create beach data loader**

Create `site/lib/beaches.ts`:

```typescript
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "beaches");
const DATA_DIR = path.join(process.cwd(), "..", "content-pipeline", "data", "beaches");

export interface BeachMeta {
  tier: number;
  lenses: string[];
  custom: string[];
  images: { hero: string; gallery: string[] };
}

export interface BeachData {
  slug: string;
  name: string;
  centroid_lat: number;
  centroid_lng: number;
  country_code: string;
  admin_level_1: string;
  admin_level_2: string;
  water_body_type: string;
  substrate_type: string;
  beach_length_m: number | null;
  sources: { source_name: string; source_id: string; source_url: string }[];
  attributes: Record<string, Record<string, string | number | boolean>>;
}

export function getAllBeachSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter((entry) => {
    const metaPath = path.join(CONTENT_DIR, entry, "meta.json");
    return fs.existsSync(metaPath);
  });
}

export function getBeachMeta(slug: string): BeachMeta {
  const metaPath = path.join(CONTENT_DIR, slug, "meta.json");
  return JSON.parse(fs.readFileSync(metaPath, "utf-8"));
}

export function getBeachData(slug: string): BeachData | null {
  const dataPath = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(dataPath)) return null;
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

export function getBeachMdx(slug: string, lens: string): string | null {
  const mdxPath = path.join(CONTENT_DIR, slug, `${lens}.mdx`);
  if (!fs.existsSync(mdxPath)) return null;
  return fs.readFileSync(mdxPath, "utf-8");
}

export function getAllBeaches(): (BeachData & { meta: BeachMeta })[] {
  const slugs = getAllBeachSlugs();
  return slugs
    .map((slug) => {
      const data = getBeachData(slug);
      const meta = getBeachMeta(slug);
      if (!data) return null;
      return { ...data, meta };
    })
    .filter(Boolean) as (BeachData & { meta: BeachMeta })[];
}
```

- [ ] **Step 3: Create regions aggregator**

Create `site/lib/regions.ts`:

```typescript
import { getAllBeaches, type BeachData, type BeachMeta } from "./beaches";

export interface Region {
  country_code: string;
  admin_level_1: string | null;
  beach_count: number;
  beaches: (BeachData & { meta: BeachMeta })[];
}

export function getCountries(): { code: string; count: number }[] {
  const beaches = getAllBeaches();
  const countryMap = new Map<string, number>();
  for (const b of beaches) {
    if (!b.country_code) continue;
    countryMap.set(b.country_code, (countryMap.get(b.country_code) || 0) + 1);
  }
  return Array.from(countryMap.entries())
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count);
}

export function getBeachesByCountry(
  countryCode: string
): (BeachData & { meta: BeachMeta })[] {
  return getAllBeaches().filter((b) => b.country_code === countryCode);
}

export function getStatesByCountry(
  countryCode: string
): { state: string; count: number }[] {
  const beaches = getBeachesByCountry(countryCode);
  const stateMap = new Map<string, number>();
  for (const b of beaches) {
    if (!b.admin_level_1) continue;
    stateMap.set(b.admin_level_1, (stateMap.get(b.admin_level_1) || 0) + 1);
  }
  return Array.from(stateMap.entries())
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);
}

export function getBeachesByState(
  countryCode: string,
  state: string
): (BeachData & { meta: BeachMeta })[] {
  return getAllBeaches().filter(
    (b) => b.country_code === countryCode && b.admin_level_1 === state
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
git add site/lib/
git commit -m "feat: add beach data loaders, lens definitions, region aggregator"
```

---

## Task 4: Shared Components

Build the reusable UI components: nav, footer, lens tabs, hero, cards, map, placeholder widgets.

**Files:**
- Create: `site/components/nav.tsx`
- Create: `site/components/footer.tsx`
- Create: `site/components/lens-tabs.tsx`
- Create: `site/components/beach-hero.tsx`
- Create: `site/components/beach-card.tsx`
- Create: `site/components/lens-summary-card.tsx`
- Create: `site/components/data-card.tsx`
- Create: `site/components/map-embed.tsx`
- Create: `site/components/mdx-components.tsx`
- Create: `site/components/tide-chart.tsx`
- Create: `site/components/weather-widget.tsx`
- Create: `site/components/water-quality-widget.tsx`

- [ ] **Step 1: Create Nav component**

Create `site/components/nav.tsx`:

```tsx
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-900">
            World Beach Tour
          </Link>
          <div className="flex gap-6">
            <Link
              href="/beaches"
              className="text-gray-600 hover:text-blue-900"
            >
              Beaches
            </Link>
            <Link
              href="/regions"
              className="text-gray-600 hover:text-blue-900"
            >
              Regions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `site/components/footer.tsx`:

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
        <p>World Beach Tour — Every beach on Earth.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create LensTabs component**

Create `site/components/lens-tabs.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LENSES } from "@/lib/lenses";

interface LensTabsProps {
  slug: string;
  activeLenses: string[];
}

export default function LensTabs({ slug, activeLenses }: LensTabsProps) {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <nav className="mx-auto max-w-7xl px-4 flex gap-1">
        <TabLink
          href={`/beaches/${slug}`}
          label="Overview"
          active={pathname === `/beaches/${slug}`}
        />
        {LENSES.filter((l) => activeLenses.includes(l.id)).map((lens) => (
          <TabLink
            key={lens.id}
            href={`/beaches/${slug}/${lens.id}`}
            label={lens.label}
            active={pathname === `/beaches/${slug}/${lens.id}`}
          />
        ))}
      </nav>
    </div>
  );
}

function TabLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {label}
    </Link>
  );
}
```

- [ ] **Step 4: Create BeachHero component**

Create `site/components/beach-hero.tsx`:

```tsx
interface BeachHeroProps {
  name: string;
  location: string;
  imageUrl?: string;
}

export default function BeachHero({
  name,
  location,
  imageUrl,
}: BeachHeroProps) {
  return (
    <div className="relative h-64 sm:h-80 bg-gray-300">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">{name}</h1>
        <p className="text-lg text-white/80 mt-1">{location}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create BeachCard component**

Create `site/components/beach-card.tsx`:

```tsx
import Link from "next/link";

interface BeachCardProps {
  slug: string;
  name: string;
  location: string;
  waterBodyType: string;
  substrateType: string;
}

export default function BeachCard({
  slug,
  name,
  location,
  waterBodyType,
  substrateType,
}: BeachCardProps) {
  return (
    <Link
      href={`/beaches/${slug}`}
      className="block rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">{location}</p>
      <div className="flex gap-2 mt-2">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
          {waterBodyType}
        </span>
        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
          {substrateType}
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 6: Create LensSummaryCard component**

Create `site/components/lens-summary-card.tsx`:

```tsx
import Link from "next/link";
import { getLens } from "@/lib/lenses";

interface LensSummaryCardProps {
  slug: string;
  lensId: string;
  summary: string;
}

export default function LensSummaryCard({
  slug,
  lensId,
  summary,
}: LensSummaryCardProps) {
  const lens = getLens(lensId);
  if (!lens) return null;

  return (
    <Link
      href={`/beaches/${slug}/${lensId}`}
      className="block rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{lens.icon}</span>
        <h3 className="font-semibold text-gray-900">{lens.label}</h3>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{summary}</p>
      <p className="text-sm text-blue-600 mt-2">Read more →</p>
    </Link>
  );
}
```

- [ ] **Step 7: Create DataCard component**

Create `site/components/data-card.tsx`:

```tsx
interface DataCardProps {
  label: string;
  value: string;
  unit?: string;
}

export default function DataCard({ label, value, unit }: DataCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900 mt-1">
        {value}
        {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </p>
    </div>
  );
}
```

- [ ] **Step 8: Create MapEmbed placeholder**

Create `site/components/map-embed.tsx`:

```tsx
"use client";

interface MapEmbedProps {
  lat: number;
  lng: number;
  name: string;
}

export default function MapEmbed({ lat, lng, name }: MapEmbedProps) {
  // Placeholder — Leaflet integration in Phase 2
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-100 h-64 flex items-center justify-center">
      <p className="text-gray-500 text-sm">
        Map: {name} ({lat.toFixed(4)}, {lng.toFixed(4)})
      </p>
    </div>
  );
}
```

- [ ] **Step 9: Create placeholder live widgets**

Create `site/components/tide-chart.tsx`:

```tsx
export default function TideChart() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-400">
      Tide Chart — live data coming in Phase 3
    </div>
  );
}
```

Create `site/components/weather-widget.tsx`:

```tsx
export default function WeatherWidget() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-400">
      Weather — live data coming in Phase 3
    </div>
  );
}
```

Create `site/components/water-quality-widget.tsx`:

```tsx
export default function WaterQualityWidget() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-400">
      Water Quality — live data coming in Phase 3
    </div>
  );
}
```

- [ ] **Step 10: Create MDX component registry**

Create `site/components/mdx-components.tsx`:

```tsx
import DataCard from "./data-card";
import MapEmbed from "./map-embed";
import TideChart from "./tide-chart";
import WeatherWidget from "./weather-widget";
import WaterQualityWidget from "./water-quality-widget";

export const mdxComponents = {
  DataCard,
  MapEmbed,
  TideChart,
  WeatherWidget,
  WaterQualityWidget,
};
```

- [ ] **Step 11: Commit**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
git add site/components/
git commit -m "feat: add shared UI components — nav, footer, lens tabs, cards, placeholders"
```

---

## Task 5: Root Layout & Homepage

Wire up the root layout (nav + footer wrapping all pages) and build the homepage.

**Files:**
- Modify: `site/app/layout.tsx`
- Modify: `site/app/page.tsx`
- Modify: `site/app/globals.css`

- [ ] **Step 1: Update root layout**

Replace `site/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Beach Tour — Every Beach on Earth",
  description:
    "The definitive guide to every beach on Earth. Travel, surf, environment, history, sand geology, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-gray-900">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Build homepage**

Replace `site/app/page.tsx`:

```tsx
import Link from "next/link";
import BeachCard from "@/components/beach-card";
import { getAllBeaches } from "@/lib/beaches";

export default function HomePage() {
  const beaches = getAllBeaches();

  return (
    <div>
      {/* Hero */}
      <section className="bg-blue-950 text-white py-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold">World Beach Tour</h1>
        <p className="mt-4 text-lg text-blue-200 max-w-2xl mx-auto">
          The definitive guide to every beach on Earth. Explore through the lens
          that matters to you — travel, surf, environment, history, sand, and
          more.
        </p>
        <Link
          href="/beaches"
          className="mt-8 inline-block bg-white text-blue-950 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Explore Beaches
        </Link>
      </section>

      {/* Featured beaches */}
      {beaches.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Featured Beaches</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {beaches.map((beach) => (
              <BeachCard
                key={beach.slug}
                slug={beach.slug}
                name={beach.name}
                location={[beach.admin_level_1, beach.country_code]
                  .filter(Boolean)
                  .join(", ")}
                waterBodyType={beach.water_body_type}
                substrateType={beach.substrate_type}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Add not-found.tsx**

Create `site/app/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900">Beach Not Found</h1>
      <p className="mt-4 text-gray-600">
        We haven't mapped this one yet. Try browsing our collection.
      </p>
      <Link
        href="/beaches"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Browse Beaches
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Clean up globals.css**

Replace `site/app/globals.css` with just the Tailwind directives (remove all the default styles from create-next-app):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: Verify build**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour/site
npm run build
```

Expected: Build succeeds (no content yet, so featured beaches section is empty — that's fine).

- [ ] **Step 6: Commit**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
git add site/app/
git commit -m "feat: add root layout, homepage, 404 page"
```

---

## Task 6: Beach Pages (Overview + Lens Routes)

Build the beach layout (hero + lens tabs), overview page, and all 8 lens page routes with MDX rendering.

**Files:**
- Create: `site/app/beaches/page.tsx`
- Create: `site/app/beaches/[slug]/layout.tsx`
- Create: `site/app/beaches/[slug]/page.tsx`
- Create: `site/app/beaches/[slug]/travel/page.tsx`
- Create: `site/app/beaches/[slug]/surf/page.tsx`
- Create: `site/app/beaches/[slug]/environment/page.tsx`
- Create: `site/app/beaches/[slug]/family/page.tsx`
- Create: `site/app/beaches/[slug]/photography/page.tsx`
- Create: `site/app/beaches/[slug]/diving/page.tsx`
- Create: `site/app/beaches/[slug]/history/page.tsx`
- Create: `site/app/beaches/[slug]/sand/page.tsx`

- [ ] **Step 1: Create beaches browse page**

Create `site/app/beaches/page.tsx`:

```tsx
import BeachCard from "@/components/beach-card";
import { getAllBeaches } from "@/lib/beaches";

export const metadata = { title: "Browse Beaches — World Beach Tour" };

export default function BeachesPage() {
  const beaches = getAllBeaches();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Beaches</h1>
      <p className="text-gray-600 mb-8">
        {beaches.length} beaches and counting.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {beaches.map((beach) => (
          <BeachCard
            key={beach.slug}
            slug={beach.slug}
            name={beach.name}
            location={[beach.admin_level_1, beach.country_code]
              .filter(Boolean)
              .join(", ")}
            waterBodyType={beach.water_body_type}
            substrateType={beach.substrate_type}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create beach layout (hero + tabs)**

Create `site/app/beaches/[slug]/layout.tsx`:

```tsx
import { notFound } from "next/navigation";
import BeachHero from "@/components/beach-hero";
import LensTabs from "@/components/lens-tabs";
import { getBeachData, getBeachMeta, getAllBeachSlugs } from "@/lib/beaches";

export function generateStaticParams() {
  return getAllBeachSlugs().map((slug) => ({ slug }));
}

export default async function BeachLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getBeachData(slug);
  const meta = getBeachMeta(slug);
  if (!data) notFound();

  const location = [data.admin_level_1, data.country_code]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <BeachHero name={data.name} location={location} />
      <LensTabs slug={slug} activeLenses={meta.lenses} />
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Create beach overview page**

Create `site/app/beaches/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import LensSummaryCard from "@/components/lens-summary-card";
import MapEmbed from "@/components/map-embed";
import { getBeachData, getBeachMeta, getBeachMdx } from "@/lib/beaches";

export default async function BeachOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getBeachData(slug);
  const meta = getBeachMeta(slug);
  if (!data) notFound();

  // Extract first paragraph from each lens MDX as summary
  const summaries: Record<string, string> = {};
  for (const lensId of meta.lenses) {
    const mdx = getBeachMdx(slug, lensId);
    if (mdx) {
      const firstParagraph = mdx
        .split("\n")
        .filter((line) => line.trim() && !line.startsWith("#") && !line.startsWith("import") && !line.startsWith("<"))
        .slice(0, 1)
        .join(" ")
        .slice(0, 200);
      summaries[lensId] = firstParagraph + (firstParagraph.length >= 200 ? "..." : "");
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Explore {data.name}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {meta.lenses.map((lensId) => (
          <LensSummaryCard
            key={lensId}
            slug={slug}
            lensId={lensId}
            summary={summaries[lensId] || "Explore this lens."}
          />
        ))}
      </div>
      <MapEmbed
        lat={data.centroid_lat}
        lng={data.centroid_lng}
        name={data.name}
      />
    </div>
  );
}
```

- [ ] **Step 4: Create generic lens page component**

Since all 8 lens pages share the same structure (load MDX + render), create a shared helper first.

Create `site/components/lens-page-template.tsx`:

```tsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBeachData, getBeachMdx } from "@/lib/beaches";
import { mdxComponents } from "@/components/mdx-components";
import MapEmbed from "@/components/map-embed";

interface LensPageProps {
  slug: string;
  lens: string;
  title: string;
}

export default function LensPage({ slug, lens, title }: LensPageProps) {
  const data = getBeachData(slug);
  const mdxSource = getBeachMdx(slug, lens);
  if (!data || !mdxSource) notFound();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {data.name} — {title}
      </h2>
      <article className="prose prose-gray max-w-none mb-8">
        <MDXRemote source={mdxSource} components={mdxComponents} />
      </article>
      <MapEmbed
        lat={data.centroid_lat}
        lng={data.centroid_lng}
        name={data.name}
      />
    </div>
  );
}
```

- [ ] **Step 5: Create all 8 lens page routes**

Each lens page is a thin wrapper. Create these files:

`site/app/beaches/[slug]/travel/page.tsx`:
```tsx
import LensPage from "@/components/lens-page-template";

export default async function TravelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="travel" title="Travel Guide" />;
}
```

`site/app/beaches/[slug]/surf/page.tsx`:
```tsx
import LensPage from "@/components/lens-page-template";

export default async function SurfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="surf" title="Surf Conditions" />;
}
```

`site/app/beaches/[slug]/environment/page.tsx`:
```tsx
import LensPage from "@/components/lens-page-template";

export default async function EnvironmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="environment" title="Environment" />;
}
```

`site/app/beaches/[slug]/family/page.tsx`:
```tsx
import LensPage from "@/components/lens-page-template";

export default async function FamilyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="family" title="Family Guide" />;
}
```

`site/app/beaches/[slug]/photography/page.tsx`:
```tsx
import LensPage from "@/components/lens-page-template";

export default async function PhotographyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="photography" title="Photography" />;
}
```

`site/app/beaches/[slug]/diving/page.tsx`:
```tsx
import LensPage from "@/components/lens-page-template";

export default async function DivingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="diving" title="Diving & Snorkeling" />;
}
```

`site/app/beaches/[slug]/history/page.tsx`:
```tsx
import LensPage from "@/components/lens-page-template";

export default async function HistoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="history" title="History" />;
}
```

`site/app/beaches/[slug]/sand/page.tsx`:
```tsx
import LensPage from "@/components/lens-page-template";

export default async function SandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="sand" title="Sand & Geology" />;
}
```

- [ ] **Step 6: Verify build**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour/site
npm run build
```

Expected: Build succeeds. No content yet so beach pages won't generate, but the routes compile.

- [ ] **Step 7: Commit**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
git add site/app/beaches/ site/components/lens-page-template.tsx
git commit -m "feat: add beach browse, overview, and all 8 lens page routes"
```

---

## Task 7: Region Pages

Build country and state-level region pages.

**Files:**
- Create: `site/app/regions/page.tsx`
- Create: `site/app/regions/[country]/page.tsx`
- Create: `site/app/regions/[country]/[state]/page.tsx`

- [ ] **Step 1: Create regions index page**

Create `site/app/regions/page.tsx`:

```tsx
import Link from "next/link";
import { getCountries } from "@/lib/regions";

export const metadata = { title: "Regions — World Beach Tour" };

export default function RegionsPage() {
  const countries = getCountries();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore by Region</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {countries.map(({ code, count }) => (
          <Link
            key={code}
            href={`/regions/${code.toLowerCase()}`}
            className="block rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <span className="font-semibold text-gray-900">{code}</span>
            <span className="text-sm text-gray-500 ml-2">
              {count} {count === 1 ? "beach" : "beaches"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create country page**

Create `site/app/regions/[country]/page.tsx`:

```tsx
import Link from "next/link";
import BeachCard from "@/components/beach-card";
import { getBeachesByCountry, getStatesByCountry, getCountries } from "@/lib/regions";

export function generateStaticParams() {
  return getCountries().map(({ code }) => ({ country: code.toLowerCase() }));
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const countryCode = country.toUpperCase();
  const states = getStatesByCountry(countryCode);
  const beaches = getBeachesByCountry(countryCode);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Beaches in {countryCode}</h1>

      {states.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">By State/Province</h2>
          <div className="flex flex-wrap gap-2">
            {states.map(({ state, count }) => (
              <Link
                key={state}
                href={`/regions/${country}/${encodeURIComponent(state.toLowerCase().replace(/\s+/g, "-"))}`}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
              >
                {state} ({count})
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {beaches.slice(0, 30).map((beach) => (
          <BeachCard
            key={beach.slug}
            slug={beach.slug}
            name={beach.name}
            location={beach.admin_level_1 || ""}
            waterBodyType={beach.water_body_type}
            substrateType={beach.substrate_type}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create state page**

Create `site/app/regions/[country]/[state]/page.tsx`:

```tsx
import BeachCard from "@/components/beach-card";
import {
  getBeachesByState,
  getCountries,
  getStatesByCountry,
} from "@/lib/regions";

export function generateStaticParams() {
  const params: { country: string; state: string }[] = [];
  for (const { code } of getCountries()) {
    for (const { state } of getStatesByCountry(code)) {
      params.push({
        country: code.toLowerCase(),
        state: state.toLowerCase().replace(/\s+/g, "-"),
      });
    }
  }
  return params;
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ country: string; state: string }>;
}) {
  const { country, state: stateParam } = await params;
  const countryCode = country.toUpperCase();
  const stateName = decodeURIComponent(stateParam).replace(/-/g, " ");

  // Find the actual state name (case-insensitive match)
  const states = getStatesByCountry(countryCode);
  const match = states.find(
    (s) => s.state.toLowerCase() === stateName.toLowerCase()
  );
  const actualState = match?.state || stateName;

  const beaches = getBeachesByState(countryCode, actualState);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Beaches in {actualState}, {countryCode}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {beaches.map((beach) => (
          <BeachCard
            key={beach.slug}
            slug={beach.slug}
            name={beach.name}
            location={beach.admin_level_2 || ""}
            waterBodyType={beach.water_body_type}
            substrateType={beach.substrate_type}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
git add site/app/regions/
git commit -m "feat: add region pages — country and state level"
```

---

## Task 8: Prompt Templates

Create the prompt templates that will be used in Claude Max to generate editorial MDX content for each lens.

**Files:**
- Create: `content-pipeline/templates/overview.md`
- Create: `content-pipeline/templates/travel.md`
- Create: `content-pipeline/templates/surf.md`
- Create: `content-pipeline/templates/environment.md`
- Create: `content-pipeline/templates/family.md`
- Create: `content-pipeline/templates/photography.md`
- Create: `content-pipeline/templates/diving.md`
- Create: `content-pipeline/templates/history.md`
- Create: `content-pipeline/templates/sand.md`

- [ ] **Step 1: Create overview prompt template**

Create `content-pipeline/templates/overview.md`:

```markdown
# Overview Page Prompt Template

You are writing the overview page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 300-500 words introducing this beach. Cover:
- What makes this beach notable or unique
- Geographic context (where it is, what surrounds it)
- The type of experience someone should expect
- Which lenses (travel, surf, environment, family, photography, diving, history, sand) are most relevant and why

## Tone
Authoritative, engaging, informative. Not salesy or generic. Write like a knowledgeable local explaining their beach to a curious traveler.

## Format
Output as MDX. No frontmatter. No imports. Use plain markdown (headings, paragraphs, lists). You may use these components:
- `<MapEmbed lat={number} lng={number} name="string" />` — for map placement
- `<DataCard label="string" value="string" unit="string" />` — for key stats

Start directly with the content (no title — the page template adds it).
```

- [ ] **Step 2: Create travel prompt template**

Create `content-pipeline/templates/travel.md`:

```markdown
# Travel Lens Prompt Template

You are writing the travel guide page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Getting there** — nearest airports, driving routes, public transit, boat access
- **Best time to visit** — seasons, weather patterns, crowd levels by month
- **Where to stay** — neighborhoods/areas near the beach, accommodation types (don't name specific hotels)
- **Costs** — general cost level for the area, free vs paid beach access
- **Safety** — swimming conditions, crime, health considerations
- **Local tips** — things only a frequent visitor would know

Research the actual geography and travel logistics. Be specific — name real airports, real highways, real transit lines.

## Tone
Practical and specific. A traveler should be able to plan a trip from this page alone.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##) to structure sections. You may use:
- `<DataCard label="string" value="string" unit="string" />` — for key stats
- `<WeatherWidget />` — placeholder for live weather
- `<MapEmbed lat={number} lng={number} name="string" />` — for map
```

- [ ] **Step 3: Create surf prompt template**

Create `content-pipeline/templates/surf.md`:

```markdown
# Surf Lens Prompt Template

You are writing the surf conditions page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **The break** — type (beach break, reef break, point break), direction, bottom type
- **Conditions** — best swell direction, ideal wind, wave size range, consistency
- **Seasons** — when it works best, flat spells, peak season
- **Skill level** — who this wave is for, hazards for beginners, challenges for advanced
- **Crowd factor** — how crowded, localism, etiquette notes
- **Nearby breaks** — other surf spots within short distance
- **Gear** — wetsuit thickness by season, board recommendations

If this beach is not a notable surf spot, say so honestly and briefly (200-300 words). Don't fabricate surf conditions.

## Tone
Written by a surfer for surfers. Technical where it matters, practical throughout.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for conditions summary
- `<TideChart />` — placeholder for live tide data
- `<WeatherWidget />` — placeholder for live wind/weather
```

- [ ] **Step 4: Create environment prompt template**

Create `content-pipeline/templates/environment.md`:

```markdown
# Environment Lens Prompt Template

You are writing the environment page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Water quality** — testing results, pollution sources, swimming advisories
- **Ecosystem** — marine and coastal habitat, notable species, biodiversity
- **Conservation status** — protected area designation, conservation programs
- **Erosion & climate** — shoreline change trends, climate impacts, sea level concerns
- **Pollution** — plastic/litter, runoff, industrial threats
- **Stewardship** — cleanup programs, volunteer opportunities, what visitors can do

Use real data where available. If data is sparse, note what's unknown and why that matters.

## Tone
Scientifically grounded, accessible. An environmentalist or concerned traveler should find this valuable.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for environmental metrics
- `<WaterQualityWidget />` — placeholder for live water quality
```

- [ ] **Step 5: Create family prompt template**

Create `content-pipeline/templates/family.md`:

```markdown
# Family Lens Prompt Template

You are writing the family guide page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Kid-friendliness** — water conditions (gentle slope, calm water, currents), sand quality
- **Facilities** — restrooms, showers, changing rooms, first aid, lifeguards
- **Accessibility** — wheelchair access, stroller-friendly paths, parking proximity
- **Activities** — what kids can do (tide pools, sandcastle building, snorkeling, playgrounds)
- **Food & supplies** — nearby restaurants, shops, picnic areas
- **Safety** — specific hazards for children, supervision needs
- **Best times** — when it's calmest, least crowded, best weather for families

Be honest. If this beach is dangerous or unsuitable for families, say so clearly.

## Tone
Practical, parent-to-parent. Specific enough to plan a family day trip.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for facility/safety info
```

- [ ] **Step 6: Create photography prompt template**

Create `content-pipeline/templates/photography.md`:

```markdown
# Photography Lens Prompt Template

You are writing the photography guide page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Orientation** — which direction the beach faces, sunrise/sunset visibility
- **Golden hour** — best times and seasons for light, where to position
- **Iconic shots** — the compositions that define this beach, viewpoints
- **Landscape features** — rock formations, cliffs, sea stacks, tidepools, wildlife
- **Conditions** — fog, mist, storms that create dramatic shots, best weather
- **Gear tips** — lens recommendations, tripod needs, waterproofing
- **Access for photographers** — best parking, how close you can get, restricted areas

## Tone
Written by a photographer for photographers. Visual and evocative descriptions that help someone plan a shoot.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for orientation/timing data
```

- [ ] **Step 7: Create diving prompt template**

Create `content-pipeline/templates/diving.md`:

```markdown
# Diving & Snorkeling Lens Prompt Template

You are writing the diving/snorkeling page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Visibility** — typical range, best seasons, factors that affect it
- **Marine life** — species commonly seen, seasonal visitors, notable encounters
- **Reef/bottom** — reef type, health, coral coverage, underwater topography
- **Conditions** — currents, depth, entry/exit points, thermoclines
- **Skill level** — suitable for snorkeling, open water divers, advanced only?
- **Dive sites** — specific spots accessible from this beach
- **Operators** — general availability of dive shops/rentals (don't name specific shops)

If this beach has no meaningful diving/snorkeling, say so briefly (200-300 words).

## Tone
Written for underwater enthusiasts. Technical where needed.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for conditions summary
```

- [ ] **Step 8: Create history prompt template**

Create `content-pipeline/templates/history.md`:

```markdown
# History Lens Prompt Template

You are writing the history page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Indigenous history** — the people who lived here first, their relationship with this coast
- **Colonial/settlement history** — who arrived, when, what changed
- **Notable events** — battles, shipwrecks, discoveries, cultural moments
- **Cultural significance** — how this beach fits into local/national identity
- **Evolution** — how the beach and its surroundings have changed over time
- **Modern era** — tourism development, environmental battles, current cultural role

Research real history. Cite specific dates, people, events. Don't fabricate.

## Tone
Narrative storytelling grounded in fact. The reader should feel they understand the human story of this place.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for key dates/facts
```

- [ ] **Step 9: Create sand prompt template**

Create `content-pipeline/templates/sand.md`:

```markdown
# Sand & Geology Lens Prompt Template

You are writing the sand and geology page for **{{beach_name}}** on WorldBeachTour.com.

## Beach Data
```json
{{beach_json}}
```

## Instructions

Write 800-1500 words covering:
- **Sand composition** — mineral makeup, grain size, color, where it comes from
- **Geological origin** — how this beach formed, the geological processes at work
- **Rock formations** — surrounding geology, cliffs, headlands, volcanic features
- **Sediment transport** — how sand arrives and leaves, longshore drift, river input
- **Unique features** — anything geologically notable (black sand, glass beach, fossil beds, coral sand)
- **Deep time** — geological age of the formations, tectonic context
- **Beach dynamics** — seasonal changes in sand coverage, erosion/accretion patterns

This is the lens that makes WorldBeachTour unique. Go deep on the science. Make geology fascinating.

## Tone
Science writing at its best — rigorous but accessible, detailed but never dry. Carl Sagan meets geology textbook.

## Format
Output as MDX. No frontmatter. No imports. Use markdown headings (##). You may use:
- `<DataCard label="string" value="string" />` — for geological data
```

- [ ] **Step 10: Commit**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
git add content-pipeline/templates/
git commit -m "feat: add prompt templates for all 8 lenses + overview"
```

---

## Task 9: Prototype Content — Waikiki

Generate MDX content for Waikiki across all lenses using the prompt templates in Claude Max. This task is manual — run each prompt template with the Waikiki JSON data, save the output as MDX files.

**Files:**
- Create: `site/content/beaches/waikiki-hawaii-us/meta.json`
- Create: `site/content/beaches/waikiki-hawaii-us/overview.mdx`
- Create: `site/content/beaches/waikiki-hawaii-us/travel.mdx`
- Create: `site/content/beaches/waikiki-hawaii-us/surf.mdx`
- Create: `site/content/beaches/waikiki-hawaii-us/environment.mdx`
- Create: `site/content/beaches/waikiki-hawaii-us/family.mdx`
- Create: `site/content/beaches/waikiki-hawaii-us/photography.mdx`
- Create: `site/content/beaches/waikiki-hawaii-us/diving.mdx`
- Create: `site/content/beaches/waikiki-hawaii-us/history.mdx`
- Create: `site/content/beaches/waikiki-hawaii-us/sand.mdx`

- [ ] **Step 1: Create meta.json**

Create `site/content/beaches/waikiki-hawaii-us/meta.json`:

```json
{
  "tier": 1,
  "lenses": ["travel", "surf", "environment", "family", "photography", "diving", "history", "sand"],
  "custom": [],
  "images": { "hero": "", "gallery": [] }
}
```

- [ ] **Step 2: Generate overview.mdx**

Open Claude Max. Paste the overview prompt template with `{{beach_name}}` replaced by "Waikiki Beach" and `{{beach_json}}` replaced by the contents of `content-pipeline/data/beaches/waikiki-hawaii-us.json`. Save output to `site/content/beaches/waikiki-hawaii-us/overview.mdx`.

- [ ] **Step 3: Generate travel.mdx**

Same process with travel template. Save to `travel.mdx`.

- [ ] **Step 4: Generate surf.mdx**

Same process with surf template. Save to `surf.mdx`.

- [ ] **Step 5: Generate environment.mdx**

Same process with environment template. Save to `environment.mdx`.

- [ ] **Step 6: Generate family.mdx**

Same process with family template. Save to `family.mdx`.

- [ ] **Step 7: Generate photography.mdx**

Same process with photography template. Save to `photography.mdx`.

- [ ] **Step 8: Generate diving.mdx**

Same process with diving template. Save to `diving.mdx`.

- [ ] **Step 9: Generate history.mdx**

Same process with history template. Save to `history.mdx`.

- [ ] **Step 10: Generate sand.mdx**

Same process with sand template. Save to `sand.mdx`.

- [ ] **Step 11: Verify site builds with content**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour/site
npm run build
```

Expected: Build generates pages for Waikiki. Visit http://localhost:3000/beaches/waikiki-hawaii-us and verify overview + all lens pages render.

- [ ] **Step 12: Commit**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
git add site/content/beaches/waikiki-hawaii-us/
git commit -m "content: add Waikiki Beach — all 8 lenses + overview"
```

---

## Task 10: Prototype Content — Reynisfjara

Same as Task 9 but for Reynisfjara. Only generate lenses where there's real content to write.

**Files:**
- Create: `site/content/beaches/reynisfjara-south-is/meta.json`
- Create: `site/content/beaches/reynisfjara-south-is/overview.mdx`
- Create: `site/content/beaches/reynisfjara-south-is/travel.mdx`
- Create: `site/content/beaches/reynisfjara-south-is/sand.mdx`
- Create: `site/content/beaches/reynisfjara-south-is/history.mdx`
- Create: `site/content/beaches/reynisfjara-south-is/photography.mdx`
- Create: `site/content/beaches/reynisfjara-south-is/environment.mdx`
- Create: `site/content/beaches/reynisfjara-south-is/diving.mdx` (if viable — Reynisfjara has notable but dangerous waters)

Note: Reynisfjara likely does NOT warrant a family page (it's dangerously unsafe for children) or a dedicated surf page. The meta.json should only list lenses that have real content.

- [ ] **Step 1: Create meta.json**

Create `site/content/beaches/reynisfjara-south-is/meta.json`:

```json
{
  "tier": 1,
  "lenses": ["travel", "sand", "history", "photography", "environment"],
  "custom": [],
  "images": { "hero": "", "gallery": [] }
}
```

- [ ] **Step 2: Generate overview.mdx**

Same process as Waikiki. Save to `site/content/beaches/reynisfjara-south-is/overview.mdx`.

- [ ] **Step 3: Generate travel.mdx**

- [ ] **Step 4: Generate sand.mdx**

This is the star page — Reynisfjara's black basalt sand is world-famous. Go deep.

- [ ] **Step 5: Generate history.mdx**

Rich Norse mythology and folklore (troll legends, Reynisdrangar sea stacks).

- [ ] **Step 6: Generate photography.mdx**

One of the most photographed beaches in the world. Basalt columns, sea stacks, dramatic light.

- [ ] **Step 7: Generate environment.mdx**

Unique volcanic ecology, bird colonies (puffins), erosion from North Atlantic storms.

- [ ] **Step 8: Verify site builds**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour/site
npm run build
```

Expected: Both Waikiki and Reynisfjara generate. Browse page shows 2 beaches.

- [ ] **Step 9: Commit**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
git add site/content/beaches/reynisfjara-south-is/
git commit -m "content: add Reynisfjara Beach — sand, history, photography, environment, travel"
```

---

## Task 11: Final Build Verification & Polish

End-to-end verification that the full site builds, all routes work, and navigation flows correctly.

**Files:**
- Possibly modify: any files with issues found during verification

- [ ] **Step 1: Full production build**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour/site
npm run build
```

Verify: no errors, pages generated for both beaches.

- [ ] **Step 2: Verify all routes**

Start dev server and manually check:
- `/` — homepage shows 2 featured beaches
- `/beaches` — browse page shows 2 beaches
- `/beaches/waikiki-hawaii-us` — overview with lens summary cards
- `/beaches/waikiki-hawaii-us/surf` — surf lens with MDX content rendered
- `/beaches/waikiki-hawaii-us/sand` — sand lens
- `/beaches/reynisfjara-south-is` — overview (fewer lens cards)
- `/beaches/reynisfjara-south-is/sand` — sand lens (the star page)
- `/regions` — shows US and IS
- `/regions/us` — shows Hawaii
- Lens tab bar navigation works (client-side transitions)
- 404 for non-existent beach or lens

- [ ] **Step 3: Fix any issues found**

- [ ] **Step 4: Final commit**

```bash
cd C:/Users/Roci/Desktop/worldbeachtour
git add -A
git commit -m "feat: WorldBeachTour Phase 1 complete — framework + 2 prototype beaches"
```
