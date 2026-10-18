"use client";
import { useEffect, useRef, useState } from "react";
import type { PlaceSummary } from "@/lib/google-places";
import { site } from "@/content/site";
import { StarIcon } from "@/components/Icons";

function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} className={className} filled={Math.max(0, Math.min(1, value - i))} />
      ))}
    </span>
  );
}

function Attribution() {
  // Places API policy: Google Maps attribution must be visible with this content.
  return (
    <p className="text-[13px] text-muted">
      Reviews from <span className="font-medium text-ink">Google Maps</span>, shown in Google&apos;s &ldquo;most relevant&rdquo; order.
    </p>
  );
}

// Loads live from Google only when scrolled into view (Places content may not be cached).
export function Reviews() {
  const root = useRef<HTMLElement>(null);
  const [data, setData] = useState<PlaceSummary | null | undefined>(undefined);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        fetch("/api/reviews")
          .then((r) => (r.ok ? r.json() : null))
          .then((d: PlaceSummary | null) => setData(d && d.reviews ? d : null))
          .catch(() => setData(null));
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const readUrl = data?.mapsUri ?? site.mapsUrl ?? site.directionsUrl;
  const writeUrl = data?.writeReviewUri ?? readUrl;

  return (
    <section id="reviews" ref={root} aria-labelledby="reviews-title" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-5">Guest reviews</p>
            <h2 id="reviews-title" className="h2 text-ink">
              What our guests say
            </h2>
            {data && data.rating != null && (
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="font-display text-5xl font-medium text-ink">{data.rating.toFixed(1)}</span>
                <div>
                  <Stars value={data.rating} className="h-5 w-5" />
                  <p className="mt-1 text-sm text-muted">
                    {data.count.toLocaleString("en-PK")} Google review{data.count === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={readUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center rounded-full border border-ink/25 px-6 font-medium text-ink transition hover:border-ink hover:bg-ink hover:text-cream"
            >
              Read all on Google
            </a>
            <a
              href={writeUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-medium text-cream transition hover:bg-coal"
            >
              Write a review
            </a>
          </div>
        </div>

        <div className="mt-12">
          {data === undefined && (
            <ul className="grid gap-5 md:grid-cols-3" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <li key={i} className="h-56 animate-pulse rounded-3xl bg-ink/5" />
              ))}
            </ul>
          )}

          {data === null && (
            <div className="grid items-center gap-6 rounded-3xl border border-line bg-paper p-8 md:grid-cols-[auto_1fr] md:p-10">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-ink text-gold">
                <StarIcon className="h-7 w-7" />
              </span>
              <div>
                <p className="font-display text-2xl text-ink">Rated by our guests on Google</p>
                <p className="mt-2 max-w-2xl text-muted">
                  Read what people say about our coffee, breakfasts and service, or share your own experience after
                  your visit. It helps more people find us.
                </p>
              </div>
            </div>
          )}

          {data && data.reviews.length > 0 && (
            <>
              <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {data.reviews.map((r) => (
                  <li key={r.name} className="flex flex-col rounded-3xl border border-line bg-paper p-7 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center gap-3">
                      {r.authorPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element -- Google-hosted avatar, attribution required
                        <img src={r.authorPhoto} alt="" width={40} height={40} referrerPolicy="no-referrer" className="h-10 w-10 rounded-full" loading="lazy" />
                      ) : (
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/30 font-semibold text-ink">
                          {r.authorName.charAt(0)}
                        </span>
                      )}
                      <div className="min-w-0">
                        {r.authorUri ? (
                          <a href={r.authorUri} target="_blank" rel="noopener" className="block truncate font-medium text-ink hover:underline">
                            {r.authorName}
                          </a>
                        ) : (
                          <p className="truncate font-medium text-ink">{r.authorName}</p>
                        )}
                        <p className="text-xs text-muted">{r.relativeTime}</p>
                      </div>
                    </div>
                    <Stars value={r.rating} className="mt-4 h-4 w-4" />
                    <p className="mt-3 line-clamp-6 flex-1 leading-relaxed text-ink/80">{r.text}</p>
                    {r.reviewUri && (
                      <a href={r.reviewUri} target="_blank" rel="noopener" className="mt-5 text-sm font-medium text-gold-deep underline-offset-4 hover:underline">
                        View on Google Maps
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Attribution />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
