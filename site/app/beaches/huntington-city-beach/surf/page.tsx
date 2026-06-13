import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SurfGuide } from "@/components/legendary-v2/spokes";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Surfing Huntington Beach — season-by-season guide to Surf City's break",
  description:
    "A surfer's guide to Huntington Beach: the pier-shaped beach break, the W/NW winter and S/SW summer swell windows, tide and the live offshore buoy, crowds and the blackball flag, and what board to bring.",
};

export default function Page() {
  const bundle = loadBundle("huntington-city-beach");
  if (!bundle) notFound();
  return <SurfGuide bundle={bundle} />;
}
