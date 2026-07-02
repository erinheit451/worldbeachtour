import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "How many beaches are there in the world? 228,612.";

export default function Image() {
  return renderOgImage({
    eyebrow: "Beach facts",
    title: "How many beaches are there in the world?",
    subtitle:
      "228,612 — and why the honest answer is a range. The only count that reconciles OpenStreetMap, EU and US registers, Wikidata and GeoNames.",
  });
}
