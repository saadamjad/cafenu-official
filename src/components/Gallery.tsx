"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronIcon, CloseIcon } from "@/components/Icons";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const photos = [
  { src: "/images/cafe-nu-club-sandwich.jpg", alt: "Cafe Nu club sandwich on brown bread served on a teal velvet seat", tall: true },
  { src: "/images/cafe-nu-all-day-breakfast-latte.jpg", alt: "All-day breakfast plate with a latte on a white table over tiled floor" },
  { src: "/images/cafe-nu-creamy-tuscan-chicken-pasta.jpg", alt: "Creamy Tuscan chicken pasta with garlic bread served over a checkered floor", tall: true },
  { src: "/images/cafe-nu-scrambled-egg-croissant.jpg", alt: "Scrambled eggs in a croissant with sausages and mixed salad", tall: true },
  { src: "/images/cafe-nu-caesar-salad.jpg", alt: "Caesar salad with grilled chicken and boiled egg on an oak table" },
  { src: "/images/cafe-nu-pizza-pasta-sandwich-spread.jpg", alt: "Pepperoni pizza, penne pasta, a toasted sandwich with fries and a blue mojito on a sunny lounge table", tall: true },
  { src: "/images/cafe-nu-iced-frappe.jpg", alt: "Iced coffee frappé topped with whipped cream beside scattered coffee beans in morning sun", tall: true },
  { src: "/images/cafe-nu-club-sandwich-dining-room.jpg", alt: "Club sandwich with fries and a blue mojito at a table inside the Cafe Nu dining room" },
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  const openPhoto = (i: number) => {
    setCurrent(i);
    dialog.current?.showModal();
  };
  const step = (dir: number) => setCurrent((c) => (c === null ? c : (c + dir + photos.length) % photos.length));

  // Arrow keys page through the lightbox; Escape is handled natively by <dialog>.
  useEffect(() => {
    if (current === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  // Play the reel only while it is on screen.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !prefersReducedMotion()) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-phone]",
        { rotateY: -35, rotateX: 12, rotateZ: -6, y: 120 },
        { rotateY: 12, rotateX: -4, rotateZ: 3, y: -40, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.2 } },
      );
      gsap.utils.toArray<HTMLElement>("[data-photo]").forEach((p) => {
        gsap.fromTo(p.querySelector("img"), { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: 1.2 } });
        gsap.from(p, { clipPath: "inset(18% 18% 18% 18% round 2rem)", duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 85%" } });
      });
    },
    { scope: root },
  );

  return (
    <section id="gallery" ref={root} aria-labelledby="gallery-title" className="relative overflow-hidden bg-coal py-20 md:py-28 text-cream">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow eyebrow--light mb-4">Gallery &amp; reels</p>
          <h2 id="gallery-title" className="h2">
            Straight from our tables
          </h2>
          <div className="mx-auto mt-12 w-[min(17rem,70vw)] [perspective:1400px] lg:mx-0">
            <div data-phone className="relative rounded-[2.6rem] border-[10px] border-[#0e0e0e] bg-black shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] [transform-style:preserve-3d]">
              <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
              <video
                ref={video}
                className="aspect-[9/16] w-full rounded-[2rem] object-cover"
                src="/video/cafe-nu-reel-720.mp4"
                poster="/video/cafe-nu-reel-poster.jpg"
                muted
                loop
                playsInline
                preload="none"
                aria-label="Cafe Nu reel: iced latte, pizza, pasta, bruschetta, all-day breakfast and baked eggs, and our dining room"
              />
            </div>
          </div>
        </div>

        <ul className="columns-2 gap-3 sm:gap-6 [&>li]:mb-3 sm:[&>li]:mb-6">
          {photos.map((p, i) => (
            <li key={p.src} data-photo className={`relative break-inside-avoid overflow-hidden rounded-2xl sm:rounded-[2rem] ${p.tall ? "aspect-[2/3]" : "aspect-[4/3]"}`}>
              <button
                type="button"
                onClick={() => openPhoto(i)}
                className="group absolute inset-0 block h-full w-full cursor-zoom-in focus-visible:rounded-2xl!"
              >
                <span className="sr-only">View larger: </span>
                <Image src={p.src} alt={p.alt} fill quality={85} sizes="(min-width: 1024px) 26rem, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <span className="absolute bottom-2 right-2 rounded-full bg-coal/70 px-2.5 py-1 text-xs sm:bottom-3 sm:right-3 sm:px-3 font-medium text-cream backdrop-blur-sm" aria-hidden="true">
                  Tap to enlarge
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        onClose={() => setCurrent(null)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        aria-label="Photo viewer"
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-coal/95 p-0 text-cream backdrop:bg-black/80"
      >
        {current !== null && (
          <figure className="pointer-events-none flex h-full flex-col items-center justify-center gap-3 px-3 py-16 md:px-20">
            <div className="relative h-full w-full">
              <Image key={photos[current].src} src={photos[current].src} alt={photos[current].alt} fill quality={85} sizes="100vw" className="object-contain" />
            </div>
            <figcaption className="max-w-2xl text-center text-sm text-cream/75">
              {photos[current].alt} <span className="text-cream/45">· {current + 1}/{photos.length}</span>
            </figcaption>
          </figure>
        )}
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Close photo" className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:rounded-full!">
          <CloseIcon />
        </button>
        <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:rounded-full! md:left-5">
          <ChevronIcon className="h-6 w-6 rotate-180" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next photo" className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:rounded-full! md:right-5">
          <ChevronIcon className="h-6 w-6" />
        </button>
      </dialog>
    </section>
  );
}
