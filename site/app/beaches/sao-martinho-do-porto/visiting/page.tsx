import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SmpVisitingPage from "@/components/legendary-v2/sao-martinho/visiting";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Visiting São Martinho do Porto — trip planning for the shell bay",
  description:
    "Getting to São Martinho from Lisbon (108 km) or Nazaré (10 km), where to stay in a village with no international hotel chains, what to eat at the Silver Coast's quietest restaurant strip, and three itineraries from a half-day to two nights.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/sao-martinho-do-porto/visiting",
  },
};

export default function Page() {
  const bundle = loadBundle("sao-martinho-do-porto");
  if (!bundle) notFound();
  return <SmpVisitingPage bundle={bundle!} />;
}
