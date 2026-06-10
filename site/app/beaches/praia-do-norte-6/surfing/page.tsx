import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NazareSurfingPage from "@/components/legendary-v2/nazare/surfing";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Surfing Nazaré — forecasting, tow protocol, records, Jaws comparison",
  description:
    "What the Nazaré wave looks like from inside the sport. Reading the forecast, wetsuit by month, tow-in mechanics, the complete wave-height records anthology, and the only big-wave comparison that matters (Jaws).",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/praia-do-norte-6/surfing",
  },
};

export default function Page() {
  const bundle = loadBundle("praia-do-norte-6");
  if (!bundle) notFound();
  return <NazareSurfingPage bundle={bundle!} />;
}
