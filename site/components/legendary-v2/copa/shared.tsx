/**
 * Copacabana cluster — shared cluster chrome.
 *
 * Tier 1. ROMANTIC voice register (new in this cluster), CLASSICAL
 * display pairing (DM Serif Display, same as Waikīkī and Brighton).
 * Four earned spokes — more than Nazaré's or Bondi's three, but Copa
 * genuinely earns it: multiple distinct audiences arrive at a
 * Copacabana page.
 */

import { Fragment, type ReactNode } from "react";
import { EYEBROW } from "../nazare/shared";

export const COPA_MAIN = "/beaches/copacabana-7";

export const COPA_SPOKES = {
  visiting: {
    slug: "visiting",
    label: "Visiting",
    subtitle:
      "Getting here, where to stay between Leme and Ipanema, what to eat at a Copa kiosk, and the Rio-wider itinerary a Copacabana trip fits inside.",
  },
  reveillon: {
    slug: "reveillon",
    label: "Réveillon",
    subtitle:
      "The world's largest New Year's Eve — 3 million on the sand, Yemanjá white clothing, the fireworks on barges, the Candomblé offerings, and how to actually be here that night.",
  },
  bossa: {
    slug: "bossa",
    label: "Bossa Nova",
    subtitle:
      "The 1958–63 musical movement Copa's beach kiosks hosted: Jobim, João Gilberto, Vinícius de Moraes, Girl from Ipanema, the Beco das Garrafas venues, and why Copa is the neighborhood in which a new Brazilian music actually got made.",
  },
  favela: {
    slug: "favela",
    label: "The Favela Above",
    subtitle:
      "Cantagalo and Pavão-Pavãozinho rise directly behind Copa and Ipanema. The UPP pacification history, the Plano Inclinado elevator, the Mirante viewpoint, and the inequality that is literally the view.",
  },
} as const;

export type CopaSpoke = keyof typeof COPA_SPOKES;

export function ClusterRail({
  current,
  beachName,
}: {
  current: "main" | CopaSpoke;
  beachName: string;
}) {
  const items: Array<{ key: "main" | CopaSpoke; label: string; href: string }> = [
    { key: "main", label: beachName, href: COPA_MAIN },
    { key: "visiting", label: "Visiting", href: `${COPA_MAIN}/visiting` },
    { key: "reveillon", label: "Réveillon", href: `${COPA_MAIN}/reveillon` },
    { key: "bossa", label: "Bossa Nova", href: `${COPA_MAIN}/bossa` },
    { key: "favela", label: "Favela Above", href: `${COPA_MAIN}/favela` },
  ];
  return (
    <nav aria-label="Page cluster" className="border-b border-[#E2E8F0] bg-[#FAFAF7]">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono uppercase tracking-[0.3em] flex-wrap">
          {items.map((it, i) => (
            <Fragment key={it.key}>
              {i > 0 && <span className="text-volcanic-300" aria-hidden="true">·</span>}
              {it.key === current ? (
                <span className="text-[color:var(--beach-primary,#1A1A1A)]">{it.label}</span>
              ) : (
                <a
                  href={it.href}
                  className="text-volcanic-500 hover:text-[color:var(--beach-primary,#1A1A1A)] transition-colors"
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
  label = "Also in Copacabana",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside className="my-12 not-prose pl-5 border-l-2 border-[color:var(--beach-primary,#1A1A1A)]/40">
      <div className={`${EYEBROW} mb-2 opacity-70`}>· {label}</div>
      <p className="text-[15px] text-volcanic-600 leading-relaxed italic max-w-2xl">{children}</p>
    </aside>
  );
}

export function ClusterLink({
  to,
  label,
}: {
  to: "main" | CopaSpoke;
  label?: string;
}) {
  const href = to === "main" ? COPA_MAIN : `${COPA_MAIN}/${to}`;
  const defaultLabel = to === "main" ? "the main page" : COPA_SPOKES[to].label;
  return (
    <a
      href={href}
      className="not-italic font-semibold text-[color:var(--beach-primary,#1A1A1A)] underline decoration-dotted underline-offset-4 hover:no-underline"
    >
      {label ?? defaultLabel} →
    </a>
  );
}

export function SpokeCrossNav({ current }: { current: CopaSpoke }) {
  const others = (Object.keys(COPA_SPOKES) as CopaSpoke[]).filter(
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
          The rest of Copacabana
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <a
            href={COPA_MAIN}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#1A1A1A)] transition-colors"
          >
            <div className={`${EYEBROW} mb-2`}>· Back to main</div>
            <h3
              className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#1A1A1A)]"
              style={{ fontFamily: "var(--display-family, var(--font-dm-serif-display))" }}
            >
              Copacabana →
            </h3>
            <p className="text-sm leading-relaxed text-volcanic-700">
              The beach the world imagines when it imagines a beach.
            </p>
          </a>
          {others.map((k) => {
            const s = COPA_SPOKES[k];
            return (
              <a
                key={k}
                href={`${COPA_MAIN}/${s.slug}`}
                className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#1A1A1A)] transition-colors"
              >
                <div className={`${EYEBROW} mb-2`}>· Companion</div>
                <h3
                  className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#1A1A1A)]"
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
