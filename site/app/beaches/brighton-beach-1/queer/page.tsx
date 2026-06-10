import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrightonQueerPage from "@/components/legendary-v2/brighton/queer";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Queer Brighton — Kemptown, Duke's Mound, and the UK's queer capital",
  description:
    "Eighty years of Kemptown gay culture, the 1980 legalization of the UK's first naturist beach at Duke's Mound, Brighton Pride as the country's largest, Brighton's response to AIDS and Section 28, and what it means that 10.7% of the city is LGBTQ+.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/brighton-beach-1/queer",
  },
};

export default function Page() {
  const bundle = loadBundle("brighton-beach-1");
  if (!bundle) notFound();
  return <BrightonQueerPage bundle={bundle!} />;
}
