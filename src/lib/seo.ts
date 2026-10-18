import type { Metadata } from "next";
import { site } from "@/content/site";

export const pageTitle = site.city
  ? `${site.name} | ${site.tagline} in ${site.city}`
  : `${site.name} | ${site.tagline}`;

export const pageDescription = site.city
  ? `${site.name} in ${site.city}: specialty espresso, iced matcha, all-day breakfast, creamy pasta, club sandwiches, burgers and steaks. See the full menu with prices, opening hours and directions.`
  : `${site.name} is a modern coffee cafe and restaurant: specialty espresso, iced matcha, all-day breakfast, creamy pasta, club sandwiches, burgers and steaks. See the full menu with prices.`;

export function buildMetadata(): Metadata {
  const ogImage = { url: "/og-cafe-nu.jpg", width: 1200, height: 630, alt: "Cafe Nu all-day breakfast with a latte" };
  return {
    metadataBase: new URL(site.url),
    title: pageTitle,
    description: pageDescription,
    applicationName: site.name,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true, "max-image-preview": "large" } as Metadata["robots"],
    openGraph: {
      type: "website",
      url: "/",
      siteName: site.name,
      title: pageTitle,
      description: pageDescription,
      locale: site.locale,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: [ogImage.url] },
    formatDetection: { telephone: true, address: true },
  };
}
