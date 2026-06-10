import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PipelinePage from "@/components/legendary-v2/pipeline-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Pipeline (Banzai Pipeline) — the proving-ground wave of elite surfing",
  description:
    "The left-breaking reef barrel 100 meters off Ehukai Beach Park on Oʻahu's North Shore. Home of the Pipe Masters since 1971, the single most-deadly contest break in surfing, and the wave every elite surfer must measure themselves against. Plus Backdoor, Off-the-Wall, the fatalities, and the wider North Shore.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/pipeline",
  },
};

export default function Page() {
  const bundle = loadBundle("pipeline");
  if (!bundle) notFound();
  return <PipelinePage bundle={bundle!} />;
}
