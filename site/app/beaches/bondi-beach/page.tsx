import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BondiPage from "@/components/legendary-v2/bondi-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";
import BeachJsonLd from "@/components/beach-jsonld";

export const metadata: Metadata = {
  title: "Bondi Beach — Australia's identity beach, and the Gadigal country under it",
  description:
    "One kilometer of Sydney sand where surf lifesaving was invented in 1906, where Black Sunday's 1938 rescue became a global standard, and where the Gadigal land beneath was never ceded. The Bondi-to-Coogee coastal walk, the Icebergs pool, Sculpture by the Sea, and the whole story behind the red-and-yellow caps.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/bondi-beach",
  },
};

export default function Page() {
  const bundle = loadBundle("bondi-beach");
  if (!bundle) notFound();
  return (
    <>
      <BeachJsonLd data={bundle.data} />
      <BondiPage bundle={bundle!} />
    </>
  );
}
