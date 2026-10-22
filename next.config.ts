import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smaller at equal quality), WebP fallback; q85 keeps food photos crisp on Retina screens
    formats: ["image/avif", "image/webp"],
    qualities: [85],
  },
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
  // One canonical host: www duplicates the whole site otherwise
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.cafenuofficial.com" }],
        destination: "https://cafenuofficial.com/:path*",
        permanent: true,
      },
      // Old logo/icon filenames (renamed with the new badge) still referenced by caches and installed apps
      ...[
        ["/images/cafe-nu-logo.png", "/images/cafe-nu-badge.png"],
        ["/images/cafe-nu-logo-168.png", "/images/cafe-nu-badge-168.png"],
        ["/icon-192.png", "/cafe-nu-icon-192.png"],
        ["/icon-512.png", "/cafe-nu-icon-512.png"],
        ["/icon-maskable-512.png", "/cafe-nu-icon-maskable-512.png"],
        ["/icon.png", "/cafe-nu-icon-192.png"],
        ["/apple-icon.png", "/cafe-nu-apple-icon.png"],
        ["/video/cafe-nu-reel.mp4", "/video/cafe-nu-reel-720.mp4"],
        ["/cafe-nu-menu.pdf", "/cafe-nu-menu-2026-10-22.pdf"],
      ].map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
};

export default nextConfig;
