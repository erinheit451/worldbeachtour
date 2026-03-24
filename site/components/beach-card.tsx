import Link from "next/link";

interface BeachCardProps {
  slug: string;
  name: string;
  location: string;
  waterBodyType: string;
  substrateType: string;
}

export default function BeachCard({
  slug,
  name,
  location,
  waterBodyType,
  substrateType,
}: BeachCardProps) {
  return (
    <Link
      href={`/beaches/${slug}`}
      className="group block rounded-xl border border-volcanic-100 bg-white overflow-hidden hover:shadow-lg hover:border-ocean-200 transition-all duration-200"
    >
      {/* Top accent gradient */}
      <div className="h-32 bg-gradient-to-br from-ocean-500 via-ocean-400 to-reef-400 relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_30%,white,transparent_60%)]" />
        <div className="absolute bottom-3 left-4">
          <span className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {waterBodyType}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-volcanic-900 group-hover:text-ocean-700 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-volcanic-400 mt-1">{location}</p>
        {substrateType && substrateType !== "unknown" && (
          <div className="mt-3">
            <span className="text-xs text-sand-700 bg-sand-50 px-2.5 py-1 rounded-full border border-sand-200">
              {substrateType}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
