import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegendaryBeachV2 from "@/components/legendary-v2/legendary-beach-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";
import BeachJsonLd from "@/components/beach-jsonld";

export const metadata: Metadata = {
  title: 'Whitehaven Beach — seven kilometres of 98% silica sand',
  description:
    "A near-pure quartz beach on an uninhabited Whitsunday island, reachable only by boat or seaplane, where Hill Inlet's tides braid white sand through turquoise water inside a national park on Ngaro Sea Country.",
  alternates: { canonical: "https://worldbeachtour.com/beaches/whitehaven-beach-1" },
};

export default function Page() {
  const bundle = loadBundle("whitehaven-beach-1");
  if (!bundle) notFound();
  return (
    <>
      <BeachJsonLd data={bundle.data} />
      <LegendaryBeachV2 bundle={bundle} />
    </>
  );
}
