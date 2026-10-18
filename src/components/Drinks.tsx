"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { formatPrice, menu } from "@/content/menu";

const pick = (cat: string, name: string) => {
  const c = menu.find((m) => m.id === cat)!;
  return { ...c.items.find((i) => i.name === name)!, category: c.title, note: c.note };
};

const drinks = [
  { ...pick("hot-coffee", "Cafe Nu Special Espresso"), color: "#1f1f1f" },
  { ...pick("hot-coffee", "Spanish Latte"), color: "#b9844f" },
  { ...pick("iced-coffee", "Caramel Iced Latte"), color: "#c98d3e" },
  { ...pick("iced-matcha", "Iced Matcha"), color: "#8fae5a" },
  { ...pick("iced-matcha", "Strawberry Iced Matcha"), color: "#d9707e" },
  { ...pick("iced-matcha", "Popcorn Iced Matcha"), color: "#cfaa76" },
  { ...pick("frappe", "Brownie Frappé"), color: "#4a3a2a" },
  { ...pick("mocktails", "Nu Azure"), color: "#2f7a82" },
];

function Card({ d }: { d: (typeof drinks)[number] }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <li data-drink className="flip h-72" data-flipped={flipped}>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${d.name}, ${formatPrice(d.price)}. Tap to flip card.`}
        className="flip__inner block w-full text-left"
      >
        <span className="flip__face flex flex-col justify-between overflow-hidden rounded-3xl bg-surface p-6 pb-24 shadow-lg ring-1 ring-line">
          <span className="flip__liquid absolute inset-x-0 bottom-0 h-[20%] opacity-90" style={{ background: d.color }} aria-hidden="true">
            <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="absolute -top-[19px] h-5 w-full" style={{ fill: d.color }}>
              <path d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 V20 H0Z" />
            </svg>
          </span>
          <span className="relative text-xs font-semibold uppercase tracking-[0.25em] text-muted">{d.category}</span>
          <span className="font-display relative text-3xl font-medium leading-tight text-ink">{d.name}</span>
        </span>
        <span className="flip__face flip__back flex flex-col justify-between rounded-3xl p-6 text-cream shadow-lg" style={{ background: d.color }}>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">{d.category}</span>
          <span>
            <span className="font-display block text-2xl font-medium">{d.name}</span>
            {d.note && <span className="mt-2 block text-sm opacity-85">{d.note}</span>}
          </span>
          <span className="font-display text-4xl font-medium">{formatPrice(d.price)}</span>
        </span>
      </button>
    </li>
  );
}

export function Drinks() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-drink]", {
        opacity: 0,
        y: 80,
        rotateX: -35,
        transformOrigin: "50% 100%",
        stagger: { each: 0.08, grid: "auto", from: "start" },
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-drink-grid]", start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="drinks" ref={root} aria-labelledby="drinks-title" className="relative overflow-hidden bg-[#efe6d6] py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="eyebrow mb-5">The bar</p>
        <h2 id="drinks-title" className="font-display max-w-3xl text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-[0.95] text-ink">
          Espresso, iced matcha &amp; frappés
        </h2>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Hover or tap a card to flip it. Hot coffees can be flavoured with hazelnut, vanilla or caramel.
        </p>
        <ul data-drink-grid className="mt-14 grid grid-cols-1 gap-6 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-4">
          {drinks.map((d) => (
            <Card key={d.name} d={d} />
          ))}
        </ul>
        <p className="mt-10">
          <a href="#menu-hot-coffee" className="font-semibold text-gold-deep underline decoration-2 underline-offset-4">
            See every coffee, tea and mocktail on the menu
          </a>
        </p>
      </div>
    </section>
  );
}
