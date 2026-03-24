import Link from "next/link";
import { getLens } from "@/lib/lenses";
import LensIcon from "@/components/lens-icon";

const LENS_STYLES: Record<string, { bg: string; accent: string }> = {
  travel: { bg: "bg-ocean-50", accent: "text-ocean-600" },
  surf: { bg: "bg-indigo-50", accent: "text-indigo-600" },
  environment: { bg: "bg-reef-50", accent: "text-reef-700" },
  family: { bg: "bg-amber-50", accent: "text-amber-600" },
  photography: { bg: "bg-violet-50", accent: "text-violet-600" },
  diving: { bg: "bg-cyan-50", accent: "text-cyan-600" },
  history: { bg: "bg-amber-50/70", accent: "text-amber-700" },
  sand: { bg: "bg-sand-50", accent: "text-sand-700" },
};

interface LensSummaryCardProps {
  slug: string;
  lensId: string;
  summary: string;
}

export default function LensSummaryCard({
  slug,
  lensId,
  summary,
}: LensSummaryCardProps) {
  const lens = getLens(lensId);
  if (!lens) return null;

  const style = LENS_STYLES[lensId] || { bg: "bg-volcanic-50", accent: "text-volcanic-600" };

  return (
    <Link
      href={`/beaches/${slug}/${lensId}`}
      className="group block rounded-xl border border-volcanic-100 overflow-hidden hover:shadow-lg hover:border-ocean-200 transition-all duration-200 cursor-pointer"
    >
      <div className={`${style.bg} px-5 py-4 border-b border-volcanic-100/50`}>
        <div className="flex items-center gap-3">
          <LensIcon name={lens.icon} className={`w-6 h-6 ${style.accent}`} />
          <h3 className={`font-display text-lg ${style.accent}`}>
            {lens.label}
          </h3>
        </div>
      </div>
      <div className="px-5 py-4 bg-white">
        <p className="text-sm text-volcanic-500 leading-relaxed line-clamp-3">
          {summary}
        </p>
        <p className={`text-sm font-medium ${style.accent} mt-3 group-hover:underline`}>
          Read more →
        </p>
      </div>
    </Link>
  );
}
