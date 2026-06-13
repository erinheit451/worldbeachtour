import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegendaryBeachV2 from "@/components/legendary-v2/legendary-beach-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Navagio (Shipwreck Beach) — the cove that exists as a single photograph",
  description:
    "A rusting freighter half-buried in a white-pebble cove on Zakynthos, reachable only by boat beneath sheer limestone cliffs — the most-photographed beach in Greece, and the access disputes and 2018 cliff collapse behind the picture.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/navagio-1",
  },
};

export default function Page() {
  const bundle = loadBundle("navagio-1");
  if (!bundle) notFound();
  return <LegendaryBeachV2 bundle={bundle} />;
}
