import type { Metadata } from "next";
import GlassBeach from "@/components/showcase/glass-beach";

export const metadata: Metadata = {
  title: "Glass Beach, Fort Bragg — what's actually in the sand",
  description:
    "Fort Bragg dumped its trash off the cliffs for 61 years. The ocean spent 60 years rounding the bottles. A landmark page on the sea glass, the Franciscan bedrock beneath it, and why it's disappearing.",
};

export default function Page() {
  return <GlassBeach />;
}
