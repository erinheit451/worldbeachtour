import BeachCard from "@/components/beach-card";
import {
  getBeachesByState,
  getCountries,
  getStatesByCountry,
} from "@/lib/regions";

export function generateStaticParams() {
  const params: { country: string; state: string }[] = [];
  for (const { code } of getCountries()) {
    for (const { state } of getStatesByCountry(code)) {
      params.push({
        country: code.toLowerCase(),
        state: state.toLowerCase().replace(/\s+/g, "-"),
      });
    }
  }
  return params;
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ country: string; state: string }>;
}) {
  const { country, state: stateParam } = await params;
  const countryCode = country.toUpperCase();
  const stateName = decodeURIComponent(stateParam).replace(/-/g, " ");

  // Find the actual state name (case-insensitive match)
  const states = getStatesByCountry(countryCode);
  const match = states.find(
    (s) => s.state.toLowerCase() === stateName.toLowerCase()
  );
  const actualState = match?.state || stateName;

  const beaches = getBeachesByState(countryCode, actualState);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Beaches in {actualState}, {countryCode}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {beaches.map((beach) => (
          <BeachCard
            key={beach.slug}
            slug={beach.slug}
            name={beach.name}
            location={beach.admin_level_2 || ""}
            waterBodyType={beach.water_body_type}
            substrateType={beach.substrate_type}
          />
        ))}
      </div>
    </div>
  );
}
