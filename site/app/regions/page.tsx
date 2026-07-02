import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";
import { getCountries } from "@/lib/regions";
import { countryName, countryFlag } from "@/lib/countries";

export const metadata = {
  title: "Beaches by Region — World Beach Tour",
  description:
    "Browse beaches by country. The full database covers 249 coastal countries; in-depth guides land first in the ones we've covered most.",
  alternates: { canonical: "/regions" },
};

export default function RegionsPage() {
  const countries = getCountries();
  const totalGuides = countries.reduce((s, c) => s + c.count, 0);
  const totalMonuments = countries.reduce((s, c) => s + c.monumentCount, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Regions" }]} />
      <div className="mb-12 max-w-3xl">
        <h1 className="font-display text-4xl sm:text-5xl text-volcanic-900 -tracking-[0.01em]">
          Beaches by country
        </h1>
        <p className="text-volcanic-500 mt-3 text-lg leading-relaxed">
          {totalGuides.toLocaleString()} in-depth guides across {countries.length}{" "}
          countries. {totalMonuments} monument pages so far. The full database
          covers 249 coastal countries — we&rsquo;re writing them in order of
          how much there is to say.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map(({ code, count, monumentCount }) => (
          <Link
            key={code}
            href={`/regions/${code.toLowerCase()}`}
            className="group flex items-center gap-4 border border-volcanic-100 bg-white px-5 py-4 hover:border-ocean-300 hover:shadow-md transition-all duration-200"
          >
            <span
              className="text-3xl leading-none"
              aria-hidden
            >
              {countryFlag(code) || code}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg leading-tight text-volcanic-900 group-hover:text-ocean-700 transition-colors truncate">
                {countryName(code)}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-volcanic-400 mt-1">
                {count} {count === 1 ? "guide" : "guides"}
                {monumentCount > 0 && (
                  <>
                    {" · "}
                    <span className="text-sand-700">
                      {monumentCount} monument{monumentCount === 1 ? "" : "s"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
