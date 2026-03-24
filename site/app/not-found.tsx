import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <p className="text-6xl mb-4" role="img" aria-label="Beach umbrella">🏖</p>
      <h1 className="font-display text-4xl text-volcanic-900">Beach Not Found</h1>
      <p className="mt-4 text-volcanic-400 max-w-md mx-auto">
        We haven't mapped this one yet — but with 412,000+ beaches in our
        database, there's plenty to explore.
      </p>
      <Link
        href="/beaches"
        className="mt-8 inline-flex items-center gap-2 bg-ocean-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-ocean-700 transition-colors"
      >
        Browse Beaches
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
