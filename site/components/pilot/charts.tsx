"use client";

/**
 * Lightweight, dependency-free SVG charts for the Huntington adaptive pilot.
 * recharts is not in deps, so these are hand-built to match the house style
 * (volcanic grays, ocean/indigo accents, monospace data labels).
 */

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTHS_FULL = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// ---------------------------------------------------------------------------
// Wave climatology: height bars + period line + swell-direction row.
// ---------------------------------------------------------------------------
export function WaveChart({
  height,
  period,
  swell,
  bestSurfMonths,
}: {
  height: number[];
  period: number[];
  swell: string[];
  bestSurfMonths: string[];
}) {
  const W = 720;
  const H = 240;
  const padL = 36;
  const padR = 36;
  const padT = 16;
  const padB = 44;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const hMax = Math.max(...height) * 1.12;
  const pMin = Math.min(...period) - 0.6;
  const pMax = Math.max(...period) + 0.4;

  const barW = (plotW / 12) * 0.56;
  const slot = plotW / 12;

  const x = (i: number) => padL + slot * i + slot / 2;
  const yH = (v: number) => padT + plotH - (v / hMax) * plotH;
  const yP = (v: number) => padT + plotH - ((v - pMin) / (pMax - pMin)) * plotH;

  const periodPath = period
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yP(v).toFixed(1)}`)
    .join(" ");

  const bestSet = new Set(
    bestSurfMonths.map((m) => MONTHS_FULL.findIndex((f) => f.toLowerCase() === m))
  );

  return (
    <figure className="not-prose">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Monthly wave height and period for Huntington Beach"
      >
        {/* horizontal gridlines for height */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={padL}
            x2={W - padR}
            y1={padT + plotH - f * plotH}
            y2={padT + plotH - f * plotH}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        ))}

        {/* height bars */}
        {height.map((v, i) => {
          const isBest = bestSet.has(i);
          return (
            <g key={i}>
              <rect
                x={x(i) - barW / 2}
                y={yH(v)}
                width={barW}
                height={padT + plotH - yH(v)}
                rx={3}
                fill={isBest ? "#4338ca" : "#a5b4fc"}
                opacity={isBest ? 1 : 0.85}
              />
              <text
                x={x(i)}
                y={yH(v) - 5}
                textAnchor="middle"
                className="fill-volcanic-400"
                style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}
              >
                {v.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* period line + dots */}
        <path d={periodPath} fill="none" stroke="#0ea5e9" strokeWidth={2} />
        {period.map((v, i) => (
          <circle key={i} cx={x(i)} cy={yP(v)} r={2.6} fill="#0284c7" />
        ))}

        {/* swell direction row */}
        {swell.map((d, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 26}
            textAnchor="middle"
            className="fill-volcanic-500"
            style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 600 }}
          >
            {d}
          </text>
        ))}

        {/* month labels */}
        {MONTHS.map((m, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 10}
            textAnchor="middle"
            className="fill-volcanic-400"
            style={{ fontSize: 10 }}
          >
            {m}
          </text>
        ))}
      </svg>

      <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-volcanic-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-700" />
          Best surf months
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#a5b4fc" }} />
          Wave height (m)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4" style={{ background: "#0ea5e9" }} />
          Swell period (s)
        </span>
        <span className="font-mono uppercase tracking-wide text-volcanic-400">
          row 3 = dominant swell direction
        </span>
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Climate: temp high/low band + rain bars.
// ---------------------------------------------------------------------------
export function ClimateChart({
  high,
  low,
  rain,
  bestMonths,
}: {
  high: number[];
  low: number[];
  rain: number[];
  bestMonths: string[];
}) {
  const W = 720;
  const H = 230;
  const padL = 34;
  const padR = 40;
  const padT = 16;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const slot = plotW / 12;
  const x = (i: number) => padL + slot * i + slot / 2;

  const tMin = Math.min(...low) - 2;
  const tMax = Math.max(...high) + 2;
  const yT = (v: number) => padT + plotH - ((v - tMin) / (tMax - tMin)) * plotH;

  const rMax = Math.max(...rain) * 1.05;
  const barW = (slot) * 0.5;

  const highPath = high.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yT(v).toFixed(1)}`).join(" ");
  const lowPath = low.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yT(v).toFixed(1)}`).join(" ");
  const bandPath =
    high.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yT(v).toFixed(1)}`).join(" ") +
    " " +
    low.map((v, i) => `L${x(11 - i).toFixed(1)},${yT(low[11 - i]).toFixed(1)}`).join(" ") +
    " Z";

  const bestSet = new Set(
    bestMonths.map((m) => MONTHS_FULL.findIndex((f) => f.toLowerCase() === m))
  );

  return (
    <figure className="not-prose">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Monthly temperature and rainfall">
        {/* rain bars (scaled into lower third) */}
        {rain.map((v, i) => {
          const h = (v / rMax) * (plotH * 0.42);
          return (
            <rect
              key={i}
              x={x(i) - barW / 2}
              y={padT + plotH - h}
              width={barW}
              height={h}
              rx={2}
              fill="#7dd3fc"
              opacity={0.55}
            />
          );
        })}

        {/* temp band */}
        <path d={bandPath} fill="#fb923c" opacity={0.1} />
        <path d={highPath} fill="none" stroke="#ea580c" strokeWidth={2} />
        <path d={lowPath} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" />
        {high.map((v, i) => (
          <circle key={i} cx={x(i)} cy={yT(v)} r={2.2} fill="#ea580c" />
        ))}

        {/* best-month tick */}
        {MONTHS.map((m, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            style={{ fontSize: 10, fontWeight: bestSet.has(i) ? 700 : 400 }}
            className={bestSet.has(i) ? "fill-reef-600" : "fill-volcanic-400"}
          >
            {m}
          </text>
        ))}
      </svg>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-volcanic-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4" style={{ background: "#ea580c" }} />
          Avg high (°C)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-t-2 border-dashed" style={{ borderColor: "#f59e0b" }} />
          Avg low (°C)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#7dd3fc" }} />
          Rainfall (mm)
        </span>
        <span className="inline-flex items-center gap-1.5 text-reef-600">
          <span className="font-semibold">Green months</span> = best to visit
        </span>
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Sand Q/F/L composition bar.
// ---------------------------------------------------------------------------
export function SandBar({ q, f, l, regime }: { q: number; f: number; l: number; regime: string }) {
  const total = q + f + l || 1;
  const seg = (v: number) => (v / total) * 100;
  return (
    <div className="not-prose">
      <div className="flex h-8 w-full overflow-hidden rounded-lg border border-volcanic-200 shadow-sm">
        <div
          className="flex items-center justify-center text-[11px] font-semibold text-white"
          style={{ width: `${seg(q)}%`, backgroundColor: "#e5c574" }}
          title={`Quartz ${q.toFixed(1)}%`}
        >
          {seg(q) > 14 ? `Quartz ${q.toFixed(0)}%` : ""}
        </div>
        <div
          className="flex items-center justify-center text-[11px] font-semibold text-white"
          style={{ width: `${seg(f)}%`, backgroundColor: "#c28a7a" }}
          title={`Feldspar ${f.toFixed(1)}%`}
        >
          {seg(f) > 14 ? `F ${f.toFixed(0)}%` : ""}
        </div>
        <div
          className="flex items-center justify-center text-[11px] font-semibold text-white"
          style={{ width: `${seg(l)}%`, backgroundColor: "#5e4a42" }}
          title={`Lithic ${l.toFixed(1)}%`}
        >
          {seg(l) > 14 ? `Lithic ${l.toFixed(0)}%` : ""}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-volcanic-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#e5c574" }} /> Quartz
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#c28a7a" }} /> Feldspar
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#5e4a42" }} /> Lithic
        </span>
        <span className="font-mono italic">{regime}</span>
      </div>
    </div>
  );
}
