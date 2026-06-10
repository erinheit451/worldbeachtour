import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MalibuHumaliwoPage from "@/components/legendary-v2/malibu/humaliwo";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Humaliwo — the Chumash village under the First Point parking lot",
  description:
    "Before \"Malibu\": the Ventureño Chumash village at the mouth of Malibu Creek, continuously occupied for at least 2,000 years. CA-LAN-264. The 1892 Rindge land grant. The tomol. The Santa Ynez Band and Wishtoyo Chumash Foundation — present tense. Say the word Humaliwo out loud once before you paddle out.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/malibu/humaliwo",
  },
};

export default function Page() {
  const bundle = loadBundle("malibu");
  if (!bundle) notFound();
  return <MalibuHumaliwoPage bundle={bundle!} />;
}
