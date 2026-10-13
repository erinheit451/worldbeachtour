/**
 * Spokes — the "one level down" pages. A spoke is one lens or topic taken to
 * its own page, linked from the parent legendary page. Two archetypes here:
 *  - SurfGuide  (audience guide): the surf lens as a full page — season swell,
 *    the break, tide-for-surf, the live buoy, crowds/etiquette, board call.
 *  - PierGuide  (deep dive): one topic, intro + authored sections.
 *
 * Both reuse the legendary theme (LegendaryShell) and read the parent bundle +
 * showcase.spokes_content. Content is data-driven where possible (the swell
 * chart is the wave climatology), authored where it must be.
 */

import Link from "next/link";
import type { LegendaryPageBundle } from "../types";
import LegendaryShell from "../shell";
import { LiveInstrument } from "../live";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

interface SurfContent {
  title: string; kicker?: string; intro?: string;
  the_break?: string; when_to_surf?: string; crowds_etiquette?: string;
  board_call?: string; skill?: string;
}
interface SpokeImage {
  url: string; title: string; author?: string; license: string; source_url?: string;
  /** CSS object-position for the header crop, e.g. "center 80%" when the subject sits low in the frame. */
  position?: string;
}
interface PierContent {
  title: string; kicker?: string; intro?: string;
  hero_image?: SpokeImage;
  sections?: { heading: string; body: string; image?: SpokeImage }[];
  sources?: { label: string; url: string }[];
}

function Credit({ image, className }: { image: SpokeImage; className: string }) {
  const text = `${image.title}${image.author ? ` · ${image.author}` : ""} · ${image.license}`;
  return image.source_url
    ? <a href={image.source_url} rel="noopener" className={`${className} hover:underline`}>{text}</a>
    : <span className={className}>{text}</span>;
}

function SpokeHeader({ bundle, title, kicker, image }: { bundle: LegendaryPageBundle; title: string; kicker?: string; image?: SpokeImage }) {
  if (image) {
    // Photo header: the site nav is white-on-transparent, so spokes need a dark top like the parent hero.
    return (
      <header className="relative w-full h-[56vh] min-h-[420px] overflow-hidden bg-black">
        <img src={image.url} alt={image.title} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: image.position ?? "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/85" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-14 sm:pb-16">
          <div className="mx-auto max-w-3xl">
            <Link href={`/beaches/${bundle.composition.slug}`} className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/85 hover:underline">
              ← {bundle.composition.beach_name}
            </Link>
            <h1 className="font-display text-[40px] sm:text-[56px] leading-[1.02] text-white mt-4" style={{ fontFamily: "var(--display-family)" }}>
              {title}
            </h1>
            {kicker && <p className="mt-3 text-lg sm:text-xl italic text-white/90 font-serif">{kicker}</p>}
          </div>
        </div>
        <Credit image={image} className="absolute bottom-3 right-4 max-w-[60%] text-right text-[10px] text-white/60" />
      </header>
    );
  }
  return (
    <>
    {/* Dark band so the white site nav stays readable on photo-less spokes. */}
    <div className="h-16 w-full" style={{ background: "var(--beach-primary, #0f172a)" }} />
    <header className="mx-auto max-w-3xl px-6 pt-12 pb-8">
      <Link
        href={`/beaches/${bundle.composition.slug}`}
        className="font-mono text-[11px] uppercase tracking-[0.18em] hover:underline"
        style={{ color: "var(--beach-primary, #475569)" }}
      >
        ← {bundle.composition.beach_name}
      </Link>
      <h1 className="font-display text-[44px] sm:text-[56px] leading-[1.02] text-volcanic-900 mt-6" style={{ fontFamily: "var(--display-family)" }}>
        {title}
      </h1>
      {kicker && <p className="mt-4 text-xl italic text-volcanic-500 font-serif">{kicker}</p>}
    </header>
    </>
  );
}

function Figure({ image }: { image: SpokeImage }) {
  return (
    <figure className="my-6">
      <img src={image.url} alt={image.title} loading="lazy" className="w-full h-auto rounded-sm" />
      <figcaption className="mt-2 text-[12px] text-volcanic-400">
        <Credit image={image} className="" />
      </figcaption>
    </figure>
  );
}

function Prose({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <>
      {text.split("\n\n").filter(Boolean).map((p, i) => (
        <p key={i} className="text-volcanic-700 leading-[1.75] text-[18px] my-5">{p}</p>
      ))}
    </>
  );
}

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10 border-t border-volcanic-100">
      <h2 className="font-display text-2xl text-volcanic-900 mb-4" style={{ fontFamily: "var(--display-family)" }}>{heading}</h2>
      {children}
    </section>
  );
}

// ── SURF GUIDE (audience guide) ─────────────────────────────────────────
export function SurfGuide({ bundle }: { bundle: LegendaryPageBundle }) {
  const c = (bundle.showcase as unknown as { spokes_content?: { surf?: SurfContent } }).spokes_content?.surf;
  const waves = (bundle.data as unknown as { waves?: {
    height_mean_m: (number | null)[]; height_big_m: (number | null)[];
    summary: { biggest_month: string; calmest_month: string; typical_period_s: number | null; character: string };
  } }).waves;
  if (!c) return null;
  const heights = waves?.height_mean_m ?? [];
  const bigs = waves?.height_big_m ?? [];
  const maxH = Math.max(1, ...heights.filter((h): h is number => h != null), ...bigs.filter((h): h is number => h != null));

  return (
    <LegendaryShell composition={bundle.composition}>
      <SpokeHeader bundle={bundle} title={c.title} kicker={c.kicker} />
      <div className="mx-auto max-w-3xl px-6 pb-4">
        {c.skill && (
          <span className="inline-block font-mono text-[10px] uppercase tracking-[0.12em] px-3 py-1 rounded-full border" style={{ borderColor: "var(--beach-primary)", color: "var(--beach-primary)" }}>
            Suits: {c.skill}
          </span>
        )}
        <div className="mt-6"><Prose text={c.intro} /></div>
      </div>

      {c.the_break && <Block heading="The break"><Prose text={c.the_break} /></Block>}

      {waves && (
        <Block heading="When it works — season by season">
          <svg viewBox="0 0 360 140" className="w-full h-auto max-w-xl">
            {heights.map((h, i) => {
              if (h == null) return null;
              const x = 10 + i * 29; const bh = (h / maxH) * 100; const big = bigs[i];
              return (
                <g key={i}>
                  {big != null && <rect x={x} y={110 - (big / maxH) * 100} width={18} height={(big / maxH) * 100} fill="var(--beach-primary,#0369a1)" opacity="0.18" />}
                  <rect x={x} y={110 - bh} width={18} height={bh} fill="var(--beach-primary,#0369a1)" opacity="0.65" />
                  <text x={x + 9} y={124} fontFamily="ui-monospace,monospace" fontSize="8" fill="#94a3b8" textAnchor="middle">{MONTHS[i]}</text>
                </g>
              );
            })}
          </svg>
          <p className="text-[12px] text-volcanic-400 italic mt-2">
            Monthly wave height (significant). Biggest swell: {waves.summary.biggest_month}; flattest: {waves.summary.calmest_month}; typical period {waves.summary.typical_period_s}s.
          </p>
          <div className="mt-5"><Prose text={c.when_to_surf} /></div>
        </Block>
      )}

      {/* The live wave + tide right now (reuses the parent's live instrument) */}
      <Block heading="Right now">
        <LiveInstrument bundle={bundle} />
      </Block>

      {c.crowds_etiquette && <Block heading="Crowds & etiquette"><Prose text={c.crowds_etiquette} /></Block>}
      {c.board_call && (
        <Block heading="What to bring">
          <p className="text-volcanic-700 leading-[1.7] text-[18px]">{c.board_call}</p>
        </Block>
      )}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href={`/beaches/${bundle.composition.slug}`} className="font-mono text-[11px] uppercase tracking-[0.18em] hover:underline" style={{ color: "var(--beach-primary)" }}>
          ← Back to {bundle.composition.beach_name}
        </Link>
      </div>
    </LegendaryShell>
  );
}

// ── TOPIC GUIDE (deep dive) ─────────────────────────────────────────────
// Any authored spoke shaped { title, kicker, intro, sections[], sources[] } under
// showcase.spokes_content[<spoke>]. Huntington's pier page is one instance.
export function PierGuide({ bundle }: { bundle: LegendaryPageBundle }) {
  return <TopicGuide bundle={bundle} spoke="the-pier" />;
}

export function TopicGuide({ bundle, spoke }: { bundle: LegendaryPageBundle; spoke: string }) {
  const c = (bundle.showcase as unknown as { spokes_content?: Record<string, PierContent> }).spokes_content?.[spoke];
  if (!c) return null;
  return (
    <LegendaryShell composition={bundle.composition}>
      <SpokeHeader bundle={bundle} title={c.title} kicker={c.kicker} image={c.hero_image} />
      <div className="mx-auto max-w-3xl px-6 pb-4"><Prose text={c.intro} /></div>
      {(c.sections ?? []).map((s, i) => (
        <Block key={i} heading={s.heading}>{s.image && <Figure image={s.image} />}<Prose text={s.body} /></Block>
      ))}
      {c.sources && c.sources.length > 0 && (
        <Block heading="Sources">
          <ol className="list-decimal pl-5 space-y-1 text-[14px] text-volcanic-500">
            {c.sources.map((s, i) => (
              <li key={i}><a href={s.url} className="underline hover:text-volcanic-800" rel="noopener">{s.label}</a></li>
            ))}
          </ol>
        </Block>
      )}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href={`/beaches/${bundle.composition.slug}`} className="font-mono text-[11px] uppercase tracking-[0.18em] hover:underline" style={{ color: "var(--beach-primary)" }}>
          ← Back to {bundle.composition.beach_name}
        </Link>
      </div>
    </LegendaryShell>
  );
}
