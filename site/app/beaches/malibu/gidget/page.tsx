import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MalibuGidgetPage from "@/components/legendary-v2/malibu/gidget";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Gidget — how a 5'1\" teenager accidentally sold Malibu to the world",
  description:
    "Kathy Kohner's summer notebooks, her Austrian-émigré father's 1957 novel, Sandra Dee doubled by Mickey Munoz in a wig, the Beach Boys' three-album Malibu run, and Bruce Brown's Endless Summer — one continuous 1956–1975 cultural explosion that has not stopped.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/malibu/gidget",
  },
};

export default function Page() {
  const bundle = loadBundle("malibu");
  if (!bundle) notFound();
  return <MalibuGidgetPage bundle={bundle!} />;
}
