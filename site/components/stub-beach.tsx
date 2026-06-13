/**
 * StubBeach — the T0 field-guide page.
 *
 * A field-guide entry, not a data card. Stubs beat Google Maps on context
 * (what kind of beach, typological siblings, provenance) — not on coverage
 * or photos. Every data point should pay for itself as a classification
 * signal or a link into a type/region hub.
 */

import Link from "next/link";
import MapEmbed from "@/components/map-embed";

// ── Types ────────────────────────────────────────────────────────────

type Confidence = "verified" | "computed" | "predicted";

export interface GalleryPhoto {
  url: string;
  thumb: string;
  license?: string | null;
  author_html?: string | null;
  title?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface Comparison {
  metric: string;
  text: string;
  detail?: string | null;
}

interface WildlifeGroup {
  label: string;
  key: string;
  count: number;
  top: { common: string; latin?: string | null; obs?: number | null; iucn?: string | null }[];
}

export interface Wildlife {
  total_species: number;
  groups: WildlifeGroup[];
}

export interface Conservation {
  name: string;
  type?: string | null;
  iucn?: string | null;
  unesco?: boolean;
}

export interface Facilities {
  parking?: boolean;
  restrooms?: boolean;
  showers?: boolean;
  changing_rooms?: boolean;
  food_nearby?: boolean;
  wheelchair?: boolean;
  dogs?: boolean;
  camping?: boolean;
  nudism?: boolean;
}

export interface SafetyInfo {
  shark_incidents_total?: number;
  shark_incident_last_year?: number | null;
  nearshore_depth_m?: number;
  lifeguard?: boolean;
}

export interface WaveData {
  height_mean_m: (number | null)[];
  height_big_m: (number | null)[];
  period_mean_s: (number | null)[];
  summary: {
    annual_mean_m: number; biggest_month: string; biggest_month_m: number;
    calmest_month: string; calmest_month_m: number; typical_period_s: number | null;
    character: string;
  };
  source: string;
}

interface ContextPhoto {
  url: string;
  caption: string;
  credit: string;
  license: string;
  source_url: string;
}

interface NearbyFeature {
  name: string;
  type: "beach" | "landmark" | "river" | "town" | "trail" | string;
  distance_m: number;
  direction?: string;
  blurb: string;
  wiki_url?: string;
}

interface NeighborGeom {
  name: string;
  slug: string;
  distance_m: number;
  direction?: string;
  osm_way_id?: number;
  geometry: [number, number][];
}

interface Sibling {
  name: string;
  region: string;
  distance_km: number;
  similarity: number;
}

interface StubData {
  slug: string;
  name: string | null;
  name_english?: string | null;
  subtitle?: string | null;
  country_code: string;
  country_name?: string;
  admin_level_1: string | null;
  admin_level_2?: string | null;
  parish?: string | null;
  municipality?: string | null;
  centroid_lat: number;
  centroid_lng: number;
  water_body_type: string | null;
  water_body_name?: string | null;
  substrate_type: string | null;
  beach_length_m: number | null;
  orientation_deg?: number | null;
  orientation_label?: string | null;
  slope_pct?: number | null;
  nearshore_depth_m?: number | null;
  classification?: {
    primary_type: string;
    primary_type_slug: string;
    coastal_type: string;
    coastal_type_slug: string;
    micro_type: string;
    micro_type_slug: string;
  };
  nearest_city: string | null;
  nearest_city_distance_km: number | null;
  nearest_city_blurb?: string | null;
  nearest_airport?: { iata: string; name: string; distance_km: number };
  osm?: { way_id: number; url: string; geometry?: [number, number][] };
  neighbor_geometries?: NeighborGeom[];
  intro?: string;
  setting?: { region: string; paragraph: string };
  nearby_features?: NearbyFeature[];
  coastal_path?: { name: string; description: string; url?: string };
  context_photos?: ContextPhoto[];
  context_photos_note?: string;
  climate?: {
    air_temp_high: (number | null)[];
    air_temp_low: (number | null)[];
    rain_mm: (number | null)[];
    wind_speed?: (number | null)[] | null;
    sun_hours?: (number | null)[] | null;
    water_temp_c?: (number | null)[];
    water_temp_source_note?: string;
    climate_source: string | null;
    climate_type?: string | null;
  };
  tides?: { range_spring_m: number; range_neap_m: number; type: string; source?: string };
  sand?: {
    predicted?: {
      q_pct: number | null;
      f_pct: number | null;
      l_pct: number | null;
      regime: string | null;
      regime_plain?: string | null;
      source?: string | null;
    };
  };
  storm_history?: {
    cyclone_count_50yr: number;
    cyclone_max_category?: number;
    paragraph: string;
    source?: string;
  };
  registry_status?: {
    in_national_registry?: boolean;
    in_regional_registry?: boolean;
    note?: string;
  };
  typological_siblings_placeholder?: Sibling[];
  photos?: GalleryPhoto[];
  comparisons?: Comparison[];
  waves?: WaveData;
  wildlife?: Wildlife;
  conservation?: Conservation;
  facilities?: Facilities;
  water_quality?: { rating: string; source?: string | null; year?: number | null };
  blue_flag?: boolean | null;
  safety?: SafetyInfo;
}

interface Neighbor {
  slug: string;
  name: string;
  distance_km: number;
  has_wiki: boolean;
}

interface StubBeachProps {
  data: StubData;
  neighbors?: Neighbor[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ── Primitives ───────────────────────────────────────────────────────

function ConfTag({ kind }: { kind: Confidence }) {
  const styles: Record<Confidence, string> = {
    verified: "bg-reef-50 text-reef-800 border-reef-200",
    computed: "bg-sand-50 text-sand-800 border-sand-200",
    predicted: "bg-coral-50 text-coral-500 border-coral-200",
  };
  return (
    <span
      className={`font-mono text-[9px] uppercase tracking-[0.08em] border rounded-sm px-1 py-[1px] ${styles[kind]}`}
    >
      {kind}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ocean-800 mb-6">
      <span className="inline-block w-6 h-px bg-ocean-800" />
      {children}
    </h2>
  );
}

function Datum({
  label,
  value,
  sub,
  conf,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  conf?: Confidence;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-volcanic-400">
          {label}
        </span>
        {conf && <ConfTag kind={conf} />}
      </div>
      <div className="font-display text-[22px] leading-[1.15] text-volcanic-900 tracking-[-0.01em]">
        {value}
      </div>
      {sub && <div className="text-sm text-volcanic-500 mt-1">{sub}</div>}
    </div>
  );
}

// ── Sand swatch SVG (deterministic from q/f/l percentages) ───────────

function SandSwatch({ q, f, l }: { q: number; f: number; l: number }) {
  // Deterministic pseudo-random placement so every beach has its own signature
  const grains: { cx: number; cy: number; r: number; fill: string }[] = [];
  const seedRand = (() => {
    let s = Math.round(q * 100 + f * 10 + l);
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  })();
  const qCount = Math.round(q * 1.1);
  const fCount = Math.round(f * 1.1);
  const lCount = Math.round(l * 1.1);
  const pushGrain = (fill: string) => {
    grains.push({
      cx: 5 + seedRand() * 90,
      cy: 5 + seedRand() * 90,
      r: 0.9 + seedRand() * 0.8,
      fill,
    });
  };
  for (let i = 0; i < qCount; i++) pushGrain(i % 2 ? "#F5EFDB" : "#EDE2C1");
  for (let i = 0; i < fCount; i++) pushGrain(i % 2 ? "#D4A57A" : "#C99668");
  for (let i = 0; i < lCount; i++) pushGrain(i % 2 ? "#5C4A33" : "#6B5A44");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <defs>
        <radialGradient id="sand-bg" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#ECE0BE" />
          <stop offset="100%" stopColor="#D4C395" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#sand-bg)" />
      <g opacity="0.72">
        {grains.map((g, i) => (
          <circle key={i} cx={g.cx} cy={g.cy} r={g.r} fill={g.fill} />
        ))}
      </g>
    </svg>
  );
}

// ── Coastline diagram SVG ─────────────────────────────────────────────

function CoastlineDiagram({
  beachCoords,
  neighbors,
  centerLat,
  centerLng,
  hereLabel,
}: {
  beachCoords: [number, number][];
  neighbors: NeighborGeom[];
  centerLat: number;
  centerLng: number;
  hereLabel: string;
}) {
  // Determine bbox from all geometry
  const allCoords: [number, number][] = [...beachCoords, ...neighbors.flatMap((n) => n.geometry)];
  const lats = allCoords.map((c) => c[0]);
  const lngs = allCoords.map((c) => c[1]);
  const padLat = 0.0008;
  const padLng = 0.0012;
  const minLat = Math.min(...lats) - padLat;
  const maxLat = Math.max(...lats) + padLat;
  const minLng = Math.min(...lngs) - padLng;
  const maxLng = Math.max(...lngs) + padLng;

  const W = 800, H = 360;
  const cosLat = Math.cos((centerLat * Math.PI) / 180);
  const xScale = W / (maxLng - minLng);
  const yScale = H / (maxLat - minLat);
  const scale = Math.min(xScale, yScale / cosLat); // preserve aspect
  const originX = W / 2 - scale * ((maxLng + minLng) / 2);
  const originY = H / 2 + scale * cosLat * ((maxLat + minLat) / 2);
  const proj = (lat: number, lng: number): [number, number] => [
    originX + scale * lng,
    originY - scale * cosLat * lat,
  ];
  const pathFromCoords = (coords: [number, number][]) =>
    coords
      .map((c, i) => {
        const [x, y] = proj(c[0], c[1]);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ") + " Z";

  // Scale bar: 200m = ? svg units
  const mPerDeg = 111_000;
  const unitsPer200m = (200 / mPerDeg) * scale;

  const [hereX, hereY] = proj(centerLat, centerLng);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="waves" width="30" height="10" patternUnits="userSpaceOnUse">
          <path d="M 0 5 Q 7 2, 15 5 T 30 5" stroke="#0c4a6e" strokeWidth="0.5" fill="none" opacity="0.12" />
        </pattern>
        <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1E4C2" />
          <stop offset="100%" stopColor="#D4C395" />
        </linearGradient>
      </defs>

      {/* Sea */}
      <rect width={W} height={H} fill="#d8e6e9" opacity="0.65" />
      <rect width={W} height={H} fill="url(#waves)" />

      {/* Neighbor beaches */}
      {neighbors.map((n) => (
        <g key={n.slug}>
          <path d={pathFromCoords(n.geometry)} fill="url(#sandGrad)" opacity="0.55" stroke="#B09A6B" strokeWidth="0.6" />
        </g>
      ))}

      {/* Subject beach */}
      <path d={pathFromCoords(beachCoords)} fill="url(#sandGrad)" stroke="#8B6F47" strokeWidth="0.8" />

      {/* Neighbor labels */}
      {neighbors.map((n) => {
        const mid = n.geometry[Math.floor(n.geometry.length / 2)];
        const [lx, ly] = proj(mid[0], mid[1]);
        return (
          <g key={`lbl-${n.slug}`}>
            <text x={lx} y={ly - 12} fontFamily="sans-serif" fontSize="11" fill="#334155" textAnchor="middle">
              {n.name}
            </text>
            <text x={lx} y={ly + 16} fontFamily="ui-monospace, monospace" fontSize="8" fill="#64748b" textAnchor="middle">
              {n.distance_m} m {n.direction || ""}
            </text>
          </g>
        );
      })}

      {/* Here marker */}
      <circle cx={hereX} cy={hereY} r={6} fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
      <text
        x={hereX}
        y={hereY + 26}
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="14"
        fontWeight={500}
        fill="#0f172a"
        textAnchor="middle"
      >
        {hereLabel}
      </text>

      {/* Scale bar */}
      <g transform={`translate(${W - 150}, 40)`}>
        <line x1={0} y1={0} x2={unitsPer200m} y2={0} stroke="#0f172a" strokeWidth={1} />
        <line x1={0} y1={-3} x2={0} y2={3} stroke="#0f172a" strokeWidth={1} />
        <line x1={unitsPer200m} y1={-3} x2={unitsPer200m} y2={3} stroke="#0f172a" strokeWidth={1} />
        <text x={0} y={-7} fontFamily="ui-monospace, monospace" fontSize={9} fill="#334155">0</text>
        <text x={unitsPer200m} y={-7} fontFamily="ui-monospace, monospace" fontSize={9} fill="#334155" textAnchor="end">200 m</text>
      </g>

      {/* North arrow */}
      <g transform={`translate(${W - 40}, 40)`}>
        <circle cx={0} cy={0} r={14} fill="none" stroke="#64748b" strokeWidth="0.6" />
        <path d="M 0 -10 L 4 6 L 0 3 L -4 6 Z" fill="#0f172a" />
        <text x={0} y={-18} fontFamily="ui-monospace, monospace" fontSize={10} fill="#0f172a" textAnchor="middle">N</text>
      </g>
    </svg>
  );
}

// ── Year at a glance SVG ──────────────────────────────────────────────

function YearStrip({
  temp,
  rain,
  goodMonths,
}: {
  temp: (number | null)[];
  rain: (number | null)[];
  goodMonths: Set<number>;
}) {
  const W = 800, H = 220;
  const padL = 32, padR = 20, padT = 16, padB = 50;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const colW = innerW / 12;

  const maxRain = Math.max(180, ...(rain.filter((r): r is number => r != null)));

  // Adaptive temperature axis — air-temp fallback spans a far wider range than
  // sea temp (cold-water beaches dip below 0°C), so derive bounds from the data
  // with a little padding and "nice" rounding.
  const temps = temp.filter((t): t is number => t != null);
  const rawMin = temps.length ? Math.min(...temps) : 8;
  const rawMax = temps.length ? Math.max(...temps) : 24;
  const tempMin = Math.floor((rawMin - 2) / 5) * 5;
  const tempMax = Math.ceil((rawMax + 2) / 5) * 5;
  const tempSpan = Math.max(1, tempMax - tempMin);
  const ticks: number[] = [];
  for (let t = tempMin; t <= tempMax; t += 5) ticks.push(t);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
      {/* Axis grid */}
      {ticks.map((t) => {
        const y = padT + innerH - ((t - tempMin) / tempSpan) * innerH;
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
            <text x={padL - 6} y={y + 3} fontFamily="ui-monospace, monospace" fontSize="9" fill="#94a3b8" textAnchor="end">
              {t}°
            </text>
          </g>
        );
      })}

      {/* Rainfall bars */}
      {rain.map((r, i) => {
        if (r == null) return null;
        const h = (r / maxRain) * innerH * 0.9;
        const x = padL + i * colW + colW * 0.2;
        const y = padT + innerH - h;
        return (
          <rect key={i} x={x} y={y} width={colW * 0.6} height={h} fill="#a16207" opacity="0.32" />
        );
      })}

      {/* Temperature line (sea temp where known, else air-temp high) */}
      <path
        d={(() => {
          let started = false;
          return temp
            .map((t, i) => {
              if (t == null) return "";
              const x = padL + i * colW + colW / 2;
              const y = padT + innerH - ((t - tempMin) / tempSpan) * innerH;
              const cmd = started ? "L" : "M";
              started = true;
              return `${cmd} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .filter(Boolean)
            .join(" ");
        })()}
        fill="none"
        stroke="#075985"
        strokeWidth="2"
      />
      {temp.map((t, i) => {
        if (t == null) return null;
        const x = padL + i * colW + colW / 2;
        const y = padT + innerH - ((t - tempMin) / tempSpan) * innerH;
        return <circle key={i} cx={x} cy={y} r={2.5} fill="#075985" />;
      })}

      {/* Swim-window band */}
      {Array.from({ length: 12 }).map((_, i) => {
        const on = goodMonths.has(i);
        const x = padL + i * colW + 1;
        const y = H - padB + 12;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={colW - 2}
            height={8}
            fill={on ? "#ca8a04" : "#e5e7eb"}
            opacity={on ? 0.9 : 0.6}
          />
        );
      })}
      <text
        x={padL}
        y={H - padB + 34}
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fill="#a16207"
        letterSpacing="0.04em"
      >
        GOOD BEACH DAYS →
      </text>

      {/* Month labels */}
      {MONTHS.map((m, i) => {
        const x = padL + i * colW + colW / 2;
        return (
          <text
            key={m}
            x={x}
            y={H - 3}
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            fill="#94a3b8"
            textAnchor="middle"
            letterSpacing="0.04em"
          >
            {m.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

// ── Sibling mini-coastline ────────────────────────────────────────────

function SiblingSketch({ seed }: { seed: number }) {
  // Deterministic wiggly coastline
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const pts: string[] = [];
  for (let i = 0; i <= 6; i++) {
    const x = (i / 6) * 90 + 5;
    const y = 14 + rand() * 14;
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const d = `M ${pts[0]} ${pts.slice(1).map((p, i) => (i % 2 === 0 ? `Q ${p}` : ` ${p}`)).join(" ")}`;
  return (
    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <path d={d} fill="none" stroke="#0f172a" strokeWidth="1" />
      <path d={`${d} L 95 40 L 5 40 Z`} fill="#D8C9A3" opacity="0.55" />
    </svg>
  );
}

// ── Main component ───────────────────────────────────────────────────

function locationLine(d: StubData) {
  const parts = [
    d.parish && `${d.parish}`,
    d.municipality && `${d.municipality}`,
    d.admin_level_2,
    d.admin_level_1,
    d.country_name || d.country_code,
  ].filter(Boolean);
  return parts.join(", ");
}

export default function StubBeach({ data, neighbors = [] }: StubBeachProps) {
  const displayName = data.name_english || data.name || `Beach at ${data.centroid_lat.toFixed(3)}°, ${data.centroid_lng.toFixed(3)}°`;
  const localName = data.name && data.name !== displayName ? data.name : null;

  const climate = data.climate;
  const hasClimate = !!climate?.air_temp_high?.[0];
  const hasSand = !!data.sand?.predicted?.q_pct;
  const hasTides = !!data.tides?.range_spring_m;

  // Best months from climate
  const bestMonths = new Set<number>();
  let annualRain = 0;
  if (hasClimate) {
    const hi = climate!.air_temp_high;
    const rain = climate!.rain_mm;
    hi.forEach((t, i) => {
      const r = rain[i] ?? 0;
      if (t != null && t >= 18 && t <= 28 && r < 80) bestMonths.add(i);
    });
    annualRain = rain.reduce<number>((s, r) => s + (r ?? 0), 0);
  }

  // "Today" placeholder: take the current-month typical from climate
  const now = new Date();
  const thisMonth = now.getMonth();
  const todayTemp = climate?.water_temp_c?.[thisMonth];
  const todayAir = climate?.air_temp_high?.[thisMonth];

  // Sea-surface temperature is absent for ~all beaches in the DB. Rather than
  // hide the season chart (or fake a water temp), fall back to air-temp highs,
  // clearly labelled. Honesty over coverage.
  const tempSeries = climate?.water_temp_c ?? climate?.air_temp_high ?? [];
  const tempIsWater = !!climate?.water_temp_c;
  const tempLabel = tempIsWater ? "Water temp" : "Air temp (high)";

  // Wind (m/s) — present ~97%. Beaufort-ish descriptor for the current month.
  const windSeries = climate?.wind_speed ?? null;
  const todayWind = windSeries?.[thisMonth] ?? null;
  const windWord = (w: number) =>
    w < 2 ? "Calm" : w < 4 ? "Light breeze" : w < 6 ? "Moderate" : w < 9 ? "Fresh, often breezy" : "Windy";
  // Sunshine: present ~97% but in an unlabelled unit; use it only to rank the
  // sunniest months relative to this beach's own year, never as an absolute.
  const sunSeries = climate?.sun_hours ?? null;

  return (
    <div className="bg-[#FBF9F4] min-h-screen">
      <div className="mx-auto max-w-5xl border-x border-volcanic-100 bg-[#FBF9F4]">
        {/* ── FIELD GUIDE HEADER ─────────────────────────────────────── */}
        <header className="px-8 md:px-12 pt-10 pb-8 border-b border-volcanic-100">
          <div className="grid md:grid-cols-[1fr_14rem] gap-10 items-start">
            <div>
              {/* Dual-track breadcrumbs */}
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-mono uppercase tracking-[0.1em] text-volcanic-400 mb-6">
                <span className="text-sand-700">Place</span>
                <Link href={`/regions/${data.country_code.toLowerCase()}`} className="hover:text-volcanic-900">
                  {data.country_name || data.country_code}
                </Link>
                {data.admin_level_1 && (<><span className="text-volcanic-200">›</span><span>{data.admin_level_1}</span></>)}
                {data.municipality && (<><span className="text-volcanic-200">›</span><span>{data.municipality}</span></>)}
                {data.parish && (<><span className="text-volcanic-200">›</span><span>{data.parish}</span></>)}
                {data.classification && (
                  <>
                    <span className="mx-2 text-volcanic-200">·</span>
                    <span className="text-sand-700">Type</span>
                    <span>{data.classification.primary_type}</span>
                    <span className="text-volcanic-200">›</span>
                    <span>{data.classification.coastal_type}</span>
                    <span className="text-volcanic-200">›</span>
                    <span>{data.classification.micro_type}</span>
                  </>
                )}
              </div>

              <h1 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-[-0.03em] text-volcanic-900 mb-3">
                {displayName}
              </h1>
              {localName && (
                <p className="font-display italic text-xl text-volcanic-500 mb-5">
                  locally <span className="text-volcanic-700">{localName}</span>
                </p>
              )}
              {data.subtitle && (
                <p className="text-[17px] text-volcanic-700 leading-[1.55] max-w-2xl">
                  {data.subtitle}
                </p>
              )}
            </div>

            {/* Sand swatch */}
            {hasSand && (
              <div>
                <div className="aspect-square border border-volcanic-100 bg-white overflow-hidden">
                  <SandSwatch
                    q={data.sand!.predicted!.q_pct!}
                    f={data.sand!.predicted!.f_pct!}
                    l={data.sand!.predicted!.l_pct!}
                  />
                </div>
                <div className="mt-3 flex justify-between items-baseline">
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-sand-700">Sand profile</span>
                  <ConfTag kind="computed" />
                </div>
                <div className="font-mono text-xs text-volcanic-600 mt-1.5 space-y-0.5">
                  <div className="flex justify-between"><span>Quartz</span><span>{data.sand!.predicted!.q_pct?.toFixed(0)}%</span></div>
                  <div className="flex justify-between"><span>Feldspar</span><span>{data.sand!.predicted!.f_pct?.toFixed(0)}%</span></div>
                  <div className="flex justify-between"><span>Rock frag.</span><span>{data.sand!.predicted!.l_pct?.toFixed(0)}%</span></div>
                </div>
                <a href="#" className="block mt-3 text-[13px] text-ocean-800 hover:underline">
                  More on granite-coast sand →
                </a>
              </div>
            )}
          </div>
        </header>

        {/* ── FIELD GUIDE CARD (8-cell data) ─────────────────────────── */}
        <section className="px-8 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 border-b border-volcanic-100 bg-gradient-to-b from-white/40 to-transparent">
          {data.classification && (
            <Datum
              label="Type"
              conf="computed"
              value={<span className="text-[19px]">{data.classification.primary_type}</span>}
              sub={`${data.classification.coastal_type} · ${data.classification.micro_type}`}
            />
          )}
          {data.beach_length_m && (
            <Datum
              label="Size"
              conf="computed"
              value={<>{Math.round(data.beach_length_m)} m <span className="text-sm text-volcanic-500">shoreline</span></>}
              sub={data.slope_pct != null ? `Seabed slope ${data.slope_pct.toFixed(2)} %` : undefined}
            />
          )}
          {hasTides && (
            <Datum
              label="Tide"
              conf="computed"
              value={<span className="text-[19px] capitalize">{data.tides!.type.replace("_", "-")}</span>}
              sub={`Spring ${data.tides!.range_spring_m.toFixed(2)} m / Neap ${data.tides!.range_neap_m.toFixed(2)} m`}
            />
          )}
          {data.water_body_name && (
            <Datum
              label="Water body"
              value={<span className="text-[19px]">{data.water_body_name}</span>}
              sub={data.orientation_label ? `${data.orientation_label}${data.orientation_deg ? ` ${data.orientation_deg}°` : ""}` : undefined}
            />
          )}
          {hasClimate && (
            <Datum
              label="Climate"
              conf="computed"
              value={<span className="text-[19px]">{climate!.climate_type || "—"}</span>}
              sub={`${annualRain.toFixed(0)} mm rain / year`}
            />
          )}
          {data.nearest_city && (
            <Datum
              label="Access"
              value={<span className="text-[19px]">From {data.nearest_city}</span>}
              sub={`${data.nearest_city_distance_km?.toFixed(1)} km${data.coastal_path ? ` · ${data.coastal_path.name}` : ""}`}
            />
          )}
          {data.nearest_airport && (
            <Datum
              label="Nearest airport"
              value={<span className="text-[19px]">{data.nearest_airport.iata}</span>}
              sub={`${data.nearest_airport.name} · ${data.nearest_airport.distance_km.toFixed(0)} km`}
            />
          )}
          {data.registry_status && data.registry_status.in_national_registry === false && (
            <Datum
              label="Services"
              value={<span className="text-[19px] text-volcanic-400">Unserviced</span>}
              sub="Not in national or regional beach registry"
            />
          )}
        </section>

        {/* ── HOW IT COMPARES (the moat — only possible with all 228K) ── */}
        {data.comparisons && data.comparisons.length > 0 && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>How it compares</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.comparisons.map((cmp, i) => (
                <div key={i} className="border border-volcanic-100 bg-white rounded-sm p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ocean-800 mb-2">
                    {cmp.metric}
                  </div>
                  <div className="font-display text-[17px] leading-[1.25] text-volcanic-900">
                    {cmp.text}
                  </div>
                  {cmp.detail && (
                    <div className="text-xs text-volcanic-500 mt-2">{cmp.detail}</div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[12px] text-volcanic-400 italic mt-3">
              Ranked against every beach in our database — 228,000+ worldwide.
            </p>
          </section>
        )}

        {/* ── TODAY (typical) ────────────────────────────────────────── */}
        {hasClimate && (todayTemp != null || todayAir != null) && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>Typical conditions · {MONTHS[thisMonth]}</SectionHeading>
            <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-volcanic-100 rounded-sm overflow-hidden">
              {todayTemp != null && (
                <div className="p-5 border-r border-volcanic-100">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-volcanic-400 mb-2">Water temp</div>
                  <div className="font-display text-3xl text-volcanic-900 leading-none">{todayTemp.toFixed(1)}°C</div>
                  <div className="text-xs text-volcanic-500 mt-2">
                    {todayTemp < 15 ? "Cool · wetsuit recommended" : todayTemp < 19 ? "Refreshing · brief swims" : "Warm enough"}
                  </div>
                </div>
              )}
              {todayAir != null && (
                <div className="p-5 border-r border-volcanic-100">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-volcanic-400 mb-2">Air (high)</div>
                  <div className="font-display text-3xl text-volcanic-900 leading-none">{todayAir.toFixed(0)}°C</div>
                  {todayTemp == null && (
                    <div className="text-xs text-volcanic-500 mt-2">No sea-temp record · air shown</div>
                  )}
                </div>
              )}
              {hasTides && (
                <div className="p-5 border-r border-volcanic-100">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-volcanic-400 mb-2">Tide range</div>
                  <div className="font-display text-3xl text-volcanic-900 leading-none">
                    {data.tides!.range_spring_m.toFixed(1)} m
                  </div>
                  <div className="text-xs text-volcanic-500 mt-2 capitalize">Spring · {data.tides!.type?.replace("_", "-") || "—"}</div>
                </div>
              )}
              <div className="p-5 border-r border-volcanic-100">
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-volcanic-400 mb-2">Rain</div>
                <div className="font-display text-3xl text-volcanic-900 leading-none">
                  {climate!.rain_mm[thisMonth]?.toFixed(0)} mm
                </div>
                <div className="text-xs text-volcanic-500 mt-2">Monthly average</div>
              </div>
              {todayWind != null && (
                <div className="p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-volcanic-400 mb-2">Wind</div>
                  <div className="font-display text-3xl text-volcanic-900 leading-none">
                    {todayWind.toFixed(1)} <span className="text-base text-volcanic-500">m/s</span>
                  </div>
                  <div className="text-xs text-volcanic-500 mt-2">{windWord(todayWind)}</div>
                </div>
              )}
            </div>
            <p className="mt-3 text-[12px] text-volcanic-400 italic">
              Monthly climatology, not a live forecast — {MONTHS[thisMonth]} normals shown as a proxy.
            </p>
          </section>
        )}

        {/* ── A YEAR HERE (climate chart — sits with Typical conditions) ── */}
        {hasClimate && tempSeries.length > 0 && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>A year here</SectionHeading>
            <div className="border border-volcanic-100 bg-white p-5">
              <YearStrip
                temp={tempSeries}
                rain={climate!.rain_mm}
                goodMonths={bestMonths}
              />
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 pt-3 border-t border-volcanic-100 font-mono text-[10px] uppercase tracking-[0.05em] text-volcanic-500">
                <span className="flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 bg-ocean-800" />{tempLabel}</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-4 h-1.5 bg-sand-700 opacity-35" />Rainfall</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-4 h-1.5 bg-sand-600 opacity-90" />Beach-day window</span>
              </div>
            </div>
            <p className="text-[12px] text-volcanic-400 italic mt-3">
              Monthly normals from {climate!.climate_source || "WorldClim v2.1"}.{" "}
              {tempIsWater
                ? climate!.water_temp_source_note
                : "Sea-surface temperature isn't on record for this beach, so the line tracks average daytime air-temperature highs; the beach-day window keys to air temperature and rainfall."}
            </p>
          </section>
        )}

        {/* ── PHOTOGRAPHS (Commons, proximity-fetched) ───────────────── */}
        {data.photos && data.photos.length > 0 && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>Photographs near here</SectionHeading>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {data.photos.map((p, i) => (
                <figure
                  key={i}
                  className={`group relative overflow-hidden bg-volcanic-100 ${
                    i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumb}
                    alt={p.title || `Photo near ${displayName}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {p.author_html && (
                    <figcaption className="absolute inset-x-0 bottom-0 px-2 py-1 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <span
                        className="text-[9px] font-mono text-white/85 line-clamp-1 [&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: `${p.author_html} · ${p.license || ""}` }}
                      />
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
            <p className="text-[12px] text-volcanic-400 italic mt-3">
              Images from Wikimedia Commons within range of this beach, ranked by
              resolution — not yet hand-verified as the beach itself. Reuse under
              each photo&rsquo;s own license.
            </p>
          </section>
        )}

        {/* ── SEA & SURF (wave climatology) ──────────────────────────── */}
        {data.waves && (() => {
          const w = data.waves!;
          const hs = w.height_mean_m, bs = w.height_big_m;
          const maxH = Math.max(1, ...hs.filter((h): h is number => h != null), ...bs.filter((h): h is number => h != null));
          return (
            <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
              <SectionHeading>Sea &amp; surf</SectionHeading>
              <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-start">
                <div className="border border-volcanic-100 bg-white p-5">
                  <svg viewBox="0 0 360 140" className="w-full h-auto">
                    {hs.map((h, i) => {
                      if (h == null) return null;
                      const x = 10 + i * 29, bh = (h / maxH) * 100, big = bs[i];
                      return (
                        <g key={i}>
                          {big != null && <rect x={x} y={110 - (big / maxH) * 100} width={18} height={(big / maxH) * 100} fill="#0369a1" opacity="0.16" />}
                          <rect x={x} y={110 - bh} width={18} height={bh} fill="#0369a1" opacity="0.6" />
                          <text x={x + 9} y={124} fontFamily="ui-monospace,monospace" fontSize="8" fill="#94a3b8" textAnchor="middle">{MONTHS[i][0]}</text>
                        </g>
                      );
                    })}
                  </svg>
                  <p className="text-[11px] text-volcanic-400 italic mt-2">
                    Solid = typical monthly wave height; pale = the bigger days. Offshore/regional swell — a sheltered cove may sit calmer.
                  </p>
                </div>
                <div>
                  <Datum label="Character" conf="computed" value={<span className="text-[18px] leading-tight">{w.summary.character}</span>} />
                  <div className="mt-5 space-y-2 font-mono text-[12px] text-volcanic-600">
                    <div className="flex justify-between border-b border-volcanic-100 pb-1.5"><span>Typical height</span><span className="text-volcanic-900">{w.summary.annual_mean_m} m</span></div>
                    <div className="flex justify-between border-b border-volcanic-100 pb-1.5"><span>Biggest swell</span><span className="text-volcanic-900">{w.summary.biggest_month} · {w.summary.biggest_month_m} m</span></div>
                    <div className="flex justify-between border-b border-volcanic-100 pb-1.5"><span>Calmest</span><span className="text-volcanic-900">{w.summary.calmest_month} · {w.summary.calmest_month_m} m</span></div>
                    {w.summary.typical_period_s != null && (
                      <div className="flex justify-between"><span>Period</span><span className="text-volcanic-900">{w.summary.typical_period_s} s {w.summary.typical_period_s >= 8 ? "(groundswell)" : "(wind chop)"}</span></div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* ── SAFETY & CONDITIONS ────────────────────────────────────── */}
        {data.safety && (data.safety.shark_incidents_total != null || data.safety.nearshore_depth_m != null || data.safety.lifeguard != null) && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>Safety &amp; conditions</SectionHeading>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.safety.shark_incidents_total != null && (
                <Datum
                  label="Shark incidents"
                  conf="verified"
                  value={
                    data.safety.shark_incidents_total === 0
                      ? <span className="text-[19px]">None recorded</span>
                      : <span className="text-[19px]">{data.safety.shark_incidents_total} recorded</span>
                  }
                  sub={
                    data.safety.shark_incidents_total === 0
                      ? "No incidents in the global shark-attack file"
                      : data.safety.shark_incident_last_year
                        ? `Most recent: ${data.safety.shark_incident_last_year}`
                        : "Historical record"
                  }
                />
              )}
              {data.safety.nearshore_depth_m != null && (
                <Datum
                  label="Water depth nearby"
                  conf="computed"
                  value={<span className="text-[19px]">~{data.safety.nearshore_depth_m.toFixed(0)} m</span>}
                  sub={
                    data.safety.nearshore_depth_m < 5 ? "Shallow & gradual close to shore"
                      : data.safety.nearshore_depth_m < 15 ? "Moderate depth offshore"
                        : "Deep water relatively close in"
                  }
                />
              )}
              {data.safety.lifeguard != null && (
                <Datum
                  label="Lifeguard"
                  value={<span className="text-[19px]">{data.safety.lifeguard ? "Yes, in season" : "No lifeguard"}</span>}
                />
              )}
            </div>
          </section>
        )}

        {/* ── FACILITIES & ACCESS ────────────────────────────────────── */}
        {data.facilities && Object.keys(data.facilities).length > 0 && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>Facilities &amp; access</SectionHeading>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["parking", "Parking"], ["restrooms", "Restrooms"], ["showers", "Showers"],
                  ["changing_rooms", "Changing rooms"], ["food_nearby", "Food nearby"],
                  ["wheelchair", "Wheelchair access"], ["dogs", "Dogs allowed"],
                  ["camping", "Camping"], ["nudism", "Naturist"],
                ] as [keyof Facilities, string][]
              ).map(([key, label]) =>
                data.facilities![key] === undefined ? null : (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm border ${
                      data.facilities![key]
                        ? "bg-reef-50 text-reef-800 border-reef-200"
                        : "bg-volcanic-50 text-volcanic-400 border-volcanic-100 line-through"
                    }`}
                  >
                    {data.facilities![key] ? "✓" : "✗"} {label}
                  </span>
                )
              )}
            </div>
            <p className="text-[12px] text-volcanic-400 italic mt-4">
              From OpenStreetMap tags — absence of a tag isn&rsquo;t proof of absence on the ground.
            </p>
          </section>
        )}

        {/* ── WATER QUALITY / BLUE FLAG ──────────────────────────────── */}
        {(data.water_quality || data.blue_flag) && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>Water quality</SectionHeading>
            <div className="flex flex-wrap items-center gap-4">
              {data.blue_flag && (
                <span className="inline-flex items-center gap-2 rounded-sm px-3 py-1.5 bg-ocean-800 text-white text-sm font-medium">
                  ⚑ Blue Flag beach
                </span>
              )}
              {data.water_quality && (
                <Datum
                  label="Bathing-water rating"
                  conf="verified"
                  value={<span className="text-[19px] capitalize">{data.water_quality.rating}</span>}
                  sub={[data.water_quality.source, data.water_quality.year].filter(Boolean).join(" · ") || undefined}
                />
              )}
            </div>
          </section>
        )}

        {/* ── WHAT LIVES HERE (wildlife) ─────────────────────────────── */}
        {data.wildlife && data.wildlife.groups.length > 0 && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>What lives here</SectionHeading>
            <p className="text-sm text-volcanic-600 max-w-2xl mb-6 leading-relaxed">
              {data.wildlife.total_species} species recorded near this beach by citizen
              scientists, most-observed first.
            </p>
            <div className="space-y-5">
              {data.wildlife.groups.slice(0, 5).map((g) => (
                <div key={g.key}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ocean-800 mb-2">
                    {g.label} <span className="text-volcanic-400">· {g.count}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.top.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full border border-volcanic-100 bg-white px-3 py-1 text-[13px] text-volcanic-800"
                        title={s.latin || undefined}
                      >
                        {s.common}
                        {s.iucn && ["EN", "CR", "VU"].includes(s.iucn) && (
                          <span className="font-mono text-[9px] text-coral-500 uppercase">{s.iucn}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[12px] text-volcanic-400 italic mt-5">
              Observation data from iNaturalist. Presence reflects what people report, not a survey.
            </p>
          </section>
        )}

        {/* ── CONSERVATION ───────────────────────────────────────────── */}
        {data.conservation && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>Protected status</SectionHeading>
            <div className="border-l-2 border-reef-500 pl-5">
              <div className="font-display text-2xl text-volcanic-900 leading-tight">
                {data.conservation.name}
              </div>
              <div className="text-sm text-volcanic-600 mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                {data.conservation.type && <span>{data.conservation.type}</span>}
                {data.conservation.iucn && <span>· IUCN {data.conservation.iucn}</span>}
                {data.conservation.unesco && <span className="text-ocean-800 font-medium">· UNESCO World Heritage</span>}
              </div>
              <p className="text-sm text-volcanic-500 mt-3 max-w-2xl">
                This beach falls within a designated protected area — access and activities
                may be regulated.
              </p>
            </div>
          </section>
        )}

        {/* ── WHERE IT IS (map) ──────────────────────────────────────── */}
        <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
          <SectionHeading>Where it is</SectionHeading>
          <MapEmbed
            lat={data.centroid_lat}
            lng={data.centroid_lng}
            name={displayName}
          />
        </section>

        {/* ── COASTLINE DIAGRAM ──────────────────────────────────────── */}
        {data.osm?.geometry && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>The shape of it</SectionHeading>
            <div className="border border-volcanic-100 bg-white p-5">
              <CoastlineDiagram
                beachCoords={data.osm.geometry}
                neighbors={data.neighbor_geometries || []}
                centerLat={data.centroid_lat}
                centerLng={data.centroid_lng}
                hereLabel={data.name_english || data.name || "Here"}
              />
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-3 border-t border-volcanic-100 font-mono text-[10px] uppercase tracking-[0.05em] text-volcanic-500">
                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#d8e6e9]" />Sea</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#D4C395]" />Sand</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-volcanic-900 border-2 border-white ring-1 ring-volcanic-900" />{data.name_english || data.name}</span>
              </div>
            </div>
            <p className="text-[12px] text-volcanic-400 italic mt-3">
              Diagram projected from OpenStreetMap geometry {data.osm?.way_id && <>(way/{data.osm.way_id})</>}. Not to be used for navigation.
            </p>
          </section>
        )}

        {/* ── CONTEXT PHOTOS ─────────────────────────────────────────── */}
        {data.context_photos && data.context_photos.length > 0 && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>Context · what&apos;s around</SectionHeading>
            {data.context_photos_note && (
              <p className="text-sm text-volcanic-600 italic mb-5 max-w-2xl">{data.context_photos_note}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.context_photos.map((p, i) => (
                <figure key={i} className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-volcanic-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.caption} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                  </div>
                  <figcaption className="mt-2">
                    <p className="text-[13px] text-volcanic-800 leading-snug">{p.caption}</p>
                    <p className="text-[10px] font-mono uppercase tracking-[0.05em] text-volcanic-400 mt-1">
                      <a href={p.source_url} className="hover:text-volcanic-700" target="_blank" rel="noopener">{p.credit}</a> · {p.license}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ── SETTING (prose) ────────────────────────────────────────── */}
        {data.setting && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>Setting — {data.setting.region}</SectionHeading>
            <p className="font-display text-[18px] leading-[1.65] text-volcanic-800 max-w-2xl">
              {data.setting.paragraph}
            </p>
          </section>
        )}

        {/* ── TYPOLOGICAL SIBLINGS ───────────────────────────────────── */}
        {data.typological_siblings_placeholder && data.typological_siblings_placeholder.length > 0 && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>Beaches like this one</SectionHeading>
            <p className="text-sm text-volcanic-600 max-w-2xl mb-6 leading-relaxed">
              Computed from coastal type, sand composition, tidal regime, beach size, and climate zone. Not the closest geographically — the closest typologically.{" "}
              <em className="text-volcanic-500">Prototype — similarity pipeline pending; these five are a hand-picked illustration of how the shape of this section will work.</em>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {data.typological_siblings_placeholder.map((s, i) => (
                <div key={i} className="block border border-volcanic-100 bg-white p-4 rounded-sm hover:border-sand-400 transition-colors">
                  <div className="h-12 mb-3">
                    <SiblingSketch seed={s.name.length * 37 + s.similarity} />
                  </div>
                  <div className="font-display text-base text-volcanic-900 leading-tight">{s.name}</div>
                  <div className="text-xs text-volcanic-500 mt-0.5">{s.region} · {s.distance_km.toLocaleString()} km</div>
                  <div className="flex items-center gap-2 mt-3 font-mono text-[10px] uppercase tracking-[0.05em] text-volcanic-400">
                    <span>sim</span>
                    <span className="flex-1 h-0.5 bg-volcanic-100 relative overflow-hidden">
                      <span className="absolute inset-y-0 left-0 bg-sand-700" style={{ width: `${s.similarity}%` }} />
                    </span>
                    <span>{s.similarity}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── AROUND HERE ────────────────────────────────────────────── */}
        {data.nearby_features && data.nearby_features.length > 0 && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>Around here · walking distance</SectionHeading>
            <ul className="grid md:grid-cols-2 gap-x-10">
              {data.nearby_features.map((f) => (
                <li key={f.name} className="grid grid-cols-[4rem_1fr] gap-4 py-3 border-t border-volcanic-100 first:border-t-0 md:[&:nth-child(2)]:border-t-0">
                  <span className="font-mono text-[13px] text-volcanic-500 pt-1">
                    {f.distance_m < 1000 ? `${f.distance_m} m` : `${(f.distance_m / 1000).toFixed(1)} km`}
                    {f.direction && <span className="text-volcanic-300 ml-1">{f.direction}</span>}
                  </span>
                  <div>
                    <div className="font-display text-base text-volcanic-900">
                      {f.wiki_url ? (
                        <a href={f.wiki_url} className="hover:underline decoration-sand-400 underline-offset-2" target="_blank" rel="noopener">{f.name}</a>
                      ) : f.name}
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.08em] text-volcanic-400 align-middle">{f.type}</span>
                    </div>
                    <p className="text-sm text-volcanic-600 mt-0.5 leading-snug">{f.blurb}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── WHAT WE DON'T KNOW ─────────────────────────────────────── */}
        <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
          <SectionHeading>What we don&apos;t know</SectionHeading>
          <div className="bg-[#F0EBDD] border border-volcanic-100 p-7 rounded-sm">
            {data.registry_status?.note && (
              <p className="font-display italic text-[17px] leading-[1.55] text-volcanic-900 max-w-2xl mb-4">
                {data.registry_status.note}
              </p>
            )}
            <p className="font-display italic text-[17px] leading-[1.55] text-volcanic-900 max-w-2xl mb-5">
              If you know this beach — if you&apos;ve walked here, swum here, had a beer on the promenade at Praia da Torre on the way back — we would like to hear from you. Specifically:
            </p>
            <ul className="grid md:grid-cols-2 gap-y-2 gap-x-8 mb-6 text-[14px] text-volcanic-700">
              <li className="pl-5 relative before:content-['○'] before:absolute before:left-0 before:text-volcanic-300">A photograph of the beach itself</li>
              <li className="pl-5 relative before:content-['○'] before:absolute before:left-0 before:text-volcanic-300">Whether there&apos;s parking nearby or it&apos;s walk-only</li>
              <li className="pl-5 relative before:content-['○'] before:absolute before:left-0 before:text-volcanic-300">The feel of the sand — fine or gravelly</li>
              <li className="pl-5 relative before:content-['○'] before:absolute before:left-0 before:text-volcanic-300">Whether the stream crossing is passable year-round</li>
              <li className="pl-5 relative before:content-['○'] before:absolute before:left-0 before:text-volcanic-300">Who actually swims here (locals, visitors, nobody)</li>
              <li className="pl-5 relative before:content-['○'] before:absolute before:left-0 before:text-volcanic-300">Any local name that isn&apos;t {displayName}</li>
            </ul>
            <a
              href={`https://forms.gle/placeholder?slug=${data.slug}`}
              className="inline-flex items-center gap-2 bg-volcanic-900 text-[#FBF9F4] px-5 py-2.5 text-[14px] font-sans hover:bg-ocean-800 rounded-sm"
              target="_blank"
              rel="noopener"
            >
              Contribute a local note <span className="font-display">→</span>
            </a>
          </div>
        </section>

        {/* ── NEIGHBORS (wbt-internal) ───────────────────────────────── */}
        {neighbors.length > 0 && (
          <section className="px-8 md:px-12 py-10 border-b border-volcanic-100">
            <SectionHeading>Other beaches on this shoreline</SectionHeading>
            <ul>
              {neighbors.slice(0, 8).map((n) => (
                <li key={n.slug} className="border-t border-volcanic-100 first:border-t-0">
                  <Link href={`/beaches/${n.slug}`} className="flex items-center justify-between py-3 hover:bg-white transition-colors px-3 -mx-3 rounded-sm">
                    <span className="font-display text-base text-volcanic-900">{n.name}</span>
                    <span className="flex items-center gap-4 text-xs text-volcanic-500">
                      <span className="font-mono">{n.distance_km.toFixed(2)} km</span>
                      {n.has_wiki && <span className="text-ocean-800">write-up →</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── PROVENANCE ─────────────────────────────────────────────── */}
        <section className="px-8 md:px-12 py-10">
          <SectionHeading>Where this page comes from</SectionHeading>
          <div className="bg-white border border-volcanic-100 rounded-sm overflow-hidden text-sm">
            <table className="w-full">
              <tbody className="divide-y divide-volcanic-100">
                <tr>
                  <td className="p-4 font-mono text-[11px] uppercase tracking-[0.05em] text-volcanic-500 w-44 align-top">Geometry</td>
                  <td className="p-4 align-top text-volcanic-700">
                    <ConfTag kind="verified" />{" "}
                    OpenStreetMap {data.osm?.way_id && <>way/{data.osm.way_id}</>}. Coordinates, shoreline length, and the outline in the diagram above.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-[11px] uppercase tracking-[0.05em] text-volcanic-500 align-top">Climate</td>
                  <td className="p-4 align-top text-volcanic-700">
                    <ConfTag kind="computed" /> WorldClim v2.1 monthly normals (2.5-minute grid). Local micro-climate may differ — the beach is a pin on a grid cell, not a weather station.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-[11px] uppercase tracking-[0.05em] text-volcanic-500 align-top">Tides</td>
                  <td className="p-4 align-top text-volcanic-700">
                    <ConfTag kind="computed" /> EOT20 global ocean tide model (DGFI-TUM). Spring and neap ranges are typical; actual conditions vary.
                  </td>
                </tr>
                {hasSand && (
                  <tr>
                    <td className="p-4 font-mono text-[11px] uppercase tracking-[0.05em] text-volcanic-500 align-top">Sand composition</td>
                    <td className="p-4 align-top text-volcanic-700">
                      <ConfTag kind="predicted" /> GloPrSM v1.0.0 model prediction from regional bedrock, climate and coastal-process inputs. Not sampled in situ.
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="p-4 font-mono text-[11px] uppercase tracking-[0.05em] text-volcanic-500 align-top">Nearest city / airport</td>
                  <td className="p-4 align-top text-volcanic-700">
                    <ConfTag kind="verified" /> GeoNames and OurAirports. Distances computed great-circle from the beach centroid.
                  </td>
                </tr>
                {data.storm_history && (
                  <tr>
                    <td className="p-4 font-mono text-[11px] uppercase tracking-[0.05em] text-volcanic-500 align-top">Storm history</td>
                    <td className="p-4 align-top text-volcanic-700">
                      <ConfTag kind="verified" /> IBTrACS v04r01 (NOAA) — tropical cyclone tracks passing within 100 km since 1980.
                    </td>
                  </tr>
                )}
                {data.typological_siblings_placeholder && (
                  <tr>
                    <td className="p-4 font-mono text-[11px] uppercase tracking-[0.05em] text-volcanic-500 align-top">Typological siblings</td>
                    <td className="p-4 align-top text-volcanic-700">
                      <ConfTag kind="predicted" /> Pipeline pending. Final similarity is cosine on a seven-dimension vector (coastal type, sand, tidal regime, size, climate zone, wave exposure, facing). The five shown are hand-curated placeholders.
                    </td>
                  </tr>
                )}
                {data.context_photos && (
                  <tr>
                    <td className="p-4 font-mono text-[11px] uppercase tracking-[0.05em] text-volcanic-500 align-top">Photos</td>
                    <td className="p-4 align-top text-volcanic-700">
                      <ConfTag kind="verified" /> Wikimedia Commons, within ~900 m of the beach. Credits and licences shown beneath each photo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
