"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { formatPrice, menu } from "@/content/menu";

const dishes = menu.flatMap((c) => c.items.filter((i) => i.image).map((i) => ({ ...i, category: c.title })));

const numberWord = (n: number) => ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"][n] ?? String(n);

// Vertical scroll drives a horizontal 3D carousel; cards rotate by distance from centre.
export function Signatures() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        const distance = () => track.scrollWidth - window.innerWidth + 64;

        const spin = () => {
          const mid = window.innerWidth / 2;
          cards.forEach((c) => {
            const r = c.getBoundingClientRect();
            const d = gsap.utils.clamp(-1, 1, (r.left + r.width / 2 - mid) / mid);
            gsap.set(c, { rotateY: d * -28, z: -Math.abs(d) * 160 });
          });
        };

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1.2,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: spin,
            onRefresh: spin,
          },
        });

        cards.forEach((c) =>
          gsap.fromTo(
            c.querySelector("[data-img]"),
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%" } },
          ),
        );
      });
      // phones: plain native swipe. No 3D transforms here: preserve-3d/rotateY on a
      // scroll container breaks touch scrolling and hit-testing in iOS Safari.
      mm.add("(max-width: 767px)", () => {
        gsap.from(gsap.utils.toArray<HTMLElement>("[data-card]"), {
          y: 40,
          opacity: 0,
          stagger: 0.06,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current!.querySelector("[data-track]"), start: "top 90%" },
        });
      });
    },
    { scope: root },
  );

  // Hover tilt + glare
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget.querySelector<HTMLElement>("[data-tilt]")!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: x * 14, rotateX: -y * 14, duration: 0.4 });
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const onLeave = (e: React.PointerEvent<HTMLElement>) =>
    gsap.to(e.currentTarget.querySelector("[data-tilt]"), { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });

  return (
    <section id="signatures" ref={root} aria-labelledby="sig-title" className="relative overflow-hidden bg-ink py-20 text-cream md:flex md:h-screen md:flex-col md:justify-center md:py-0">
      <div className="mx-auto mb-10 w-full max-w-7xl md:mb-16 px-5 md:px-8">
        <p className="eyebrow eyebrow--light mb-4">Signature plates</p>
        <h2 id="sig-title" className="h2 max-w-3xl">
          {numberWord(dishes.length)} plates from our kitchen.
        </h2>
      </div>

      <ul
        data-track
        className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:gap-6 sm:px-8 md:w-max md:touch-auto md:[perspective:1600px] md:[transform-style:preserve-3d] md:snap-none md:overflow-visible md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {dishes.map((d) => (
          <li key={d.name} data-card onPointerMove={onMove} onPointerLeave={onLeave} className="w-[80vw] max-w-[22rem] shrink-0 snap-start sm:w-[22rem]">
            <article data-tilt className="group relative overflow-hidden ring-logo rounded-[2rem] bg-coal md:[transform-style:preserve-3d]">
              <div data-img className="relative aspect-[4/5]">
                <Image src={d.image!} alt={d.name} fill quality={85} sizes="(min-width: 640px) 22rem, 78vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgba(255,255,255,0.25),transparent_45%)]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-coal via-coal/85 to-transparent p-6 pt-16 sm:p-7 sm:pt-20">
                <p className="label !text-gold">{d.category}</p>
                <h3 className="font-display mt-2 text-2xl font-medium leading-tight">{d.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-cream/75">{d.description}</p>
                <p className="mt-4 inline-block rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-ink">{formatPrice(d.price)}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <p className="label label--light mt-2 px-5 md:hidden" aria-hidden="true">
        Swipe to see more →
      </p>
    </section>
  );
}
