import BeachCard from "@/components/beach-card";
import Breadcrumbs from "@/components/breadcrumbs";
import { getAllBeaches } from "@/lib/beaches";

export const metadata = {
  title: "Browse Beaches — World Beach Tour",
  description: "Explore our collection of beaches from around the world, with in-depth guides for travel, surf, environment, and more.",
};

export default function BeachesPage() {
  const beaches = getAllBeaches();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Breadcrumbs items={[{ label: "Beaches" }]} />
      <div className="mb-10">
        <h1 className="font-display text-4xl text-volcanic-900">
          Browse Beaches
        </h1>
        <p className="text-volcanic-400 mt-2">
          {beaches.length} beaches with in-depth guides. More coming soon.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {beaches.map((beach) => (
          <BeachCard
            key={beach.slug}
            slug={beach.slug}
            name={beach.name}
            location={[beach.admin_level_1, beach.country_code]
              .filter(Boolean)
              .join(", ")}
            waterBodyType={beach.water_body_type}
            substrateType={beach.substrate_type}
          />
        ))}
      </div>
    </div>
  );
}
