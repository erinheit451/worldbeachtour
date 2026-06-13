import { notFound } from "next/navigation";
import Link from "next/link";
import StubBeach from "@/components/stub-beach";
import T1Beach from "@/components/t1-beach";
import {
  getPreviewSlugs,
  getPreviewBundle,
  previewTier,
} from "@/lib/preview";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPreviewSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = getPreviewBundle(slug);
  return {
    title: `Preview · ${bundle?.data?.name || slug}`,
    robots: { index: false, follow: false },
  };
}

type StubProps = Parameters<typeof StubBeach>[0];

export default async function PreviewBeachPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = getPreviewBundle(slug);
  if (!bundle) notFound();

  const tier = previewTier(bundle.data);
  const data = bundle.data as unknown as StubProps["data"];
  const neighbors = bundle.neighbors as unknown as StubProps["neighbors"];

  return (
    <>
      <DevBanner slug={slug} tier={tier} bundle={bundle} />
      {tier === "T1" ? (
        <T1Beach data={data} neighbors={neighbors} />
      ) : (
        <StubBeach data={data} neighbors={neighbors} />
      )}
    </>
  );
}

function DevBanner({
  slug,
  tier,
  bundle,
}: {
  slug: string;
  tier: string;
  bundle: NonNullable<ReturnType<typeof getPreviewBundle>>;
}) {
  const d = bundle.data;
  const facts = [
    `gate: ${tier}`,
    d.wikidata_id ? `wikidata ✓` : `wikidata ✗`,
    d.name ? `named ✓` : `unnamed ✗`,
    typeof d.data_completeness_pct === "number"
      ? `${d.data_completeness_pct}% data`
      : null,
    `${bundle.neighbors.length} neighbors`,
  ].filter(Boolean);

  return (
    <div className="sticky top-0 z-50 bg-volcanic-900 text-white px-4 py-2 flex items-center gap-4 font-mono text-[11px]">
      <Link href="/preview" className="text-coral-300 hover:text-white whitespace-nowrap">
        ← all 20
      </Link>
      <span
        className={`px-1.5 py-0.5 rounded-sm font-bold ${
          tier === "T1" ? "bg-reef-500 text-volcanic-900" : "bg-sand-400 text-volcanic-900"
        }`}
      >
        {tier}
      </span>
      <span className="text-volcanic-300 truncate">{slug}</span>
      <span className="text-volcanic-400 ml-auto hidden sm:block">
        {facts.join("  ·  ")}
      </span>
    </div>
  );
}
