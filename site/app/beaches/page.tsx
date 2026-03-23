import BeachCard from "@/components/beach-card";
import { getAllBeaches } from "@/lib/beaches";

export const metadata = { title: "Browse Beaches — World Beach Tour" };

export default function BeachesPage() {
  const beaches = getAllBeaches();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Beaches</h1>
      <p className="text-gray-600 mb-8">{beaches.length} beaches and counting.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {beaches.map((beach) => (
          <BeachCard
            key={beach.slug}
            slug={beach.slug}
            name={beach.name}
            location={[beach.admin_level_1, beach.country_code].filter(Boolean).join(", ")}
            waterBodyType={beach.water_body_type}
            substrateType={beach.substrate_type}
          />
        ))}
      </div>
    </div>
  );
}
