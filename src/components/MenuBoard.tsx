"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { formatPrice, menu } from "@/content/menu";

// The whole menu is real HTML text (crawlable); tabs are scroll-spy anchors, not hidden panels.
export function MenuBoard() {
  const root = useRef<HTMLElement>(null);
  const pills = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(menu[0].id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace("menu-", ""))),
      { rootMargin: "-45% 0px -50% 0px" },
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
      gsap.utils.toArray<HTMLElement>("[data-cat]").forEach((cat) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: cat, start: "top 85%" } });
        tl.from(cat.querySelector("h3"), { yPercent: 100, opacity: 0, rotateX: -60, duration: 0.8, ease: "expo.out" })
          .from(cat.querySelectorAll("li"), { opacity: 0, y: 24, stagger: 0.06, duration: 0.6, ease: "power3.out" }, "<0.1")
          .from(cat.querySelectorAll(".leader"), { scaleX: 0, stagger: 0.06, duration: 0.8, ease: "power2.out" }, "<0.1");
      });
    },
    { scope: root },
  );

  return (
    <section id="menu" ref={root} aria-labelledby="menu-title" className="relative bg-cream py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-teal">The menu</p>
            <h2 id="menu-title" className="font-display text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[0.95] text-espresso">
              Coffee, brunch &amp; plates
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Breakfast, starters, soups and salads, pasta, sandwiches, burgers, pizza, grills, coffee, matcha, frappés and
              mocktails. All prices in Pakistani rupees.
            </p>
          </div>
          <a
            href="/cafe-nu-menu.pdf"
            download
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-espresso px-6 py-3 font-semibold text-espresso transition hover:bg-espresso hover:text-cream"
          >
            Download PDF menu
          </a>
        </div>

        <nav aria-label="Menu categories" className="sticky top-0 z-30 -mx-4 mt-12 bg-cream/90 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
          <div ref={pills} className="relative flex gap-2 overflow-x-auto [scrollbar-width:none]">
            <span data-indicator aria-hidden="true" className="absolute left-0 top-0 h-full rounded-full bg-espresso" style={{ width: 0 }} />
            {menu.map((c) => (
              <a
                key={c.id}
                href={`#menu-${c.id}`}
                data-pill={c.id}
                aria-current={active === c.id ? "true" : undefined}
                className={`relative z-10 whitespace-nowrap rounded-full px-4 py-3 text-sm font-semibold transition-colors ${
                  active === c.id ? "text-cream" : "text-espresso hover:bg-espresso/5"
                }`}
              >
                {c.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-12 grid gap-x-16 gap-y-20 lg:grid-cols-2">
          {menu.map((c) => (
            <div key={c.id} id={`menu-${c.id}`} data-cat className="scroll-mt-40 [perspective:800px]">
              <div className="overflow-hidden">
                <h3 className="font-display border-b-2 border-espresso pb-3 text-4xl font-semibold text-espresso">{c.title}</h3>
              </div>
              {c.note && <p className="mt-3 text-sm italic text-muted">{c.note}</p>}
              <ul className="mt-6 space-y-6">
                {c.items.map((i) => (
                  <li key={i.name}>
                    <div className="flex items-baseline">
                      <h4 className="font-semibold text-espresso">{i.name}</h4>
                      <span className="leader" aria-hidden="true" />
                      <span className="font-display text-lg font-semibold tabular-nums text-teal">{formatPrice(i.price)}</span>
                    </div>
                    {i.description && <p className="mt-1 max-w-[52ch] text-sm leading-relaxed text-muted">{i.description}</p>}
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
