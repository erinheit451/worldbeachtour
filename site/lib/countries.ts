/**
 * ISO 3166-1 alpha-2 → display name + flag emoji.
 *
 * Covers every country code currently present in the beach DB; falls back
 * gracefully (raw code, no flag) for anything else. EL is mapped to Greece
 * (Eurostat code; GR is the ISO code, both appear in OSM data).
 */

const NAMES: Record<string, string> = {
  AL: "Albania",
  AU: "Australia",
  AW: "Aruba",
  BD: "Bangladesh",
  BG: "Bulgaria",
  BR: "Brazil",
  BS: "Bahamas",
  CA: "Canada",
  CR: "Costa Rica",
  CU: "Cuba",
  CW: "Curaçao",
  CY: "Cyprus",
  DE: "Germany",
  DK: "Denmark",
  EL: "Greece",
  ES: "Spain",
  FI: "Finland",
  FR: "France",
  GB: "United Kingdom",
  GH: "Ghana",
  GR: "Greece",
  HR: "Croatia",
  ID: "Indonesia",
  IE: "Ireland",
  IN: "India",
  IS: "Iceland",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  KE: "Kenya",
  KR: "South Korea",
  KY: "Cayman Islands",
  ME: "Montenegro",
  MF: "Saint Martin",
  MX: "Mexico",
  MY: "Malaysia",
  NG: "Nigeria",
  NZ: "New Zealand",
  PF: "French Polynesia",
  PH: "Philippines",
  PK: "Pakistan",
  PR: "Puerto Rico",
  PT: "Portugal",
  SC: "Seychelles",
  SO: "Somalia",
  TH: "Thailand",
  TR: "Türkiye",
  US: "United States",
  VG: "British Virgin Islands",
  VI: "U.S. Virgin Islands",
  ZA: "South Africa",
};

// Greek Eurostat code → ISO alpha-2 for flag emoji rendering.
const FLAG_REMAP: Record<string, string> = { EL: "GR" };

export function countryName(code: string): string {
  return NAMES[code] ?? code;
}

/** Regional Indicator emoji for an ISO alpha-2 code. */
export function countryFlag(code: string): string {
  const cc = (FLAG_REMAP[code] ?? code).toUpperCase();
  if (cc.length !== 2 || !/^[A-Z]{2}$/.test(cc)) return "";
  const a = 0x1f1e6 + (cc.charCodeAt(0) - 65);
  const b = 0x1f1e6 + (cc.charCodeAt(1) - 65);
  return String.fromCodePoint(a) + String.fromCodePoint(b);
}
