import { MagneticButton } from "@/components/MagneticButton";
import { menu } from "@/content/menu";
import { site } from "@/content/site";

const groups = [
  { label: "Food", items: menu.filter((c) => c.kind === "food") },
  { label: "Drinks", items: menu.filter((c) => c.kind === "drink") },
];
const itemCount = menu.reduce((n, c) => n + c.items.length, 0);

// Home page keeps the menu to one short block; the full list lives on /menu.
export function MenuTeaser() {
  return (
    <section id="menu" aria-labelledby="menu-title" className="relative bg-cream py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow mb-4">The menu</p>
          <h2 id="menu-title" className="h2 text-ink">
            Coffee, brunch &amp; plates
          </h2>
          <p className="lead mt-5">
            {itemCount} dishes and drinks, from breakfast to dessert. Browse it all, with prices, on one page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton href="/menu" variant="dark">
              View full menu →
            </MagneticButton>
            <a
              href={site.menuPdf}
              download
              className="inline-flex min-h-12 items-center rounded-full border border-ink/40 px-6 font-medium text-ink transition hover:border-ink hover:bg-ink hover:text-cream"
            >
              Download PDF
            </a>
          </div>
        </div>

        <div className="space-y-8 rounded-3xl border border-line bg-paper p-6 sm:p-8">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="label">{g.label}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`/menu#menu-${c.id}`}
                      className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm text-ink/80 transition-colors hover:border-ink hover:text-ink focus-visible:rounded-full!"
                    >
                      {c.title}
                    </a>
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
