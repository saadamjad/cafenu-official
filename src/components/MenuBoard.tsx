"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { formatPrice, menu } from "@/content/menu";

const groups = [
  { label: "Food", items: menu.filter((c) => c.kind === "food") },
  { label: "Drinks", items: menu.filter((c) => c.kind === "drink") },
];

const idFromHash = () => {
  const id = window.location.hash.replace("#menu-", "");
  return window.location.hash.startsWith("#menu-") && menu.some((c) => c.id === id) ? id : null;
};

// One category at a time keeps the menu calm to read. Every category stays in the DOM
// (inactive ones are `hidden`), so the full menu is still crawlable and in the page source.
export function MenuBoard() {
  const root = useRef<HTMLElement>(null);
  const pills = useRef<HTMLDivElement>(null);
  const panels = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(menu[0].id);
  const switched = useRef(false);

  // Deep links like #menu-hot-coffee open that tab and bring the menu into view.
  useEffect(() => {
    const sync = () => {
      const id = idFromHash();
      if (!id) return;
      select(id);
      requestAnimationFrame(() => root.current?.querySelector("[data-menu-tabs]")?.scrollIntoView({ block: "start" }));
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function select(id: string) {
    switched.current = true;
    setActive(id);
  }

  // keep the active pill in view + slide the indicator under it
  useEffect(() => {
    const bar = pills.current;
    const pill = bar?.querySelector<HTMLElement>(`[data-pill="${active}"]`);
    const ind = bar?.querySelector<HTMLElement>("[data-indicator]");
    if (!bar || !pill || !ind) return;
    gsap.to(ind, { x: pill.offsetLeft, width: pill.offsetWidth, duration: 0.5, ease: "power3.out" });
    bar.scrollTo({ left: pill.offsetLeft - bar.clientWidth / 2 + pill.offsetWidth / 2, behavior: "smooth" });

    // soft fade between categories; if the reader had scrolled down a long list, return to its top
    if (!switched.current) return;
    const panel = panels.current?.querySelector<HTMLElement>(`#menu-${active}`);
    if (!panel) return;
    const tabs = root.current?.querySelector<HTMLElement>("[data-menu-tabs]");
    if (tabs && panels.current && panels.current.getBoundingClientRect().top < tabs.offsetHeight + 80) {
      tabs.scrollIntoView({ block: "start" });
    }
    if (!prefersReducedMotion()) {
      gsap.fromTo(panel.querySelectorAll("li"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: "expo.out" });
    }
  }, [active]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-menu-panels]", { opacity: 0, y: 24, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: "[data-menu-panels]", start: "top 85%" } });
    },
    { scope: root },
  );

  return (
    <section id="menu" ref={root} aria-labelledby="menu-title" className="relative bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">The menu</p>
            <h2 id="menu-title" className="h2 text-ink">
              Coffee, brunch &amp; plates
            </h2>
            <p className="lead mt-5">From breakfast to dessert. All prices in Pakistani rupees.</p>
          </div>
          <a
            href="/cafe-nu-menu.pdf"
            download
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/40 px-6 py-3 font-medium text-ink transition hover:border-ink hover:bg-ink hover:text-cream"
          >
            Download PDF menu
          </a>
        </div>

        <nav
          data-menu-tabs
          aria-label="Menu categories"
          className="menu-pills sticky top-0 z-30 -mx-5 mt-12 scroll-mt-20 bg-cream/90 px-5 py-3 backdrop-blur-md md:-mx-8 md:mt-16 md:px-8"
        >
          <div ref={pills} className="relative flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
            <span data-indicator aria-hidden="true" className="absolute left-0 top-0 h-full rounded-full bg-ink" style={{ width: 0 }} />
            {groups.map((g, gi) => (
              <div key={g.label} className="flex items-center gap-1.5">
                <span className={`label shrink-0 pr-1 ${gi > 0 ? "ml-3 border-l border-line pl-4" : ""}`}>{g.label}</span>
                {g.items.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    data-pill={c.id}
                    onClick={() => select(c.id)}
                    aria-controls={`menu-${c.id}`}
                    aria-pressed={active === c.id}
                    className={`relative z-10 min-h-11 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors focus-visible:rounded-full! ${
                      active === c.id ? "text-cream" : "text-ink/75 hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </nav>

        <div ref={panels} data-menu-panels className="mx-auto mt-10 max-w-2xl md:mt-14">
          {menu.map((c) => (
            <div key={c.id} id={`menu-${c.id}`} hidden={active !== c.id} className="scroll-mt-40">
              <h3 className="font-display border-b border-line pb-4 text-3xl font-medium italic text-ink md:text-4xl">{c.title}</h3>
              {c.note && <p className="mt-4 text-sm italic text-muted">{c.note}</p>}
              <ul className="mt-8 space-y-7">
                {c.items.map((i) => (
                  <li key={i.name}>
                    <div className="flex items-baseline">
                      <h4 className="font-medium text-ink">{i.name}</h4>
                      <span className="leader" aria-hidden="true" />
                      <span className="font-display text-lg font-medium tabular-nums text-gold-deep">{formatPrice(i.price)}</span>
                    </div>
                    {i.description && <p className="mt-1.5 max-w-[56ch] text-sm leading-relaxed text-muted">{i.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
