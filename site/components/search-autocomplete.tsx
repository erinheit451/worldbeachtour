"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export type SearchEntry = {
  slug: string;
  name: string;
  country: string;
  countryName: string;
  admin1: string | null;
};

type Suggestion = SearchEntry & { score: number };

export default function SearchAutocomplete({
  index,
  total,
  defaultSuggestions,
  variant = "hero",
}: {
  index: SearchEntry[];
  total: number;
  defaultSuggestions: SearchEntry[]; // shown before typing
  variant?: "hero" | "panel";
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  const suggestions: Suggestion[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) {
      return defaultSuggestions.map((b) => ({ ...b, score: 0 }));
    }
    const out: Suggestion[] = [];
    for (const b of index) {
      const name = b.name.toLowerCase();
      const country = b.countryName.toLowerCase();
      const admin = (b.admin1 ?? "").toLowerCase();
      let score = 0;
      if (name.startsWith(query)) score = 100;
      else if (name.includes(query)) score = 60;
      else if (admin.startsWith(query)) score = 40;
      else if (country.startsWith(query)) score = 30;
      else if (admin.includes(query) || country.includes(query)) score = 20;
      if (score > 0) out.push({ ...b, score });
    }
    out.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    return out.slice(0, 6);
  }, [q, index, defaultSuggestions]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(slug: string) {
    window.location.href = `/beaches/${slug}`;
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) setOpen(true);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions[active]) go(suggestions[active].slug);
      else if (q.trim()) window.location.href = `/beaches?q=${encodeURIComponent(q)}`;
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const isHero = variant === "hero";

  return (
    <div ref={wrap} className="relative">
      <form
        action="/beaches"
        method="GET"
        onSubmit={(e) => {
          if (suggestions[active]) {
            e.preventDefault();
            go(suggestions[active].slug);
          }
        }}
      >
        <div
          className={
            isHero
              ? "flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md ring-1 ring-white/30 pl-5 pr-1.5 py-1.5 shadow-2xl shadow-black/30 focus-within:ring-ocean-400 transition"
              : "flex items-center gap-2 rounded-full bg-white ring-1 ring-volcanic-200 pl-5 pr-1.5 py-1.5 focus-within:ring-ocean-500 transition"
          }
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-volcanic-500 shrink-0">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            name="q"
            type="search"
            autoComplete="off"
            value={q}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onKeyDown={onKey}
            placeholder="Search a beach, a coast, or a city"
            className="flex-1 bg-transparent text-volcanic-900 placeholder-volcanic-400 outline-none text-[15px] py-2.5"
          />
          <button
            type="submit"
            className="rounded-full bg-volcanic-900 text-white px-5 py-2.5 text-[13px] font-medium hover:bg-volcanic-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white shadow-2xl shadow-black/20 ring-1 ring-volcanic-200 overflow-hidden z-50">
          {q.trim() === "" && (
            <div className="px-5 pt-3 pb-1 text-[11px] uppercase tracking-[0.2em] text-volcanic-400 font-mono">
              Try one of these
            </div>
          )}
          <ul role="listbox">
            {suggestions.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/beaches/${s.slug}`}
                  onMouseEnter={() => setActive(i)}
                  className={`flex items-center justify-between gap-3 px-5 py-3 text-[14px] transition-colors ${
                    i === active ? "bg-ocean-50 text-volcanic-900" : "text-volcanic-700 hover:bg-volcanic-50"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-volcanic-400">📍</span>
                    <span className="font-medium truncate">{s.name}</span>
                  </span>
                  <span className="text-[12px] text-volcanic-500 shrink-0 font-mono">
                    {s.admin1 ? `${s.admin1}, ${s.country}` : s.countryName}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/beaches"
            className="block px-5 py-3 text-[13px] font-medium text-ocean-700 bg-volcanic-50 hover:bg-volcanic-100 border-t border-volcanic-100"
          >
            Browse all {total.toLocaleString()} beaches →
          </Link>
        </div>
      )}
    </div>
  );
}
