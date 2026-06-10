import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";

const DATA_PATH = path.join(process.cwd(), "data", "beaches", "copacabana-7.json");

interface SurfData {
  climate: {
    wave_height_m: (number | null)[];
    wave_period_s: (number | null)[];
    water_temp: (number | null)[];
    ocean_source: string | null;
  };
  tides: {
    range_spring_m: number;
    range_neap_m: number;
    type: string;
  };
}

function loadData(): SurfData {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

export const metadata: Metadata = {
  title: "Surf at Copacabana — The Honest Read",
  description:
    "Copa is not a legendary surf break. But on the right winter week it's a real one. Seasonal swell window, the Posto 6 break, rip currents, and who surfs here.",
  openGraph: {
    title: "Surf at Copacabana",
    description: "Not legendary, not flat — a real Atlantic. What a visiting surfer needs to know.",
    type: "article",
  },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function WaveBars({ values }: { values: (number | null)[] }) {
  const max = Math.max(2, ...values.map((v) => v ?? 0));
  return (
    <div className="not-prose">
      <div className="grid grid-cols-12 gap-2 items-end h-40">
        {values.map((v, i) => {
          const h = v != null ? Math.max(4, (v / max) * 140) : 0;
          const strong = v != null && v >= 1.5;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-full flex items-end" style={{ height: 140 }}>
                <div
                  className={`w-full rounded-t ${strong ? "bg-ocean-500" : "bg-ocean-200"}`}
                  style={{ height: `${h}px` }}
                  title={`${MONTHS[i]}: ${v?.toFixed(2) ?? "—"}m`}
                />
              </div>
              <div className="text-[10px] font-mono text-volcanic-500">{MONTHS[i]}</div>
              <div className="text-[10px] font-mono text-volcanic-700">{v?.toFixed(1) ?? "—"}</div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-volcanic-500 italic">
        Monthly mean maximum wave height in meters. Darker bars = above 1.5m. The pattern is the austral winter swell window, June–August.
      </p>
    </div>
  );
}

export default function SurfPage() {
  const data = loadData();
  return (
    <article className="bg-white">
      {/* Header band */}
      <header className="border-b border-volcanic-200 bg-ocean-50/60">
        <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
          <nav className="text-xs text-volcanic-500 mb-6">
            <Link href="/beaches/copacabana-7" className="hover:text-ocean-700">← Back to Copacabana</Link>
          </nav>
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-ocean-700 mb-4">
            Specialist · Surf
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-volcanic-900 leading-tight">
            Surf at Copacabana
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-volcanic-600 italic font-serif">
            Not legendary, not flat — a real Atlantic doing real Atlantic work.
          </p>
        </div>
      </header>

      {/* The honest read */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="prose prose-lg max-w-none prose-p:text-volcanic-700 prose-p:leading-relaxed">
          <p>
            If you flew to Rio to surf, you did not fly for Copacabana. You flew for Saquarema 90 km east, or Itacoatiara across the bay, or the Rio state north-coast points. Those are the serious breaks.
          </p>
          <p>
            But if you live on Copa for a week and the swell is up, the Posto 6 break at the southern end of the arc can be a legitimate session. It's a real Atlantic, it's in a city, and it's convenient in a way almost no other decent wave in the world is. That's the trade.
          </p>
        </div>
      </section>

      {/* When */}
      <section className="border-t border-volcanic-200">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="font-display text-3xl text-volcanic-900 mb-3">When</h2>
          <p className="max-w-2xl text-volcanic-700 leading-relaxed mb-10">
            Austral winter — <strong>June through August</strong> — brings cold-front swell from the Southern Ocean. That's the window. Summer (December–March) is usually flat; peak tourist season is also the flattest ocean. Spring and autumn are in-between months where a storm two thousand miles south will occasionally deliver two or three good days before the wind ruins it.
          </p>
          <WaveBars values={data.climate.wave_height_m} />
        </div>
      </section>

      {/* Where */}
      <section className="border-t border-volcanic-200 bg-sand-50">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="font-display text-3xl text-volcanic-900 mb-6">Where</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-xl text-volcanic-900 mb-3">Posto 6 break</h3>
              <p className="text-volcanic-700 leading-relaxed">
                The south end of the arc, right where the beach narrows against the Forte de Copacabana promontory. This is where the swell refracts into a consistent right-hand break. A beach break with an offshore sandbar structure; peaks shift over weeks. The fishermen's colônia is 50 m north — you'll share the water with their boats at dawn.
              </p>
              <p className="mt-3 text-volcanic-700 leading-relaxed">
                At its best, head-high, mellow shoulder, 50-meter rides. At its worst, closeouts all day and wind coming straight onshore by nine.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl text-volcanic-900 mb-3">Other postos</h3>
              <p className="text-volcanic-700 leading-relaxed">
                Posto 5 occasionally holds a shorter peak when the swell wraps north. Postos 1–4 are mostly closeout conditions even on a good day — the arc flattens too much against them. You can paddle out anywhere for exercise, but for waves you want the southern end.
              </p>
              <p className="mt-3 text-volcanic-700 leading-relaxed">
                <strong>Arpoador</strong>, the rock just around the corner into Ipanema, holds a sharper right that locals prefer when it's working. It's a 10-minute walk from Posto 6. Not strictly Copa but strictly on the radar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rip currents */}
      <section className="border-t border-volcanic-200">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <h2 className="font-display text-3xl text-volcanic-900 mb-6">Rip currents</h2>
          <div className="prose prose-lg max-w-none prose-p:text-volcanic-700 prose-p:leading-relaxed">
            <p>
              Copa's shore-break sandbar structure creates reliable rip channels, and they're the reason for most lifeguard rescues. The pattern: the swell pushes water up the beach, it finds the lowest spot in the bar to drain through, and that drainage is the rip. The water wants to go back out; you're in its way.
            </p>
            <p>
              If you get caught in one, don't fight it. Don't swim straight back at shore — you'll lose. Swim parallel to the beach until you're out of the channel (usually 10 to 30 meters), then angle back in. The current is narrow. The fear of it is what kills people.
            </p>
            <p>
              The red flags on the sand mean a guard has decided this stretch is unsafe. They are right. Swim somewhere else that day.
            </p>
          </div>
        </div>
      </section>

      {/* Board + rentals */}
      <section className="border-t border-volcanic-200 bg-volcanic-50">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="font-display text-3xl text-volcanic-900 mb-6">Boards + rentals</h2>
          <p className="max-w-2xl text-volcanic-700 leading-relaxed mb-8">
            A visiting surfer's options on Copa are modest — fewer dedicated surf shops than Arpoador/Ipanema side. Most rentals are seasonal stands that set up on the sand near Posto 6 when the swell is running. Expect R$50–80 per day for a shortboard, R$80–120 for a longboard. Prices vary.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-volcanic-200 bg-white p-6">
              <h3 className="font-display text-lg text-volcanic-900">Rio Surf'n Stay</h3>
              <p className="mt-2 text-sm text-volcanic-700 leading-relaxed">
                Long-running surf hostel + lessons operation. Based more toward Recreio/Barra than Copa itself, but offers airport pickup and day trips.
              </p>
            </div>
            <div className="rounded-xl border border-volcanic-200 bg-white p-6">
              <h3 className="font-display text-lg text-volcanic-900">Itacoatiara Adventures</h3>
              <p className="mt-2 text-sm text-volcanic-700 leading-relaxed">
                If the Copa forecast is flat, day-trip operators run to Itacoatiara (across the bay in Niterói) or north to Saquarema — Rio state's serious breaks.
              </p>
            </div>
          </div>
          <p className="mt-6 text-xs italic text-volcanic-500">
            We don't list specific kiosk surf-rental names because the concession operators rotate. Ask at your hotel's concierge or at Posto 6 directly on the morning you want to paddle out.
          </p>
        </div>
      </section>

      {/* Quick-reference data card */}
      <section className="border-t border-volcanic-200">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="font-display text-3xl text-volcanic-900 mb-8">Data at a glance</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Primary break", "Posto 6"],
              ["Surf season", "Jun – Aug (austral winter)"],
              ["Winter wave height", `${Math.max(...(data.climate.wave_height_m.filter((v): v is number => v != null))).toFixed(1)} m avg max`],
              ["Summer wave height", `${Math.min(...(data.climate.wave_height_m.filter((v): v is number => v != null))).toFixed(1)} m avg max`],
              ["Water temp (winter)", "22°C"],
              ["Water temp (summer)", "26°C"],
              ["Upwelling cold drop to", "~18°C"],
              ["Tide range (spring / neap)", `${data.tides.range_spring_m.toFixed(2)}m / ${data.tides.range_neap_m.toFixed(2)}m`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-volcanic-200 bg-white p-5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-volcanic-500 mb-2">{k}</div>
                <div className="font-display text-lg text-volcanic-900">{v}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs italic text-volcanic-500">
            Wave data from {data.climate.ocean_source}. For live forecasts, check CPTEC / INPE Brazil or Windy.com.
          </p>
        </div>
      </section>

      {/* Forecast links */}
      <section className="border-t border-volcanic-200 bg-volcanic-900 text-volcanic-50">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="font-display text-3xl text-white mb-6">Live forecast</h2>
          <p className="max-w-2xl text-volcanic-200 leading-relaxed mb-8">
            Historical monthly averages are what we have on-site. For a live read before you paddle, these are the three Brazilian surfers use:
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            <a href="https://www.cptec.inpe.br/" target="_blank" rel="noopener"
               className="rounded-xl border border-volcanic-700 bg-volcanic-800 p-6 hover:border-ocean-400 transition-colors">
              <h3 className="font-display text-lg text-white">CPTEC / INPE</h3>
              <p className="mt-2 text-sm text-volcanic-300">Brazilian government forecast, wave + wind models.</p>
              <p className="mt-3 text-xs font-mono text-ocean-300">cptec.inpe.br →</p>
            </a>
            <a href="https://www.windy.com/?-22.987,-43.190,13" target="_blank" rel="noopener"
               className="rounded-xl border border-volcanic-700 bg-volcanic-800 p-6 hover:border-ocean-400 transition-colors">
              <h3 className="font-display text-lg text-white">Windy</h3>
              <p className="mt-2 text-sm text-volcanic-300">Global weather + wave model, visual, pre-centered on Posto 6.</p>
              <p className="mt-3 text-xs font-mono text-ocean-300">windy.com →</p>
            </a>
            <a href="https://www.surfline.com/surf-report/copacabana/5ad57a7a9320ba00106c8691" target="_blank" rel="noopener"
               className="rounded-xl border border-volcanic-700 bg-volcanic-800 p-6 hover:border-ocean-400 transition-colors">
              <h3 className="font-display text-lg text-white">Surfline Copacabana</h3>
              <p className="mt-2 text-sm text-volcanic-300">English-language surf report for Copa specifically.</p>
              <p className="mt-3 text-xs font-mono text-ocean-300">surfline.com →</p>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-volcanic-200 bg-volcanic-50">
        <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-volcanic-600">
          <p>
            <Link href="/beaches/copacabana-7" className="text-ocean-700 hover:text-ocean-900">← Back to the main Copacabana page</Link>
          </p>
          <p className="mt-2 text-xs text-volcanic-400">
            Wave and tide data from Open-Meteo Marine archive. Forecast links are independent — we don't own the data or the operation of those sites.
          </p>
        </div>
      </footer>
    </article>
  );
}
