import BeachCard from "@/components/beach-card";
import Breadcrumbs from "@/components/breadcrumbs";
import { getAllBeaches } from "@/lib/beaches";
import { computeTier, tierRank, type Tier } from "@/lib/tier";

export const metadata = {
  title: "Browse Beaches — World Beach Tour",
  description: "Explore our collection of beaches from around the world, with in-depth guides for travel, surf, environment, and more.",
  alternates: { canonical: "/beaches" },
};

export default function BeachesPage() {
  const beaches = getAllBeaches();
  const decorated = beaches.map((b) => ({
    ...b,
    tier: computeTier(b.slug, b, b.meta) as Tier,
  }));

  // Monuments first, then featured, then standard. Within a tier, alphabetical.
  const sorted = [...decorated].sort((a, b) => {
    const r = tierRank(a.tier) - tierRank(b.tier);
    if (r !== 0) return r;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Beaches" }]} />
      <div className="mb-10 max-w-3xl">
        <h1 className="font-display text-4xl sm:text-5xl text-volcanic-900 -tracking-[0.01em]">
          Every beach we&rsquo;ve written
        </h1>
        <p className="text-volcanic-500 mt-3 text-lg leading-relaxed">
          {beaches.length} in-depth guides, with the full 228,612-beach database
          one click away. Monuments first.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((beach) => (
          <BeachCard
            key={beach.slug}
            slug={beach.slug}
            name={beach.name}
            location={[beach.admin_level_1, beach.country_code]
              .filter(Boolean)
              .join(", ")}
            waterBodyType={beach.water_body_type}
            substrateType={beach.substrate_type}
            hero={beach.meta.images?.hero ?? null}
            tier={beach.tier}
          />
        ))}
      </div>
    </div>
  );
}
