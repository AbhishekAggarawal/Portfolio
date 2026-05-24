/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output produces a self-contained build, ideal for Vercel + Docker
  output: "standalone",

  // Environment variables that should be exposed to the browser
  // (all NEXT_PUBLIC_* vars are automatically included)
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },
};

export default nextConfig;
