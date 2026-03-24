import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ocean-950 text-ocean-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-lg text-white mb-3">World Beach Tour</h3>
            <p className="text-sm text-ocean-300 leading-relaxed">
              The definitive guide to every beach on Earth. 412,000+ beaches
              across 249 countries, explored through the lens that matters to you.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/beaches" className="hover:text-white transition-colors">
                  Browse Beaches
                </Link>
              </li>
              <li>
                <Link href="/regions" className="hover:text-white transition-colors">
                  By Region
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Data Sources
            </h4>
            <ul className="space-y-2 text-sm text-ocean-300">
              <li>OpenStreetMap</li>
              <li>Overture Maps</li>
              <li>EU Bathing Water Directive</li>
              <li>Wikidata &amp; GeoNames</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-ocean-800 text-center text-xs text-ocean-400">
          Beach data sourced from open datasets under ODbL and CC licenses.
        </div>
      </div>
    </footer>
  );
}
