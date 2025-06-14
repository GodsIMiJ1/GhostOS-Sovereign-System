import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization for Netlify
  images: {
    unoptimized: true,
  },

  // Trailing slash for better hosting
  trailingSlash: true,
};

export default nextConfig;
