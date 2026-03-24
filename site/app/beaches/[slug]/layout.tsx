import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BeachHero from "@/components/beach-hero";
import LensTabs from "@/components/lens-tabs";
import BeachJsonLd from "@/components/beach-jsonld";
import { getBeachData, getBeachMeta, getAllBeachSlugs } from "@/lib/beaches";

export function generateStaticParams() {
  return getAllBeachSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getBeachData(slug);
  if (!data) return {};

  const location = [data.admin_level_1, data.country_code]
    .filter(Boolean)
    .join(", ");
  const description = `Complete guide to ${data.name}${location ? ` in ${location}` : ""}. Travel tips, surf conditions, environment, history, sand geology, and more.`;

  return {
    title: `${data.name} — World Beach Tour`,
    description,
    openGraph: {
      title: `${data.name} — World Beach Tour`,
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
  const data = getBeachData(slug);
  const meta = getBeachMeta(slug);
  if (!data) notFound();

  const location = [data.admin_level_1, data.country_code]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <BeachJsonLd data={data} />
      <BeachHero name={data.name} location={location} />
      <LensTabs slug={slug} activeLenses={meta.lenses} />
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  );
}
