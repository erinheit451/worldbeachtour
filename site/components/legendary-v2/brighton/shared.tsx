/**
 * Brighton cluster — shared cluster chrome.
 *
 * Tier 1. WRY voice register, CLASSICAL display pairing (DM Serif
 * Display). Three earned spokes chosen per-beach:
 *   - Visiting (universal — London day-trip, weekend, overnight)
 *   - The Royal Pavilion (deep-dive — George IV's Indo-Islamic palace)
 *   - Queer Brighton (honest-reckoning expansion — Kemptown, Pride,
 *     the UK's gay capital)
 *
 * Mods-and-Rockers 1964 and the Grand Hotel bombing are main-page
 * Culture content rather than spokes — event-scale not audience-scale.
 */

import { Fragment, type ReactNode } from "react";
import { EYEBROW } from "../nazare/shared";

export const BRIGHTON_MAIN = "/beaches/brighton-beach-1";

export const BRIGHTON_SPOKES = {
  visiting: {
    slug: "visiting",
    label: "Visiting",
    subtitle:
      "The London day-trip vs the weekend vs the overnight; where to stay in the Lanes, the seafront, or Kemptown; and how to eat in a town of five hundred restaurants.",
  },
  pavilion: {
    slug: "pavilion",
    label: "The Royal Pavilion",
    subtitle:
      "George IV's Indo-Islamic fantasy palace — how it got built, why it is the way it is, and how to read the most unusual royal building in Britain.",
  },
  queer: {
    slug: "queer",
    label: "Queer Brighton",
    subtitle:
      "Kemptown, the UK's first legal naturist beach at Duke's Mound, eighty years of Brighton gay culture, and what it actually means that this is the UK's queer capital.",
  },
} as const;

export type BrightonSpoke = keyof typeof BRIGHTON_SPOKES;

export function ClusterRail({
  current,
  beachName,
}: {
  current: "main" | BrightonSpoke;
  beachName: string;
}) {
  const items: Array<{
    key: "main" | BrightonSpoke;
    label: string;
    href: string;
  }> = [
    { key: "main", label: beachName, href: BRIGHTON_MAIN },
    { key: "visiting", label: "Visiting", href: `${BRIGHTON_MAIN}/visiting` },
    { key: "pavilion", label: "The Pavilion", href: `${BRIGHTON_MAIN}/pavilion` },
    { key: "queer", label: "Queer Brighton", href: `${BRIGHTON_MAIN}/queer` },
  ];
  return (
    <nav aria-label="Page cluster" className="border-b border-[#E2E8F0] bg-[#FAFAF7]">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono uppercase tracking-[0.3em] flex-wrap">
          {items.map((it, i) => (
            <Fragment key={it.key}>
              {i > 0 && <span className="text-volcanic-300" aria-hidden="true">·</span>}
              {it.key === current ? (
                <span className="text-[color:var(--beach-primary,#3A4E5C)]">{it.label}</span>
              ) : (
                <a href={it.href} className="text-volcanic-500 hover:text-[color:var(--beach-primary,#3A4E5C)] transition-colors">
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
  label = "Also in Brighton",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside className="my-12 not-prose pl-5 border-l-2 border-[color:var(--beach-primary,#3A4E5C)]/40">
      <div className={`${EYEBROW} mb-2 opacity-70`}>· {label}</div>
      <p className="text-[15px] text-volcanic-600 leading-relaxed italic max-w-2xl">{children}</p>
    </aside>
  );
}

export function ClusterLink({
  to,
  label,
}: {
  to: "main" | BrightonSpoke;
  label?: string;
}) {
  const href = to === "main" ? BRIGHTON_MAIN : `${BRIGHTON_MAIN}/${to}`;
  const defaultLabel =
    to === "main" ? "the main page" : BRIGHTON_SPOKES[to].label;
  return (
    <a
      href={href}
      className="not-italic font-semibold text-[color:var(--beach-primary,#3A4E5C)] underline decoration-dotted underline-offset-4 hover:no-underline"
    >
      {label ?? defaultLabel} →
    </a>
  );
}

export function SpokeCrossNav({ current }: { current: BrightonSpoke }) {
  const others = (Object.keys(BRIGHTON_SPOKES) as BrightonSpoke[]).filter(
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
          The rest of Brighton
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <a
            href={BRIGHTON_MAIN}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#3A4E5C)] transition-colors"
          >
            <div className={`${EYEBROW} mb-2`}>· Back to the main page</div>
            <h3
              className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#3A4E5C)]"
              style={{ fontFamily: "var(--display-family, var(--font-dm-serif-display))" }}
            >
              Brighton →
            </h3>
            <p className="text-sm leading-relaxed text-volcanic-700">
              The two piers, the Regency seafront, and what a grey-sky
              beach built English seaside tourism around.
            </p>
          </a>
          {others.map((k) => {
            const s = BRIGHTON_SPOKES[k];
            return (
              <a
                key={k}
                href={`${BRIGHTON_MAIN}/${s.slug}`}
                className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#3A4E5C)] transition-colors"
              >
                <div className={`${EYEBROW} mb-2`}>· Companion spoke</div>
                <h3
                  className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#3A4E5C)]"
                  style={{ fontFamily: "var(--display-family, var(--font-dm-serif-display))" }}
                >
                  {s.label} →
                </h3>
                <p className="text-sm leading-relaxed text-volcanic-700">{s.subtitle}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
