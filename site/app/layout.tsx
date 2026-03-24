import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "World Beach Tour — Every Beach on Earth",
  description:
    "The definitive guide to every beach on Earth. Explore 412,000+ beaches through the lens that matters to you — travel, surf, environment, history, sand geology, and more.",
  metadataBase: new URL("https://worldbeachtour.com"),
  openGraph: {
    title: "World Beach Tour — Every Beach on Earth",
    description:
      "The definitive guide to every beach on Earth. 412,000+ beaches across 249 countries.",
    siteName: "World Beach Tour",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Beach Tour",
    description: "The definitive guide to every beach on Earth.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#082f49" />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-volcanic-800">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
