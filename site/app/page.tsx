import Link from "next/link";
import BeachCard from "@/components/beach-card";
import { getAllBeaches } from "@/lib/beaches";

export default function HomePage() {
  const beaches = getAllBeaches();

  return (
    <div>
      <section className="bg-blue-950 text-white py-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold">World Beach Tour</h1>
        <p className="mt-4 text-lg text-blue-200 max-w-2xl mx-auto">
          The definitive guide to every beach on Earth. Explore through the lens
          that matters to you — travel, surf, environment, history, sand, and more.
        </p>
        <Link
          href="/beaches"
          className="mt-8 inline-block bg-white text-blue-950 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Explore Beaches
        </Link>
      </section>

      {beaches.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Featured Beaches</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>
      )}
    </div>
  );
}
