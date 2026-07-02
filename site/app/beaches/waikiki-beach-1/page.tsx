import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WaikikiV2Page from "@/components/legendary-v2/waikiki-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";
import BeachJsonLd from "@/components/beach-jsonld";

export const metadata: Metadata = {
  title: "Waikīkī — A Royal Beach That Survived Becoming a Resort",
  description:
    "Two miles of Pacific sand on the leeward shore of Oʻahu. The place where modern surfing was reintroduced to the world by Duke Kahanamoku in 1912 — on a beach whose country had been overthrown nineteen years earlier. The village is still the village.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/waikiki-beach-1",
  },
};

export default function Page() {
  const bundle = loadBundle("waikiki-beach-1");
  if (!bundle) notFound();
  return (
    <>
      <BeachJsonLd data={bundle.data} />
      <WaikikiV2Page bundle={bundle!} />
    </>
  );
}
