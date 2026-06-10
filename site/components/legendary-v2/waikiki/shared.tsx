/**
 * Waikīkī cluster — shared cluster chrome (rail, aside, link, constants).
 *
 * Used by: waikiki-v2.tsx (main), waikiki/visiting.tsx, waikiki/surf.tsx,
 * waikiki/malama.tsx. The beach-neutral primitives (tokens, Section,
 * SectionHeader, Fact, renderInlineBold, pickImage, SpokeHero,
 * SpokeProvenance) come from ../nazare/shared — which is currently still
 * named `nazare/` but is beach-agnostic content. Rename / relocate when
 * we refactor after beach three.
 */

import { Fragment, type ReactNode } from "react";
import { EYEBROW } from "../nazare/shared";

export const WAIKIKI_MAIN = "/beaches/waikiki-beach-1";

export const WAIKIKI_SPOKES = {
  visiting: {
    slug: "visiting",
    label: "Visiting",
    subtitle:
      "Getting here, where to stay on a strip of 30,000 rooms, what to eat, visitor safety, three itineraries.",
  },
  surf: {
    slug: "surf",
    label: "Learning to Surf",
    subtitle:
      "The world's first-lesson beach. Which school, which break, etiquette, and what it means to be taught by a Hawaiian waterman.",
  },
  malama: {
    slug: "malama",
    label: "Mālama Hawaiʻi",
    subtitle:
      "The overthrow in detail, sovereignty today, ʻōlelo Hawaiʻi basics, Hawaiian homestead, and how to visit a royal beach without flattening a living kingdom.",
  },
} as const;

export type WaikikiSpoke = keyof typeof WAIKIKI_SPOKES;

export function ClusterRail({
  current,
  beachName,
}: {
  current: "main" | WaikikiSpoke;
  beachName: string;
}) {
  const items: Array<{ key: "main" | WaikikiSpoke; label: string; href: string }> =
    [
      { key: "main", label: beachName, href: WAIKIKI_MAIN },
      { key: "visiting", label: "Visiting", href: `${WAIKIKI_MAIN}/visiting` },
      { key: "surf", label: "Learning to Surf", href: `${WAIKIKI_MAIN}/surf` },
      { key: "malama", label: "Mālama Hawaiʻi", href: `${WAIKIKI_MAIN}/malama` },
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
                <span className="text-[color:var(--beach-supporting,#1E5F74)]">
                  {it.label}
                </span>
              ) : (
                <a
                  href={it.href}
                  className="text-volcanic-500 hover:text-[color:var(--beach-supporting,#1E5F74)] transition-colors"
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
  label = "Also in Waikīkī",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside className="my-12 not-prose pl-5 border-l-2 border-[color:var(--beach-supporting,#1E5F74)]/40">
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
  to: "main" | WaikikiSpoke;
  label?: string;
}) {
  const href = to === "main" ? WAIKIKI_MAIN : `${WAIKIKI_MAIN}/${to}`;
  const defaultLabel =
    to === "main" ? "the main page" : WAIKIKI_SPOKES[to].label;
  return (
    <a
      href={href}
      className="not-italic font-semibold text-[color:var(--beach-supporting,#1E5F74)] underline decoration-dotted underline-offset-4 hover:no-underline"
    >
      {label ?? defaultLabel} →
    </a>
  );
}

/**
 * Cross-spoke navigation — three cards: back-to-main + two companion
 * spokes. Sits near the bottom of every spoke page.
 */
export function SpokeCrossNav({ current }: { current: WaikikiSpoke }) {
  const others = (Object.keys(WAIKIKI_SPOKES) as WaikikiSpoke[]).filter(
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
          The rest of Waikīkī
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <a
            href={WAIKIKI_MAIN}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-supporting,#1E5F74)] transition-colors"
          >
            <div className={`${EYEBROW} mb-2`}>· Back to the main page</div>
            <h3
              className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-supporting,#1E5F74)]"
              style={{ fontFamily: "var(--display-family, var(--font-dm-serif-display))" }}
            >
              Waikīkī →
            </h3>
            <p className="text-sm leading-relaxed text-volcanic-700">
              A royal beach that survived becoming a resort — the full
              argument this spoke sits inside.
            </p>
          </a>
          {others.map((k) => {
            const s = WAIKIKI_SPOKES[k];
            return (
              <a
                key={k}
                href={`${WAIKIKI_MAIN}/${s.slug}`}
                className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-supporting,#1E5F74)] transition-colors"
              >
                <div className={`${EYEBROW} mb-2`}>· Companion spoke</div>
                <h3
                  className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-supporting,#1E5F74)]"
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
