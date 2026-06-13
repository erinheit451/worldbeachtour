import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BeachHero from "@/components/beach-hero";
import LensTabs from "@/components/lens-tabs";
import BeachJsonLd from "@/components/beach-jsonld";
import { getBeachData, getBeachMeta, getAllBeachSlugs } from "@/lib/beaches";
import { computeTier } from "@/lib/tier";

// Slugs with an explicit handwritten showcase page at app/beaches/<slug>/page.tsx
// are handled by that literal route; exclude them here so the static export
// doesn't overwrite the showcase HTML.
const SHOWCASE_SLUGS = new Set([
  "copacabana-7",
  "waikiki-beach-1",
  "bondi-beach",
  "brighton-beach-1",
  "praia-do-norte-6",
  "navagio-1",
  "boulders-beach",
  "whitehaven-beach-1",
  "varkala-beach",
  "patong",
]);

export function generateStaticParams() {
  return getAllBeachSlugs()
    .filter((slug) => !SHOWCASE_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getBeachData(slug) as (ReturnType<typeof getBeachData> & { name_english?: string | null; subtitle?: string | null }) | null;
  if (!data) return {};

  const displayName = data.name_english || data.name;
  const location = [data.admin_level_1, data.country_code]
    .filter(Boolean)
    .join(", ");
  const description =
    data.subtitle ||
    `Complete guide to ${displayName}${location ? ` in ${location}` : ""}. Travel tips, surf conditions, environment, history, sand geology, and more.`;

  return {
    title: `${displayName} — World Beach Tour`,
    description,
    openGraph: {
      title: `${displayName} — World Beach Tour`,
      description,
      type: "article",
    },
  };
}

export default async function BeachLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getBeachData(slug) as (ReturnType<typeof getBeachData> & { name_english?: string | null }) | null;
  const meta = getBeachMeta(slug);
  if (!data) notFound();

  // T0 stubs render their own full-page layout (StubBeach). Skip the generic
  // hero + lens-tab chrome — it would duplicate the stub's header and add a
  // single-tab lens UI that isn't meaningful here.
  const tier = computeTier(slug, data, meta);
  if (tier === 0) {
    return (
      <>
        <BeachJsonLd data={data} />
        {children}
      </>
    );
  }

  const displayName = data.name_english || data.name;
  const location = [data.admin_level_1, data.country_code]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <BeachJsonLd data={data} />
      <BeachHero name={displayName} location={location} />
      <LensTabs slug={slug} activeLenses={meta.lenses} />
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  );
}
