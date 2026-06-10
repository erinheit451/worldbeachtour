import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BondiLifesavingPage from "@/components/legendary-v2/bondi/lifesaving";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Surf Lifesaving at Bondi — the 1906 origin, Black Sunday 1938, and the modern operation",
  description:
    "How the sport started at Bondi in February 1906, how Black Sunday 1938 made it a global standard, how the volunteer red-and-yellow patrol and the paid blue-cap professional lifeguards share the beach today, and how Bondi Rescue works as television and as surf-lifesaving training material.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/bondi-beach/lifesaving",
  },
};

export default function Page() {
  const bundle = loadBundle("bondi-beach");
  if (!bundle) notFound();
  return <BondiLifesavingPage bundle={bundle!} />;
}
