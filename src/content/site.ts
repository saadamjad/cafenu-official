// Single source of truth for business details.
// Anything left as `null` is hidden on the page AND omitted from structured data,
// so nothing incorrect is ever published. Fill these in before launch.

export type OpeningHours = { days: string; dayCodes: string[]; opens: string; closes: string };

export const site = {
  name: "Cafe Nu",
  url: "https://cafenuofficial.com",
  tagline: "Modern Coffee Cafe & Restaurant",
  description:
    "Cafe Nu is a modern coffee cafe and restaurant serving specialty espresso, iced matcha, all-day breakfast, fresh pasta, gourmet sandwiches, burgers and steaks.",
  locale: "en_PK",
  currency: "PKR",

  // TODO: real details (used in the Visit section, footer and LocalBusiness schema)
  city: null as string | null, // e.g. "Lahore"
  address: null as null | {
    street: string;
    locality: string; // city
    region: string; // province
    postalCode: string;
    country: "PK";
  },
  phone: null as string | null, // E.164, e.g. "+923001234567"
  whatsapp: null as string | null, // E.164 digits only, e.g. "923001234567"
  email: null as string | null,
  mapsUrl: null as string | null, // Google Maps share link
  hours: [] as OpeningHours[], // e.g. [{ days: "Mon – Sun", dayCodes: ["Monday", ...], opens: "08:00", closes: "23:00" }]
  socials: {
    instagram: null as string | null, // TODO: e.g. "https://www.instagram.com/<handle>/"
    tiktok: null as string | null,
    facebook: null as string | null, // TODO: e.g. "https://www.facebook.com/<page>"
  },
};

export const sameAs = Object.values(site.socials).filter((v): v is string => Boolean(v));
