import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WaikikiVisitingPage from "@/components/legendary-v2/waikiki/visiting";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Visiting Waikīkī — trip planning, stay, eat, itineraries",
  description:
    "How to actually be in Waikīkī. Getting from HNL, where to stay on a strip of 30,000 rooms, poke/shave ice/plate lunch/mai tai, visitor safety, and four Oʻahu itineraries from cruise-day to seven-night.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/waikiki-beach-1/visiting",
  },
};

export default function Page() {
  const bundle = loadBundle("waikiki-beach-1");
  if (!bundle) notFound();
  return <WaikikiVisitingPage bundle={bundle!} />;
}
