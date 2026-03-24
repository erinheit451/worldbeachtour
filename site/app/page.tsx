import Link from "next/link";
import BeachCard from "@/components/beach-card";
import LensIcon from "@/components/lens-icon";
import { getAllBeaches } from "@/lib/beaches";

export default function HomePage() {
  const beaches = getAllBeaches();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ocean-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-950 via-ocean-900 to-reef-900" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,theme(colors.ocean.400),transparent_60%)]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_left,theme(colors.reef.400),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 text-center">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white">
            World Beach Tour
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ocean-200 max-w-2xl mx-auto leading-relaxed">
            The definitive guide to every beach on Earth. Explore through the
            lens that matters to you — travel, surf, environment, history,
            geology, and more.
          </p>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-12 text-center">
            <div>
              <p className="font-display text-3xl sm:text-4xl text-white">228K+</p>
              <p className="text-sm text-ocean-300 mt-1">Beaches Mapped</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl text-white">{beaches.length}</p>
              <p className="text-sm text-ocean-300 mt-1">In-Depth Guides</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl text-white">8</p>
              <p className="text-sm text-ocean-300 mt-1">Lenses</p>
            </div>
          </div>

          <Link
            href="/beaches"
            className="mt-10 inline-flex items-center gap-2 bg-white text-ocean-950 font-semibold px-8 py-3.5 rounded-full hover:bg-ocean-50 transition-colors shadow-lg shadow-ocean-950/30"
          >
            Explore Beaches
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Featured beaches */}
      {beaches.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl text-volcanic-900">
                Featured Beaches
              </h2>
              <p className="text-volcanic-400 mt-2">
                Hand-picked destinations with in-depth guides
              </p>
            </div>
            <Link
              href="/beaches"
              className="text-sm font-medium text-ocean-600 hover:text-ocean-700 transition-colors hidden sm:block"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beaches
              .sort((a, b) => (b.notability_score ?? 0) - (a.notability_score ?? 0))
              .slice(0, 6)
              .map((beach) => (
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

      {/* Lenses section */}
      <section className="bg-volcanic-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-3xl text-volcanic-900 text-center mb-4">
            One Beach, Many Lenses
          </h2>
          <p className="text-volcanic-400 text-center max-w-2xl mx-auto mb-12">
            Every beach has layers of information. We organize it by what matters
            to you — whether you're planning a trip, chasing a wave, or studying
            coastal geology.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "plane", label: "Travel", desc: "Getting there, where to stay, when to go" },
              { icon: "waves", label: "Surf", desc: "Wave conditions, breaks, skill levels" },
              { icon: "leaf", label: "Environment", desc: "Water quality, ecosystems, conservation" },
              { icon: "camera", label: "Photography", desc: "Compositions, golden hour, gear tips" },
              { icon: "users", label: "Family", desc: "Safety, facilities, kid-friendly activities" },
              { icon: "anchor", label: "Diving", desc: "Marine life, visibility, dive sites" },
              { icon: "scroll", label: "History", desc: "Indigenous roots, mythology, modern story" },
              { icon: "mountain", label: "Sand & Geology", desc: "Composition, formation, coastal science" },
            ].map((lens) => (
              <div
                key={lens.label}
                className="rounded-xl bg-white border border-volcanic-100 p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-ocean-200"
              >
                <LensIcon name={lens.icon} className="w-6 h-6 text-ocean-600" />
                <h3 className="font-display text-lg text-volcanic-800 mt-3">
                  {lens.label}
                </h3>
                <p className="text-sm text-volcanic-400 mt-1">{lens.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
