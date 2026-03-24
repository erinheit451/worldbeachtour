import { notFound } from "next/navigation";
import LensSummaryCard from "@/components/lens-summary-card";
import MapEmbed from "@/components/map-embed";
import DataCard from "@/components/data-card";
import Breadcrumbs from "@/components/breadcrumbs";
import { getBeachData, getBeachMeta, getBeachMdx } from "@/lib/beaches";

export default async function BeachOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getBeachData(slug);
  const meta = getBeachMeta(slug);
  if (!data) notFound();

  // Extract first meaningful paragraph from each lens MDX
  const summaries: Record<string, string> = {};
  for (const lensId of meta.lenses) {
    const mdx = getBeachMdx(slug, lensId);
    if (mdx) {
      const lines = mdx.split("\n");
      const paragraph = lines.find(
        (line) =>
          line.trim().length > 40 &&
          !line.startsWith("#") &&
          !line.startsWith("import") &&
          !line.startsWith("<") &&
          !line.startsWith("---") &&
          !line.startsWith("*")
      );
      if (paragraph) {
        const trimmed = paragraph.trim();
        summaries[lensId] =
          trimmed.length > 180 ? trimmed.slice(0, 180) + "..." : trimmed;
      }
    }
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Beaches", href: "/beaches" },
          { label: data.name },
        ]}
      />

      {/* Quick facts */}
      <div className="flex flex-wrap gap-3 mb-8">
        {data.water_body_type && (
          <DataCard label="Water Body" value={data.water_body_type} />
        )}
        {data.substrate_type && data.substrate_type !== "unknown" && (
          <DataCard label="Sand Type" value={data.substrate_type} />
        )}
        {data.country_code && (
          <DataCard label="Country" value={data.country_code} />
        )}
        {data.admin_level_1 && (
          <DataCard label="Region" value={data.admin_level_1} />
        )}
      </div>

      {/* Lens cards */}
      <h2 className="font-display text-2xl text-volcanic-900 mb-6">
        Explore {data.name}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {meta.lenses.map((lensId) => (
          <LensSummaryCard
            key={lensId}
            slug={slug}
            lensId={lensId}
            summary={summaries[lensId] || "Explore this lens."}
          />
        ))}
      </div>

      {/* Map */}
      <MapEmbed
        lat={data.centroid_lat}
        lng={data.centroid_lng}
        name={data.name}
      />
    </div>
  );
}
