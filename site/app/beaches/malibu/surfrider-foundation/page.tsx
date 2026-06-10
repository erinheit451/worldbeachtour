import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MalibuSurfriderPage from "@/components/legendary-v2/malibu/surfrider-foundation";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "The Surfrider Foundation — the 1984 breakwater fight and the Clean Water Act's teeth",
  description:
    "Three surfers — Glen Henning, Tom Pratte, Lance Carson — incorporated a nonprofit in August 1984 to stop a breakwater at First Point. Forty-two years later Surfrider is the largest coastal-protection nonprofit on Earth. The 1991 Louisiana-Pacific case, Tapia wastewater, the 2013 lagoon restoration, and the fight that has outlasted every elected official asked to address it.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/malibu/surfrider-foundation",
  },
};

export default function Page() {
  const bundle = loadBundle("malibu");
  if (!bundle) notFound();
  return <MalibuSurfriderPage bundle={bundle!} />;
}
