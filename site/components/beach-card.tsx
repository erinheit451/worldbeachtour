import Link from "next/link";

interface BeachCardProps {
  slug: string;
  name: string;
  location: string;
  waterBodyType: string;
  substrateType: string;
}

export default function BeachCard({ slug, name, location, waterBodyType, substrateType }: BeachCardProps) {
  return (
    <Link
      href={`/beaches/${slug}`}
      className="block rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">{location}</p>
      <div className="flex gap-2 mt-2">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{waterBodyType}</span>
        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{substrateType}</span>
      </div>
    </Link>
  );
}
