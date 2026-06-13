"use client";

import { useMemo, useState } from "react";
import {
  Waves,
  Users,
  Camera,
  Anchor,
  Mountain,
  Sun,
  Thermometer,
  Wind,
  MapPin,
  Navigation,
  TriangleAlert,
  Check,
  X,
  CircleHelp,
} from "lucide-react";
import { WaveChart, ClimateChart, SandBar } from "./charts";
import { LiveConditions, PlanYourTrip } from "./live-and-revenue";

// ---------------------------------------------------------------------------
// TYPES (subset of the beach JSON we consume)
// ---------------------------------------------------------------------------
export interface HuntingtonData {
  name: string;
  official_name: string;
  centroid_lat: number;
  centroid_lng: number;
  admin_level_1: string;
  dominant_lens: string;
  location: {
    nearest_city: string;
    nearest_city_distance_km: number;
    nearest_airport_iata: string;
    nearest_airport_name: string;
    nearest_airport_distance_km: number;
  };
  climate: {
    air_temp_high: number[];
    air_temp_low: number[];
    rain_mm: number[];
    sun_hours: number[];
    wind_speed: number[];
    source: string;
  };
  ocean: {
    wave_height_m: number[];
    wave_period_s: number[];
    swell_direction: string[];
    source: string;
  };
  tides: { range_spring_m: number; range_neap_m: number; type: string; source: string };
  bathymetry: { slope_pct: number; nearshore_depth_m: number; drop_off_flag: number };
  sand: { q_pct: number; f_pct: number; l_pct: number; regime_label: string; source: string };
  best_months: string[];
  swim_suitability: string;
  surfable: {
    surfable: boolean;
    confidence: string;
    break_type_guess: string;
    max_mean_wave_m: number;
    best_surf_months: string[];
    note: string;
  };
  hazards: { hazard_type: string; severity: string; source: string; observed_date: string }[];
  months_index: string[];
}

const HERO_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Ruby%27s%2C_Huntington_Beach_pier%2C_California.jpg/1920px-Ruby%27s%2C_Huntington_Beach_pier%2C_California.jpg";

const MONTHS_FULL = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function fmtMonths(keys: string[]): string {
  // Collapse a list of month keys into a readable range or list.
  const idxs = keys
    .map((k) => MONTHS_FULL.findIndex((m) => m.toLowerCase() === k))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  if (idxs.length === 0) return "";
  // detect contiguous (allowing dec→jan wrap loosely)
  const labels = idxs.map((i) => MONTHS_FULL[i]);
  if (labels.length <= 3) return labels.join(", ");
  return `${labels[0]}–${labels[labels.length - 1]}`;
}

// ---------------------------------------------------------------------------
// LENS DEFINITIONS — chips and which sections each emphasizes.
// ---------------------------------------------------------------------------
type SectionId = "surf" | "conditions" | "tides" | "sand" | "hazards" | "getting-there";

interface Lens {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** sections to float to the top, in priority order */
  emphasize: SectionId[];
}

const LENSES: Lens[] = [
  { id: "surf", label: "Surf", icon: <Waves className="h-4 w-4" />, emphasize: ["surf", "conditions", "tides", "hazards"] },
  { id: "swim", label: "Swim", icon: <Sun className="h-4 w-4" />, emphasize: ["tides", "hazards", "conditions", "surf"] },
  { id: "family", label: "Family", icon: <Users className="h-4 w-4" />, emphasize: ["tides", "hazards", "getting-there", "conditions"] },
  { id: "photography", label: "Photography", icon: <Camera className="h-4 w-4" />, emphasize: ["conditions", "surf", "getting-there"] },
  { id: "nature", label: "Nature & Sand", icon: <Mountain className="h-4 w-4" />, emphasize: ["sand", "conditions", "hazards"] },
  { id: "conditions", label: "Conditions", icon: <Thermometer className="h-4 w-4" />, emphasize: ["conditions", "surf", "tides"] },
];

const DEFAULT_ORDER: SectionId[] = ["surf", "conditions", "tides", "sand", "hazards", "getting-there"];

function orderForLens(lensId: string): SectionId[] {
  const lens = LENSES.find((l) => l.id === lensId);
  if (!lens) return DEFAULT_ORDER;
  const seen = new Set<SectionId>();
  const out: SectionId[] = [];
  for (const s of lens.emphasize) {
    if (!seen.has(s)) {
      out.push(s);
      seen.add(s);
    }
  }
  for (const s of DEFAULT_ORDER) if (!seen.has(s)) out.push(s);
  return out;
}

// ===========================================================================
// MAIN
// ===========================================================================
export default function HuntingtonPilot({ data }: { data: HuntingtonData }) {
  const [activeLens, setActiveLens] = useState<string>("surf");

  const order = useMemo(() => orderForLens(activeLens), [activeLens]);

  const winterWave = data.ocean.wave_height_m[0]; // jan
  const summerWave = data.ocean.wave_height_m[6]; // jul
  const winterPeriod = data.ocean.wave_period_s[0];

  return (
    <main className="bg-volcanic-50/40">
      {/* ===================== HERO ===================== */}
      <header className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt="The Huntington Beach Pier at golden hour, Surf City USA"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-volcanic-950/90 via-volcanic-950/30 to-volcanic-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-volcanic-950/40 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-12 sm:px-8 sm:pb-16">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
            <MapPin className="h-3.5 w-3.5" />
            {data.admin_level_1}, USA
            <span className="mx-1 text-sand-300">·</span>
            <span className="text-sand-300">Surf City USA</span>
          </div>
          <h1
            className="font-display text-5xl leading-[0.95] text-white sm:text-7xl"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.4)" }}
          >
            {data.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            A west-facing beach break where the swell flips with the season — long Pacific
            groundswell in winter, mellow southern wraps in summer. The pier splits it; the
            sand runs gold and almost pure quartz.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Pill>Beach break</Pill>
            <Pill>Quartz-dominant sand</Pill>
            <Pill>Sunset over water</Pill>
            <Pill>Mixed semidiurnal tide</Pill>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* ===================== QUICK-DECISION VERDICT ===================== */}
        <section className="-mt-10 relative z-20 mb-14">
          <div className="rounded-3xl border border-volcanic-100 bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl text-volcanic-900">Can I… here?</h2>
              <span className="text-[11px] font-medium uppercase tracking-wide text-volcanic-400">
                One verdict per visitor
              </span>
            </div>
            <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
              <Verdict
                icon={<Waves className="h-4 w-4" />}
                q="Surfable?"
                verdict="yes"
                answer={
                  <>
                    <strong>Yes</strong> — {data.surfable.break_type_guess}, best{" "}
                    {fmtMonths(data.surfable.best_surf_months)} on W groundswell. Winter swells run
                    ~{winterWave.toFixed(2)} m at {winterPeriod.toFixed(0)} s vs summer ~
                    {summerWave.toFixed(2)} m.
                  </>
                }
              />
              <Verdict
                icon={<Sun className="h-4 w-4" />}
                q="Good for swimming?"
                verdict="ok"
                answer={
                  <>
                    <strong>Fair</strong> — gentle {data.bathymetry.slope_pct}% shelf and a modest{" "}
                    {data.tides.range_spring_m} m spring tide, but it&apos;s open ocean with real
                    shorebreak. Swim near a staffed tower.
                  </>
                }
              />
              <Verdict
                icon={<Users className="h-4 w-4" />}
                q="Good for families?"
                verdict="ok"
                answer={
                  <>
                    <strong>Yes, with care</strong> — wide flat sand and a low tidal range are
                    forgiving; keep small kids out of the shorebreak and mind summer rip risk.
                  </>
                }
              />
              <Verdict
                icon={<Anchor className="h-4 w-4" />}
                q="Snorkel or dive?"
                verdict="no"
                answer={
                  <>
                    <strong>Skip it</strong> — sandy bottom, no reef and sediment-stirred water.
                    This isn&apos;t a snorkel beach; go to a rocky cove instead.
                  </>
                }
              />
              <Verdict
                icon={<Camera className="h-4 w-4" />}
                q="Sunset photography?"
                verdict="yes"
                answer={
                  <>
                    <strong>Excellent</strong> — it faces W/SW, so the sun drops straight into the
                    Pacific behind the pier. Few US beaches get a true over-water sunset.
                  </>
                }
              />
              <Verdict
                icon={<Mountain className="h-4 w-4" />}
                q="Nature & sand?"
                verdict="yes"
                answer={
                  <>
                    <strong>Notable</strong> — {data.sand.q_pct}% quartz, an unusually pure,
                    bright golden sand ({data.sand.regime_label}).
                  </>
                }
              />
            </div>
          </div>
        </section>

        {/* ===================== LENS CHIPS ===================== */}
        <div className="sticky top-0 z-30 -mx-5 mb-10 bg-volcanic-50/80 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-volcanic-400 sm:block">
              I&apos;m here to
            </span>
            <div className="flex flex-1 gap-2 overflow-x-auto hide-scrollbar scroll-fade-right pb-0.5">
              {LENSES.map((lens) => {
                const active = lens.id === activeLens;
                return (
                  <button
                    key={lens.id}
                    onClick={() => setActiveLens(lens.id)}
                    aria-pressed={active}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      active
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                        : "border-volcanic-200 bg-white text-volcanic-600 hover:border-indigo-300 hover:text-indigo-700"
                    }`}
                  >
                    {lens.icon}
                    {lens.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================== SECTIONS (re-ordered by lens) ===================== */}
        <div className="space-y-6 pb-4">
          {order.map((id, i) => (
            <SectionBlock key={id} id={id} data={data} emphasized={i === 0} />
          ))}
        </div>

        {/* ===================== LIVE CONDITIONS ===================== */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Live"
            title="Live conditions"
            kicker="Real public feeds, read in your browser. We label every card with its source and never invent a measured number."
          />
          <LiveConditions />
        </section>

        {/* ===================== REVENUE ===================== */}
        <section className="mt-16 mb-24">
          <SectionHeading
            eyebrow="Plan"
            title="Plan your trip"
            kicker={`Templated from this beach's own data — nearest city (${data.location.nearest_city}) and airport (${data.location.nearest_airport_iata}, ${data.location.nearest_airport_distance_km} km away).`}
          />
          <PlanYourTrip
            city={data.location.nearest_city}
            lat={data.centroid_lat}
            lng={data.centroid_lng}
            iata={data.location.nearest_airport_iata}
          />
          <p className="mt-4 text-[11px] text-volcanic-400">
            Links point to live public search results; affiliate IDs slot into the marked URL
            params in production.
          </p>
        </section>
      </div>
    </main>
  );
}

// ===========================================================================
// SECTION ROUTER
// ===========================================================================
function SectionBlock({
  id,
  data,
  emphasized,
}: {
  id: SectionId;
  data: HuntingtonData;
  emphasized: boolean;
}) {
  const ring = emphasized ? "ring-2 ring-indigo-100 border-indigo-200" : "border-volcanic-100";
  const base = `scroll-mt-24 rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 sm:p-8 ${ring}`;

  switch (id) {
    case "surf":
      return (
        <section id="surf" className={base}>
          <SectionHeading
            eyebrow="Dominant lens · Surf"
            title="The break"
            kicker={data.surfable.note}
            badge={emphasized}
          />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <WaveChart
                height={data.ocean.wave_height_m}
                period={data.ocean.wave_period_s}
                swell={data.ocean.swell_direction}
                bestSurfMonths={data.surfable.best_surf_months}
              />
            </div>
            <div className="space-y-4">
              <FactRow label="Verdict" value="Surfable — yes" accent />
              <FactRow label="Break type" value={data.surfable.break_type_guess} />
              <FactRow
                label="Best months"
                value={fmtMonths(data.surfable.best_surf_months)}
              />
              <FactRow label="Biggest mean swell" value={`${data.surfable.max_mean_wave_m} m`} />
              <p className="rounded-xl bg-indigo-50/60 p-4 text-sm leading-relaxed text-volcanic-700">
                Watch the swell-direction row on the chart: it&apos;s{" "}
                <strong className="text-indigo-700">W in winter</strong> (Dec–Mar, long-period
                North Pacific groundswell) and{" "}
                <strong className="text-indigo-700">SW in summer</strong> (shorter southern-
                hemisphere wraps). Winter is the bigger, cleaner window.
              </p>
              <p className="text-[11px] text-volcanic-400">
                Confidence: {data.surfable.confidence}. Source: {data.ocean.source}.
              </p>
            </div>
          </div>
        </section>
      );

    case "conditions":
      return (
        <section id="conditions" className={base}>
          <SectionHeading
            eyebrow="Conditions"
            title="Climate & best months"
            kicker="Coastal Southern California: dry, sun-soaked summers and a short, mild rainy season Dec–Mar. The water lags the air, peaking in late summer."
            badge={emphasized}
          />
          <ClimateChart
            high={data.climate.air_temp_high}
            low={data.climate.air_temp_low}
            rain={data.climate.rain_mm}
            bestMonths={data.best_months}
          />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStat icon={<Sun className="h-4 w-4" />} label="Sunniest" value="Jul" />
            <MiniStat icon={<Thermometer className="h-4 w-4" />} label="Warmest air" value="25°C (Aug)" />
            <MiniStat icon={<Wind className="h-4 w-4" />} label="Light winds" value="~3.5 m/s" />
            <MiniStat
              icon={<Camera className="h-4 w-4" />}
              label="Best months"
              value={fmtMonths(data.best_months)}
            />
          </div>
          <p className="mt-4 text-[11px] text-volcanic-400">Source: {data.climate.source}.</p>
        </section>
      );

    case "tides":
      return (
        <section id="tides" className={base}>
          <SectionHeading
            eyebrow="Water"
            title="Tides"
            kicker="A mixed semidiurnal tide — two unequal highs and lows a day. The range is modest, so the beach width is fairly stable through the day."
            badge={emphasized}
          />
          <div className="grid gap-6 sm:grid-cols-3">
            <TideGauge label="Spring range" m={data.tides.range_spring_m} max={data.tides.range_spring_m} />
            <TideGauge label="Neap range" m={data.tides.range_neap_m} max={data.tides.range_spring_m} />
            <div className="flex flex-col justify-center rounded-2xl bg-ocean-50/60 p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ocean-700">
                Tide type
              </span>
              <span className="mt-1 font-display text-2xl capitalize text-volcanic-900">
                {data.tides.type}
              </span>
              <span className="mt-1 text-xs text-volcanic-500">
                semidiurnal · unequal highs & lows
              </span>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-volcanic-400">Source: {data.tides.source}.</p>
        </section>
      );

    case "sand":
      return (
        <section id="sand" className={base}>
          <SectionHeading
            eyebrow="Geology"
            title="Sand & geology"
            kicker={`At ${data.sand.q_pct}% quartz this is an unusually pure, bright sand — washed down from the granitic Santa Ana watershed and rounded by the surf.`}
            badge={emphasized}
          />
          <SandBar
            q={data.sand.q_pct}
            f={data.sand.f_pct}
            l={data.sand.l_pct}
            regime={data.sand.regime_label}
          />
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <FactRow label="Regime" value={data.sand.regime_label} />
            <FactRow label="Nearshore slope" value={`${data.bathymetry.slope_pct}% (gentle)`} />
            <FactRow label="Nearshore depth" value={`${data.bathymetry.nearshore_depth_m} m`} />
          </div>
          <p className="mt-4 text-[11px] text-volcanic-400">
            Modelled from {data.sand.source}. Treat as a regional signal, not a sand assay.
          </p>
        </section>
      );

    case "hazards":
      return (
        <section id="hazards" className={base}>
          <SectionHeading
            eyebrow="Safety"
            title="Hazards & safety"
            kicker="The standing risks here are shorebreak and rip currents — and, rarely, the tail of an eastern-Pacific tropical system. Three are on the historical record."
            badge={emphasized}
          />
          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <SafetyNote
              title="Rip currents & shorebreak"
              body="A beach break means rips form and shift, especially on bigger winter swell and around the pier pilings. Swim between flagged towers."
              severity="standing"
            />
            <SafetyNote
              title="Sun & surf exposure"
              body="Long sun hours and open water — hydrate, watch kids in the shorebreak, and check the daily NWS rip outlook below."
              severity="standing"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-volcanic-100">
            <table className="w-full text-sm">
              <thead className="bg-volcanic-50 text-left text-[11px] uppercase tracking-wide text-volcanic-400">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Recorded hazard</th>
                  <th className="px-4 py-2.5 font-semibold">Severity</th>
                  <th className="px-4 py-2.5 font-semibold">Date</th>
                  <th className="px-4 py-2.5 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-volcanic-100">
                {data.hazards.map((h, i) => (
                  <tr key={i} className="text-volcanic-700">
                    <td className="px-4 py-2.5 capitalize">
                      {h.hazard_type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-2.5">
                      <SeverityBadge severity={h.severity} />
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-volcanic-500">
                      {h.observed_date.slice(0, 10)}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-volcanic-400">
                      {h.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-volcanic-400">
            Tropical-cyclone passes are historical (1972–1978) from IBTrACS — context, not a
            current forecast.
          </p>
        </section>
      );

    case "getting-there":
      return (
        <section id="getting-there" className={base}>
          <SectionHeading
            eyebrow="Logistics"
            title="Getting there"
            kicker="One of the most accessible major surf beaches in the country — a county airport sits 12 km away."
            badge={emphasized}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <FactRow
              label="Nearest city"
              value={`${data.location.nearest_city} (${data.location.nearest_city_distance_km} km)`}
            />
            <FactRow
              label="Airport"
              value={`${data.location.nearest_airport_iata} · ${data.location.nearest_airport_distance_km} km`}
            />
            <FactRow
              label="Coordinates"
              value={`${data.centroid_lat.toFixed(3)}, ${data.centroid_lng.toFixed(3)}`}
            />
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${data.centroid_lat},${data.centroid_lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-volcanic-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-volcanic-800"
          >
            <Navigation className="h-4 w-4" /> Open in maps
          </a>
        </section>
      );
  }
}

// ===========================================================================
// SMALL UI PRIMITIVES
// ===========================================================================
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
      {children}
    </span>
  );
}

function Verdict({
  icon,
  q,
  answer,
  verdict,
}: {
  icon: React.ReactNode;
  q: string;
  answer: React.ReactNode;
  verdict: "yes" | "no" | "ok";
}) {
  const mark =
    verdict === "yes" ? (
      <Check className="h-4 w-4 text-reef-600" />
    ) : verdict === "no" ? (
      <X className="h-4 w-4 text-coral-500" />
    ) : (
      <CircleHelp className="h-4 w-4 text-amber-500" />
    );
  return (
    <div className="flex gap-3 border-b border-volcanic-100 py-3.5 last:border-0 sm:[&:nth-last-child(2)]:border-0">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-volcanic-50 text-volcanic-500">
        {icon}
      </span>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-volcanic-900">{q}</span>
          {mark}
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-volcanic-600">{answer}</p>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  kicker,
  badge,
}: {
  eyebrow: string;
  title: string;
  kicker?: string;
  badge?: boolean;
}) {
  return (
    <div className="mb-6 max-w-3xl">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-500">
          {eyebrow}
        </span>
        {badge && (
          <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            In focus
          </span>
        )}
      </div>
      <h3 className="font-display text-3xl leading-tight text-volcanic-900">{title}</h3>
      {kicker && <p className="mt-2 text-[15px] leading-relaxed text-volcanic-500">{kicker}</p>}
    </div>
  );
}

function FactRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`flex flex-col rounded-xl border px-4 py-3 ${
        accent ? "border-indigo-200 bg-indigo-50/50" : "border-volcanic-100 bg-volcanic-50/40"
      }`}
    >
      <span className="text-[11px] font-medium uppercase tracking-wider text-volcanic-400">
        {label}
      </span>
      <span
        className={`mt-0.5 text-base font-semibold capitalize ${
          accent ? "text-indigo-700" : "text-volcanic-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-volcanic-100 bg-volcanic-50/40 p-3.5">
      <span className="text-volcanic-400">{icon}</span>
      <div className="mt-2 text-base font-semibold text-volcanic-900">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-volcanic-400">{label}</div>
    </div>
  );
}

function TideGauge({ label, m, max }: { label: string; m: number; max: number }) {
  const pct = Math.min(100, (m / max) * 100);
  return (
    <div className="rounded-2xl border border-volcanic-100 bg-volcanic-50/40 p-5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-volcanic-400">
        {label}
      </span>
      <div className="mt-1 font-display text-2xl text-volcanic-900">{m.toFixed(2)} m</div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-volcanic-100">
        <div className="h-full rounded-full bg-ocean-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SafetyNote({
  title,
  body,
  severity,
}: {
  title: string;
  body: string;
  severity: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
      <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-volcanic-900">{title}</h4>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700">
            {severity}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-volcanic-600">{body}</p>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const n = parseInt(severity, 10);
  const color =
    n >= 4
      ? "bg-coral-100 text-coral-500"
      : n >= 2
      ? "bg-amber-100 text-amber-700"
      : "bg-volcanic-100 text-volcanic-500";
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${color}`}>
      Cat {severity}
    </span>
  );
}
