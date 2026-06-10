import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrightonPavilionPage from "@/components/legendary-v2/brighton/pavilion";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "The Royal Pavilion — George IV's Indo-Islamic fantasy at Brighton",
  description:
    "How George IV and John Nash built Britain's oddest royal building, five rooms worth planning the visit around, the Pavilion's post-royal history as a WWI Indian military hospital, and the full practical visitor guide.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/brighton-beach-1/pavilion",
  },
};

export default function Page() {
  const bundle = loadBundle("brighton-beach-1");
  if (!bundle) notFound();
  return <BrightonPavilionPage bundle={bundle!} />;
}
