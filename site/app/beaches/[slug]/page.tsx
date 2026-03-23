import { notFound } from "next/navigation";
import LensSummaryCard from "@/components/lens-summary-card";
import MapEmbed from "@/components/map-embed";
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

  const summaries: Record<string, string> = {};
  for (const lensId of meta.lenses) {
    const mdx = getBeachMdx(slug, lensId);
    if (mdx) {
      const firstParagraph = mdx
        .split("\n")
        .filter((line) => line.trim() && !line.startsWith("#") && !line.startsWith("import") && !line.startsWith("<"))
        .slice(0, 1)
        .join(" ")
        .slice(0, 200);
      summaries[lensId] = firstParagraph + (firstParagraph.length >= 200 ? "..." : "");
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Explore {data.name}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {meta.lenses.map((lensId) => (
          <LensSummaryCard
            key={lensId}
            slug={slug}
            lensId={lensId}
            summary={summaries[lensId] || "Explore this lens."}
          />
        ))}
      </div>
      <MapEmbed lat={data.centroid_lat} lng={data.centroid_lng} name={data.name} />
    </div>
  );
}
