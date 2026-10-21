import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} | ${site.tagline}`,
    short_name: site.name,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ec",
    theme_color: "#1f1f1f",
    icons: [
      { src: "/cafe-nu-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/cafe-nu-icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/cafe-nu-icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
