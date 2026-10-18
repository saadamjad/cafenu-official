import { menu, priceRange } from "@/content/menu";
import { sameAs, site } from "@/content/site";

// Only fields backed by real data are emitted; null TODOs in site.ts are skipped.
export function JsonLd() {
  const abs = (p: string) => new URL(p, site.url).toString();
  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${site.url}/#cafe`,
    name: site.name,
    url: site.url,
    description: site.description,
    image: [
      abs("/images/cafe-nu-all-day-breakfast-latte.jpg"),
      abs("/images/cafe-nu-club-sandwich.jpg"),
      abs("/images/cafe-nu-creamy-tuscan-chicken-pasta.jpg"),
    ],
    servesCuisine: ["Coffee", "Cafe", "Breakfast", "Italian", "Pakistani", "Continental"],
    priceRange: `Rs ${priceRange.min}–${priceRange.max}`,
    currenciesAccepted: site.currency,
    hasMenu: { "@id": `${site.url}/#menu` },
  };
  if (site.address)
    business.address = {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    };
  if (site.phone) business.telephone = site.phone;
  if (site.email) business.email = site.email;
  if (site.mapsUrl) business.hasMap = site.mapsUrl;
  if (site.hours.length)
    business.openingHoursSpecification = site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dayCodes,
      opens: h.opens,
      closes: h.closes,
    }));
  if (sameAs.length) business.sameAs = sameAs;

  const menuLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${site.url}/#menu`,
    name: `${site.name} Menu`,
    url: `${site.url}/#menu`,
    inLanguage: "en",
    hasMenuSection: menu.map((c) => ({
      "@type": "MenuSection",
      name: c.title,
      hasMenuItem: c.items.map((i) => ({
        "@type": "MenuItem",
        name: i.name,
        ...(i.description ? { description: i.description } : {}),
        ...(i.image ? { image: abs(i.image) } : {}),
        offers: { "@type": "Offer", price: i.price, priceCurrency: site.currency },
      })),
    })),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "en",
    publisher: { "@id": `${site.url}/#cafe` },
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so menu text can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify([business, menuLd, website]).replace(/</g, "\\u003c") }}
    />
  );
}
