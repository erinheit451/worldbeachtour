"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LENSES } from "@/lib/lenses";

const LENS_COLORS: Record<string, string> = {
  travel: "text-ocean-600 border-ocean-500",
  surf: "text-indigo-600 border-indigo-500",
  environment: "text-reef-700 border-reef-600",
  family: "text-amber-600 border-amber-500",
  photography: "text-violet-600 border-violet-500",
  diving: "text-cyan-600 border-cyan-500",
  history: "text-amber-700 border-amber-700",
  sand: "text-sand-700 border-sand-600",
};

interface LensTabsProps {
  slug: string;
  activeLenses: string[];
}

export default function LensTabs({ slug, activeLenses }: LensTabsProps) {
  const pathname = usePathname();

  return (
    <div className="border-b border-volcanic-100 bg-white">
      <nav
        className="mx-auto max-w-7xl px-4 flex gap-1 overflow-x-auto hide-scrollbar scroll-fade-right"
        role="tablist"
        aria-label="Beach content lenses"
      >
        <TabLink
          href={`/beaches/${slug}`}
          label="Overview"
          active={pathname === `/beaches/${slug}`}
          colorClass="text-volcanic-700 border-volcanic-500"
        />
        {LENSES.filter((l) => activeLenses.includes(l.id)).map((lens) => (
          <TabLink
            key={lens.id}
            href={`/beaches/${slug}/${lens.id}`}
            label={lens.label}
            active={pathname === `/beaches/${slug}/${lens.id}`}
            colorClass={LENS_COLORS[lens.id] || "text-ocean-600 border-ocean-500"}
          />
        ))}
      </nav>
    </div>
  );
}

function TabLink({
  href,
  label,
  active,
  colorClass,
}: {
  href: string;
  label: string;
  active: boolean;
  colorClass: string;
}) {
  return (
    <Link
      href={href}
      role="tab"
      aria-selected={active}
      aria-current={active ? "page" : undefined}
      className={`whitespace-nowrap px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
        active
          ? colorClass
          : "border-transparent text-volcanic-500 hover:text-volcanic-700 hover:border-volcanic-300"
      }`}
    >
      {label}
    </Link>
  );
}
