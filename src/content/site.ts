// Single source of truth for business details (from the Cafe NU Google Business Profile).
// Anything left as `null` is hidden on the page AND omitted from structured data.

export type OpeningHours = { days: string; dayCodes: string[]; opens: string; closes: string };

const address = {
  street: "Shop #1, Ground Floor, 6C Old Sunset Blvd, D.H.A. Phase 2",
  locality: "Karachi",
  region: "Sindh",
  postalCode: "75500",
  country: "PK" as const,
};

const mapsQuery = encodeURIComponent(`Cafe NU, ${address.street}, ${address.locality} ${address.postalCode}`);

export const site = {
  name: "Cafe Nu",
  url: "https://cafenuofficial.com",
  tagline: "Modern Coffee Cafe & Restaurant",
  description:
    "Cafe Nu is a modern all-day cafe and restaurant in DHA Phase 2, Karachi: handcrafted coffee, in-house baked breads, wholesome breakfasts, pizzas, pastas and signature meals.",
  locale: "en_PK",
  currency: "PKR",
  timeZone: "Asia/Karachi",

  city: "Karachi" as string | null,
  address: address as null | typeof address,
  phone: "+923363299555" as string | null, // E.164
  phoneDisplay: "0336 3299555",
  whatsapp: "923363299555" as string | null, // digits only, for wa.me
  email: null as string | null,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}` as string | null,
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
  mapEmbedUrl: `https://www.google.com/maps?q=${mapsQuery}&output=embed`,
  hours: [
    {
      days: "Monday – Sunday",
      dayCodes: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "23:00",
    },
  ] as OpeningHours[],
  socials: {
    instagram: "https://www.instagram.com/cafenu_" as string | null,
    facebook: "https://www.facebook.com/profile.php?id=61594756180377" as string | null,
    linkedin: "https://www.linkedin.com/company/cafeu/" as string | null,
    tiktok: null as string | null,
  },
};

export const sameAs = Object.values(site.socials).filter((v): v is string => Boolean(v));

export const telHref = site.phone ? `tel:${site.phone}` : null;
export const whatsappHref = site.whatsapp ? `https://wa.me/${site.whatsapp}` : null;

/** "08:00" -> "8 am", "23:00" -> "11 pm" */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Open/closed state right now, in the cafe's own time zone. Client-side only (time-dependent). */
export function openStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timeZone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = get("weekday");
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
  const today = site.hours.find((h) => h.dayCodes.includes(day));
  if (today && minutes >= toMin(today.opens) && minutes < toMin(today.closes)) {
    return { open: true, label: `Open now · until ${formatTime(today.closes)}`, day };
  }
  // next opening: later today, otherwise the next day that has hours
  if (today && minutes < toMin(today.opens)) return { open: false, label: `Closed · opens ${formatTime(today.opens)}`, day };
  for (let i = 1; i <= 7; i++) {
    const next = DAYS[(DAYS.indexOf(day) + i) % 7];
    const h = site.hours.find((x) => x.dayCodes.includes(next));
    if (h) return { open: false, label: `Closed · opens ${i === 1 ? "tomorrow" : next} ${formatTime(h.opens)}`, day };
  }
  return { open: false, label: "Closed", day };
}
