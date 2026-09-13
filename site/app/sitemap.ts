import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import { getAllBeachSlugs, getBeachData, getBeachMeta, getBeachMdx } from "@/lib/beaches";
import { getCountries, getStatesByCountry } from "@/lib/regions";
import { computeTier } from "@/lib/tier";

const BASE_URL = "https://worldbeachtour.com";

// Generated at build into the standalone output and served at /sitemap.xml by the
// Node server. Replaces the old post-build `out/` scan (obsolete after the
// static-export → standalone/ISR migration, which is why the live sitemap 404'd).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const hubs: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/beaches`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/regions`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/how-many-beaches-in-the-world`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/sand`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const slugs = getAllBeachSlugs();

  const beaches: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/beaches/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Sand & geology deep-dive pages exist only for beaches that carry sand data
  // (mirrors /sand/[slug] generateStaticParams).
  const sand: MetadataRoute.Sitemap = slugs
    .filter((slug) => Boolean(getBeachData(slug)?.sand))
    .map((slug) => ({
      url: `${BASE_URL}/sand/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  // Region hub pages. URL shape mirrors the route's generateStaticParams exactly
  // (country lowercased; state lowercased with spaces → dashes) so every entry
  // resolves to a real page.
  const regions: MetadataRoute.Sitemap = [];
  for (const { code } of getCountries()) {
    const country = code.toLowerCase();
    regions.push({
      url: `${BASE_URL}/regions/${country}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
    for (const { state } of getStatesByCountry(code)) {
      const stateSlug = state.toLowerCase().replace(/\s+/g, "-");
      regions.push({
        url: `${BASE_URL}/regions/${country}/${stateSlug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  // Spoke / lens sub-pages. Until 2026-09-13 the 310 authored deep-dives
  // (/beaches/<slug>/history etc.) were live but absent from the sitemap. The
  // inclusion rule mirrors lens-page-template.tsx exactly (tier >= 2, mdx
  // present, >= 300 prose words) so we never list a URL that 404s.
  const LENSES = ["culture", "diving", "environment", "family", "history", "photography", "sand", "surf", "travel"];
  const spokes: MetadataRoute.Sitemap = [];
  for (const slug of slugs) {
    const data = getBeachData(slug);
    if (!data) continue;
    const meta = getBeachMeta(slug);
    if (computeTier(slug, data, meta) < 2) continue;
    for (const lens of LENSES) {
      const mdx = getBeachMdx(slug, lens);
      if (!mdx || lensWordCount(mdx) < SUBPAGE_MIN_WORDS) continue;
      spokes.push({ url: `${BASE_URL}/beaches/${slug}/${lens}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
    }
  }
  // Bespoke Tier-1 sub-routes (app/beaches/<slug>/<sub>/page.tsx), e.g. bondi-beach/gadigal.
  const appBeaches = path.join(process.cwd(), "app", "beaches");
  if (fs.existsSync(appBeaches)) {
    for (const slug of fs.readdirSync(appBeaches)) {
      if (slug.startsWith("[") || slug === "pipeline") continue;
      const dir = path.join(appBeaches, slug);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const sub of fs.readdirSync(dir)) {
        if (fs.existsSync(path.join(dir, sub, "page.tsx"))) {
          spokes.push({ url: `${BASE_URL}/beaches/${slug}/${sub}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
        }
      }
    }
  }

  return [...hubs, ...beaches, ...spokes, ...sand, ...regions];
}

const SUBPAGE_MIN_WORDS = 300; // keep in sync with components/lens-page-template.tsx
function lensWordCount(mdx: string): number {
  const stripped = mdx
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ");
  return stripped.split(/\s+/).filter(Boolean).length;
}
