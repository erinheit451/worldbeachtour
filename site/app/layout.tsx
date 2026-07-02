import type { Metadata } from "next";
import Script from "next/script";
import { DM_Serif_Display, Inter, JetBrains_Mono, Barlow_Condensed } from "next/font/google";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import SiteJsonLd from "@/components/site-jsonld";
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "World Beach Tour — Every Beach on Earth",
  description:
    "Search 228,612 beaches worldwide. Real history, real climate data, real local knowledge — the canonical page for every beach on Earth, written one beach at a time.",
  metadataBase: new URL("https://worldbeachtour.com"),
  openGraph: {
    title: "World Beach Tour — Every Beach on Earth",
    description:
      "228,612 beaches across 249 countries. Real history, real climate data, real local knowledge.",
    siteName: "World Beach Tour",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Beach Tour",
    description: "The definitive guide to every beach on Earth.",
  },
  verification: {
    google: "SITH76i6JrGmRNjaAPoaAJPXfcPvNSj6vnptZaI62W8",
    // Bing Webmaster Tools: paste the content value of the <meta name="msvalidate.01">
    // tag Bing gives you at https://www.bing.com/webmasters (Add site → verify by
    // meta tag), then uncomment. Leaving it empty would emit a broken tag, so it
    // stays commented until you have the real value.
    // other: { "msvalidate.01": "PASTE_BING_TOKEN_HERE" },
  },
};

const GA_MEASUREMENT_ID = "G-5HC2J82REX";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${inter.variable} ${jetbrainsMono.variable} ${barlowCondensed.variable}`}>
      <head>
        <meta name="theme-color" content="#082f49" />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-volcanic-800">
        <SiteJsonLd />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
      </body>
    </html>
  );
}
