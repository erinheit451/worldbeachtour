/**
 * <Hero> — page opening visual. One of 4 archetypes per levers.hero_type.
 *
 * MONUMENT: full-bleed landscape, text overlay at bottom.
 * SPIKE: cropped tight on the spike subject.
 * LAYERED: diptych of two images.
 * ABSENCE: beach empty, lower visual intensity.
 *
 * See docs/legendary/components.md PART B.
 */

import type { SectionImage, HeroType } from "../types";

interface HeroProps {
  beachName: string;
  location: string;
  tagline?: string;
  heroType: HeroType;
  primary: SectionImage;
  secondary?: SectionImage;     // required for LAYERED
  version: string;
  tier: 1 | 2;
}

export default function Hero({
  beachName,
  location,
  tagline,
  heroType,
  primary,
  secondary,
  version,
  tier,
}: HeroProps) {
  if (heroType === "LAYERED" && secondary) {
    return <HeroLayered {...{ beachName, location, tagline, primary, secondary, version, tier }} />;
  }
  if (heroType === "ABSENCE") {
    return <HeroAbsence {...{ beachName, location, tagline, primary, version, tier }} />;
  }
  if (heroType === "SPIKE") {
    return <HeroSpike {...{ beachName, location, tagline, primary, version, tier }} />;
  }
  return <HeroMonument {...{ beachName, location, tagline, primary, version, tier }} />;
}

// ----------------------------------------------------------------------------
// MONUMENT — full-bleed landscape, bottom-left text stack
// ----------------------------------------------------------------------------
function HeroMonument({ beachName, location, tagline, primary, tier }: BaseHeroProps) {
  const heightClass = tier === 1 ? "h-[88vh] min-h-[600px]" : "h-[66vh] min-h-[480px]";
  return (
    <section className={`relative ${heightClass} w-full overflow-hidden bg-black`}>
      <img
        src={primary.thumbnail || primary.url}
        alt={primary.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/85" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16">
        <div className="mx-auto max-w-7xl">
          <TextStack name={beachName} location={location} tagline={tagline} align="left" />
        </div>
      </div>
      <Attribution image={primary} />
    </section>
  );
}

// ----------------------------------------------------------------------------
// SPIKE — cropped tight, bottom-right text stack (desktop), bottom-left (mobile)
// ----------------------------------------------------------------------------
function HeroSpike({ beachName, location, tagline, primary, tier }: BaseHeroProps) {
  const heightClass = tier === 1 ? "h-[88vh] min-h-[600px]" : "h-[66vh] min-h-[480px]";
  return (
    <section className={`relative ${heightClass} w-full overflow-hidden bg-black`}>
      <img
        src={primary.thumbnail || primary.url}
        alt={primary.title}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16">
        <div className="mx-auto max-w-7xl sm:text-right">
          <TextStack name={beachName} location={location} tagline={tagline} align="right" />
        </div>
      </div>
      <Attribution image={primary} />
    </section>
  );
}

// ----------------------------------------------------------------------------
// LAYERED — two images side-by-side (50/50 desktop, stacked mobile)
// ----------------------------------------------------------------------------
function HeroLayered({
  beachName,
  location,
  tagline,
  primary,
  secondary,
  tier,
}: BaseHeroProps & { secondary: SectionImage }) {
  const heightClass = tier === 1 ? "h-[88vh] min-h-[600px]" : "h-[66vh] min-h-[480px]";
  return (
    <section className={`relative ${heightClass} w-full overflow-hidden bg-black`}>
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
        <div className="relative overflow-hidden">
          <img
            src={primary.thumbnail || primary.url}
            alt={primary.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="relative overflow-hidden hidden md:block">
          <img
            src={secondary.thumbnail || secondary.url}
            alt={secondary.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16">
        <div className="mx-auto max-w-7xl">
          <TextStack name={beachName} location={location} tagline={tagline} align="left" />
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// ABSENCE — muted, lower visual intensity, centred text
// ----------------------------------------------------------------------------
function HeroAbsence({ beachName, location, tagline, primary, tier }: BaseHeroProps) {
  const heightClass = tier === 1 ? "h-[70vh] min-h-[500px]" : "h-[55vh] min-h-[400px]";
  return (
    <section className={`relative ${heightClass} w-full overflow-hidden bg-volcanic-100`}>
      <img
        src={primary.thumbnail || primary.url}
        alt={primary.title}
        className="absolute inset-0 h-full w-full object-cover opacity-95"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/40" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16">
        <div className="mx-auto max-w-5xl text-center">
          <TextStack name={beachName} location={location} tagline={tagline} align="center" dark={false} />
        </div>
      </div>
      <Attribution image={primary} dark />
    </section>
  );
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
interface BaseHeroProps {
  beachName: string;
  location: string;
  tagline?: string;
  primary: SectionImage;
  version: string;
  tier: 1 | 2;
  secondary?: SectionImage;
}

function TextStack({
  name,
  location,
  tagline,
  align,
  dark = true,
}: {
  name: string;
  location: string;
  tagline?: string;
  align: "left" | "right" | "center";
  dark?: boolean;
}) {
  const textColor = dark ? "text-white" : "text-volcanic-900";
  const eyebrowColor = dark ? "text-white/75" : "text-volcanic-600";
  const taglineColor = dark ? "text-white/85" : "text-volcanic-700";
  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "sm:text-right" : "";

  return (
    <div className={alignClass}>
      <p
        className={`text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-5 ${eyebrowColor}`}
      >
        {location}
      </p>
      <h1
        className={`font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.9] -tracking-[0.02em] ${textColor}`}
        style={{ fontFamily: "var(--display-family, var(--font-serif))" }}
      >
        {name}
      </h1>
      {tagline && (
        <p
          className={`mt-8 max-w-2xl text-lg sm:text-xl font-serif italic ${
            align === "right" ? "sm:ml-auto" : align === "center" ? "mx-auto" : ""
          } ${taglineColor}`}
        >
          {tagline}
        </p>
      )}
    </div>
  );
}

function Attribution({
  image,
  dark = false,
}: {
  image: SectionImage;
  dark?: boolean;
}) {
  return (
    <div
      className={`absolute bottom-3 right-4 text-[10px] max-w-[50%] text-right ${
        dark ? "text-volcanic-500" : "text-white/50"
      }`}
    >
      {image.title}
      {image.author ? ` · ${image.author}` : ""} · {image.license}
    </div>
  );
}
