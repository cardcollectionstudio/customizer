import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site into the `out/` directory.
  // GitHub Pages serves static files only — no Node.js server.
  output: 'export',

  // next/image's server-side optimizer is unavailable in static export mode.
  // Images are served as-is from the `public/` directory.
  images: {
    unoptimized: true,
  },

  // Required when hosted at cardcollectionstudio.github.io/customizer/ (no custom domain).
  // basePath: tells Next.js router that the app lives at /customizer.
  // assetPrefix: tells Next.js to prepend /customizer to all _next/static/* asset URLs.
  // Remove both once the custom domain (cardcollectionstudio.shop) is active.
  basePath: '/customizer',
  assetPrefix: '/customizer',

  env: {
    NEXT_PUBLIC_BASE_PATH: '/customizer',
  },
};

export default nextConfig;


