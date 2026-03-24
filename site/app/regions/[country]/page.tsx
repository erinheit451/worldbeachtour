import Link from "next/link";
import BeachCard from "@/components/beach-card";
import Breadcrumbs from "@/components/breadcrumbs";
import {
  getBeachesByCountry,
  getStatesByCountry,
  getCountries,
} from "@/lib/regions";

export function generateStaticParams() {
  return getCountries().map(({ code }) => ({ country: code.toLowerCase() }));
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const countryCode = country.toUpperCase();
  const states = getStatesByCountry(countryCode);
  const beaches = getBeachesByCountry(countryCode);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Breadcrumbs
        items={[
          { label: "Regions", href: "/regions" },
          { label: countryCode },
        ]}
      />
      <div className="mb-10">
        <h1 className="font-display text-4xl text-volcanic-900">
          Beaches in {countryCode}
        </h1>
        <p className="text-volcanic-400 mt-2">
          {beaches.length} {beaches.length === 1 ? "beach" : "beaches"}
          {states.length > 0 &&
            ` across ${states.length} ${states.length === 1 ? "region" : "regions"}`}
        </p>
      </div>

      {states.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-xl text-volcanic-800 mb-4">
            By Region
          </h2>
          <div className="flex flex-wrap gap-2">
            {states.map(({ state, count }) => (
              <Link
                key={state}
                href={`/regions/${country}/${encodeURIComponent(state.toLowerCase().replace(/\s+/g, "-"))}`}
                className="text-sm bg-ocean-50 text-ocean-700 hover:bg-ocean-100 px-3.5 py-1.5 rounded-full transition-colors border border-ocean-100"
              >
                {state} ({count})
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {beaches.slice(0, 30).map((beach) => (
          <BeachCard
            key={beach.slug}
            slug={beach.slug}
            name={beach.name}
            location={beach.admin_level_1 || ""}
            waterBodyType={beach.water_body_type}
            substrateType={beach.substrate_type}
          />
        ))}
      </div>
    </div>
  );
}
