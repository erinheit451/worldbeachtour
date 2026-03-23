import Link from "next/link";
import { getLens } from "@/lib/lenses";

interface LensSummaryCardProps {
  slug: string;
  lensId: string;
  summary: string;
}

export default function LensSummaryCard({ slug, lensId, summary }: LensSummaryCardProps) {
  const lens = getLens(lensId);
  if (!lens) return null;

  return (
    <Link
      href={`/beaches/${slug}/${lensId}`}
      className="block rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-gray-900 mb-2">{lens.label}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{summary}</p>
      <p className="text-sm text-blue-600 mt-2">Read more →</p>
    </Link>
  );
}
