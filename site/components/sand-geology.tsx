import Link from "next/link";
import type { SandData } from "@/lib/beaches";

const COLOR_SWATCHES: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f4f3ef",
  pink: "#f7c6cf",
  golden: "#d9a04a",
  red: "#a94332",
  green: "#6b8e5a",
  orange: "#d97a3c",
  grey: "#7e7e78",
  tan: "#c7a373",
  brown: "#6b4a32",
  yellow: "#e8c96b",
  coral: "#e88a7a",
  rainbow: "linear-gradient(90deg,#d94a4a,#d97a3c,#e8c96b,#6b8e5a,#4a7bd9,#9a4ad9)",
};

function Swatch({ color }: { color: string }) {
  const swatch = COLOR_SWATCHES[color] ?? "#bdb8ac";
  const isGradient = swatch.startsWith("linear");
  return (
    <span
      className="inline-block h-4 w-4 rounded-full border border-volcanic-200 align-middle"
      style={isGradient ? { backgroundImage: swatch } : { backgroundColor: swatch }}
      aria-hidden="true"
    />
  );
}

function QFLBar({ q, f, l }: { q: number | null; f: number | null; l: number | null }) {
  if (q == null || f == null || l == null) return null;
  const total = q + f + l || 1;
  const qW = (q / total) * 100;
  const fW = (f / total) * 100;
  const lW = (l / total) * 100;
  return (
    <div className="mt-3">
      <div className="flex h-6 w-full overflow-hidden rounded-md border border-volcanic-200">
        <div
          className="flex items-center justify-center text-[10px] font-medium text-white"
          style={{ width: `${qW}%`, backgroundColor: "#e5c574" }}
          title={`Quartz ${q.toFixed(1)}%`}
        >
          {qW > 12 ? `Q ${q.toFixed(0)}%` : ""}
        </div>
        <div
          className="flex items-center justify-center text-[10px] font-medium text-white"
          style={{ width: `${fW}%`, backgroundColor: "#c28a7a" }}
          title={`Feldspar ${f.toFixed(1)}%`}
        >
          {fW > 12 ? `F ${f.toFixed(0)}%` : ""}
        </div>
        <div
          className="flex items-center justify-center text-[10px] font-medium text-white"
          style={{ width: `${lW}%`, backgroundColor: "#5e4a42" }}
          title={`Lithic ${l.toFixed(1)}%`}
        >
          {lW > 12 ? `L ${l.toFixed(0)}%` : ""}
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-volcanic-400">
        <span>Quartz</span>
        <span>Feldspar</span>
        <span>Lithic</span>
      </div>
    </div>
  );
}

export default function SandGeology({ sand, slug }: { sand: SandData; slug: string }) {
  const predicted = sand.predicted;
  const hasMeasured = (sand.measured_samples?.length ?? 0) > 0;
  return (
    <section className="not-prose mt-8 rounded-lg border border-volcanic-100 bg-white/60 p-6">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="font-display text-xl text-volcanic-900">Sand &amp; Geology</h2>
        {sand.color && (
          <span className="inline-flex items-center gap-2 rounded-full border border-volcanic-200 px-3 py-0.5 text-xs font-medium text-volcanic-700">
            <Swatch color={sand.color} />
            {sand.color}
          </span>
        )}
      </div>

      {sand.curated?.story && (
        <p className="text-sm leading-relaxed text-volcanic-800">{sand.curated.story}</p>
      )}

      {!sand.curated?.story && sand.description && (
        <p className="text-sm leading-relaxed text-volcanic-800">{sand.description}</p>
      )}

      {predicted && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-volcanic-500">
            <span>Predicted regional composition</span>
            <span className="italic">{predicted.regime}</span>
          </div>
          <QFLBar q={predicted.q_pct} f={predicted.f_pct} l={predicted.l_pct} />
          <p className="mt-2 text-[11px] leading-snug text-volcanic-400">
            Modelled from {predicted.source}. Calibrated on river sand, not measured beach
            samples — treat as a regional signal, not a sand assay.
          </p>
        </div>
      )}

      {hasMeasured && (
        <p className="mt-4 inline-flex items-center gap-1 rounded bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
          ✓ Measured sediment samples within 5 km
        </p>
      )}

      <div className="mt-5 text-xs">
        <Link
          href={`/sand/${slug}`}
          className="font-medium text-ocean-600 hover:text-ocean-700"
        >
          See the full sand &amp; geology page →
        </Link>
      </div>
    </section>
  );
}
