import { notFound } from "next/navigation";
import BeachHero from "@/components/beach-hero";
import LensTabs from "@/components/lens-tabs";
import { getBeachData, getBeachMeta, getAllBeachSlugs } from "@/lib/beaches";

export function generateStaticParams() {
  return getAllBeachSlugs().map((slug) => ({ slug }));
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

  const location = [data.admin_level_1, data.country_code].filter(Boolean).join(", ");

  return (
    <div>
      <BeachHero name={data.name} location={location} />
      <LensTabs slug={slug} activeLenses={meta.lenses} />
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  );
}
