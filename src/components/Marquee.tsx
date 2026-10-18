"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const words = ["Espresso", "Iced Matcha", "All-Day Breakfast", "Creamy Pasta", "Club Sandwiches", "Steaks", "Frappés", "Mocktails"];

// Infinite skewed ribbon; scroll velocity speeds it up and flips its direction.
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
      const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity() / 300;
          gsap.to(loop, { timeScale: (self.direction || 1) * Math.min(Math.max(Math.abs(v), 1), 6), duration: 0.3, overwrite: true });
          gsap.to(track, { skewX: gsap.utils.clamp(-12, 12, -v * 2), duration: 0.4, overwrite: "auto" });
        },
      });
    },
    { scope: root },
  );

  const row = (hidden: boolean) =>
    words.map((w) => (
      <span key={w + hidden} aria-hidden={hidden || undefined} className="flex items-center gap-8 px-4">
        <span className="font-display py-1 text-4xl italic leading-[1.25] font-medium sm:text-6xl">{w}</span>
        <svg viewBox="0 0 24 34" className="h-8 w-6 shrink-0 fill-ink" aria-hidden="true">
          <ellipse cx="12" cy="17" rx="10" ry="15" />
          <path d="M12 3c-4 5 4 9 0 14s4 9 0 14" stroke="#cfaa76" strokeWidth="2" fill="none" />
        </svg>
      </span>
    ));

  return (
    <div ref={root} className="relative -my-6 rotate-[-2deg] overflow-hidden bg-gold py-6 text-ink shadow-xl">
      <p className="sr-only">On the menu: {words.join(", ")}.</p>
      <div data-track className="flex w-max" aria-hidden="true">
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
