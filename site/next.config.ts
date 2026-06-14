import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // ISR migration: standalone Node server instead of a static export. Unlocks
  // on-demand rendering for the long tail (no 76k static files), ISR caching,
  // and server route handlers (the live NDBC/NOAA buoy proxy). Deploy target:
  // the standalone server runs on the Hetzner box with nginx micro-cache in front.
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
