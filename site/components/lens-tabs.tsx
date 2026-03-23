"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LENSES } from "@/lib/lenses";

interface LensTabsProps {
  slug: string;
  activeLenses: string[];
}

export default function LensTabs({ slug, activeLenses }: LensTabsProps) {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <nav className="mx-auto max-w-7xl px-4 flex gap-1">
        <TabLink
          href={`/beaches/${slug}`}
          label="Overview"
          active={pathname === `/beaches/${slug}`}
        />
        {LENSES.filter((l) => activeLenses.includes(l.id)).map((lens) => (
          <TabLink
            key={lens.id}
            href={`/beaches/${slug}/${lens.id}`}
            label={lens.label}
            active={pathname === `/beaches/${slug}/${lens.id}`}
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
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {label}
    </Link>
  );
}
