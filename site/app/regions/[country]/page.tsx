import Link from "next/link";
import BeachCard from "@/components/beach-card";
import { getBeachesByCountry, getStatesByCountry, getCountries } from "@/lib/regions";

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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Beaches in {countryCode}</h1>

      {states.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">By State/Province</h2>
          <div className="flex flex-wrap gap-2">
            {states.map(({ state, count }) => (
              <Link
                key={state}
                href={`/regions/${country}/${encodeURIComponent(state.toLowerCase().replace(/\s+/g, "-"))}`}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
              >
                {state} ({count})
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
