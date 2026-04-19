/**
 * LegendaryBeach — the shared scaffold for Tier 1 beach pages.
 *
 * Renders 15 reusable sections (Hero, Story, Zones, Day, Timeline, Calendar,
 * Water, Versus, Stay, Eat, Planner, Safety, ViewBack, Context, Sources).
 * Each beach page adds 1-2 bespoke signature components via the `signatures`
 * prop; they are spliced into the nav + rendered at their declared anchor.
 *
 * See docs/legendary-beach-playbook.md for editorial process + data schema.
 */

import type { ReactNode } from "react";
import StickyNav, { NavGroup } from "./sticky-nav";
import MonthlyClimateChart from "./monthly-climate-chart";
import PostoMap from "./posto-map";

// ----------------------------------------------------------------------------
// Types (the JSON contract)
// ----------------------------------------------------------------------------

export interface SectionImage {
  url: string;
  thumbnail?: string;
  title: string;
  author?: string;
  license: string;
  width: number;
  height: number;
  role?: string;
  source_url?: string;
}

export interface LegendaryMeta {
  tier: number;
  showcase: boolean;
  images: {
    hero: SectionImage;
    section: Record<string, SectionImage>;
    gallery: SectionImage[];
  };
}

export interface TimelineEvent {
  year: number;
  month: number | null;
  event_type: string;
  title: string;
  description: string;
  wiki_url: string | null;
}

export interface Zone {
  zone_code: string;
  name: string;
  position_along_beach_pct: number;
  character: string;
  best_for: string | null;
  notes: string | null;
  lat: number;
  lng: number;
}

export interface Landmark {
  name: string;
  landmark_type: string;
  year_built: number | null;
  architect_or_designer: string | null;
  description: string;
  wikipedia_url: string | null;
}

export interface RecurringEvent {
  name: string;
  when_text: string;
  month: number | null;
  description: string;
  typical_attendance: number | null;
}

export interface Business {
  name: string;
  category: string;
  description: string;
  address: string | null;
  year_established: number | null;
  external_url: string | null;
}

export interface LegendaryData {
  name: string;
  admin_level_1: string;
  country_code: string;
  climate: {
    air_temp_high: (number | null)[];
    air_temp_low: (number | null)[];
    water_temp: (number | null)[];
    rain_mm: (number | null)[];
    sun_hours: (number | null)[];
    climate_source: string | null;
    ocean_source: string | null;
  };
  tides: { range_spring_m: number; range_neap_m: number; type: string; source: string };
  species: { species_name: string; common_name: string; taxon_group: string; observation_count: number }[];
  showcase: {
    intro_text: string;
    favela_note: string; // renamed per-beach via `honestContextLabel`
    day_in_time: { dawn: string; midday: string; golden: string; night: string };
    timeline: TimelineEvent[];
    zones: Zone[];
    landmarks: Landmark[];
    cultural_refs: {
      ref_type: string;
      title: string;
      creator: string | null;
      year: number | null;
      description: string | null;
      wikipedia_url: string | null;
    }[];
    recurring_events: RecurringEvent[];
    businesses: Business[];
    food_drink: { name: string; description: string; where: string }[];
  };
}

export interface SignatureSection {
  /** Anchor id — must be unique, lowercase, kebab-case. */
  id: string;
  /** Label in the sticky nav. */
  label: string;
  /** Which nav group to drop into. Defaults to "culture". */
  group?: "culture" | "beach" | "plan";
  /** Rendered React content. Component is responsible for its own <WideSection>/<Section> wrapper. */
  component: ReactNode;
  /**
   * Where to splice this section in the shared flow. Values reference the
   * built-in anchor ids below. Default: "after-story" (right after the
   * intro story, before the built-in PostosSection).
   */
  insertAfter?:
    | "story"
    | "postos"
    | "day"
    | "history"
    | "calendar"
    | "water"
    | "versus"
    | "stay"
    | "eat"
    | "planner"
    | "safety"
    | "viewback"
    | "context";
}

export interface VersusCard {
  /** Short tag like "Copacabana" */
  tag: string;
  /** Color pill for the eyebrow text */
  tagTone?: "ocean" | "sand" | "volcanic" | "coral";
  /** Headline under the tag */
  headline: string;
  /** Term/definition list */
  rows: { label: string; value: string }[];
}

export interface LegendaryBeachProps {
  data: LegendaryData;
  meta: LegendaryMeta;
  /** Bespoke sections spliced into the flow + nav. */
  signatures?: SignatureSection[];
  /** Subtitle under the big hero title. */
  heroTagline?: string;
  /** Pull quote after the Story section. Optional. */
  storyPullQuote?: { text: string; attribution?: string };
  /** Rival beaches for the Versus section. Hidden if empty. */
  versusCompare?: VersusCard[];
  /** Override the honest-context label. Default: "The Favela Above" for Copa-style cities. */
  honestContextTitle?: string;
  honestContextEyebrow?: string;
  honestContextNavLabel?: string;
  /** Stay section: hotel tiers per zone. */
  stayZones?: {
    zone: string;
    flavor: string;
    tiers: { tier: "Luxury" | "Mid" | "Budget"; examples: string }[];
  }[];
  /** Safety copy — what locals actually do + in-the-water. */
  safetyCopy?: { whatLocalsDo: string; inTheWater: string };
  /** Planner rows — airports, money, visa, duration. */
  plannerRows?: { heading: string; items: [string, string][] }[];
  /** Water section — bespoke marine story + at-a-glance dl. */
  waterCopy?: { prose: string; atAGlance: { label: string; value: string }[] };
  /** View-back section captions — one per image role. */
  viewBackImages?: { role: string; caption: string }[];
  /** Sources footer — allow per-beach voice override. */
  sourcesVoice?: string;
  /** Skip sections entirely (defaults render all). */
  hideSections?: Array<"versus" | "viewback" | "context">;
  /** Quick decision panel — the three two-minute answers. */
  quickDecisions?: {
    when: { prose: string; linkText: string; linkTo: string };
    where: { prose: string; linkText: string; linkTo: string };
    howLong: { prose: string; linkText: string; linkTo: string };
  };
  /** Timeline event-year → image key in meta.images.section. */
  timelineImagesByYear?: Record<number, string>;
}

// ----------------------------------------------------------------------------
// Typography primitives
// ----------------------------------------------------------------------------

export function Section({
  id,
  children,
  className = "",
  dark = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section id={id} className={`${dark ? "bg-volcanic-900 text-volcanic-50" : ""} ${className}`}>
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">{children}</div>
    </section>
  );
}

export function WideSection({
  id,
  children,
  className = "",
  dark = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section id={id} className={`${dark ? "bg-volcanic-900 text-volcanic-50" : ""} ${className}`}>
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  kicker,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  kicker?: string;
  dark?: boolean;
}) {
  return (
    <header className="mb-12 max-w-3xl">
      <div
        className={`text-xs font-mono uppercase tracking-[0.3em] mb-4 ${dark ? "text-ocean-300" : "text-ocean-700"}`}
      >
        {eyebrow}
      </div>
      <h2
        className={`font-display text-4xl sm:text-5xl leading-[1.05] ${dark ? "text-white" : "text-volcanic-900"}`}
      >
        {title}
      </h2>
      {kicker && (
        <p className={`mt-5 text-lg italic ${dark ? "text-volcanic-300" : "text-volcanic-500"}`}>
          {kicker}
        </p>
      )}
    </header>
  );
}

export function Prose({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      className={`prose prose-lg max-w-none
      ${dark ? "prose-invert" : ""}
      prose-p:leading-[1.75] prose-p:text-[17px]
      prose-p:my-5
      ${dark ? "prose-p:text-volcanic-200" : "prose-p:text-volcanic-700"}
      prose-a:text-ocean-600 prose-a:no-underline hover:prose-a:underline`}
    >
      {children}
    </div>
  );
}

export function PullQuote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <aside className="my-10 border-l-4 border-ocean-500 pl-6">
      <p className="font-display text-2xl sm:text-3xl leading-[1.2] text-volcanic-900">"{children}"</p>
      {attribution && (
        <p className="mt-3 text-sm text-volcanic-500 uppercase tracking-widest">— {attribution}</p>
      )}
    </aside>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <p className="text-[11px] uppercase tracking-widest text-volcanic-400 mt-2">{children}</p>;
}

function formatAttendance(n: number | null): string {
  if (n == null) return "";
  if (n >= 1_000_000) return `~${(n / 1_000_000).toFixed(1)}M attendees`;
  if (n >= 100_000) return `hundreds of thousands`;
  if (n >= 10_000) return `tens of thousands`;
  return `thousands`;
}

function renderWithBold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i}>{m[1]}</strong>;
    return <span key={i}>{part}</span>;
  });
}

// ----------------------------------------------------------------------------
// Hero + quick decision
// ----------------------------------------------------------------------------

function QuickDecisionPanel({
  quickDecisions,
}: {
  quickDecisions?: LegendaryBeachProps["quickDecisions"];
}) {
  if (!quickDecisions) return null;
  const { when, where, howLong } = quickDecisions;
  return (
    <section className="bg-sand-50 border-b border-volcanic-200">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ocean-700 mb-5">
          If you have two minutes
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-display text-lg text-volcanic-900 mb-1">When should I go?</h3>
            <p className="text-sm text-volcanic-700 leading-relaxed">{when.prose}</p>
            <a
              href={when.linkTo}
              className="text-xs text-ocean-600 hover:text-ocean-800 mt-2 inline-block font-medium"
            >
              {when.linkText} →
            </a>
          </div>
          <div>
            <h3 className="font-display text-lg text-volcanic-900 mb-1">Where on the arc?</h3>
            <p className="text-sm text-volcanic-700 leading-relaxed">{where.prose}</p>
            <a
              href={where.linkTo}
              className="text-xs text-ocean-600 hover:text-ocean-800 mt-2 inline-block font-medium"
            >
              {where.linkText} →
            </a>
          </div>
          <div>
            <h3 className="font-display text-lg text-volcanic-900 mb-1">How much time?</h3>
            <p className="text-sm text-volcanic-700 leading-relaxed">{howLong.prose}</p>
            <a
              href={howLong.linkTo}
              className="text-xs text-ocean-600 hover:text-ocean-800 mt-2 inline-block font-medium"
            >
              {howLong.linkText} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Hero({
  image,
  name,
  location,
  tagline,
}: {
  image: SectionImage;
  name: string;
  location: string;
  tagline?: string;
}) {
  return (
    <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden bg-black">
      <img
        src={image.thumbnail || image.url}
        alt={image.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/85" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-white/75 mb-5">
            {location} · A single page, deeply
          </p>
          <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl text-white leading-[0.9] -tracking-[0.02em]">
            {name}
          </h1>
          {tagline && (
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/85 font-serif italic">
              {tagline}
            </p>
          )}
        </div>
      </div>
      <div className="absolute bottom-3 right-4 text-[10px] text-white/50 max-w-[50%] text-right">
        {image.title} · {image.author || image.license}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Shared sections
// ----------------------------------------------------------------------------

function StorySection({
  beachName,
  intro,
  pullQuote,
}: {
  beachName: string;
  intro: string;
  pullQuote?: { text: string; attribution?: string };
}) {
  const paragraphs = intro.split("\n\n").filter(Boolean);
  return (
    <Section id="story">
      <SectionHeader
        eyebrow="01 · The Story"
        title={beachName}
        kicker="A single page — written so a local nods."
      />
      <Prose>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "first-letter:font-display first-letter:text-7xl first-letter:float-left first-letter:leading-[0.85] first-letter:pr-3 first-letter:pt-1 first-letter:text-ocean-700"
                : ""
            }
          >
            {p}
          </p>
        ))}
      </Prose>
      {pullQuote && <PullQuote attribution={pullQuote.attribution}>{pullQuote.text}</PullQuote>}
    </Section>
  );
}

function PostosSection({ zones, sign }: { zones: Zone[]; sign?: SectionImage }) {
  if (!zones || zones.length === 0) return null;
  return (
    <WideSection id="postos">
      <SectionHeader
        eyebrow="· The Zones"
        title={`${zones.length} stations along the arc`}
        kicker="Locals sort themselves by zone. The distinctions are real, and useful."
      />
      <PostoMap zones={zones} />
      {sign && (
        <figure className="mt-10 max-w-md">
          <img src={sign.thumbnail || sign.url} alt={sign.title} className="rounded-lg w-full h-auto" />
          <Caption>
            {sign.title} · {sign.license}
          </Caption>
        </figure>
      )}
    </WideSection>
  );
}

function DaySection({
  day,
}: {
  day: { dawn: string; midday: string; golden: string; night: string };
}) {
  const vignettes = [
    {
      key: "dawn",
      label: "Dawn",
      time: "05:30 – 07:00",
      text: day.dawn,
      tone: "bg-gradient-to-br from-ocean-50 to-ocean-100 text-volcanic-800",
    },
    {
      key: "midday",
      label: "Midday",
      time: "11:00 – 15:00",
      text: day.midday,
      tone: "bg-gradient-to-br from-sand-50 to-sand-200 text-volcanic-900",
    },
    {
      key: "golden",
      label: "Golden Hour",
      time: "17:00 – 19:00",
      text: day.golden,
      tone: "bg-gradient-to-br from-amber-200 via-orange-200 to-coral-200 text-volcanic-900",
    },
    {
      key: "night",
      label: "Night",
      time: "20:00 – late",
      text: day.night,
      tone: "bg-gradient-to-br from-volcanic-900 to-volcanic-950 text-volcanic-100",
    },
  ];
  return (
    <Section id="day">
      <SectionHeader
        eyebrow="· A Day Here"
        title="The rhythm of the place"
        kicker="Show up to the right part of the day and it's another thing entirely."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {vignettes.map((v) => (
          <div key={v.key} className={`rounded-2xl p-7 ${v.tone}`}>
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-display text-2xl">{v.label}</h3>
              <span className="text-xs font-mono opacity-70">{v.time}</span>
            </div>
            <p className="leading-[1.65] text-[15px]">{v.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function TimelineSection({
  events,
  imageByYear,
}: {
  events: TimelineEvent[];
  imageByYear?: Record<number, SectionImage>;
}) {
  const icon: Record<string, string> = {
    cultural: "♪",
    built: "▨",
    sport: "◈",
    political: "◎",
    infrastructure: "▣",
    design: "◇",
    event: "✧",
  };
  return (
    <WideSection id="history">
      <SectionHeader
        eyebrow="· History"
        title="Arc of the century"
        kicker="Turning points, in order."
      />
      <div className="relative">
        <div className="absolute left-4 sm:left-[96px] top-2 bottom-2 w-px bg-volcanic-200" />
        <ol className="space-y-10">
          {events.map((ev, i) => {
            const photo = imageByYear?.[ev.year] ?? null;
            return (
              <li
                key={i}
                className="relative grid grid-cols-[auto_1fr] sm:grid-cols-[88px_1fr] gap-5 sm:gap-8"
              >
                <div className="relative">
                  <span className="hidden sm:block font-mono text-sm text-volcanic-500 mt-1">
                    {ev.year}
                  </span>
                  <span className="absolute top-1.5 -right-[22px] sm:right-auto sm:left-[80px] w-4 h-4 rounded-full bg-white border-2 border-ocean-600 z-10" />
                </div>
                <div className="pl-6 sm:pl-4">
                  <div className="flex items-center gap-2 mb-1 sm:hidden">
                    <span className="font-mono text-xs text-volcanic-500">{ev.year}</span>
                    <span className="text-volcanic-400 text-lg leading-none">
                      {icon[ev.event_type] || "•"}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-volcanic-900 mb-1">
                    <span className="hidden sm:inline-block mr-2 text-volcanic-400">
                      {icon[ev.event_type] || "•"}
                    </span>
                    {ev.title}
                  </h3>
                  <p className="text-volcanic-600 leading-relaxed mb-2">{ev.description}</p>
                  {photo && (
                    <div className="mt-3 overflow-hidden rounded-lg max-w-lg">
                      <img
                        src={photo.thumbnail || photo.url}
                        alt={photo.title}
                        className="w-full h-auto"
                      />
                      <Caption>
                        {photo.title} · {photo.license}
                      </Caption>
                    </div>
                  )}
                  {ev.wiki_url && (
                    <a
                      href={ev.wiki_url}
                      target="_blank"
                      rel="noopener"
                      className="text-xs text-ocean-600 hover:text-ocean-800 mt-2 inline-block"
                    >
                      Wikipedia →
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </WideSection>
  );
}

function CalendarSection({
  climate,
  events,
}: {
  climate: LegendaryData["climate"];
  events: RecurringEvent[];
}) {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const bestIdx = climate.air_temp_high
    .map((hi, i) => ({
      i,
      score: hi == null ? -1 : 100 - Math.abs(hi - 26) * 3 - (climate.rain_mm[i] || 999) * 0.4,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .sort((a, b) => a.i - b.i)
    .map((x) => MONTHS[x.i]);

  return (
    <WideSection id="calendar">
      <SectionHeader
        eyebrow="· The Calendar"
        title="A year in local time"
        kicker="Not a generic 'best time to visit' — what actually happens across the year."
      />
      <div className="grid gap-10 lg:grid-cols-3 mb-12">
        <div className="lg:col-span-2">
          <MonthlyClimateChart
            airHigh={climate.air_temp_high}
            airLow={climate.air_temp_low}
            waterTemp={climate.water_temp}
            rainMm={climate.rain_mm}
          />
        </div>
        <aside className="space-y-5">
          <div className="rounded-xl border border-ocean-100 bg-ocean-50/60 p-5">
            <div className="text-[10px] font-mono uppercase tracking-widest text-ocean-700 mb-1">
              Best months for a beach day
            </div>
            <div className="font-display text-xl text-volcanic-900">{bestIdx.join(" · ")}</div>
          </div>
          <a
            href="#water"
            className="block rounded-xl border border-volcanic-100 p-5 hover:border-ocean-300 transition-colors"
          >
            <div className="text-[10px] font-mono uppercase tracking-widest text-volcanic-500 mb-1">
              For the ocean itself
            </div>
            <div className="font-display text-lg text-volcanic-900">Surf, upwelling, water quality</div>
            <p className="mt-2 text-sm text-ocean-600">Visit The Water →</p>
          </a>
        </aside>
      </div>
      <div className="space-y-6 max-w-3xl">
        {events.map((e) => (
          <div key={e.name} className="border-l-4 border-coral-300 pl-5">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h3 className="font-display text-xl text-volcanic-900">{e.name}</h3>
              <span className="text-xs font-mono text-volcanic-500 uppercase tracking-wider">
                {e.when_text}
              </span>
              {e.typical_attendance && formatAttendance(e.typical_attendance) && (
                <span className="text-xs font-mono text-coral-600">
                  {formatAttendance(e.typical_attendance)}
                </span>
              )}
            </div>
            <p className="mt-2 text-volcanic-700 leading-relaxed">{e.description}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-xs italic text-volcanic-400">
        Monthly climate from {climate.climate_source}. Wave data from {climate.ocean_source}.
      </p>
    </WideSection>
  );
}

function WaterSection({ copy }: { copy: LegendaryBeachProps["waterCopy"] }) {
  if (!copy) return null;
  const paragraphs = copy.prose.split("\n\n").filter(Boolean);
  return (
    <WideSection id="water" className="bg-ocean-50/40">
      <SectionHeader
        eyebrow="· The Water"
        title="What the ocean does here"
        kicker="Upwelling, surf season, water quality — what matters for a visitor paying attention."
      />
      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] items-start">
        <Prose>
          {paragraphs.map((p, i) => (
            <p key={i}>{renderWithBold(p)}</p>
          ))}
        </Prose>
        <div className="rounded-xl border border-volcanic-100 bg-white p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-ocean-700 mb-4">
            At a glance
          </div>
          <dl className="space-y-3 text-sm">
            {copy.atAGlance.map((r, i) => (
              <div
                key={i}
                className={`flex justify-between ${i < copy.atAGlance.length - 1 ? "border-b border-volcanic-100 pb-2" : ""}`}
              >
                <dt className="text-volcanic-600">{r.label}</dt>
                <dd className="font-mono text-volcanic-900">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </WideSection>
  );
}

function VersusSection({ cards }: { cards: VersusCard[] }) {
  if (!cards || cards.length === 0) return null;
  const tones: Record<string, string> = {
    ocean: "text-ocean-700",
    sand: "text-sand-700",
    volcanic: "text-volcanic-600",
    coral: "text-coral-700",
  };
  return (
    <WideSection id="versus" className="bg-volcanic-50">
      <SectionHeader
        eyebrow="· The Rivalry"
        title="How it compares"
        kicker="Same coast, different beaches. The distinctions are real."
      />
      <div className={`grid gap-6 md:grid-cols-${Math.min(cards.length, 3)}`}>
        {cards.map((c) => (
          <article key={c.tag} className="rounded-2xl bg-white p-7 border border-volcanic-100">
            <div
              className={`text-xs font-mono uppercase tracking-widest mb-2 ${tones[c.tagTone || "ocean"]}`}
            >
              {c.tag}
            </div>
            <h3 className="font-display text-2xl mb-4">{c.headline}</h3>
            <dl className="space-y-3 text-[15px] text-volcanic-700">
              {c.rows.map((r) => (
                <div key={r.label}>
                  <dt className="font-semibold text-volcanic-900 inline">{r.label}:</dt>{" "}
                  <dd className="inline">{r.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </WideSection>
  );
}

function StaySection({ zones }: { zones: NonNullable<LegendaryBeachProps["stayZones"]> }) {
  return (
    <WideSection id="stay">
      <SectionHeader
        eyebrow="· Where to Stay"
        title="The location decision"
        kicker="Which end of the beach drives 70% of your stay."
      />
      <div className="relative rounded-2xl bg-gradient-to-b from-ocean-50 to-sand-50 p-6 sm:p-10 overflow-hidden">
        <div className={`grid gap-6 md:grid-cols-${Math.min(zones.length, 3)}`}>
          {zones.map((z) => (
            <div key={z.zone}>
              <h3 className="font-display text-xl text-volcanic-900 mb-2">{z.zone}</h3>
              <p className="text-sm text-volcanic-600 mb-4 leading-relaxed">{z.flavor}</p>
              <dl className="space-y-2 text-xs">
                {z.tiers.map((t) => (
                  <div key={t.tier}>
                    <dt className="font-mono uppercase tracking-widest text-volcanic-500">{t.tier}</dt>
                    <dd className="text-volcanic-700">{t.examples}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 text-xs italic text-volcanic-400 max-w-2xl">
        Hotel names are widely-documented representative options at each tier, not ads.
      </p>
    </WideSection>
  );
}

function EatSection({
  food,
  businesses,
}: {
  food: { name: string; description: string; where: string }[];
  businesses: Business[];
}) {
  const named = businesses.filter((b) => b.category === "restaurant" || b.category === "museum");
  return (
    <WideSection id="eat">
      <SectionHeader
        eyebrow="· Eat & Drink"
        title="What to order, where to sit"
        kicker="At the kiosks, at the bar, at the table. All verified."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {food.map((f) => (
          <div key={f.name} className="rounded-xl border border-sand-200 bg-sand-50 p-5">
            <h4 className="font-display text-lg text-volcanic-900">{f.name}</h4>
            <p className="mt-2 text-sm text-volcanic-700 leading-relaxed">{f.description}</p>
            <p className="mt-3 text-[11px] font-mono uppercase tracking-wider text-volcanic-500">
              {f.where}
            </p>
          </div>
        ))}
      </div>
      {named.length > 0 && (
        <>
          <h3 className="font-display text-2xl mb-6 text-volcanic-800">Named places</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {named.map((r) => {
              const isWikipedia = r.external_url?.includes("wikipedia.org");
              const validUrl = r.external_url && !isWikipedia ? r.external_url : null;
              return (
                <div key={r.name} className="border-l-2 border-ocean-400 pl-5">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h4 className="font-display text-xl text-volcanic-900">{r.name}</h4>
                    {r.year_established && (
                      <span className="text-xs font-mono text-volcanic-400">
                        est. {r.year_established}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[15px] text-volcanic-700 leading-relaxed">{r.description}</p>
                  {r.address && <p className="mt-2 text-xs text-volcanic-500 italic">{r.address}</p>}
                  {validUrl && (
                    <a
                      href={validUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-xs text-ocean-600 hover:text-ocean-800 mt-1 inline-block"
                    >
                      Website →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </WideSection>
  );
}

function PlannerSection({
  rows,
}: {
  rows: NonNullable<LegendaryBeachProps["plannerRows"]>;
}) {
  return (
    <WideSection id="planner">
      <SectionHeader
        eyebrow="· Before You Go"
        title="The practical stack"
        kicker="Airports, money, language, visa, itineraries. The things a generic AI gets wrong."
      />
      <div className="grid gap-8 md:grid-cols-2">
        {rows.map((r) => (
          <div key={r.heading} className="rounded-xl border border-volcanic-100 bg-white p-6">
            <h3 className="font-display text-xl text-volcanic-900 mb-4">{r.heading}</h3>
            <dl className="space-y-3">
              {r.items.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold text-volcanic-800 uppercase tracking-wider">
                    {k}
                  </dt>
                  <dd className="mt-1 text-sm text-volcanic-700 leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </WideSection>
  );
}

function SafetySection({ copy }: { copy: LegendaryBeachProps["safetyCopy"] }) {
  if (!copy) return null;
  const locals = copy.whatLocalsDo.split("\n\n").filter(Boolean);
  const water = copy.inTheWater.split("\n\n").filter(Boolean);
  return (
    <WideSection id="safety">
      <SectionHeader
        eyebrow="· Safety"
        title="What the caveats actually mean"
        kicker="Real risks, lived reality."
      />
      <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
        <div>
          <h3 className="font-display text-xl text-volcanic-900 mb-3">What locals actually do</h3>
          <Prose>
            {locals.map((p, i) => (
              <p key={i}>{renderWithBold(p)}</p>
            ))}
          </Prose>
        </div>
        <div>
          <h3 className="font-display text-xl text-volcanic-900 mb-3">In the water</h3>
          <Prose>
            {water.map((p, i) => (
              <p key={i}>{renderWithBold(p)}</p>
            ))}
          </Prose>
        </div>
      </div>
    </WideSection>
  );
}

function ViewBackSection({
  images,
  captions,
}: {
  images: Record<string, SectionImage>;
  captions: NonNullable<LegendaryBeachProps["viewBackImages"]>;
}) {
  if (!captions || captions.length === 0) return null;
  return (
    <WideSection id="viewback" className="bg-volcanic-900 text-volcanic-50" dark>
      <SectionHeader
        eyebrow="· The View Back"
        title="The beach as seen"
        kicker="A few specific vantage points define how this beach is photographed."
        dark
      />
      <div className="space-y-14">
        {captions.map(({ role, caption }) => {
          const img = images[role];
          if (!img) return null;
          return (
            <figure key={role}>
              <img src={img.url} alt={img.title} className="w-full h-auto" />
              <figcaption className="mt-3 text-xs text-volcanic-400 font-mono italic max-w-2xl">
                {caption} {img.author && `${img.author}. `}
                {img.license}.
              </figcaption>
            </figure>
          );
        })}
      </div>
    </WideSection>
  );
}

function ContextSection({
  note,
  title,
  eyebrow,
}: {
  note: string;
  title: string;
  eyebrow: string;
}) {
  if (!note || note.trim().length === 0) return null;
  const paragraphs = note.split("\n\n").filter(Boolean);
  return (
    <Section id="context">
      <SectionHeader eyebrow={eyebrow} title={title} />
      <Prose>
        {paragraphs.map((p, i) => (
          <p key={i}>{renderWithBold(p)}</p>
        ))}
      </Prose>
    </Section>
  );
}

function SourcesFooter({
  tidesSource,
  sourcesVoice,
}: {
  tidesSource: string;
  sourcesVoice?: string;
}) {
  return (
    <section id="sources" className="bg-volcanic-50 border-t border-volcanic-200 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-ocean-700 mb-4">
          · Data & Provenance
        </div>
        <h2 className="font-display text-3xl text-volcanic-900 mb-10">Where this page comes from</h2>
        <div className="grid gap-6 md:grid-cols-2 text-sm text-volcanic-700 leading-relaxed">
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">Geography, facilities</h4>
            <p>OpenStreetMap (ODbL) for geometry and facility tags within 500 m of the beach centroid. GeoNames for city/airport distances.</p>
          </div>
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">Climate & ocean</h4>
            <p>WorldClim v2.1 monthly normals and Open-Meteo Marine API. UV index excluded pending forecast-API follow-up.</p>
          </div>
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">Tides</h4>
            <p>{tidesSource}. Ranges are typical spring/neap; local conditions vary.</p>
          </div>
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">Species</h4>
            <p>iNaturalist observations, radius-filtered.</p>
          </div>
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">History & culture</h4>
            <p>
              Every factual claim on this page is linked to its source. Wikipedia articles cited inline per event. When we could not verify a specific claim, we said so.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">Photography</h4>
            <p>Wikimedia Commons, each image carries its own license. Attribution visible on every image.</p>
          </div>
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">Named businesses</h4>
            <p>Each restaurant, hotel, museum verified against its own website or Wikipedia entry.</p>
          </div>
          {sourcesVoice && (
            <div>
              <h4 className="font-display text-base text-volcanic-900 mb-1">Voice</h4>
              <p>{sourcesVoice}</p>
            </div>
          )}
        </div>
        <p className="mt-10 text-xs text-volcanic-500">Last updated {new Date().toISOString().slice(0, 10)}.</p>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Nav assembly
// ----------------------------------------------------------------------------

function buildNavGroups(
  data: LegendaryData,
  signatures: SignatureSection[],
  opts: { hideSections: Set<string>; honestContextNavLabel?: string }
): NavGroup[] {
  const cultureGroup: [string, string][] = [["story", "Story"]];
  const beachGroup: [string, string][] = [];
  const planGroup: [string, string][] = [];

  // Splice signatures where they belong
  for (const sig of signatures) {
    const label = sig.label;
    const group = sig.group ?? "culture";
    if (group === "culture") cultureGroup.push([sig.id, label]);
    else if (group === "beach") beachGroup.push([sig.id, label]);
    else planGroup.push([sig.id, label]);
  }

  if (data.showcase.zones.length > 0) cultureGroup.push(["postos", "Zones"]);
  cultureGroup.push(["day", "A Day"]);
  if (data.showcase.timeline.length > 0) cultureGroup.push(["history", "History"]);
  if (data.showcase.favela_note?.trim() && !opts.hideSections.has("context")) {
    cultureGroup.push(["context", opts.honestContextNavLabel ?? "Context"]);
  }

  beachGroup.unshift(["water", "The Water"]);
  beachGroup.push(["calendar", "Calendar"]);
  if (!opts.hideSections.has("versus")) beachGroup.push(["versus", "Compare"]);
  if (!opts.hideSections.has("viewback")) beachGroup.push(["viewback", "View Back"]);

  planGroup.unshift(["stay", "Stay"]);
  planGroup.push(["eat", "Eat & Drink"]);
  planGroup.push(["planner", "Before You Go"]);
  planGroup.push(["safety", "Safety"]);

  return [
    { label: "Culture & Story", items: cultureGroup },
    { label: "The Beach Itself", items: beachGroup },
    { label: "Plan Your Visit", items: planGroup },
    { label: "Meta", items: [["sources", "Sources"]] },
  ];
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

export default function LegendaryBeach(props: LegendaryBeachProps) {
  const {
    data,
    meta,
    signatures = [],
    heroTagline,
    storyPullQuote,
    versusCompare,
    honestContextTitle = "Honest Context",
    honestContextEyebrow = "· Honest Context",
    stayZones,
    safetyCopy,
    plannerRows,
    waterCopy,
    viewBackImages,
    sourcesVoice,
    hideSections = [],
    quickDecisions,
  } = props;

  const hide = new Set(hideSections);
  const location = `${data.admin_level_1}, ${data.country_code}`;

  const navGroups = buildNavGroups(data, signatures, {
    hideSections: hide,
    honestContextNavLabel: props.honestContextNavLabel,
  });

  // Signatures spliced by insertAfter anchor
  const sigsAfter = (anchor: string) =>
    signatures.filter((s) => (s.insertAfter ?? "story") === anchor);

  return (
    <div className="bg-white">
      <Hero image={meta.images.hero} name={data.name} location={location} tagline={heroTagline} />
      <QuickDecisionPanel quickDecisions={quickDecisions} />
      <StickyNav groups={navGroups} />

      <StorySection beachName={data.name} intro={data.showcase.intro_text} pullQuote={storyPullQuote} />
      {sigsAfter("story").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      <PostosSection
        zones={data.showcase.zones}
        sign={meta.images.section.posto_5_sign || meta.images.section.zone_sign}
      />
      {sigsAfter("postos").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      <DaySection day={data.showcase.day_in_time} />
      {sigsAfter("day").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      <TimelineSection
        events={data.showcase.timeline}
        imageByYear={
          props.timelineImagesByYear
            ? Object.fromEntries(
                Object.entries(props.timelineImagesByYear)
                  .map(([year, role]) => [Number(year), meta.images.section[role]])
                  .filter(([, img]) => !!img)
              )
            : undefined
        }
      />
      {sigsAfter("history").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      <CalendarSection climate={data.climate} events={data.showcase.recurring_events} />
      {sigsAfter("calendar").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      <WaterSection copy={waterCopy} />
      {sigsAfter("water").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      {!hide.has("versus") && versusCompare && <VersusSection cards={versusCompare} />}
      {sigsAfter("versus").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      {stayZones && <StaySection zones={stayZones} />}
      {sigsAfter("stay").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      <EatSection food={data.showcase.food_drink} businesses={data.showcase.businesses} />
      {sigsAfter("eat").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      {plannerRows && <PlannerSection rows={plannerRows} />}
      {sigsAfter("planner").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      <SafetySection copy={safetyCopy} />
      {sigsAfter("safety").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      {!hide.has("viewback") && viewBackImages && (
        <ViewBackSection images={meta.images.section} captions={viewBackImages} />
      )}
      {sigsAfter("viewback").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      {!hide.has("context") && (
        <ContextSection
          note={data.showcase.favela_note}
          title={honestContextTitle}
          eyebrow={honestContextEyebrow}
        />
      )}
      {sigsAfter("context").map((s) => (
        <div key={s.id}>{s.component}</div>
      ))}

      <SourcesFooter tidesSource={data.tides.source} sourcesVoice={sourcesVoice} />
    </div>
  );
}
