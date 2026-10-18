"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// Pinned three-layer parallax: tiles (back), salad (mid), branded cup (front).
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
    <section id="about" ref={root} aria-labelledby="about-title" className="relative overflow-hidden bg-cream py-16 sm:py-24 md:py-32 lg:flex lg:min-h-screen lg:items-center lg:py-0">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:gap-16 md:px-8 lg:grid-cols-2">
        <div className="relative mx-auto h-[400px] w-full max-w-lg sm:h-[520px] [perspective:1400px] lg:h-[640px]">
          <div data-layer="back" className="tiles absolute left-[6%] top-[4%] h-[62%] w-[70%] rounded-3xl opacity-90 shadow-xl" />
          <div data-layer="mid" className="absolute right-0 top-[10%] h-[62%] w-[58%] overflow-hidden rounded-3xl shadow-2xl">
            <Image src="/images/cafe-nu-caesar-salad.jpg" alt="Caesar salad being finished with parmesan in front of Cafe Nu's teal velvet chairs" fill quality={85} sizes="(min-width: 1024px) 18rem, 55vw" className="object-cover" />
          </div>
          <div data-layer="front" className="absolute bottom-0 left-[10%] h-[58%] w-[50%] overflow-hidden rounded-[2rem] border-4 border-cream shadow-2xl">
            <Image src="/images/cafe-nu-sandwich-and-coffee-cup.jpg" alt="A stacked focaccia sandwich balanced on a Cafe Nu branded takeaway coffee cup" fill quality={85} sizes="(min-width: 1024px) 16rem, 50vw" className="object-cover" />
          </div>
        </div>

        <div>
          <p className="eyebrow mb-5">About Cafe Nu</p>
          <h2 id="about-title" className="h2 text-ink">
            Freshness, flavour and comfort, <em className="text-gold-deep">all day long.</em>
          </h2>
          <div className="mt-8 space-y-5 text-lg font-light leading-relaxed text-muted">
            <p data-line>
              Cafe Nu is a modern all-day dining destination in DHA Phase 2, Karachi. From handcrafted coffee and
              in-house baked breads to wholesome breakfasts, pizzas, pastas and signature meals, everything is
              thoughtfully prepared.
            </p>
            <p data-line>
              Pull up a teal velvet chair at an oak table, under arched pendant lights and greenery, and let our team
              look after you. A warm room and quality service make every visit feel special.
            </p>
          </div>
          <ul data-line className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {[
              ["Handcrafted", "coffee & matcha"],
              ["Baked", "in-house breads"],
              ["All-day", "breakfast & plates"],
            ].map(([a, b]) => (
              <li key={a}>
                <p className="font-display text-2xl text-ink md:text-3xl">{a}</p>
                <p className="mt-1 text-sm text-muted">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
