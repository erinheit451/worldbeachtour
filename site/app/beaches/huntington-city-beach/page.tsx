import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegendaryBeachV2 from "@/components/legendary-v2/legendary-beach-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Huntington Beach — Surf City USA, from live buoy to deep history",
  description:
    "The Tier-1 page for Huntington Beach: live offshore-buoy and tide feeds, season-by-season swell, the manufactured-then-earned 'Surf City USA' story, the pier, the oil spills, and a full surf guide.",
  alternates: { canonical: "https://worldbeachtour.com/beaches/huntington-city-beach" },
};

export default function Page() {
  const bundle = loadBundle("huntington-city-beach");
  if (!bundle) notFound();
  return <LegendaryBeachV2 bundle={bundle} />;
}
