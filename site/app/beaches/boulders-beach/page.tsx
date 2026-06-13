import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegendaryBeachV2 from "@/components/legendary-v2/legendary-beach-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Boulders Beach — the granite cove you share with endangered penguins",
  description:
    "A sheltered run of 540-million-year-old granite coves at Simon's Town, Cape Town, where an African penguin colony — Critically Endangered since 2024 — nests among the rocks and swims beside visitors inside Table Mountain National Park.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/boulders-beach",
  },
};

export default function Page() {
  const bundle = loadBundle("boulders-beach");
  if (!bundle) notFound();
  return <LegendaryBeachV2 bundle={bundle} />;
}
