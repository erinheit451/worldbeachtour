import type { Metadata } from "next";
import { loadBundle } from "../load-bundle";

/**
 * Metadata for an authored topic spoke, read from showcase.spokes_content[<spoke>]
 * (meta_title / meta_description, falling back to title / kicker) so the
 * <head> can never drift from the page body.
 */
export function topicMetadata(slug: string, spoke: string): Metadata {
  const bundle = loadBundle(slug);
  const c = (bundle?.showcase as unknown as {
    spokes_content?: Record<string, { title?: string; kicker?: string; meta_title?: string; meta_description?: string }>;
  } | undefined)?.spokes_content?.[spoke];
  return {
    title: c?.meta_title ?? c?.title,
    description: c?.meta_description ?? c?.kicker,
    alternates: { canonical: `https://worldbeachtour.com/beaches/${slug}/${spoke}` },
  };
}
