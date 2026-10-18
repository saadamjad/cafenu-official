"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { formatPrice, menu } from "@/content/menu";

const dishes = menu.flatMap((c) => c.items.filter((i) => i.image).map((i) => ({ ...i, category: c.title })));

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
            gsap.set(c, { rotateY: d * -28, z: -Math.abs(d) * 160, opacity: 1 - Math.abs(d) * 0.35 });
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
      // phones: native swipe + a coverflow tilt driven by the horizontal scroll position
      mm.add("(max-width: 767px)", () => {
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        const setters = cards.map((c) => ({
          ry: gsap.quickTo(c, "rotateY", { duration: 0.5 }),
          sc: gsap.quickTo(c, "scale", { duration: 0.5 }),
        }));
        let frame = 0;
        const update = () => {
          frame = 0;
          const mid = track.scrollLeft + track.clientWidth / 2;
          cards.forEach((c, i) => {
            const d = gsap.utils.clamp(-1, 1, (c.offsetLeft + c.offsetWidth / 2 - mid) / track.clientWidth);
            setters[i].ry(d * -30);
            setters[i].sc(1 - Math.abs(d) * 0.12);
          });
        };
        const onScroll = () => (frame ||= requestAnimationFrame(update));
        track.addEventListener("scroll", onScroll, { passive: true });
        update();
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          rotateX: -20,
          stagger: 0.08,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: track, start: "top 85%" },
        });
        return () => {
          track.removeEventListener("scroll", onScroll);
          cancelAnimationFrame(frame);
        };
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
    <section id="signatures" ref={root} aria-labelledby="sig-title" className="relative overflow-hidden bg-ink py-24 text-cream md:flex md:h-screen md:flex-col md:justify-center md:py-0">
      <div className="mx-auto mb-12 w-full max-w-7xl px-4 sm:px-8">
        <p className="eyebrow eyebrow--light mb-5">Signature plates</p>
        <h2 id="sig-title" className="font-display max-w-3xl text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-[1] tracking-[-0.01em]">
          Five plates from our kitchen.
        </h2>
      </div>

      <ul
        data-track
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6 [perspective:1600px] [transform-style:preserve-3d] sm:px-8 md:w-max md:snap-none md:overflow-visible md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {dishes.map((d) => (
          <li key={d.name} data-card onPointerMove={onMove} onPointerLeave={onLeave} className="w-[78vw] shrink-0 snap-center sm:w-[22rem]">
            <article data-tilt className="group relative overflow-hidden ring-logo rounded-[2rem] bg-coal [transform-style:preserve-3d]">
              <div data-img className="relative aspect-[4/5]">
                <Image src={d.image!} alt={d.name} fill quality={85} sizes="(min-width: 640px) 22rem, 78vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgba(255,255,255,0.25),transparent_45%)]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-coal via-coal/85 to-transparent p-6 pt-20">
                <p className="font-script text-2xl leading-none text-gold">{d.category}</p>
                <h3 className="font-display mt-2 text-2xl font-medium leading-tight">{d.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-cream/75">{d.description}</p>
                <p className="mt-4 inline-block rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-ink">{formatPrice(d.price)}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
