import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MalibuFirstPointPage from "@/components/legendary-v2/malibu/first-point";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "First Point — Malibu's wave as a physics argument",
  description:
    "Cobblestone geology, the south-swell window from the Southern Hemisphere, and eighty years of a longboard canon written against a single peeling right at Surfrider Beach. Simmons-Quigg-Kivlin, Lance Carson, Miki Dora, Joel Tudor — and what First Point's lineup actually feels like in 2026.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/malibu/first-point",
  },
};

export default function Page() {
  const bundle = loadBundle("malibu");
  if (!bundle) notFound();
  return <MalibuFirstPointPage bundle={bundle!} />;
}
