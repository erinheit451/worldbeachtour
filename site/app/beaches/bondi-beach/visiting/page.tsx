import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BondiVisitingPage from "@/components/legendary-v2/bondi/visiting";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Visiting Bondi — from Sydney CBD, where to stay, the coastal walk, Icebergs",
  description:
    "The 25-minute bus from Sydney Central to Bondi, where to stay along Campbell Parade vs in Bondi Junction, the canonical food-and-drink list, the 6 km coastal walk to Coogee, and three itinerary templates from half-day to overnight.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/bondi-beach/visiting",
  },
};

export default function Page() {
  const bundle = loadBundle("bondi-beach");
  if (!bundle) notFound();
  return <BondiVisitingPage bundle={bundle!} />;
}
