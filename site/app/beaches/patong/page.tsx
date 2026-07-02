import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegendaryBeachV2 from "@/components/legendary-v2/legendary-beach-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";
import BeachJsonLd from "@/components/beach-jsonld";

export const metadata: Metadata = {
  title: "Patong Beach — the fishing bay that became Thailand's loudest strip",
  description:
    'Three kilometres of Phuket sand fronting Bangla Road, transformed from farming village to mass-tourism capital — and struck head-on by the 2004 Indian Ocean tsunami.',
  alternates: { canonical: "https://worldbeachtour.com/beaches/patong" },
};

export default function Page() {
  const bundle = loadBundle("patong");
  if (!bundle) notFound();
  return (
    <>
      <BeachJsonLd data={bundle.data} />
      <LegendaryBeachV2 bundle={bundle} />
    </>
  );
}
