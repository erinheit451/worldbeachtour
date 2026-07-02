import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

// Default social card for the whole site (home + any page without its own).
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "World Beach Tour — every beach on Earth";

export default function Image() {
  return renderOgImage({
    title: "Every beach on Earth, one real page at a time",
    subtitle:
      "228,612 beaches across 249 countries — real history, climate data and local knowledge, not another list of top-10 beaches.",
  });
}
