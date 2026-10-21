import { menu, priceRange } from "@/content/menu";
import { sameAs, site } from "@/content/site";

const abs = (p: string) => new URL(p, site.url).toString();

function LdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so menu text can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// Home page: the cafe itself + the website. Only fields backed by real data are emitted; null TODOs in site.ts are skipped.
export function SiteJsonLd() {
  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${site.url}/#cafe`,
    name: site.name,
    url: site.url,
    description: site.description,
    logo: abs("/images/cafe-nu-badge.png"),
    image: [
      abs("/images/cafe-nu-all-day-breakfast-latte.jpg"),
      abs("/images/cafe-nu-club-sandwich.jpg"),
      abs("/images/cafe-nu-creamy-tuscan-chicken-pasta.jpg"),
    ],
    servesCuisine: ["Coffee", "Cafe", "Breakfast", "Italian", "Pakistani", "Continental"],
    priceRange: `Rs ${priceRange.min}–${priceRange.max}`,
    currenciesAccepted: site.currency,
    hasMenu: { "@id": `${site.url}/menu#menu` },
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

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "en",
    publisher: { "@id": `${site.url}/#cafe` },
  };

  return <LdScript data={[business, website]} />;
}

// Menu page: the priced menu (what /menu actually shows) + its breadcrumb.
export function MenuJsonLd() {
  const menuLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${site.url}/menu#menu`,
    name: `${site.name} Menu`,
    url: `${site.url}/menu`,
    inLanguage: "en",
    provider: { "@id": `${site.url}/#cafe` },
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

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "Menu", item: `${site.url}/menu` },
    ],
  };

  return <LdScript data={[menuLd, breadcrumb]} />;
}
