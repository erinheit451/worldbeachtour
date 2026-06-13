/**
 * <LegendaryBeachV2> — the Tier 1 / Tier 2 page scaffold.
 *
 * Composes primitives + section components per the beach's composition.json.
 *
 * First-draft scope: renders hero, quick-facts, story (with spike-statement
 * pull-quote), spike deep-explainer (first-draft prose-only, no marginalia
 * yet), and sources. Other sections from composition.sections render as
 * "Section pending" placeholders until each component is built.
 *
 * See docs/legendary/components.md + spec-v1.2.md §8 build order.
 */

import type { LegendaryPageBundle, SectionImage } from "./types";
import LegendaryShell from "./shell";
import StickyNavV2, { type NavGroup } from "./sticky-nav";
import Hero from "./sections/hero";
import QuickFactsStrip from "./sections/quick-facts";
import Story from "./sections/story";
import SpikeDeepExplainer from "./sections/spike-deep-explainer";
import Sources from "./sections/sources";
import {
  TimelineSection,
  PlaceAnatomySection,
  DayInLifeSection,
  CultureSection,
  HonestReckoningSection,
  PlanStackSection,
  ComparisonSection,
  SeaSurfSection,
  ThingsToKnowSection,
  SpikeSection,
  BibliographySection,
  GallerySection,
} from "./sections/standard-sections";
import { LiveInstrument } from "./live";
import LensReorder from "./lens-reorder";
import SectionDivider from "./primitives/section-divider";
import Link from "next/link";

interface LegendaryBeachV2Props {
  bundle: LegendaryPageBundle;
}

export default function LegendaryBeachV2({ bundle }: LegendaryBeachV2Props) {
  const { composition, meta, showcase, data, doneness } = bundle;
  const location = [data.admin_level_1, data.country_code].filter(Boolean).join(", ");

  // Build section nav groups
  const navGroups = buildNavGroups(composition.sections);

  // Collect quick facts from the data bundle
  const quickFacts = buildQuickFacts(bundle);

  // Gallery pool — distributed as section lead images so the page isn't a
  // wall of text. Falls back gracefully when a beach has few photos.
  const galleryPool = meta.images?.gallery ?? [];
  const lead = (i: number) => galleryPool.length ? galleryPool[i % galleryPool.length] : undefined;

  // Image resolution helpers — defensive. meta.images.section may be undefined
  // (e.g. Glass Beach Tier 2 meta hasn't declared section images).
  const section = meta.images?.section ?? {};
  const imageByRole = (role: string): SectionImage | undefined => section[role];
  const firstAvailable = (...roles: string[]): SectionImage | undefined =>
    roles.map(imageByRole).find((i) => i != null);

  const primaryHero = meta.images.hero;
  const secondaryHero =
    composition.levers.hero_type === "LAYERED"
      ? firstAvailable(
          "secondary_hero",
          "lighthouse_with_wave",
          "mosaic",
          "palace",
          "palace_pier"
        )
      : undefined;

  return (
    <LegendaryShell composition={composition}>
      <Hero
        beachName={composition.beach_name}
        location={location}
        tagline={composition.spike_statement ?? composition.subtitle}
        heroType={composition.levers.hero_type}
        primary={primaryHero}
        secondary={secondaryHero}
        version={doneness?.final_version ?? composition.version}
        tier={composition.tier}
      />

      <QuickFactsStrip facts={quickFacts} tier={composition.tier} />

      <StickyNavV2 groups={navGroups} />

      {(() => {
        const renderSection = (sectionId: string): React.ReactNode => {
        switch (sectionId) {
          case "hero":
          case "quick_facts":
            return null; // already rendered above
          case "story":
            return (
              <Story
                key={sectionId}
                text={showcase.intro_text ?? ""}
                pullQuote={
                  composition.spike_statement
                    ? { text: composition.spike_statement }
                    : undefined
                }
                marginNotes={(showcase as unknown as { margin_notes?: { audience: string; anchor_para_index: number; text: string }[] }).margin_notes}
                tier={composition.tier}
              />
            );
          case "spike_deep_explainer":
          case "feature_deep_explainer":
            return <SpikeSection key={sectionId} bundle={bundle} />;
          case "live_now":
            return <LiveInstrument key={sectionId} bundle={bundle} />;
          case "spokes":
            return <SpokesSection key={sectionId} bundle={bundle} />;
          case "timeline":
            return <TimelineSection key={sectionId} bundle={bundle} lead={lead(1)} />;
          case "place_anatomy":
            return <PlaceAnatomySection key={sectionId} bundle={bundle} lead={lead(2)} />;
          case "day_in_life":
            return <DayInLifeSection key={sectionId} bundle={bundle} />;
          case "culture":
            return <CultureSection key={sectionId} bundle={bundle} lead={lead(3)} />;
          case "honest_reckoning":
            return <HonestReckoningSection key={sectionId} bundle={bundle} />;
          case "comparison":
            return <ComparisonSection key={sectionId} bundle={bundle} />;
          case "sea_surf":
            return <SeaSurfSection key={sectionId} bundle={bundle} lead={lead(4)} />;
          case "things_to_know":
            return <ThingsToKnowSection key={sectionId} bundle={bundle} />;
          case "plan_stack":
            return <PlanStackSection key={sectionId} bundle={bundle} />;
          case "gallery":
            return <GallerySection key={sectionId} bundle={bundle} />;
          case "sources":
            return (
              <div key={sectionId}>
                <BibliographySection bundle={bundle} />
                <Sources
                  composition={composition}
                  tideSource={data.tides?.source}
                  climateSource={data.climate?.climate_source ?? undefined}
                  doneness={doneness}
                />
              </div>
            );
          default:
            return <PendingSection id={sectionId} />;
        }
        };
        const bodyIds = composition.sections.filter((id) => id !== "hero" && id !== "quick_facts");
        const nodes = bodyIds.map((id) => ({ id, node: renderSection(id) }));
        const PIN_TOP = new Set(["live_now"]);
        const PIN_BOTTOM = new Set(["sources"]);
        const adaptive = !!(composition as unknown as { adaptive?: boolean }).adaptive;
        const top = nodes.filter((n) => PIN_TOP.has(n.id));
        const bottom = nodes.filter((n) => PIN_BOTTOM.has(n.id));
        const body = nodes.filter((n) => !PIN_TOP.has(n.id) && !PIN_BOTTOM.has(n.id));
        return (
          <>
            {top.map((n) => <div key={n.id}>{n.node}</div>)}
            {adaptive
              ? <LensReorder items={body} />
              : body.map((n) => <div key={n.id}>{n.node}</div>)}
            {bottom.map((n) => <div key={n.id}>{n.node}</div>)}
          </>
        );
      })()}
    </LegendaryShell>
  );
}

// ----------------------------------------------------------------------------
// Quick-facts assembly — derives from composition.tier + data
// ----------------------------------------------------------------------------
function buildQuickFacts(bundle: LegendaryPageBundle): Array<{ label: string; value: string }> {
  const { composition, data } = bundle;
  const facts: Array<{ label: string; value: string }> = [];

  if (data.beach_length_m) {
    const km = data.beach_length_m >= 1000
      ? `${(data.beach_length_m / 1000).toFixed(1)} km`
      : `${Math.round(data.beach_length_m)} m`;
    facts.push({ label: "Length", value: km });
  }
  if (data.substrate_type && data.substrate_type !== "unknown") {
    facts.push({ label: "Substrate", value: data.substrate_type });
  }
  if (data.tides?.range_spring_m) {
    facts.push({
      label: "Spring tide",
      value: `${data.tides.range_spring_m.toFixed(2)} m`,
    });
  }
  if (data.climate?.water_temp) {
    const wt = data.climate.water_temp.filter((v): v is number => v != null);
    if (wt.length > 0) {
      facts.push({
        label: "Water temp",
        value: `${Math.min(...wt).toFixed(0)}–${Math.max(...wt).toFixed(0)}°C`,
      });
    }
  }
  if (data.nearest_airport) {
    facts.push({
      label: `Nearest airport`,
      value: `${data.nearest_airport.iata} · ${data.nearest_airport.distance_km.toFixed(0)} km`,
    });
  }
  facts.push({
    label: "Tier",
    value: composition.tier === 1 ? "Legendary" : "Featured",
  });

  return facts;
}

// ----------------------------------------------------------------------------
// Title for the spike section — derives a reasonable per-beach title.
// ----------------------------------------------------------------------------
function titleForSpike(composition: LegendaryPageBundle["composition"]): string {
  const SPIKE_TITLES: Record<string, string> = {
    "the-canyon": "The Canyon",
    "cultural-ubiquity": "The Icon",
    "two-piers": "The Piers",
    "surfing-reintroduced": "Surfing, Reintroduced",
    "surf-lifesaving-origin": "The Surf-Life Origin",
  };
  if (composition.spike && SPIKE_TITLES[composition.spike]) {
    return SPIKE_TITLES[composition.spike];
  }
  if (composition.tier === 2) return `${composition.beach_name} — the feature`;
  return "The Spike";
}

// ----------------------------------------------------------------------------
// Spike prose — first-draft assembly until MDX pipeline lands
// ----------------------------------------------------------------------------
function buildSpikeProse(bundle: LegendaryPageBundle): string {
  const { showcase, composition } = bundle;
  // For first draft: use intro_text's richest paragraphs about the spike.
  // TODO: replace with spike.mdx reading once remark plugin lands.
  const paragraphs = (showcase.intro_text ?? "").split("\n\n").filter(Boolean);
  // Skip the opening paragraph (reused in Story) and grab the next 3–5
  return paragraphs.slice(1, 6).join("\n\n");
}

// ----------------------------------------------------------------------------
// Nav group assembly
// ----------------------------------------------------------------------------
function buildNavGroups(sectionIds: string[]): NavGroup[] {
  const LABELS: Record<string, string> = {
    live_now: "Right now",
    spokes: "Go deeper",
    story: "Story",
    spike_deep_explainer: "The Spike",
    feature_deep_explainer: "Feature",
    place_anatomy: "Anatomy",
    day_in_life: "A Day Here",
    timeline: "History",
    data_science: "Data",
    comparison: "Compare",
    sea_surf: "Sea & surf",
    things_to_know: "Know before",
    plan_stack: "Plan",
    culture: "Culture",
    honest_reckoning: "Context",
    gallery: "Gallery",
    sources: "Sources",
  };

  const CULTURE_GROUP = new Set([
    "story",
    "spike_deep_explainer",
    "feature_deep_explainer",
    "place_anatomy",
    "day_in_life",
    "timeline",
    "culture",
    "honest_reckoning",
  ]);
  const BEACH_GROUP = new Set(["data_science", "comparison", "sea_surf", "gallery"]);
  const PLAN_GROUP = new Set(["things_to_know", "plan_stack"]);

  const culture: [string, string][] = [];
  const beach: [string, string][] = [];
  const plan: [string, string][] = [];
  const meta: [string, string][] = [];

  for (const id of sectionIds) {
    if (id === "hero" || id === "quick_facts") continue;
    const label = LABELS[id] ?? id;
    if (id === "sources") meta.push([id, "Sources"]);
    else if (PLAN_GROUP.has(id)) plan.push([id, label]);
    else if (BEACH_GROUP.has(id)) beach.push([id, label]);
    else if (CULTURE_GROUP.has(id)) culture.push([id, label]);
    else meta.push([id, label]);
  }

  const groups: NavGroup[] = [];
  if (culture.length) groups.push({ label: "Culture & Story", items: culture });
  if (beach.length) groups.push({ label: "The Beach Itself", items: beach });
  if (plan.length) groups.push({ label: "Plan Your Visit", items: plan });
  if (meta.length) groups.push({ label: "Meta", items: meta });
  return groups;
}

// ----------------------------------------------------------------------------
// Placeholder for unimplemented sections
// ----------------------------------------------------------------------------
function SpokesSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const spokes = bundle.composition.spokes ?? [];
  if (spokes.length === 0) return null;
  const LABELS: Record<string, string> = {
    audience_guide: "Audience guide", deep_dive: "Deep dive",
    event: "Event", anthology: "Anthology",
  };
  const title = (s: string) =>
    s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <section id="spokes" className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <div className="text-[11px] font-mono uppercase tracking-[0.3em] mb-6" style={{ color: "var(--beach-primary, #475569)" }}>
        Go deeper
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {spokes.map((sp, i) => (
          <Link
            key={i}
            href={`/beaches/${bundle.composition.slug}/${sp.slug}`}
            className="group flex items-baseline justify-between gap-4 border-t-2 pt-4 hover:opacity-80 transition-opacity"
            style={{ borderColor: "var(--beach-primary, #cbd5e1)" }}
          >
            <span className="font-display text-2xl text-volcanic-900" style={{ fontFamily: "var(--display-family)" }}>
              {title(sp.slug)}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-volcanic-400 whitespace-nowrap">
              {LABELS[sp.type] ?? "More"} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PendingSection({ id }: { id: string }) {
  return (
    <section
      id={id}
      className="mx-auto max-w-5xl px-6 py-24 text-center border-t"
      style={{ borderColor: "var(--color-rule, #E5E5E5)" }}
    >
      <div
        className="text-[11px] font-mono uppercase tracking-[0.3em] mb-3"
        style={{ color: "var(--beach-primary, #475569)" }}
      >
        {id.replace(/_/g, " ")}
      </div>
      <p className="text-volcanic-400 italic font-serif text-sm">
        Section component pending — spec&apos;d in{" "}
        <span className="font-mono">components.md</span>, build in progress.
      </p>
    </section>
  );
}
