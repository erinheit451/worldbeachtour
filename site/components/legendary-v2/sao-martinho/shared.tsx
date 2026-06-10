/**
 * São Martinho do Porto cluster — shared cluster chrome.
 *
 * Tier 3 cluster (reclassified from Tier 2, 2026-04-20). The pattern
 * is intentionally parallel to the Nazaré and Waikīkī Tier 1 clusters
 * — same ClusterRail / ClusterAside / ClusterLink / SpokeCrossNav
 * primitives — at a smaller volume.
 *
 * Tier 3 vs Tier 1: fewer sections, lighter prose, spokes chosen
 * per-beach rather than a default three.
 */

import { Fragment, type ReactNode } from "react";
import { EYEBROW } from "../nazare/shared";

export const SMP_MAIN = "/beaches/sao-martinho-do-porto";

export const SMP_SPOKES = {
  visiting: {
    slug: "visiting",
    label: "Visiting",
    subtitle:
      "Getting here from Lisbon or Nazaré, where to stay, what to eat, and how to organize a São Martinho day around the Silver Coast.",
  },
  family: {
    slug: "family",
    label: "For Families",
    subtitle:
      "The most swimmable calm-water beach on the Portuguese Atlantic — why this bay works for young children and how to use it well.",
  },
} as const;

export type SmpSpoke = keyof typeof SMP_SPOKES;

export function ClusterRail({
  current,
  beachName,
}: {
  current: "main" | SmpSpoke;
  beachName: string;
}) {
  const items: Array<{ key: "main" | SmpSpoke; label: string; href: string }> = [
    { key: "main", label: beachName, href: SMP_MAIN },
    { key: "visiting", label: "Visiting", href: `${SMP_MAIN}/visiting` },
    { key: "family", label: "For Families", href: `${SMP_MAIN}/family` },
  ];
  return (
    <nav
      aria-label="Page cluster"
      className="border-b border-[#E2E8F0] bg-[#FAFAF7]"
    >
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono uppercase tracking-[0.3em] flex-wrap">
          {items.map((it, i) => (
            <Fragment key={it.key}>
              {i > 0 && (
                <span className="text-volcanic-300" aria-hidden="true">
                  ·
                </span>
              )}
              {it.key === current ? (
                <span className="text-[color:var(--beach-primary,#2B6F8C)]">
                  {it.label}
                </span>
              ) : (
                <a
                  href={it.href}
                  className="text-volcanic-500 hover:text-[color:var(--beach-primary,#2B6F8C)] transition-colors"
                >
                  {it.label}
                </a>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function ClusterAside({
  children,
  label = "Also in São Martinho",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside className="my-12 not-prose pl-5 border-l-2 border-[color:var(--beach-primary,#2B6F8C)]/40">
      <div className={`${EYEBROW} mb-2 opacity-70`}>· {label}</div>
      <p className="text-[15px] text-volcanic-600 leading-relaxed italic max-w-2xl">
        {children}
      </p>
    </aside>
  );
}

export function ClusterLink({
  to,
  label,
}: {
  to: "main" | SmpSpoke;
  label?: string;
}) {
  const href = to === "main" ? SMP_MAIN : `${SMP_MAIN}/${to}`;
  const defaultLabel =
    to === "main" ? "the main page" : SMP_SPOKES[to].label;
  return (
    <a
      href={href}
      className="not-italic font-semibold text-[color:var(--beach-primary,#2B6F8C)] underline decoration-dotted underline-offset-4 hover:no-underline"
    >
      {label ?? defaultLabel} →
    </a>
  );
}

export function SpokeCrossNav({ current }: { current: SmpSpoke }) {
  const others = (Object.keys(SMP_SPOKES) as SmpSpoke[]).filter(
    (k) => k !== current
  );
  return (
    <section className="bg-[#FAFAF7]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className={`${EYEBROW} mb-6`}>· Keep Reading</div>
        <h2
          className="text-[32px] sm:text-[44px] leading-[0.95] -tracking-[0.01em] text-volcanic-900 uppercase mb-12 max-w-3xl"
          style={{ fontFamily: "var(--display-family, var(--font-dm-serif-display))" }}
        >
          The rest of São Martinho
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <a
            href={SMP_MAIN}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#2B6F8C)] transition-colors"
          >
            <div className={`${EYEBROW} mb-2`}>· Back to the main page</div>
            <h3
              className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#2B6F8C)]"
              style={{ fontFamily: "var(--display-family, var(--font-dm-serif-display))" }}
            >
              São Martinho do Porto →
            </h3>
            <p className="text-sm leading-relaxed text-volcanic-700">
              The shell-shaped bay — geography, history, the 900-year
              relationship with the Alcobaça monastery. The full page.
            </p>
          </a>
          {others.map((k) => {
            const s = SMP_SPOKES[k];
            return (
              <a
                key={k}
                href={`${SMP_MAIN}/${s.slug}`}
                className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#2B6F8C)] transition-colors"
              >
                <div className={`${EYEBROW} mb-2`}>· Companion spoke</div>
                <h3
                  className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#2B6F8C)]"
                  style={{ fontFamily: "var(--display-family, var(--font-dm-serif-display))" }}
                >
                  {s.label} →
                </h3>
                <p className="text-sm leading-relaxed text-volcanic-700">
                  {s.subtitle}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
