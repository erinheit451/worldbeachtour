import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrightonVisitingPage from "@/components/legendary-v2/brighton/visiting";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Visiting Brighton — trip planning for the seafront, the Lanes, and Kemptown",
  description:
    "Getting to Brighton from London (50 minutes by train), where to stay in the Lanes vs the seafront vs Kemptown vs Hove, what to eat in a town of 500 restaurants, and four itineraries from a day trip to Pride weekend.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/brighton-beach-1/visiting",
  },
};

export default function Page() {
  const bundle = loadBundle("brighton-beach-1");
  if (!bundle) notFound();
  return <BrightonVisitingPage bundle={bundle!} />;
}
