"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// Pinned three-layer parallax: breakfast (back), salad (mid), branded cup (front).
export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]");
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", scrub: 1.4, pin: true },
        });
        tl.fromTo("[data-layer=back]", { yPercent: 10, rotate: -6 }, { yPercent: -20, rotate: 4, ease: "none" }, 0)
          .fromTo("[data-layer=mid]", { yPercent: 30, rotateY: -25 }, { yPercent: -15, rotateY: 8, ease: "none" }, 0)
          .fromTo("[data-layer=front]", { yPercent: 70, rotateY: 30, rotateZ: 6 }, { yPercent: -30, rotateY: -10, rotateZ: -3, ease: "none" }, 0);
        // copy reveals once, fully legible (no half-faded scrubbed text)
        gsap.from(lines, { opacity: 0, y: 32, stagger: 0.12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 60%" } });
      });
      mm.add("(max-width: 1023px)", () => {
        // phones: no pinning, but the three layers still drift at different depths
        const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.2 };
        gsap.fromTo("[data-layer=back]", { yPercent: 12, rotate: -5 }, { yPercent: -12, rotate: 3, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-layer=mid]", { yPercent: 22, rotateY: -18 }, { yPercent: -10, rotateY: 6, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-layer=front]", { yPercent: 40, rotateY: 22, rotateZ: 5 }, { yPercent: -18, rotateY: -8, rotateZ: -2, ease: "none", scrollTrigger: st });
        lines.forEach((l) =>
          gsap.from(l, { opacity: 0, y: 36, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: l, start: "top 90%" } }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="relative overflow-hidden bg-cream py-20 md:py-28 lg:flex lg:min-h-screen lg:items-center lg:py-0">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:gap-16 md:px-8 lg:grid-cols-2">
        <div className="relative mx-auto h-[400px] w-full max-w-lg sm:h-[520px] [perspective:1400px] lg:h-[640px]">
          <div data-layer="back" className="absolute left-[6%] top-[4%] h-[62%] w-[70%] overflow-hidden rounded-3xl shadow-xl">
            <Image src="/images/cafe-nu-all-day-breakfast-latte.jpg" alt="Cafe Nu all-day breakfast and a latte on a white table over the checkered floor" fill quality={85} sizes="(min-width: 1024px) 22rem, 70vw" className="object-cover object-[30%_50%]" />
          </div>
          <div data-layer="mid" className="absolute right-0 top-[10%] h-[62%] w-[58%] overflow-hidden rounded-3xl shadow-2xl">
            <Image src="/images/cafe-nu-caesar-salad.jpg" alt="Caesar salad being finished with parmesan in front of Cafe Nu's teal velvet chairs" fill quality={85} sizes="(min-width: 1024px) 18rem, 55vw" className="object-cover" />
          </div>
          <div data-layer="front" className="absolute bottom-0 left-[10%] h-[58%] w-[50%] overflow-hidden rounded-[2rem] border-4 border-cream shadow-2xl">
            <Image src="/images/cafe-nu-sandwich-and-coffee-cup.jpg" alt="A stacked focaccia sandwich balanced on a Cafe Nu branded takeaway coffee cup" fill quality={85} sizes="(min-width: 1024px) 16rem, 50vw" className="object-cover" />
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">About Cafe Nu</p>
          <h2 id="about-title" className="h2 text-ink">
            Freshness, flavour and comfort, <em className="text-gold-deep">all day long.</em>
          </h2>
          <div className="mt-6 space-y-4">
            <p data-line className="lead">
              An all-day cafe in DHA Phase 2, Karachi. Handcrafted coffee, bread baked in-house, and breakfasts,
              pizzas and pastas made with care.
            </p>
            <p data-line className="lead">
              Teal velvet chairs, oak tables and arched pendant lights. Settle in, and let our team look after you.
            </p>
          </div>
          <ul data-line className="mt-10 grid grid-cols-3 gap-3 border-t border-line pt-8 sm:gap-4">
            {[
              ["Hand\u00ADcrafted", "coffee & matcha"],
              ["Baked", "in-house breads"],
              ["All-day", "breakfast & plates"],
            ].map(([a, b]) => (
              <li key={a}>
                <p className="font-display text-xl leading-tight text-ink sm:text-2xl md:text-3xl">{a}</p>
                <p className="mt-1 text-sm text-muted">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
