import { getAllBeaches, type BeachData, type BeachMeta } from "./beaches";
import { computeTier } from "./tier";

export interface CountryEntry {
  code: string;
  count: number;
  monumentCount: number;
}

export function getCountries(): CountryEntry[] {
  const beaches = getAllBeaches();
  const counts = new Map<string, number>();
  const monuments = new Map<string, number>();
  for (const b of beaches) {
    if (!b.country_code) continue;
    counts.set(b.country_code, (counts.get(b.country_code) || 0) + 1);
    if (computeTier(b.slug, b, b.meta) === 3) {
      monuments.set(b.country_code, (monuments.get(b.country_code) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([code, count]) => ({
      code,
      count,
      monumentCount: monuments.get(code) ?? 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getBeachesByCountry(countryCode: string): (BeachData & { meta: BeachMeta })[] {
  return getAllBeaches().filter((b) => b.country_code === countryCode);
}

export function getStatesByCountry(countryCode: string): { state: string; count: number }[] {
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

export function getBeachesByState(countryCode: string, state: string): (BeachData & { meta: BeachMeta })[] {
  return getAllBeaches().filter(
    (b) => b.country_code === countryCode && b.admin_level_1 === state
  );
}
