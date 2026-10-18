import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${site.url}/images/cafe-nu-all-day-breakfast-latte.jpg`],
    },
    { url: `${site.url}/menu`, changeFrequency: "monthly", priority: 0.9 },
  ];
}
