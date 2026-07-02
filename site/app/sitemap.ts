import type { MetadataRoute } from "next";
import { getAllBeachSlugs, getBeachData } from "@/lib/beaches";
import { getCountries, getStatesByCountry } from "@/lib/regions";

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

  return [...hubs, ...beaches, ...sand, ...regions];
}
