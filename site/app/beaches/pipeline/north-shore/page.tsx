import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PipelineNorthShorePage from "@/components/legendary-v2/pipeline/north-shore";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "The North Shore — the 7-Mile Miracle as a day trip from Waikīkī",
  description:
    "The 60-kilometer drive from Waikīkī to the North Shore, the canonical six-stop circuit from Haleʻiwa through Laniākea, Waimea, Pipeline, Sunset, to Turtle Bay. Matsumoto Shave Ice, Giovanni's Shrimp Truck, Ted's Bakery, and three itinerary templates including Pipe Masters week.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/pipeline/north-shore",
  },
};

export default function Page() {
  const bundle = loadBundle("pipeline");
  if (!bundle) notFound();
  return <PipelineNorthShorePage bundle={bundle!} />;
}
