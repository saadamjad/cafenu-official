import type { MetadataRoute } from "next";
import { menu } from "@/content/menu";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = site.contentUpdated;
  const dishImages = [...new Set(menu.flatMap((c) => c.items.flatMap((i) => (i.image ? [`${site.url}${i.image}`] : []))))];
  return [
    {
      url: `${site.url}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${site.url}/images/cafe-nu-all-day-breakfast-latte.jpg`],
    },
    { url: `${site.url}/menu`, lastModified, changeFrequency: "monthly", priority: 0.9, images: dishImages },
  ];
}
