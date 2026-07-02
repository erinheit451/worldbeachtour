import type { Metadata } from "next";

// /beaches-v2/* is a preview scaffold that duplicates the canonical /beaches/*
// pages. Keep it crawlable (so search engines can drop already-indexed v2 URLs)
// but noindex the whole segment. Covers the [slug] route and the literal
// showcase children.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function BeachesV2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
