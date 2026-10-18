import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smaller at equal quality), WebP fallback; q85 keeps food photos crisp on Retina screens
    formats: ["image/avif", "image/webp"],
    qualities: [85],
  },
  cacheComponents: true,
  partialPrefetching: true,
  // One canonical host: www duplicates the whole site otherwise
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.cafenuofficial.com" }],
        destination: "https://cafenuofficial.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
