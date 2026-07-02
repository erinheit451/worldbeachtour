import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NazareV2Page from "@/components/legendary-v2/nazare-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";
import BeachJsonLd from "@/components/beach-jsonld";

export const metadata: Metadata = {
  title: "Nazaré (Praia do Norte) — The Canyon That Made the Village and the Wave",
  description:
    "A 900-year-old Portuguese fishing village above a 5-kilometer submarine canyon. The same canyon that feeds the Atlantic sardine fishery produces the largest surfable waves on Earth. The village is still the village.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/praia-do-norte-6",
  },
};

export default function Page() {
  const bundle = loadBundle("praia-do-norte-6");
  if (!bundle) notFound();
  return (
    <>
      <BeachJsonLd data={bundle.data} />
      <NazareV2Page bundle={bundle!} />
    </>
  );
}
