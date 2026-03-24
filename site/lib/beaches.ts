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
