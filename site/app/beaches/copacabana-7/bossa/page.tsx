import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CopaBossaPage from "@/components/legendary-v2/copa/bossa";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Bossa Nova — the 1958–1964 Copa-Ipanema musical movement",
  description:
    "How Antônio Carlos Jobim, João Gilberto, Vinícius de Moraes, and Astrud Gilberto invented bossa nova in the bars and apartments of a six-block radius around Copa and Ipanema. The canonical venues, the five essential recordings, why this specific neighborhood in this specific six-year window, and where to hear it in Rio today.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/copacabana-7/bossa",
  },
};

export default function Page() {
  const bundle = loadBundle("copacabana-7");
  if (!bundle) notFound();
  return <CopaBossaPage bundle={bundle!} />;
}
