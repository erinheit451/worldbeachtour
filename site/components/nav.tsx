"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Routes that render a full-bleed hero photo at the very top of the page.
// On these the nav floats transparently over the photo; everywhere else it
// sits on a solid ocean-950 band so the page is bookended by the footer.
function isHeroRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === "/") return true;
  if (pathname.startsWith("/beaches/") && pathname !== "/beaches") return true;
  return false;
}

export default function Nav() {
  const pathname = usePathname();
  const overHero = isHeroRoute(pathname);

  // When over a hero, fade in a subtle ocean-950 backing once the user scrolls
  // past ~80px so links stay legible against varied photography.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  // Hero routes: fixed overlay so the hero photo fills behind the nav.
  // Non-hero routes: sticky in-flow so content starts cleanly below.
  const wrapperClass = overHero
    ? `fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-ocean-950/85 backdrop-blur-md border-b border-white/10"
          : "bg-gradient-to-b from-black/40 via-black/15 to-transparent"
      }`
    : "sticky top-0 z-50 bg-ocean-950 border-b border-white/10";

  const linkClass =
    "text-[11px] font-medium uppercase tracking-[0.22em] text-white/70 hover:text-white transition-colors";

  return (
    <nav className={wrapperClass}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${overHero ? "h-14" : "h-16"}`}>
          <Link href="/" className="group flex items-baseline gap-2">
            <span
              className="text-white text-[15px] sm:text-base font-semibold uppercase"
              style={{
                fontFamily: "var(--font-barlow-condensed), system-ui, sans-serif",
                letterSpacing: "0.22em",
              }}
            >
              World
              <span className="mx-2 text-sand-300/90">·</span>
              Beach
              <span className="mx-2 text-sand-300/90">·</span>
              Tour
            </span>
          </Link>

          <div className="flex items-center gap-7 sm:gap-9">
            <Link href="/beaches" className={linkClass}>
              Beaches
            </Link>
            <Link href="/regions" className={linkClass}>
              Regions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
