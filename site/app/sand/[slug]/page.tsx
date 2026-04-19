import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import MapEmbed from "@/components/map-embed";
import { getAllBeachSlugs, getBeachData } from "@/lib/beaches";
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

export async function generateStaticParams() {
  return getAllBeachSlugs()
    .filter((slug) => {
      const data = getBeachData(slug);
      return Boolean(data?.sand);
    })
    .map((slug) => ({ slug }));
}

export default async function SandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getBeachData(slug);
  if (!data || !data.sand) return notFound();

  const sand: SandData = data.sand;
  const predicted = sand.predicted;
  const curated = sand.curated;
  const samples = sand.measured_samples ?? [];
  const swatchStyle = sand.color
    ? COLOR_SWATCHES[sand.color]?.startsWith("linear")
      ? { backgroundImage: COLOR_SWATCHES[sand.color] }
      : { backgroundColor: COLOR_SWATCHES[sand.color] ?? "#bdb8ac" }
    : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Beaches", href: "/" },
          { label: data.name, href: `/beaches/${slug}` },
          { label: "Sand & geology", href: `/sand/${slug}` },
        ]}
      />

      <header className="mb-8 mt-4">
        <p className="text-sm font-medium uppercase tracking-wider text-ocean-600">
          Sand &amp; geology
        </p>
        <h1 className="mt-1 font-display text-4xl text-volcanic-900">
          {data.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-volcanic-500">
          {sand.color && (
            <span className="inline-flex items-center gap-2 rounded-full border border-volcanic-200 px-3 py-0.5 text-xs font-medium text-volcanic-700">
              <span
                className="inline-block h-3 w-3 rounded-full border border-volcanic-300"
                style={swatchStyle}
                aria-hidden="true"
              />
              {sand.color} sand
            </span>
          )}
          {predicted?.regime && predicted.regime !== "unknown" && (
            <span className="italic">{predicted.regime}</span>
          )}
        </div>
      </header>

      {curated?.story && (
        <section className="mb-10 rounded-lg border border-ocean-100 bg-ocean-50/40 p-6">
          <h2 className="mb-3 font-display text-lg text-volcanic-900">
            What&apos;s in the sand
          </h2>
          <p className="text-base leading-relaxed text-volcanic-800">
            {curated.story}
          </p>
          {curated.citations.length > 0 && (
            <p className="mt-3 text-xs text-volcanic-500">
              References:{" "}
              {curated.citations.map((c, i) => (
                <span key={c}>
                  <a
                    href={c}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ocean-600 hover:underline"
                  >
                    source {i + 1}
                  </a>
                  {i < curated.citations.length - 1 && " · "}
                </span>
              ))}
            </p>
          )}
        </section>
      )}

      {!curated?.story && sand.description && (
        <section className="mb-10">
          <p className="text-base leading-relaxed text-volcanic-800">
            {sand.description}
          </p>
          {data.wikipedia_url && (
            <p className="mt-2 text-xs text-volcanic-500">
              Extracted from{" "}
              <a
                href={data.wikipedia_url}
                className="text-ocean-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wikipedia
              </a>
              .
            </p>
          )}
        </section>
      )}

      {predicted && (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-lg text-volcanic-900">
            Predicted regional composition
          </h2>
          <p className="mb-4 text-sm text-volcanic-600">
            Q-F-L (quartz, feldspar, lithic) fractions sampled from the GloPrSM
            global sand model at this beach&apos;s location.
          </p>
          <div className="mb-2 flex h-8 w-full overflow-hidden rounded-md border border-volcanic-200">
            {[
              { pct: predicted.q_pct, label: "Q", color: "#e5c574" },
              { pct: predicted.f_pct, label: "F", color: "#c28a7a" },
              { pct: predicted.l_pct, label: "L", color: "#5e4a42" },
            ].map(({ pct, label, color }) => {
              const total =
                (predicted.q_pct ?? 0) +
                (predicted.f_pct ?? 0) +
                (predicted.l_pct ?? 0) || 1;
              const w = ((pct ?? 0) / total) * 100;
              return (
                <div
                  key={label}
                  className="flex items-center justify-center text-xs font-medium text-white"
                  style={{ width: `${w}%`, backgroundColor: color }}
                  title={`${label} ${pct?.toFixed(1) ?? "?"}%`}
                >
                  {w > 10 ? `${label} ${pct?.toFixed(0) ?? "?"}%` : ""}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-volcanic-400">
            {predicted.source}. GloPrSM is calibrated on modern river sand;
            beach sand in the same watershed is a reasonable proxy but not
            identical.
          </p>
        </section>
      )}

      {samples.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-lg text-volcanic-900">
            Measured sediment samples nearby
          </h2>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-volcanic-400">
              <tr>
                <th className="pb-2">Source</th>
                <th className="pb-2">Distance</th>
                <th className="pb-2">Grain size</th>
                <th className="pb-2">Folk class</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {samples.map((s, i) => (
                <tr key={i} className="border-t border-volcanic-100">
                  <td className="py-2">{s.source}</td>
                  <td className="py-2">
                    {s.distance_m != null ? `${(s.distance_m / 1000).toFixed(1)} km` : "-"}
                  </td>
                  <td className="py-2">
                    {s.grain_size_mean_mm != null
                      ? `${s.grain_size_mean_mm} mm`
                      : "-"}
                  </td>
                  <td className="py-2">{s.folk_class ?? "-"}</td>
                  <td className="py-2">
                    {s.citation_url && (
                      <a
                        href={s.citation_url}
                        className="text-ocean-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        source
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="mb-10 rounded-md border border-dashed border-volcanic-200 bg-volcanic-50/30 p-5 text-sm text-volcanic-600">
        <p className="font-medium text-volcanic-800">Got a close-up photo of the sand here?</p>
        <p className="mt-1">
          Take a picture with a coin for scale and send it over. We&apos;re
          building a global grain-photo library and this beach isn&apos;t in it yet.
        </p>
      </section>

      <MapEmbed
        lat={data.centroid_lat}
        lng={data.centroid_lng}
        name={data.name}
      />

      <p className="mt-8 text-sm">
        <Link href={`/beaches/${slug}`} className="text-ocean-600 hover:underline">
          ← Back to {data.name}
        </Link>
      </p>
    </div>
  );
}
