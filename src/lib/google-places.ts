import "server-only";

// Google Places API (New): Place Details. Docs: developers.google.com/maps/documentation/places/web-service/place-details
// Policy note: Places content (rating, reviews) must NOT be cached or stored. Only the place ID may be stored.

export type PlaceReview = {
  name: string;
  rating: number;
  text: string;
  relativeTime: string;
  authorName: string;
  authorUri?: string;
  authorPhoto?: string;
  reviewUri?: string;
};

export type PlaceSummary = {
  rating: number | null;
  count: number;
  mapsUri: string | null;
  writeReviewUri: string | null;
  reviews: PlaceReview[];
};

type ApiReview = {
  name?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

export async function getPlaceSummary(): Promise<PlaceSummary | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: ApiReview[];
    };
    return {
      rating: data.rating ?? null,
      count: data.userRatingCount ?? 0,
      mapsUri: data.googleMapsUri ?? null,
      writeReviewUri: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
      reviews: (data.reviews ?? [])
        .filter((r) => r.text?.text || r.originalText?.text)
        .slice(0, 5)
        .map((r) => ({
          name: r.name ?? crypto.randomUUID(),
          rating: r.rating ?? 0,
          text: r.text?.text ?? r.originalText?.text ?? "",
          relativeTime: r.relativePublishTimeDescription ?? "",
          authorName: r.authorAttribution?.displayName ?? "Google user",
          authorUri: r.authorAttribution?.uri,
          authorPhoto: r.authorAttribution?.photoUri,
          reviewUri: r.googleMapsUri,
        })),
    };
  } catch {
    return null;
  }
}
