/**
 * Monthly climate visualization. SVG-only, no chart library.
 * Renders air temp high/low, water temp, and rainfall bars.
 */
interface Props {
  airHigh: (number | null)[];
  airLow: (number | null)[];
  waterTemp: (number | null)[];
  rainMm: (number | null)[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function MonthlyClimateChart({ airHigh, airLow, waterTemp, rainMm }: Props) {
  const W = 840;
  const H = 260;
  const PAD_L = 44;
  const PAD_R = 16;
  const PAD_T = 20;
  const PAD_B = 40;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // Temperature scale: 10-35°C
  const tMin = 10, tMax = 36;
  const tY = (v: number) => PAD_T + plotH - ((v - tMin) / (tMax - tMin)) * plotH;

  // Rain scale: 0-200mm
  const rMax = Math.max(200, ...rainMm.map((v) => v || 0));
  const rH = (v: number) => (v / rMax) * (plotH * 0.45); // bars take bottom 45% of plot

  const xAt = (i: number) => PAD_L + ((i + 0.5) / 12) * plotW;

  const tempPath = (vals: (number | null)[]) => {
    let d = "";
    for (let i = 0; i < 12; i++) {
      const v = vals[i];
      if (v == null) continue;
      const x = xAt(i);
      const y = tY(v);
      d += (d ? " L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
    }
    return d;
  };

  const maxTemp = Math.max(...airHigh.filter((v): v is number => v != null));
  const maxI = airHigh.findIndex((v) => v === maxTemp);
  const minTemp = Math.min(...airLow.filter((v): v is number => v != null));
  const minI = airLow.findIndex((v) => v === minTemp);

  return (
    <div className="not-prose">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Monthly climate chart">
        {/* Y-axis temperature labels */}
        {[15, 20, 25, 30].map((t) => (
          <g key={t}>
            <line x1={PAD_L} x2={W - PAD_R} y1={tY(t)} y2={tY(t)} stroke="#e5e7eb" strokeWidth="1" />
            <text x={PAD_L - 6} y={tY(t) + 4} textAnchor="end" className="text-[10px]" fill="#64748b">
              {t}°
            </text>
          </g>
        ))}

        {/* Rain bars */}
        {rainMm.map((v, i) => {
          if (v == null) return null;
          const bh = rH(v);
          return (
            <rect
              key={`rain-${i}`}
              x={xAt(i) - 12}
              y={PAD_T + plotH - bh}
              width={24}
              height={bh}
              fill="#bae6fd"
              opacity="0.7"
              rx="2"
            />
          );
        })}

        {/* Air temp high */}
        <path d={tempPath(airHigh)} fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
        {/* Air temp low */}
        <path d={tempPath(airLow)} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
        {/* Water temp */}
        <path d={tempPath(waterTemp)} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />

        {/* Data points on water temp line (subtle markers) */}
        {waterTemp.map((v, i) =>
          v != null ? (
            <circle key={`w-${i}`} cx={xAt(i)} cy={tY(v)} r="2.5" fill="#0ea5e9" />
          ) : null
        )}

        {/* X-axis month labels */}
        {MONTHS.map((m, i) => (
          <text
            key={m}
            x={xAt(i)}
            y={H - 12}
            textAnchor="middle"
            className="text-[11px] font-medium"
            fill="#475569"
          >
            {m}
          </text>
        ))}

        {/* Annotations: hottest + coolest month labels */}
        {maxI >= 0 && (
          <text x={xAt(maxI)} y={tY(maxTemp) - 8} textAnchor="middle" className="text-[10px]" fill="#dc2626" fontWeight="600">
            {Math.round(maxTemp)}°
          </text>
        )}
        {minI >= 0 && (
          <text x={xAt(minI)} y={tY(minTemp) - 8} textAnchor="middle" className="text-[10px]" fill="#f59e0b" fontWeight="600">
            {Math.round(minTemp)}°
          </text>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-volcanic-600">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-red-600" /> Air high
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-t-2 border-amber-500 border-dashed" /> Air low
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-ocean-500" /> Water
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 bg-ocean-200 rounded-sm" /> Rain (mm)
        </div>
      </div>
    </div>
  );
}
