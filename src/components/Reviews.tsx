"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PlaceSummary } from "@/lib/google-places";
import { site } from "@/content/site";
import { googleRating, googleReviews, relativeTime } from "@/content/reviews";
import { ArrowIcon, GoogleIcon, StarIcon } from "@/components/Icons";

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
  const rating = data ? data.rating : data === null ? googleRating.rating : null;
  const count = data ? data.count : googleRating.count;

  return (
    <section id="reviews" ref={root} aria-labelledby="reviews-title" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-5">Guest reviews</p>
            <h2 id="reviews-title" className="h2 text-ink">
              What our guests say
            </h2>
            {rating != null && (
              <a
                href={readUrl}
                target="_blank"
                rel="noopener"
                className="group mt-6 flex w-fit flex-wrap items-center gap-4 rounded-2xl"
              >
                <GoogleIcon className="h-9 w-9" />
                <span className="font-display text-5xl font-medium text-ink">{rating.toFixed(1)}</span>
                <span>
                  <Stars value={rating} className="h-5 w-5" />
                  <span className="mt-1 block text-sm text-muted underline-offset-4 group-hover:underline">
                    Based on {count.toLocaleString("en-PK")} Google review{count === 1 ? "" : "s"}
                  </span>
                </span>
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={readUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center rounded-full border focus-visible:rounded-full! border-ink/25 px-6 font-medium text-ink transition hover:border-ink hover:bg-ink hover:text-cream"
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Read all on Google
            </a>
            <a
              href={writeUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center rounded-full bg-ink focus-visible:rounded-full! px-6 font-medium text-cream transition hover:bg-coal"
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

      {data === null && <CuratedReviews readUrl={readUrl} />}
    </section>
  );
}

const noopSubscribe = () => () => {};

const arrowBtn =
  "grid h-11 w-11 place-items-center rounded-full border border-ink/25 text-ink transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink hover:bg-ink hover:text-cream focus-visible:rounded-full! disabled:pointer-events-none disabled:opacity-30";

// Hand-picked Google reviews (no API key needed), laid out like Google's own review cards.
function CuratedReviews({ readUrl }: { readUrl: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  // Relative times are computed after mount so server and client markup always match.
  const today = useSyncExternalStore(noopSubscribe, () => Math.floor(Date.now() / 86_400_000), () => null);
  const now = today == null ? null : new Date(today * 86_400_000);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scroll(dir: 1 | -1) {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 24), behavior: "smooth" });
  }

  return (
    <div className="mt-12">
      <div className="mx-auto hidden max-w-7xl justify-end gap-3 px-5 md:flex md:px-8">
        <button type="button" onClick={() => scroll(-1)} disabled={edge.start} aria-label="Previous reviews" className={arrowBtn}>
          <ArrowIcon dir="left" />
        </button>
        <button type="button" onClick={() => scroll(1)} disabled={edge.end} aria-label="Next reviews" className={arrowBtn}>
          <ArrowIcon />
        </button>
      </div>

      <ul
        ref={track}
        aria-label="Google reviews"
        className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-6 [scrollbar-width:none] sm:scroll-px-8 sm:px-8 md:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] md:px-[max(2rem,calc((100vw-80rem)/2+2rem))] [&::-webkit-scrollbar]:hidden"
      >
        {googleReviews.map((r) => {
          const ago = now && relativeTime(r.date, now);
          const isNew = now && now.getTime() - new Date(r.date).getTime() < 30 * 86_400_000;
          return (
            <li key={r.author} className="w-[85%] shrink-0 snap-start sm:w-[22rem]">
              <article className="flex h-full flex-col rounded-3xl border border-line bg-paper p-7 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.35)]">
                <header className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/30 font-semibold text-ink" aria-hidden="true">
                    {r.author.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-ink">{r.author}</h3>
                    <p className="truncate text-xs text-muted">{r.meta}</p>
                  </div>
                  <GoogleIcon className="h-5 w-5 shrink-0" />
                </header>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Stars value={r.rating} />
                  {ago && <span className="text-xs text-muted">{ago}</span>}
                  {isNew && (
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[0.7rem] font-medium text-ink/70">
                      New
                    </span>
                  )}
                </div>

                {r.context && <p className="mt-3 text-xs font-medium text-muted">{r.context}</p>}
                {r.text && <p className="mt-3 line-clamp-6 leading-relaxed text-ink/80">{r.text}</p>}

                {r.scores && (
                  <p className="mt-auto pt-5 text-xs text-muted">
                    <span className="sr-only">Ratings: </span>
                    Food {r.scores.food}/5 · Service {r.scores.service}/5 · Atmosphere {r.scores.atmosphere}/5
                  </p>
                )}
              </article>
            </li>
          );
        })}

        <li className="w-[85%] shrink-0 snap-start sm:w-[22rem]">
          <a
            href={readUrl}
            target="_blank"
            rel="noopener"
            className="group flex h-full min-h-64 flex-col justify-between rounded-3xl bg-ink p-7 text-cream transition-colors duration-500 hover:bg-coal focus-visible:rounded-3xl!"
          >
            <GoogleIcon className="h-8 w-8" />
            <span>
              <span className="font-display block text-2xl leading-tight">
                See all {googleRating.count} reviews on Google
              </span>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gold">
                Open Google Maps
                <ArrowIcon className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
              </span>
            </span>
          </a>
        </li>
      </ul>

      <p className="mx-auto max-w-7xl px-5 text-[13px] text-muted md:px-8">
        Selected reviews from our Google Maps listing.{" "}
        <a href={readUrl} target="_blank" rel="noopener" className="font-medium text-ink underline-offset-4 hover:underline">
          Read every review on Google
        </a>
        .
      </p>
    </div>
  );
}
