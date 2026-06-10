/**
 * Malibu cluster — shared cluster chrome.
 *
 * Tier 1. WRY voice register primary (Malibu performs its own myth and
 * the page is in on the joke), with REVERENT shifts for the wave and
 * SEVERE shifts for the honest-reckoning spokes. CLASSICAL display
 * pairing (DM Serif Display), matching Brighton and Waikīkī.
 *
 * Four earned spokes:
 *   - First Point (deep-dive — the wave, cobblestone, longboard canon)
 *   - Gidget (deep-dive — the 1957-1975 cultural explosion)
 *   - Humaliwo (honest reckoning — Chumash, CA-LAN-264, Rindge)
 *   - Surfrider Foundation (honest reckoning — 1984 breakwater fight,
 *     1991 CWA case, Tapia, lagoon restoration)
 */

import { Fragment, type ReactNode } from "react";
import { EYEBROW } from "../nazare/shared";

export const MALIBU_MAIN = "/beaches/malibu";

export const MALIBU_SPOKES = {
  "first-point": {
    slug: "first-point",
    label: "First Point",
    subtitle:
      "The wave itself. Cobblestone geology, the south-swell window, the longboard canon from Simmons to Carson to today's crew, and why First Point is a physics argument for a specific kind of surfing.",
  },
  gidget: {
    slug: "gidget",
    label: "Gidget",
    subtitle:
      "The cultural explosion 1956–1975. Kathy Kohner's summer notebooks, her father's novel, Sandra Dee, the Beach Boys, The Endless Summer — and how a 5'1\" teenager accidentally sold Malibu to the world.",
  },
  humaliwo: {
    slug: "humaliwo",
    label: "Humaliwo",
    subtitle:
      "Before \"Malibu\": the Chumash village of Humaliwo, the Rindge land grant that erased it, and the two-thousand-year history buried under the First Point parking lot.",
  },
  "surfrider-foundation": {
    slug: "surfrider-foundation",
    label: "Surfrider Foundation",
    subtitle:
      "Water quality and the 1984 founding. How a fight to stop a breakwater at First Point became the largest coastal-protection nonprofit on Earth — and what the fight looks like at Malibu Creek now.",
  },
} as const;

export type MalibuSpoke = keyof typeof MALIBU_SPOKES;

export function ClusterRail({
  current,
  beachName,
}: {
  current: "main" | MalibuSpoke;
  beachName: string;
}) {
  const items: Array<{
    key: "main" | MalibuSpoke;
    label: string;
    href: string;
  }> = [
    { key: "main", label: beachName, href: MALIBU_MAIN },
    { key: "first-point", label: "First Point", href: `${MALIBU_MAIN}/first-point` },
    { key: "gidget", label: "Gidget", href: `${MALIBU_MAIN}/gidget` },
    { key: "humaliwo", label: "Humaliwo", href: `${MALIBU_MAIN}/humaliwo` },
    { key: "surfrider-foundation", label: "Surfrider", href: `${MALIBU_MAIN}/surfrider-foundation` },
  ];
  return (
    <nav aria-label="Page cluster" className="border-b border-[#E2E8F0] bg-[#FAFAF7]">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono uppercase tracking-[0.3em] flex-wrap">
          {items.map((it, i) => (
            <Fragment key={it.key}>
              {i > 0 && <span className="text-volcanic-300" aria-hidden="true">·</span>}
              {it.key === current ? (
                <span className="text-[color:var(--beach-primary,#8E5A3C)]">{it.label}</span>
              ) : (
                <a href={it.href} className="text-volcanic-500 hover:text-[color:var(--beach-primary,#8E5A3C)] transition-colors">
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
  label = "Also in Malibu",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside className="my-12 not-prose pl-5 border-l-2 border-[color:var(--beach-primary,#8E5A3C)]/40">
      <div className={`${EYEBROW} mb-2 opacity-70`}>· {label}</div>
      <p className="text-[15px] text-volcanic-600 leading-relaxed italic max-w-2xl">{children}</p>
    </aside>
  );
}

export function ClusterLink({
  to,
  label,
}: {
  to: "main" | MalibuSpoke;
  label?: string;
}) {
  const href = to === "main" ? MALIBU_MAIN : `${MALIBU_MAIN}/${to}`;
  const defaultLabel =
    to === "main" ? "the main page" : MALIBU_SPOKES[to].label;
  return (
    <a
      href={href}
      className="not-italic font-semibold text-[color:var(--beach-primary,#8E5A3C)] underline decoration-dotted underline-offset-4 hover:no-underline"
    >
      {label ?? defaultLabel} →
    </a>
  );
}

export function SpokeCrossNav({ current }: { current: MalibuSpoke }) {
  const others = (Object.keys(MALIBU_SPOKES) as MalibuSpoke[]).filter(
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
          The rest of Malibu
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <a
            href={MALIBU_MAIN}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#8E5A3C)] transition-colors"
          >
            <div className={`${EYEBROW} mb-2`}>· Back to the main page</div>
            <h3
              className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#8E5A3C)]"
              style={{ fontFamily: "var(--display-family, var(--font-dm-serif-display))" }}
            >
              Surfrider Beach →
            </h3>
            <p className="text-sm leading-relaxed text-volcanic-700">
              The three-point cobblestone right-hander, the canon, the honest reckoning.
            </p>
          </a>
          {others.map((k) => {
            const s = MALIBU_SPOKES[k];
            return (
              <a
                key={k}
                href={`${MALIBU_MAIN}/${s.slug}`}
                className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#8E5A3C)] transition-colors"
              >
                <div className={`${EYEBROW} mb-2`}>· Companion spoke</div>
                <h3
                  className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#8E5A3C)]"
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
