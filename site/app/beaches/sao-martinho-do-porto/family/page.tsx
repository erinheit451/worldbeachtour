import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SmpFamilyPage from "@/components/legendary-v2/sao-martinho/family";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "São Martinho do Porto for Families — the calm-water Atlantic beach",
  description:
    "Why the shell-shaped bay of São Martinho is the most swimmable calm-water beach on the Portuguese Atlantic coast for families with young children. Geography, what to bring, rainy-day options, and what to do when the bay's mild water stops being enough for older kids.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/sao-martinho-do-porto/family",
  },
};

export default function Page() {
  const bundle = loadBundle("sao-martinho-do-porto");
  if (!bundle) notFound();
  return <SmpFamilyPage bundle={bundle!} />;
}
