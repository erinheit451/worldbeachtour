import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";
import { getCountries } from "@/lib/regions";

export const metadata = {
  title: "Beaches by Region — World Beach Tour",
  description:
    "Browse beaches by country and region. Find beaches across 249 countries worldwide.",
};

export default function RegionsPage() {
  const countries = getCountries();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Breadcrumbs items={[{ label: "Regions" }]} />
      <div className="mb-10">
        <h1 className="font-display text-4xl text-volcanic-900">
          Explore by Region
        </h1>
        <p className="text-volcanic-400 mt-2">
          {countries.length} countries with beach guides
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {countries.map(({ code, count }) => (
          <Link
            key={code}
            href={`/regions/${code.toLowerCase()}`}
            className="group flex items-center justify-between rounded-xl border border-volcanic-100 p-4 hover:shadow-lg hover:border-ocean-200 transition-all duration-200"
          >
            <span className="font-display text-lg text-volcanic-900 group-hover:text-ocean-700 transition-colors">
              {code}
            </span>
            <span className="text-sm text-volcanic-400">
              {count} {count === 1 ? "beach" : "beaches"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
