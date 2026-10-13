import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegendaryBeachV2 from "@/components/legendary-v2/legendary-beach-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";
import BeachJsonLd from "@/components/beach-jsonld";

export function generateMetadata(): Metadata {
  const bundle = loadBundle("coney-island-beach-1");
  const c = bundle?.composition as unknown as { meta_title?: string; meta_description?: string; spike_statement?: string } | undefined;
  return {
    title: c?.meta_title ?? "Coney Island Beach",
    description: c?.meta_description ?? c?.spike_statement,
    alternates: { canonical: "https://worldbeachtour.com/beaches/coney-island-beach-1" },
  };
}

export default function Page() {
  const bundle = loadBundle("coney-island-beach-1");
  if (!bundle) notFound();
  return (
    <>
      <BeachJsonLd data={bundle.data} />
      <LegendaryBeachV2 bundle={bundle} />
    </>
  );
}
