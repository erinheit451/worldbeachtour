import { notFound } from "next/navigation";
import LensSummaryCard from "@/components/lens-summary-card";
import MapEmbed from "@/components/map-embed";
import DataCard from "@/components/data-card";
import Breadcrumbs from "@/components/breadcrumbs";
import { getBeachData, getBeachMeta, getBeachMdx } from "@/lib/beaches";

function FacilityBadge({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
        value
          ? "bg-teal-50 text-teal-700 border border-teal-200"
          : "bg-volcanic-50 text-volcanic-400 border border-volcanic-100 line-through"
      }`}
    >
      {value ? "✓" : "✗"} {label}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-lg text-volcanic-900 mb-3 mt-6">
      {children}
    </h3>
  );
}

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

  const hasSafety =
    data.safety &&
    (data.safety.water_quality_rating !== undefined ||
      data.safety.lifeguard !== undefined ||
      data.safety.shark_incidents_total !== undefined);

  const hasFacilities =
    data.facilities &&
    Object.values(data.facilities).some((v) => v !== undefined);

  const hasGettingThere = data.nearest_city || data.nearest_airport;

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

      {/* Enriched data sections */}
      {(hasGettingThere || hasSafety || hasFacilities) && (
        <div className="mb-8 rounded-xl border border-volcanic-100 bg-white px-6 py-5">
          {/* Getting There */}
          {hasGettingThere && (
            <div>
              <SectionHeading>Getting There</SectionHeading>
              <div className="flex flex-wrap gap-3">
                {data.nearest_city && (
                  <DataCard
                    label="Nearest City"
                    value={data.nearest_city}
                    unit={
                      data.nearest_city_distance_km != null
                        ? `${data.nearest_city_distance_km.toFixed(1)} km`
                        : undefined
                    }
                  />
                )}
                {data.nearest_airport && (
                  <DataCard
                    label={`Airport (${data.nearest_airport.iata})`}
                    value={data.nearest_airport.name}
                    unit={`${data.nearest_airport.distance_km.toFixed(1)} km`}
                  />
                )}
              </div>
            </div>
          )}

          {/* Safety & Conditions */}
          {hasSafety && (
            <div>
              <SectionHeading>Safety &amp; Conditions</SectionHeading>
              <div className="flex flex-wrap gap-3">
                {data.safety?.water_quality_rating && (
                  <DataCard
                    label="Water Quality"
                    value={data.safety.water_quality_rating}
                  />
                )}
                {data.safety?.lifeguard !== undefined && (
                  <DataCard
                    label="Lifeguard"
                    value={data.safety.lifeguard ? "Yes" : "No"}
                  />
                )}
                {data.safety?.shark_incidents_total !== undefined && (
                  <DataCard
                    label="Shark Incidents"
                    value={String(data.safety.shark_incidents_total)}
                    unit="recorded"
                  />
                )}
              </div>
            </div>
          )}

          {/* Facilities */}
          {hasFacilities && (
            <div>
              <SectionHeading>Facilities</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {data.facilities?.parking !== undefined && (
                  <FacilityBadge label="Parking" value={data.facilities.parking} />
                )}
                {data.facilities?.restrooms !== undefined && (
                  <FacilityBadge label="Restrooms" value={data.facilities.restrooms} />
                )}
                {data.facilities?.showers !== undefined && (
                  <FacilityBadge label="Showers" value={data.facilities.showers} />
                )}
                {data.facilities?.wheelchair_accessible !== undefined && (
                  <FacilityBadge
                    label="Wheelchair Accessible"
                    value={data.facilities.wheelchair_accessible}
                  />
                )}
                {data.facilities?.dogs_allowed !== undefined && (
                  <FacilityBadge label="Dogs Allowed" value={data.facilities.dogs_allowed} />
                )}
              </div>
            </div>
          )}
        </div>
      )}

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
