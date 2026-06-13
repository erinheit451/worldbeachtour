"use client";

import { useEffect, useState } from "react";
import {
  Waves,
  Activity,
  Droplets,
  ShieldAlert,
  BedDouble,
  Plane,
  Ticket,
  ExternalLink,
  RadioTower,
} from "lucide-react";

// ===========================================================================
// LIVE DATA
//
// Two feeds are wired for real, client-side, CORS-friendly, free, public:
//   - NDBC buoy 46222 (San Pedro, CA) realtime2 .txt  → live wave height/period
//   - NOAA CO-OPS station 9410660 (Los Angeles)       → latest water level + next tide
// Two feeds are HONEST PLACEHOLDERS (named source + "monitored" badge, no
// fabricated number): NWS rip-current outlook + EPA BEACON water quality.
// ===========================================================================

type FetchState = "loading" | "ok" | "error";

const NDBC_STATION = "46222"; // San Pedro, CA
const COOPS_STATION = "9410660"; // Los Angeles, CA (Outer Harbor)

function cToF(c: number) {
  return c * 1.8 + 32;
}
function mToFt(m: number) {
  return m * 3.28084;
}

export function LiveConditions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <BuoyCard />
      <TideCard />
      <RipCurrentCard />
      <WaterQualityCard />
    </div>
  );
}

function LiveShell({
  icon,
  title,
  source,
  state,
  badge,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  source: string;
  state: FetchState | "monitored";
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-volcanic-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ocean-50 text-ocean-600">
            {icon}
          </span>
          <div>
            <h4 className="text-sm font-semibold text-volcanic-900">{title}</h4>
            <p className="text-[11px] text-volcanic-400">{source}</p>
          </div>
        </div>
        {state === "ok" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-reef-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-reef-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-reef-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-reef-600" />
            </span>
            Live
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-volcanic-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-volcanic-500">
            {badge ?? "Monitored"}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function BuoyCard() {
  const [state, setState] = useState<FetchState>("loading");
  const [data, setData] = useState<{ wvht?: number; dpd?: number; wtmp?: number; when?: string }>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `https://www.ndbc.noaa.gov/data/realtime2/${NDBC_STATION}.txt`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(String(res.status));
        const text = await res.text();
        const lines = text.split("\n").filter((l) => l && !l.startsWith("#"));
        const cols = text.split("\n")[0].replace(/^#/, "").trim().split(/\s+/);
        const idx = (name: string) => cols.indexOf(name);
        // first data row is most recent
        const row = lines[0].trim().split(/\s+/);
        const num = (name: string) => {
          const v = parseFloat(row[idx(name)]);
          return Number.isFinite(v) && v < 99 ? v : undefined;
        };
        const yy = row[0], mo = row[1], dd = row[2], hh = row[3], mm = row[4];
        if (!cancelled) {
          setData({
            wvht: num("WVHT"),
            dpd: num("DPD"),
            wtmp: num("WTMP"),
            when: `${yy}-${mo}-${dd} ${hh}:${mm} UTC`,
          });
          setState("ok");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <LiveShell
      icon={<RadioTower className="h-5 w-5" />}
      title="Offshore buoy — Station 46222"
      source="NOAA NDBC · San Pedro, CA (~30 mi WSW)"
      state={state === "ok" ? "ok" : "monitored"}
      badge={state === "loading" ? "Connecting…" : "Feed offline"}
    >
      {state === "ok" ? (
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat
            label="Wave"
            value={data.wvht != null ? `${mToFt(data.wvht).toFixed(1)} ft` : "—"}
          />
          <Stat label="Period" value={data.dpd != null ? `${data.dpd.toFixed(0)} s` : "—"} />
          <Stat
            label="Water"
            value={data.wtmp != null ? `${cToF(data.wtmp).toFixed(0)}°F` : "—"}
          />
          <p className="col-span-3 mt-1 font-mono text-[10px] text-volcanic-400">
            obs {data.when}
          </p>
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-volcanic-500">
          Nearest active wave buoy to Huntington. We read the live realtime feed in your
          browser; if NOAA throttles the request it falls back to this monitored card.
        </p>
      )}
    </LiveShell>
  );
}

function TideCard() {
  const [state, setState] = useState<FetchState>("loading");
  const [now, setNow] = useState<{ v?: number; t?: string }>({});
  const [next, setNext] = useState<{ type?: string; t?: string; v?: number }>({});

  useEffect(() => {
    let cancelled = false;
    const base = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";
    const common = `station=${COOPS_STATION}&time_zone=lst_ldt&units=english&application=worldbeachtour&format=json`;
    (async () => {
      try {
        const [wlRes, predRes] = await Promise.all([
          fetch(`${base}?date=latest&product=water_level&datum=MLLW&${common}`, { cache: "no-store" }),
          fetch(
            `${base}?date=today&range=48&product=predictions&interval=hilo&datum=MLLW&${common}`,
            { cache: "no-store" }
          ),
        ]);
        const wl = await wlRes.json();
        const pred = await predRes.json();
        const latest = wl?.data?.[0];
        const upcoming = (pred?.predictions ?? []).find((p: { t: string }) => new Date(p.t) > new Date());
        if (!cancelled) {
          setNow({ v: latest ? parseFloat(latest.v) : undefined, t: latest?.t });
          if (upcoming)
            setNext({
              type: upcoming.type === "H" ? "High" : "Low",
              t: upcoming.t,
              v: parseFloat(upcoming.v),
            });
          setState(latest || upcoming ? "ok" : "error");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <LiveShell
      icon={<Activity className="h-5 w-5" />}
      title="Tide — Station 9410660"
      source="NOAA CO-OPS · Los Angeles (datum MLLW)"
      state={state === "ok" ? "ok" : "monitored"}
      badge={state === "loading" ? "Connecting…" : "Feed offline"}
    >
      {state === "ok" ? (
        <div className="grid grid-cols-2 gap-2 text-center">
          <Stat label="Now" value={now.v != null ? `${now.v.toFixed(1)} ft` : "—"} />
          <Stat
            label={next.type ? `Next ${next.type.toLowerCase()}` : "Next"}
            value={
              next.t
                ? new Date(next.t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                : "—"
            }
          />
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-volcanic-500">
          Real-time water level and the next high/low, read live from NOAA in your browser.
        </p>
      )}
    </LiveShell>
  );
}

function RipCurrentCard() {
  return (
    <LiveShell
      icon={<ShieldAlert className="h-5 w-5" />}
      title="Rip-current outlook"
      source="NWS Los Angeles/Oxnard · Surf Zone Forecast"
      state="monitored"
      badge="Source linked"
    >
      <p className="text-xs leading-relaxed text-volcanic-500">
        Daily rip-current risk (Low / Moderate / High) is issued by the National Weather
        Service. We surface the official outlook rather than guess a level.
      </p>
      <a
        href="https://forecast.weather.gov/product.php?site=LOX&product=SRF&issuedby=LOX"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ocean-600 hover:text-ocean-700"
      >
        Today&apos;s NWS surf-zone forecast <ExternalLink className="h-3 w-3" />
      </a>
    </LiveShell>
  );
}

function WaterQualityCard() {
  return (
    <LiveShell
      icon={<Droplets className="h-5 w-5" />}
      title="Water quality"
      source="EPA BEACON · OC Health Care Agency"
      state="monitored"
      badge="Source linked"
    >
      <p className="text-xs leading-relaxed text-volcanic-500">
        Bacterial advisories and closures for Huntington City Beach are posted by Orange
        County and aggregated in EPA&apos;s BEACON database. Always check before a swim
        after rain.
      </p>
      <a
        href="https://ocbeachinfo.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ocean-600 hover:text-ocean-700"
      >
        OC ocean water-quality status <ExternalLink className="h-3 w-3" />
      </a>
    </LiveShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-volcanic-50/70 py-2">
      <div className="font-mono text-base font-semibold text-volcanic-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-volcanic-400">{label}</div>
    </div>
  );
}

// ===========================================================================
// REVENUE — contextual "Plan your trip" CTAs templated from the beach data.
// URL patterns are real public search endpoints; the marked params are where
// affiliate IDs / deep-link wrappers go in production.
// ===========================================================================

export function PlanYourTrip({
  city,
  lat,
  lng,
  iata,
}: {
  city: string;
  lat: number;
  lng: number;
  iata: string;
}) {
  const q = encodeURIComponent(`${city}, California`);

  // AFFILIATE SLOT: append &aid=<booking_affiliate_id>&label=wbt-huntington
  const stayUrl = `https://www.booking.com/searchresults.html?ss=${q}`;
  // AFFILIATE SLOT: Skyscanner partner deep-link / Kiwi Tequila affiliate wrapper
  const flightUrl = `https://www.skyscanner.com/transport/flights-to/${iata.toLowerCase()}/`;
  // AFFILIATE SLOT: Viator partner id ?pid=<viator_pid>&mcid=...&medium=link
  const doUrl = `https://www.viator.com/search/${q}`;
  // AFFILIATE SLOT: GetYourGuide partner_id query param
  const gygUrl = `https://www.getyourguide.com/s/?q=${q}&lat=${lat}&lng=${lng}`;

  const cards = [
    {
      icon: <BedDouble className="h-5 w-5" />,
      kicker: "Stay",
      title: `Where to stay in ${city}`,
      blurb: "Beachfront hotels along PCH, walkable to the pier.",
      href: stayUrl,
      cta: "Search Booking.com",
      accent: "text-ocean-600 bg-ocean-50",
    },
    {
      icon: <Plane className="h-5 w-5" />,
      kicker: "Fly",
      title: `Flights to ${iata}`,
      blurb: "John Wayne / Orange County — 12 km from the sand.",
      href: flightUrl,
      cta: "Compare flights",
      accent: "text-indigo-600 bg-indigo-50",
    },
    {
      icon: <Ticket className="h-5 w-5" />,
      kicker: "Do",
      title: "Surf lessons & things to do",
      blurb: "Beginner surf schools, pier tours, e-bike coast rides.",
      href: doUrl,
      altHref: gygUrl,
      cta: "Browse experiences",
      accent: "text-violet-600 bg-violet-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <a
          key={c.title}
          href={c.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="group flex flex-col rounded-2xl border border-volcanic-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-ocean-200 hover:shadow-md"
        >
          <span className={`grid h-10 w-10 place-items-center rounded-lg ${c.accent}`}>
            {c.icon}
          </span>
          <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-volcanic-400">
            {c.kicker}
          </span>
          <h4 className="mt-1 font-display text-lg leading-tight text-volcanic-900">
            {c.title}
          </h4>
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-volcanic-500">{c.blurb}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ocean-600 group-hover:gap-2 transition-all">
            {c.cta} <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </a>
      ))}
    </div>
  );
}

export { Waves };
