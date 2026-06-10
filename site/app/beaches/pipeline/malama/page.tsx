import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PipelineMalamaPage from "@/components/legendary-v2/pipeline/malama";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Mālama North Shore — the Hawaiian sacred sites of the 7-Mile Miracle",
  description:
    "Puʻu o Mahuka Heiau — Oʻahu's largest ancient Hawaiian temple complex — sits on the ridge above Pipeline. Waimea Valley holds 78+ archaeological sites under Hiʻipaka cultural stewardship. The Hawaiian place names under every English surf-break name: Ehukai, Pūpūkea, Laniākea, Haleʻiwa. Seven specific respectful-visit practices.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/pipeline/malama",
  },
};

export default function Page() {
  const bundle = loadBundle("pipeline");
  if (!bundle) notFound();
  return <PipelineMalamaPage bundle={bundle!} />;
}
