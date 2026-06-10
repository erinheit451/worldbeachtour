import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CopaReveillonPage from "@/components/legendary-v2/copa/reveillon";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Réveillon — the world's largest New Year's Eve at Copacabana",
  description:
    "Guinness-certified in 2025, 3 million people on 4 km of sand, white clothing, 11 offshore fireworks barges, Candomblé Yemanjá offerings pushed into the surf at midnight. Eight practical guides for actually being here that night, from booking 4 months ahead to the quiet 5 a.m. sunrise after.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/copacabana-7/reveillon",
  },
};

export default function Page() {
  const bundle = loadBundle("copacabana-7");
  if (!bundle) notFound();
  return <CopaReveillonPage bundle={bundle!} />;
}
