import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PenicheVisitingPage from "@/components/legendary-v2/peniche/visiting";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Visiting Peniche — trip planning for the Silver Coast surf capital",
  description:
    "Getting to Peniche from Lisbon (95 km, 70 min), where to stay in the old town vs Baleal vs the Supertubos strip, what to eat in a working sardine-fleet town, how to visit the Fortaleza political-prison museum, and three itineraries.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/peniche/visiting",
  },
};

export default function Page() {
  const bundle = loadBundle("peniche");
  if (!bundle) notFound();
  return <PenicheVisitingPage bundle={bundle!} />;
}
