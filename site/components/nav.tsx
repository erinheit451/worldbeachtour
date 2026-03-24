import Link from "next/link";

export default function Nav() {
  return (
    <nav className="border-b border-volcanic-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="font-display text-xl text-ocean-950">
              World Beach Tour
            </span>
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/beaches"
              className="text-sm font-medium text-volcanic-500 hover:text-ocean-700 transition-colors"
            >
              Beaches
            </Link>
            <Link
              href="/regions"
              className="text-sm font-medium text-volcanic-500 hover:text-ocean-700 transition-colors"
            >
              Regions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
