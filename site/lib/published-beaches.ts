import fs from "fs";
import path from "path";

export type PublishedBeach = {
  slug: string;
  name: string;
  country: string;
  countryName: string;
  admin1: string | null;
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  IN: "India",
  ES: "Spain",
  PT: "Portugal",
  AU: "Australia",
  GB: "United Kingdom",
  GR: "Greece",
  CA: "Canada",
  TH: "Thailand",
  BR: "Brazil",
  FR: "France",
  ID: "Indonesia",
  MX: "Mexico",
  IT: "Italy",
  HR: "Croatia",
  PH: "Philippines",
  ZA: "South Africa",
  EL: "Greece",
  IE: "Ireland",
  NZ: "New Zealand",
  JP: "Japan",
  IS: "Iceland",
  CR: "Costa Rica",
};

export function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}

let cache: PublishedBeach[] | null = null;

export function getPublishedBeaches(): PublishedBeach[] {
  if (cache) return cache;
  const dir = path.join(process.cwd(), "data", "beaches");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const beaches: PublishedBeach[] = [];
  for (const file of files) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
      beaches.push({
        slug: d.slug,
        name: d.name,
        country: d.country_code ?? "",
        countryName: countryName(d.country_code ?? ""),
        admin1: d.admin_level_1 ?? null,
      });
    } catch {
      /* skip */
    }
  }
  beaches.sort((a, b) => a.name.localeCompare(b.name));
  cache = beaches;
  return beaches;
}

export function topCountries(n = 8): { code: string; name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const b of getPublishedBeaches()) {
    counts.set(b.country, (counts.get(b.country) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([code, count]) => ({ code, name: countryName(code), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}
