import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "beaches");
// Prefer bundled site-local data (for Vercel deploy); fall back to the sibling
// content-pipeline/data/beaches for local dev.
const SITE_DATA = path.join(process.cwd(), "data", "beaches");
const FALLBACK_DATA = path.join(process.cwd(), "..", "content-pipeline", "data", "beaches");
const DATA_DIR = fs.existsSync(SITE_DATA) ? SITE_DATA : FALLBACK_DATA;

export interface BeachImage {
  url: string;
  title?: string;
  author?: string;
  license?: string;
  source_url?: string;
  width?: number;
  height?: number;
}

export interface BeachMeta {
  tier: number;
  lenses: string[];
  custom: string[];
  /**
   * The lens that carries the most weight on this beach's page. Optional —
   * inferred from `lenses[0]` (or "overview") when absent. Drives main-page
   * lens-section emphasis and which subpage gets the editorial expansion.
   */
  dominant_lens?: string;
  images: {
    hero?: BeachImage;
    gallery?: BeachImage[];
    section?: Record<string, BeachImage>;
  };
}

/**
 * Resolve the dominant lens for a beach: explicit field if present, else
 * the first lens in the `lenses` array, else "overview" as the floor.
 */
export function getDominantLens(meta: BeachMeta): string {
  return meta.dominant_lens ?? meta.lenses?.[0] ?? "overview";
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
  // Enriched fields
  nearest_city?: string;
  nearest_city_distance_km?: number;
  nearest_airport?: { iata: string; name: string; distance_km: number };
  safety?: {
    water_quality_rating?: string;
    lifeguard?: boolean;
    shark_incidents_total?: number;
  };
  facilities?: {
    parking?: boolean;
    restrooms?: boolean;
    showers?: boolean;
    wheelchair_accessible?: boolean;
    dogs_allowed?: boolean;
  };
  wikipedia_url?: string;
  notability_score?: number;
  data_completeness_pct?: number;
  sand?: SandData;
}

export interface SandPredicted {
  q_pct: number | null;
  f_pct: number | null;
  l_pct: number | null;
  regime: string;
  source: string;
}

export interface SandCurated {
  story: string;
  citations: string[];
  showcase_rank: number | null;
  reference_photo_url: string | null;
  reference_photo_attribution: string | null;
}

export interface SandSample {
  source: string;
  distance_m: number | null;
  grain_size_mean_mm: number | null;
  folk_class: string | null;
  q_pct: number | null;
  f_pct: number | null;
  l_pct: number | null;
  citation_url: string | null;
}

export interface SandData {
  predicted?: SandPredicted;
  color?: string;
  description?: string;
  curated?: SandCurated;
  measured_samples?: SandSample[];
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
