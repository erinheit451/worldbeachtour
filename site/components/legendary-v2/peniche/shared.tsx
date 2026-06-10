/**
 * Peniche cluster — shared cluster chrome.
 *
 * First real Tier 2 cluster (after São Martinho reclassified to Tier 3
 * on 2026-04-20). Peniche earns Tier 2 because it is genuinely known
 * to two international scenes: the global competitive surf community
 * (through the WSL Championship Tour's Supertubos stop) and Portuguese
 * political-history audiences (through the Fortaleza's Salazar-era
 * prison legacy).
 */

import { Fragment, type ReactNode } from "react";
import { EYEBROW } from "../nazare/shared";

export const PENICHE_MAIN = "/beaches/peniche";

export const PENICHE_SPOKES = {
  surfing: {
    slug: "surfing",
    label: "Surfing Peniche",
    subtitle:
      "The WSL Championship Tour stop. Which break for which level, why Supertubos barrels the way it does, the competition calendar, and the surf-camp inventory at Baleal.",
  },
  visiting: {
    slug: "visiting",
    label: "Visiting",
    subtitle:
      "Getting to Peniche from Lisbon, where to stay, what to eat, and the Fortaleza as the Peninsula's serious afternoon.",
  },
  berlengas: {
    slug: "berlengas",
    label: "The Berlengas",
    subtitle:
      "The UNESCO Biosphere archipelago 10 km offshore — how to book the permit-limited boat trip, what to do on the main island, and the bird colony that makes it worth the seasick crossing.",
  },
} as const;

export type PenicheSpoke = keyof typeof PENICHE_SPOKES;

export function ClusterRail({
  current,
  beachName,
}: {
  current: "main" | PenicheSpoke;
  beachName: string;
}) {
  const items: Array<{
    key: "main" | PenicheSpoke;
    label: string;
    href: string;
  }> = [
    { key: "main", label: beachName, href: PENICHE_MAIN },
    { key: "surfing", label: "Surfing", href: `${PENICHE_MAIN}/surfing` },
    { key: "visiting", label: "Visiting", href: `${PENICHE_MAIN}/visiting` },
    { key: "berlengas", label: "Berlengas", href: `${PENICHE_MAIN}/berlengas` },
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
                <span className="text-[color:var(--beach-primary,#0A4D68)]">
                  {it.label}
                </span>
              ) : (
                <a
                  href={it.href}
                  className="text-volcanic-500 hover:text-[color:var(--beach-primary,#0A4D68)] transition-colors"
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
  label = "Also in Peniche",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside className="my-12 not-prose pl-5 border-l-2 border-[color:var(--beach-primary,#0A4D68)]/40">
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
  to: "main" | PenicheSpoke;
  label?: string;
}) {
  const href = to === "main" ? PENICHE_MAIN : `${PENICHE_MAIN}/${to}`;
  const defaultLabel =
    to === "main" ? "the main page" : PENICHE_SPOKES[to].label;
  return (
    <a
      href={href}
      className="not-italic font-semibold text-[color:var(--beach-primary,#0A4D68)] underline decoration-dotted underline-offset-4 hover:no-underline"
    >
      {label ?? defaultLabel} →
    </a>
  );
}

export function SpokeCrossNav({ current }: { current: PenicheSpoke }) {
  const others = (Object.keys(PENICHE_SPOKES) as PenicheSpoke[]).filter(
    (k) => k !== current
  );
  return (
    <section className="bg-[#FAFAF7]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className={`${EYEBROW} mb-6`}>· Keep Reading</div>
        <h2
          className="text-[32px] sm:text-[44px] leading-[0.95] -tracking-[0.01em] text-volcanic-900 uppercase mb-12 max-w-3xl"
          style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
        >
          The rest of Peniche
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <a
            href={PENICHE_MAIN}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#0A4D68)] transition-colors"
          >
            <div className={`${EYEBROW} mb-2`}>· Back to the main page</div>
            <h3
              className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#0A4D68)]"
              style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
            >
              Peniche →
            </h3>
            <p className="text-sm leading-relaxed text-volcanic-700">
              The peninsula, the fortress, Supertubos, and the Berlengas —
              the full argument.
            </p>
          </a>
          {others.map((k) => {
            const s = PENICHE_SPOKES[k];
            return (
              <a
                key={k}
                href={`${PENICHE_MAIN}/${s.slug}`}
                className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#0A4D68)] transition-colors"
              >
                <div className={`${EYEBROW} mb-2`}>· Companion spoke</div>
                <h3
                  className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#0A4D68)]"
                  style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
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
