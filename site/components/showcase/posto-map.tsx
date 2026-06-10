interface Zone {
  zone_code: string;
  name: string;
  position_along_beach_pct: number;
  character: string;
  best_for: string | null;
  notes: string | null;
}

/**
 * Copacabana's 6 postos: SVG map (visual anchor) + 6 posto cards stacked below.
 * Static — no client-side state. Each marker links to its card via anchor.
 */
export default function PostoMap({ zones }: { zones: Zone[] }) {
  const W = 840;
  const H = 220;
  const arcPath = `M 40 160 Q 420 60 800 160`;
  const pointAt = (t: number) => {
    const p0 = [40, 160];
    const p1 = [420, 60];
    const p2 = [800, 160];
    const x = (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0];
    const y = (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1];
    return [x, y];
  };

  return (
    <div className="not-prose">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Copacabana postos map">
        <defs>
          <linearGradient id="ocean-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="sand-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
        </defs>

        <path d={`${arcPath} L 800 0 L 40 0 Z`} fill="url(#ocean-gradient)" />
        <path d={`${arcPath} L 800 ${H} L 40 ${H} Z`} fill="url(#sand-gradient)" />
        <path d={arcPath} fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />

        <text x={40} y={200} textAnchor="middle" className="text-[11px]" fill="#475569" fontWeight="500">Leme</text>
        <text x={40} y={215} textAnchor="middle" className="text-[10px]" fill="#94a3b8">(north)</text>
        <text x={800} y={200} textAnchor="middle" className="text-[11px]" fill="#475569" fontWeight="500">Fort</text>
        <text x={800} y={215} textAnchor="middle" className="text-[10px]" fill="#94a3b8">(south)</text>

        {zones.map((z) => {
          const [x, y] = pointAt(z.position_along_beach_pct);
          const num = z.zone_code.replace("posto-", "");
          return (
            <a key={z.zone_code} href={`#${z.zone_code}`}>
              <circle cx={x} cy={y} r={10} fill="#0ea5e9" stroke="#ffffff" strokeWidth="2" />
              <text x={x} y={y + 4} textAnchor="middle" className="text-[11px] font-semibold pointer-events-none" fill="#ffffff">
                {num}
              </text>
            </a>
          );
        })}
      </svg>

      {/* All 6 postos as stacked cards */}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {zones.map((z) => (
          <article
            key={z.zone_code}
            id={z.zone_code}
            className="rounded-xl border border-volcanic-100 bg-white p-6 scroll-mt-24"
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ocean-500 text-white font-display text-lg">
                {z.zone_code.replace("posto-", "")}
              </span>
              <h4 className="font-display text-xl text-volcanic-900">{z.name}</h4>
            </div>
            <p className="text-volcanic-700 leading-relaxed text-[15px]">{z.character}</p>
            {z.best_for && (
              <p className="mt-3 text-xs text-volcanic-500">
                <span className="font-semibold text-volcanic-700 uppercase tracking-wider">Best for:</span> {z.best_for}
              </p>
            )}
            {z.notes && <p className="mt-2 text-xs italic text-volcanic-500">{z.notes}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
