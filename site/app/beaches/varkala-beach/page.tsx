import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegendaryBeachV2 from "@/components/legendary-v2/legendary-beach-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: 'Varkala Beach — the red laterite cliff where Kerala washes away sin',
  description:
    "The only sea-cliff on Kerala's coast: red laterite walls above Papanasam beach, where Hindu ancestor rites meet a clifftop strip of Ayurveda and cafes, below a 2,000-year-old temple.",
  alternates: { canonical: "https://worldbeachtour.com/beaches/varkala-beach" },
};

export default function Page() {
  const bundle = loadBundle("varkala-beach");
  if (!bundle) notFound();
  return <LegendaryBeachV2 bundle={bundle} />;
}
