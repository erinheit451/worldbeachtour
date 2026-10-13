import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicGuide } from "@/components/legendary-v2/spokes";
import { topicMetadata } from "@/components/legendary-v2/spokes/topic-metadata";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export function generateMetadata(): Metadata {
  return topicMetadata("coney-island-beach-1", "history");
}

export default function Page() {
  const bundle = loadBundle("coney-island-beach-1");
  if (!bundle) notFound();
  return <TopicGuide bundle={bundle} spoke="history" />;
}
