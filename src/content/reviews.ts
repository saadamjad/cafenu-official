// Hand-picked from the Cafe NU Google Maps listing ("Most relevant" order). Text is copied verbatim.
// Update by hand when new reviews come in; keep `rating`/`count` in sync with Google.
// `date` is approximate (from Google's "a week ago" etc.) so the relative time stays truthful as it ages.

export type GoogleReview = {
  author: string;
  meta: string; // e.g. "1 review · 3 photos", "Local Guide · 3 reviews"
  rating: number;
  date: string; // ISO date
  context?: string; // e.g. "Dine in · Dinner"
  text?: string;
  scores?: { food: number; service: number; atmosphere: number };
};

const allFives = { food: 5, service: 5, atmosphere: 5 };

export const googleRating = { rating: 4.9, count: 8 };

export const googleReviews: GoogleReview[] = [
  {
    author: "Ushba Shaikh",
    meta: "1 review · 3 photos",
    rating: 5,
    date: "2026-10-11",
    text: "Had a great experience at cafe nu. Vibe is good. Service is great. Food was so fresh and delicious and thier portion size is just right too. Do try their club sandwich and rustic chicken brushetta. Highly recommended 👌",
    scores: allFives,
  },
  {
    author: "Masood Khan",
    meta: "1 review",
    rating: 5,
    date: "2026-10-11",
    text: "Portion size is good. Price is reasonable for the quality. The place is well maintained. Overall a great experience.",
    scores: allFives,
  },
  {
    author: "Azra Masood",
    meta: "1 review",
    rating: 5,
    date: "2026-10-11",
    text: "Amazing food and even better ambiance! Great service, very clean, and perfect for families. Will definitely visit again. Highly recommend.",
    scores: allFives,
  },
  {
    author: "mahreen amjad",
    meta: "1 review · 1 photo",
    rating: 5,
    date: "2026-10-11",
    context: "Dinner · Rs 1,000–2,000",
    text: "Best place… everything is good food services and comfortable …",
  },
  {
    author: "Hassaan Khan",
    meta: "1 review",
    rating: 5,
    date: "2026-10-11",
    text: "Recommended!! Great food, good ambiance and excellent vibe!!",
    scores: allFives,
  },
  {
    author: "javeria khan",
    meta: "2 reviews · 5 photos",
    rating: 5,
    date: "2026-10-11",
    context: "Dine in · Dinner",
    text: "Highly recommend! This one is going to be my new fav spot in k-town.",
    scores: allFives,
  },
  {
    author: "Haris",
    meta: "Google user",
    rating: 5,
    date: "2026-10-11",
    context: "Breakfast · Rs 1,000–2,000",
    scores: allFives,
  },
  {
    author: "Amir Mehtab",
    meta: "Local Guide · 3 reviews",
    rating: 4,
    date: "2026-09-18",
    scores: { food: 4, service: 5, atmosphere: 5 },
  },
];

/** Google-style relative time: "a week ago", "3 weeks ago", "a month ago"… */
export function relativeTime(iso: string, now = new Date()) {
  const days = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 86_400_000));
  const unit = (n: number, one: string) => (n <= 1 ? `a ${one} ago` : `${n} ${one}s ago`);
  if (days < 1) return "today";
  if (days < 7) return unit(days, "day");
  if (days < 30) return unit(Math.floor(days / 7), "week");
  if (days < 365) return unit(Math.floor(days / 30), "month");
  return unit(Math.floor(days / 365), "year");
}
