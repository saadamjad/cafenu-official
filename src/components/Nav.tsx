"use client";
import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#signatures", label: "Signatures" },
  { href: "#menu", label: "Menu" },
  { href: "#drinks", label: "Coffee & Matcha" },
  { href: "#gallery", label: "Gallery" },
  { href: "#visit", label: "Visit" },
];

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 400);
      setSolid(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? y / max : 0);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${hidden && !open ? "-translate-y-full" : ""}`}
    >
      <div
        className={`mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 transition-colors duration-500 sm:px-8 ${
          solid || open ? "bg-espresso-deep/85 backdrop-blur-md" : ""
        } text-cream`}
      >
        <a href="#top" className="font-display text-2xl font-semibold tracking-tight" aria-label="Cafe Nu home">
          Cafe <span className="italic text-mustard">Nu</span>
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-4 py-3 text-sm font-medium opacity-85 transition hover:bg-white/10 hover:opacity-100">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#menu" className="hidden rounded-full bg-mustard px-5 py-3 text-sm font-semibold text-espresso lg:inline-flex">
          View menu
        </a>
        <button
          type="button"
          className="grid h-12 w-12 place-items-center rounded-full lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3 w-6">
            <span className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`absolute bottom-0 left-0 h-0.5 w-6 bg-current transition ${open ? "-translate-y-1 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      <div
        className="absolute left-0 top-0 h-[2px] bg-mustard"
        style={{ width: `${progress * 100}%` }}
        aria-hidden="true"
      />
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`overflow-hidden bg-espresso-deep/95 text-cream backdrop-blur-md transition-[max-height] duration-500 lg:hidden ${open ? "max-h-[80vh]" : "max-h-0"}`}
      >
        <ul className="flex flex-col px-4 pb-6">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="font-display block border-b border-white/10 py-4 text-3xl">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
