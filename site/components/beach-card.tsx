import Link from "next/link";
import { thumbUrl } from "@/lib/image-url";

interface BeachCardProps {
  slug: string;
  name: string;
  location: string;
  waterBodyType: string;
  substrateType: string;
  hero?: { url: string; title?: string } | null;
  /** Architecture-doc numbering: 3=Monument, 2=Featured, 1=Standard, 0=Stub. */
  tier?: number;
}

// Substrate-driven gradient fallback when no hero photo exists. Quieter than
// the previous candy ocean→reef gradient — fits the editorial tone.
function fallbackGradient(substrate: string | undefined): string {
  switch ((substrate ?? "").toLowerCase()) {
    case "sand":
      return "bg-gradient-to-br from-sand-200 via-sand-300 to-volcanic-300";
    case "pebble":
    case "shingle":
    case "gravel":
      return "bg-gradient-to-br from-volcanic-300 via-volcanic-400 to-volcanic-600";
    case "rock":
    case "boulder":
      return "bg-gradient-to-br from-volcanic-500 via-volcanic-700 to-volcanic-900";
    case "mud":
    case "silt":
      return "bg-gradient-to-br from-sand-700 via-volcanic-600 to-volcanic-800";
    default:
      return "bg-gradient-to-br from-ocean-700 via-ocean-800 to-volcanic-800";
  }
}

export default function BeachCard({
  slug,
  name,
  location,
  waterBodyType,
  substrateType,
  hero,
  tier,
}: BeachCardProps) {
  const heroSrc = hero?.url ? thumbUrl(hero.url, 640) : null;
  const isMonument = tier === 3;
  const isFeatured = tier === 2;

  return (
    <Link
      href={`/beaches/${slug}`}
      className="group block overflow-hidden border border-volcanic-100 bg-white hover:shadow-xl hover:border-ocean-300 transition-all duration-300"
    >
      <div
        className={`relative h-44 overflow-hidden ${
          heroSrc ? "bg-volcanic-200" : fallbackGradient(substrateType)
        }`}
      >
        {heroSrc ? (
          <img
            src={heroSrc}
            alt={hero?.title || name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/90">
            {waterBodyType}
          </span>
          {isMonument ? (
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-sand-300/95">
              Monument
            </span>
          ) : isFeatured ? (
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/75">
              Featured
            </span>
          ) : null}
        </div>
      </div>
      <div className="px-5 py-4">
        <h3 className="font-display text-lg leading-tight text-volcanic-900 group-hover:text-ocean-700 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-volcanic-500 mt-1">{location}</p>
      </div>
    </Link>
  );
}
