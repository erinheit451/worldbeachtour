import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CopaVisitingPage from "@/components/legendary-v2/copa/visiting";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Visiting Copacabana — how to do a Rio trip that uses the beach without being trapped by it",
  description:
    "Getting from GIG airport to Copa, six neighborhood-stay options from the 1923 Palace to Leme to Ipanema, how to eat at a kiosk vs a churrascaria vs a boteco, six essential side-trips beyond the beach, and four itinerary templates from cruise port day to Réveillon week.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/copacabana-7/visiting",
  },
};

export default function Page() {
  const bundle = loadBundle("copacabana-7");
  if (!bundle) notFound();
  return <CopaVisitingPage bundle={bundle!} />;
}
