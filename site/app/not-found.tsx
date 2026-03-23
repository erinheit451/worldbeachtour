import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900">Beach Not Found</h1>
      <p className="mt-4 text-gray-600">
        We haven't mapped this one yet. Try browsing our collection.
      </p>
      <Link
        href="/beaches"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Browse Beaches
      </Link>
    </div>
  );
}
