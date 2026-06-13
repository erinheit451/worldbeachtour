import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PierGuide } from "@/components/legendary-v2/spokes";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "The Huntington Beach Pier — rebuilt five times, the wave-maker of Surf City",
  description:
    "The Huntington Beach Pier: its construction history from the 1904 wooden pier to the 1,856-foot 1992 rebuild, how it shapes the beach break, and why the US Open of Surfing happens beneath it.",
};

export default function Page() {
  const bundle = loadBundle("huntington-city-beach");
  if (!bundle) notFound();
  return <PierGuide bundle={bundle} />;
}
