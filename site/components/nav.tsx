import Link from "next/link";

export default function Nav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-900">
            World Beach Tour
          </Link>
          <div className="flex gap-6">
            <Link href="/beaches" className="text-gray-600 hover:text-blue-900">
              Beaches
            </Link>
            <Link href="/regions" className="text-gray-600 hover:text-blue-900">
              Regions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
