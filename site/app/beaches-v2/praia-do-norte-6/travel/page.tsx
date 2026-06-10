import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NazareTravelPage from "@/components/legendary-v2/nazare/travel";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Visiting Nazaré — trip planning for Praia do Norte",
  description:
    "How to actually be here. Getting to Nazaré from Lisbon, where to stay (Praia, Sítio, Pederneira), what to eat, visitor safety (do not swim at Praia do Norte), and four itineraries.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/praia-do-norte-6/travel",
  },
  robots: { index: false, follow: true },
};

export default function Page() {
  const bundle = loadBundle("praia-do-norte-6");
  if (!bundle) notFound();
  return <NazareTravelPage bundle={bundle!} />;
}
