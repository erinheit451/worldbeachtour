import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WaikikiSurfPage from "@/components/legendary-v2/waikiki/surf";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Learning to Surf at Waikīkī — the first-lesson beach",
  description:
    "The world's first-lesson beach. Why Waikīkī's reef breaks forgive beginners, which schools and breaks to choose, the two-hour lesson minute-by-minute, lineup etiquette, the beach boys tradition, and what it means that a Hawaiian waterman is teaching you.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/waikiki-beach-1/surf",
  },
  robots: { index: false, follow: true },
};

export default function Page() {
  const bundle = loadBundle("waikiki-beach-1");
  if (!bundle) notFound();
  return <WaikikiSurfPage bundle={bundle!} />;
}
