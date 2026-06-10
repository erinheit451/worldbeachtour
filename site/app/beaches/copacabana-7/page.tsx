import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CopaPage from "@/components/legendary-v2/copa-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Copacabana — the beach the world imagines when it imagines a beach",
  description:
    "Four kilometers of Rio sand — Burle Marx's 1970 mosaic Calçadão, the 1923 Copacabana Palace, the world's largest New Year's Eve, the bossa nova neighborhood where Girl from Ipanema was written, the kiosks, the fishing colony at Posto 6, and the favelas on the hills behind.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/copacabana-7",
  },
};

export default function Page() {
  const bundle = loadBundle("copacabana-7");
  if (!bundle) notFound();
  return <CopaPage bundle={bundle!} />;
}
