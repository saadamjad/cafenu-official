import type { Metadata } from "next";
import { site } from "@/content/site";

export const pageTitle = site.city
  ? `${site.name} | ${site.tagline} in ${site.city}`
  : `${site.name} | ${site.tagline}`;

export const pageDescription = site.city
  ? `${site.name} in ${site.city}: specialty espresso, iced matcha, all-day breakfast, creamy pasta, club sandwiches, burgers and steaks. See the full menu with prices, opening hours and directions.`
  : `${site.name} is a modern coffee cafe and restaurant: specialty espresso, iced matcha, all-day breakfast, creamy pasta, club sandwiches, burgers and steaks. See the full menu with prices.`;

type PageSeo = { title?: string; description?: string; path?: string };

// Pages pass their own title/description/path; Next replaces openGraph and twitter wholesale per page,
// so every page must get the full objects (image, siteName, type) from here.
export function buildMetadata({ title = pageTitle, description = pageDescription, path = "/" }: PageSeo = {}): Metadata {
  const ogImage = { url: "/og-cafe-nu.jpg", width: 1200, height: 630, alt: "Cafe Nu all-day breakfast with a latte" };
  return {
    metadataBase: new URL(site.url),
    title,
    description,
    applicationName: site.name,
    icons: {
      icon: [{ url: "/cafe-nu-icon-192.png", sizes: "192x192", type: "image/png" }],
      apple: [{ url: "/cafe-nu-apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    alternates: { canonical: path },
    robots: { index: true, follow: true, "max-image-preview": "large" } as Metadata["robots"],
    openGraph: {
      type: "website",
      url: path,
      siteName: site.name,
      title,
      description,
      locale: site.locale,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
    formatDetection: { telephone: true, address: true },
  };
}
