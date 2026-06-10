import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CopaFavelaPage from "@/components/legendary-v2/copa/favela";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "The Favela Above — Cantagalo, Pavão-Pavãozinho, and the inequality that is the view",
  description:
    "The three favelas on the hills between Copa and Ipanema — 18,500 residents between them. The UPP pacification program from 2009 to its current degradation, the free Plano Inclinado elevator from Ipanema metro to the upper Mirante viewpoint, and how to visit Rio's favela-adjacent infrastructure respectfully.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/copacabana-7/favela",
  },
};

export default function Page() {
  const bundle = loadBundle("copacabana-7");
  if (!bundle) notFound();
  return <CopaFavelaPage bundle={bundle!} />;
}
