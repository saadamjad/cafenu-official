"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const photos = [
  { src: "/images/cafe-nu-club-sandwich.jpg", alt: "Cafe Nu club sandwich on brown bread served on a teal velvet seat", tall: true },
  { src: "/images/cafe-nu-all-day-breakfast-latte.jpg", alt: "All-day breakfast plate with a latte on a white table over tiled floor" },
  { src: "/images/cafe-nu-creamy-tuscan-chicken-pasta.jpg", alt: "Creamy Tuscan chicken pasta with garlic bread served over a checkered floor", tall: true },
  { src: "/images/cafe-nu-scrambled-egg-croissant.jpg", alt: "Scrambled eggs in a croissant with sausages and mixed salad", tall: true },
  { src: "/images/cafe-nu-caesar-salad.jpg", alt: "Caesar salad with grilled chicken and boiled egg on an oak table" },
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

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
    <section id="gallery" ref={root} aria-labelledby="gallery-title" className="relative overflow-hidden bg-coal py-28 text-cream">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow eyebrow--light mb-5">Gallery &amp; reels</p>
          <h2 id="gallery-title" className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-[0.95]">
            Straight from our tables
          </h2>
          <div className="mx-auto mt-12 w-[min(17rem,70vw)] [perspective:1400px] lg:mx-0">
            <div data-phone className="relative rounded-[2.6rem] border-[10px] border-[#0e0e0e] bg-black shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] [transform-style:preserve-3d]">
              <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
              <video
                ref={video}
                className="aspect-[9/16] w-full rounded-[2rem] object-cover"
                src="/video/cafe-nu-reel.mp4"
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

        <ul className="columns-1 gap-6 sm:columns-2 [&>li]:mb-6">
          {photos.map((p) => (
            <li key={p.src} data-photo className={`relative break-inside-avoid overflow-hidden rounded-[2rem] ${p.tall ? "aspect-[2/3]" : "aspect-[4/3]"}`}>
              <Image src={p.src} alt={p.alt} fill quality={85} sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw" className="object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
