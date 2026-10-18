"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { formatPrice, menu } from "@/content/menu";

const groups = [
  { label: "Food", items: menu.filter((c) => c.kind === "food") },
  { label: "Drinks", items: menu.filter((c) => c.kind === "drink") },
];

// Full menu page: every category is real HTML text in one scroll; the sticky pills follow along (scroll-spy).
export function MenuBoard() {
  const root = useRef<HTMLElement>(null);
  const pills = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(menu[0].id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace("menu-", ""))),
      { rootMargin: "-35% 0px -60% 0px" },
    );
    menu.forEach((c) => {
      const el = document.getElementById(`menu-${c.id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // keep the active pill in view + slide the indicator under it
  useEffect(() => {
    const bar = pills.current;
    const pill = bar?.querySelector<HTMLElement>(`[data-pill="${active}"]`);
    const ind = bar?.querySelector<HTMLElement>("[data-indicator]");
    if (!bar || !pill || !ind) return;
    gsap.to(ind, { x: pill.offsetLeft, width: pill.offsetWidth, duration: 0.5, ease: "power3.out" });
    bar.scrollTo({ left: pill.offsetLeft - bar.clientWidth / 2 + pill.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-cat]").forEach((cat) =>
        gsap.from(cat, { opacity: 0, y: 24, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: cat, start: "top 88%" } }),
      );
    },
    { scope: root },
  );

  return (
    <section id="menu" ref={root} aria-labelledby="menu-title" className="relative bg-cream pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">The menu</p>
            <h1 id="menu-title" className="h2 text-ink">
              Coffee, brunch &amp; plates
            </h1>
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

        <nav aria-label="Menu categories" className="menu-pills sticky top-0 z-30 -mx-5 mt-12 bg-cream/90 px-5 py-3 backdrop-blur-md md:-mx-8 md:mt-16 md:px-8">
          <div ref={pills} className="relative flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
            <span data-indicator aria-hidden="true" className="absolute left-0 top-0 h-full rounded-full bg-ink" style={{ width: 0 }} />
            {groups.map((g, gi) => (
              <div key={g.label} className="flex items-center gap-1.5">
                <span className={`label shrink-0 pr-1 ${gi > 0 ? "ml-3 border-l border-line pl-4" : ""}`}>{g.label}</span>
                {g.items.map((c) => (
                  <a
                    key={c.id}
                    href={`#menu-${c.id}`}
                    data-pill={c.id}
                    aria-current={active === c.id ? "true" : undefined}
                    className={`relative z-10 inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors focus-visible:rounded-full! ${
                      active === c.id ? "text-cream" : "text-ink/75 hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    {c.title}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </nav>

        <div className="mt-12 grid gap-x-16 gap-y-16 md:mt-16 lg:grid-cols-2 lg:gap-y-20">
          {menu.map((c) => (
            <div key={c.id} id={`menu-${c.id}`} data-cat className="scroll-mt-40">
              <h2 className="font-display border-b border-line pb-4 text-3xl font-medium italic text-ink md:text-4xl">{c.title}</h2>
              {c.note && <p className="mt-4 text-sm italic text-muted">{c.note}</p>}
              <ul className="mt-8 space-y-7">
                {c.items.map((i) => (
                  <li key={i.name}>
                    <div className="flex items-baseline">
                      <h3 className="font-medium text-ink">{i.name}</h3>
                      <span className="leader" aria-hidden="true" />
                      <span className="font-display shrink-0 whitespace-nowrap text-lg font-medium tabular-nums text-gold-deep">{formatPrice(i.price)}</span>
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
