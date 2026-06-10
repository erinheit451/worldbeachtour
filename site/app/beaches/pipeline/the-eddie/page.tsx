import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PipelineEddiePage from "@/components/legendary-v2/pipeline/the-eddie";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "The Eddie — Waimea Bay, Eddie Aikau, and the paddle-in big-wave tradition",
  description:
    "Eddie Aikau, Waimea Bay's first lifeguard (500+ rescues, 1968–1978), died at sea in the 1978 Hōkūleʻa rescue attempt. The Eddie Aikau Big Wave Invitational that bears his name has only run ten times since 1985 — only when Waimea delivers minimum 20-foot open-face waves. Plus the sacred Waimea Valley and how to use the bay summer and winter.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/pipeline/the-eddie",
  },
};

export default function Page() {
  const bundle = loadBundle("pipeline");
  if (!bundle) notFound();
  return <PipelineEddiePage bundle={bundle!} />;
}
