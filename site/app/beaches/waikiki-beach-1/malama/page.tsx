import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WaikikiMalamaPage from "@/components/legendary-v2/waikiki/malama";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Mālama Hawaiʻi — the Hawaiian ground you are standing on at Waikīkī",
  description:
    "The 1893 overthrow in full, Queen Liliʻuokalani's protest, the Kuʻe Petitions, the 1993 U.S. Apology Resolution, Hawaiian Homestead and the housing crisis, sovereignty today (OHA, Akaka Bill, Aloha ʻĀina), ʻōlelo Hawaiʻi primer, Hōkūleʻa, and twelve specific ways to visit Waikīkī respectfully.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/waikiki-beach-1/malama",
  },
};

export default function Page() {
  const bundle = loadBundle("waikiki-beach-1");
  if (!bundle) notFound();
  return <WaikikiMalamaPage bundle={bundle!} />;
}
