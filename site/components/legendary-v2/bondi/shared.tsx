/**
 * Bondi cluster — shared cluster chrome.
 *
 * Tier 1. WRY voice register (same as Brighton), AUSTERE display
 * pairing (Barlow Condensed, same as Nazaré). Three earned spokes:
 *
 *   - Visiting (universal — Sydney day-trip, stay, coastal walk)
 *   - Surf Lifesaving (the spike-applied spoke — Black Sunday 1938,
 *     the sport's origin, Bondi Rescue TV show, the red-and-yellow flags
 *     as national emblem). Absorbs what would otherwise be separate
 *     Black-Sunday and Bondi-Rescue spokes — both live here.
 *   - Gadigal Country (honest-reckoning expansion — Eora Nation,
 *     Uluru Statement, visiting Country respectfully)
 */

import { Fragment, type ReactNode } from "react";
import { EYEBROW } from "../nazare/shared";

export const BONDI_MAIN = "/beaches/bondi-beach";

export const BONDI_SPOKES = {
  visiting: {
    slug: "visiting",
    label: "Visiting",
    subtitle:
      "Getting to Bondi from Sydney CBD, the 6 km Bondi-to-Coogee coastal walk, where to stay, what to eat, and Icebergs as the anchor destination.",
  },
  lifesaving: {
    slug: "lifesaving",
    label: "Surf Lifesaving",
    subtitle:
      "The 1906 founding of the Bondi Surf Bathers' Life Saving Club, the 1938 Black Sunday rescue, what the red-and-yellow-capped volunteers actually do, and Bondi Rescue as both TV show and training program.",
  },
  gadigal: {
    slug: "gadigal",
    label: "Gadigal Country",
    subtitle:
      "Eora Nation country, the Bondi rock engravings, the Uluru Statement arc and the 2023 Voice referendum, and how to visit an Australian beach that was never ceded.",
  },
} as const;

export type BondiSpoke = keyof typeof BONDI_SPOKES;

export function ClusterRail({
  current,
  beachName,
}: {
  current: "main" | BondiSpoke;
  beachName: string;
}) {
  const items: Array<{ key: "main" | BondiSpoke; label: string; href: string }> = [
    { key: "main", label: beachName, href: BONDI_MAIN },
    { key: "visiting", label: "Visiting", href: `${BONDI_MAIN}/visiting` },
    { key: "lifesaving", label: "Surf Lifesaving", href: `${BONDI_MAIN}/lifesaving` },
    { key: "gadigal", label: "Gadigal Country", href: `${BONDI_MAIN}/gadigal` },
  ];
  return (
    <nav aria-label="Page cluster" className="border-b border-[#E2E8F0] bg-[#FAFAF7]">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono uppercase tracking-[0.3em] flex-wrap">
          {items.map((it, i) => (
            <Fragment key={it.key}>
              {i > 0 && <span className="text-volcanic-300" aria-hidden="true">·</span>}
              {it.key === current ? (
                <span className="text-[color:var(--beach-primary,#D9B66B)]">{it.label}</span>
              ) : (
                <a href={it.href} className="text-volcanic-500 hover:text-[color:var(--beach-primary,#D9B66B)] transition-colors">
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
  label = "Also in Bondi",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside className="my-12 not-prose pl-5 border-l-2 border-[color:var(--beach-primary,#D9B66B)]/60">
      <div className={`${EYEBROW} mb-2 opacity-70`}>· {label}</div>
      <p className="text-[15px] text-volcanic-600 leading-relaxed italic max-w-2xl">{children}</p>
    </aside>
  );
}

export function ClusterLink({
  to,
  label,
}: {
  to: "main" | BondiSpoke;
  label?: string;
}) {
  const href = to === "main" ? BONDI_MAIN : `${BONDI_MAIN}/${to}`;
  const defaultLabel = to === "main" ? "the main page" : BONDI_SPOKES[to].label;
  return (
    <a
      href={href}
      className="not-italic font-semibold text-[color:var(--beach-primary,#B8913A)] underline decoration-dotted underline-offset-4 hover:no-underline"
    >
      {label ?? defaultLabel} →
    </a>
  );
}

export function SpokeCrossNav({ current }: { current: BondiSpoke }) {
  const others = (Object.keys(BONDI_SPOKES) as BondiSpoke[]).filter(
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
          The rest of Bondi
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <a
            href={BONDI_MAIN}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#D9B66B)] transition-colors"
          >
            <div className={`${EYEBROW} mb-2`}>· Back to the main page</div>
            <h3
              className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#B8913A)]"
              style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
            >
              Bondi →
            </h3>
            <p className="text-sm leading-relaxed text-volcanic-700">
              Australia's image of itself — the crescent of sand, the
              red-and-yellow flags, and the Gadigal country under both.
            </p>
          </a>
          {others.map((k) => {
            const s = BONDI_SPOKES[k];
            return (
              <a
                key={k}
                href={`${BONDI_MAIN}/${s.slug}`}
                className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#D9B66B)] transition-colors"
              >
                <div className={`${EYEBROW} mb-2`}>· Companion spoke</div>
                <h3
                  className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#B8913A)]"
                  style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
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
