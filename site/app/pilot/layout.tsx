import type { Metadata } from "next";

// Internal pilot/scratch route — never index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PilotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
