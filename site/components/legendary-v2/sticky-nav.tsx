"use client";

/**
 * <StickyNavV2> — the page's section nav, grouped + sticky.
 *
 * Adapted from existing showcase/sticky-nav.tsx. Uses CSS custom property
 * --beach-primary for active-link highlight so it's per-page themable.
 */

import { useEffect, useState, Fragment } from "react";

export interface NavGroup {
  label: string;
  items: [string, string][];
}

interface StickyNavV2Props {
  groups: NavGroup[];
}

export default function StickyNavV2({ groups }: StickyNavV2Props) {
  const allItems = groups.flatMap((g) => g.items);
  const [active, setActive] = useState<string>(allItems[0]?.[0] ?? "");

  useEffect(() => {
    const ids = allItems.map(([id]) => id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [groups]);

  return (
    <nav
      className="sticky top-0 z-30 border-b bg-[#FAFAF7]/95 backdrop-blur-md"
      style={{ borderColor: "var(--color-rule, #E5E5E5)" }}
    >
      <div className="mx-auto max-w-7xl overflow-x-auto px-4">
        <ul className="flex items-center py-3 whitespace-nowrap">
          {groups.map((group, gi) => (
            <Fragment key={group.label}>
              {gi > 0 && (
                <li className="mx-3 text-volcanic-300 select-none">•</li>
              )}
              <li className="text-[9px] font-mono uppercase tracking-[0.2em] text-volcanic-400 mr-3 select-none hidden md:inline">
                {group.label}
              </li>
              {group.items.map(([id, label], i) => {
                const isActive = active === id;
                return (
                  <li key={id} className={i > 0 ? "ml-4" : ""}>
                    <a
                      href={`#${id}`}
                      className="text-xs font-medium uppercase tracking-wider transition-colors pb-1"
                      style={{
                        color: isActive
                          ? "var(--beach-primary, #0284c7)"
                          : "var(--color-muted, #64748b)",
                        borderBottom: isActive
                          ? "2px solid var(--beach-primary, #0284c7)"
                          : "2px solid transparent",
                      }}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </Fragment>
          ))}
        </ul>
      </div>
    </nav>
  );
}
