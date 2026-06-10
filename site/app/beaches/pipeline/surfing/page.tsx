import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PipelineSurfingPage from "@/components/legendary-v2/pipeline/surfing";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Surfing Pipeline — the reef, the Pipe Masters, and why the fatalities are structural",
  description:
    "What it takes to ride Pipeline: reading the lineup, the late deep takeoff, holding the line in the barrel, exit timing. The Pipe Masters contest format and local-water hierarchy. Backdoor and Off-the-Wall. And why the reef geometry makes certain wipeouts structurally fatal despite the fastest water-safety response in surfing.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/pipeline/surfing",
  },
};

export default function Page() {
  const bundle = loadBundle("pipeline");
  if (!bundle) notFound();
  return <PipelineSurfingPage bundle={bundle!} />;
}
