import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BondiGadigalPage from "@/components/legendary-v2/bondi/gadigal";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Gadigal Country — the Eora Nation, the Uluru Statement, and the Bondi rock engravings",
  description:
    "Bondi is unceded Gadigal land. 65,000 years of Aboriginal continental presence, 20,000 years of Sydney coastal Gadigal presence, the rock engravings at North Bondi, the 1992 Mabo decision, the 2017 Uluru Statement, the 2023 Voice referendum, and nine specific things a visitor can do in 2026.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/bondi-beach/gadigal",
  },
};

export default function Page() {
  const bundle = loadBundle("bondi-beach");
  if (!bundle) notFound();
  return <BondiGadigalPage bundle={bundle!} />;
}
