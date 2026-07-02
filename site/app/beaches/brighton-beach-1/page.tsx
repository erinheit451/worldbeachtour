import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrightonPage from "@/components/legendary-v2/brighton-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";
import BeachJsonLd from "@/components/beach-jsonld";

export const metadata: Metadata = {
  title: "Brighton — English seaside invented here, burning and rebuilding since",
  description:
    "The grey-sky pebble beach where three centuries of English people came to be somebody else for a weekend. Two Victorian piers (one working, one a burnt skeleton), the Royal Pavilion, Kemptown as the UK's queer capital, and the town behind all of it.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/brighton-beach-1",
  },
};

export default function Page() {
  const bundle = loadBundle("brighton-beach-1");
  if (!bundle) notFound();
  return (
    <>
      <BeachJsonLd data={bundle.data} />
      <BrightonPage bundle={bundle!} />
    </>
  );
}
