"use client";
import { useEffect, useState } from "react";

export type HeroSlide = {
  src: string;
  alt: string;
  caption: string; // small text shown bottom-right (location credit)
};

export default function HeroRotator({
  slides,
  intervalMs = 7000,
}: {
  slides: HeroSlide[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [slides.length, intervalMs]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading={i === 0 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
      <div className="absolute bottom-3 right-4 text-[11px] font-mono text-white/60 z-10 text-right">
        {slides[index]?.caption}
      </div>
    </div>
  );
}
