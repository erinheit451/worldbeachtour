import { getAllBeaches, type BeachData, type BeachMeta } from "./beaches";

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
