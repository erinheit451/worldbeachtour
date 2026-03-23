import Link from "next/link";
import { getCountries } from "@/lib/regions";

export const metadata = { title: "Regions — World Beach Tour" };

export default function RegionsPage() {
  const countries = getCountries();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore by Region</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {countries.map(({ code, count }) => (
          <Link
            key={code}
            href={`/regions/${code.toLowerCase()}`}
            className="block rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <span className="font-semibold text-gray-900">{code}</span>
            <span className="text-sm text-gray-500 ml-2">
              {count} {count === 1 ? "beach" : "beaches"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
