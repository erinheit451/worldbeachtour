import type { Metadata } from "next";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Beach Tour — Every Beach on Earth",
  description:
    "The definitive guide to every beach on Earth. Travel, surf, environment, history, sand geology, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-gray-900">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
