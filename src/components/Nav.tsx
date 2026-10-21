"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site, telHref } from "@/content/site";
import { DirectionsIcon, PhoneIcon } from "@/components/Icons";
import { SocialLinks } from "@/components/SocialLinks";

const links = [
  { href: "#about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "#drinks", label: "Coffee & Matcha" },
  { href: "#reviews", label: "Reviews" },
  { href: "#gallery", label: "Gallery" },
  { href: "#visit", label: "Visit" },
];

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  const home = pathname === "/";
  // section anchors only exist on the home page; elsewhere they point back to it
  const to = (href: string) => (href.startsWith("#") && !home ? `/${href}` : href);
  const current = home ? active : pathname;

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const hide = y > last && y > 400;
      setHidden(hide);
      // sticky bars below the nav (menu category pills) read this to sit flush or under the nav
      document.documentElement.dataset.nav = hide ? "hidden" : "shown";
      setSolid(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? y / max : 0);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // highlight the section currently in view
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["top", ...links.filter((l) => l.href.startsWith("#")).map((l) => l.href.slice(1))].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-cream transition-[transform,background-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hidden && !open ? "-translate-y-full" : ""
      } ${solid || open ? "bg-coal/85 shadow-[0_1px_0_rgb(207_170_118/0.15)] backdrop-blur-xl" : ""}`}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <a href={to("#top")} className="group block shrink-0" aria-label="Cafe Nu home">
          <Image
            src="/images/cafe-nu-badge-168.png"
            alt="Cafe Nu"
            width={56}
            height={56}
            priority
            unoptimized
            className="h-14 w-14 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[12deg] group-hover:scale-105"
          />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={to(l.href)}
                  aria-current={current === l.href ? "true" : undefined}
                  className={`relative rounded-full px-3.5 py-3 text-[0.92rem] font-medium transition-colors xl:px-4 ${
                    current === l.href ? "text-gold" : "text-cream/80 hover:text-cream"
                  }`}
                >
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-4 bottom-1.5 h-px origin-left bg-gold transition-transform duration-500 ${
                      current === l.href ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {telHref && (
            <a href={telHref} className="inline-flex items-center gap-2 text-sm font-medium text-cream/85 transition-colors hover:text-gold">
              <PhoneIcon className="h-4 w-4 text-gold" />
              {site.phoneDisplay}
            </a>
          )}
          <a
            href={site.directionsUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold-light"
          >
            <DirectionsIcon className="h-4 w-4" />
            Get directions
          </a>
        </div>

        <button
          type="button"
          className="grid h-12 w-12 place-items-center rounded-full lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3 w-6">
            <span className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`absolute bottom-0 left-0 h-0.5 w-6 bg-current transition duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div className="absolute left-0 top-0 h-[2px] bg-gold" style={{ width: `${progress * 100}%` }} aria-hidden="true" />

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${open ? "max-h-[90vh]" : "max-h-0"}`}
      >
        <ul className="flex flex-col px-5 pb-4">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={to(l.href)}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="font-display block border-b border-white/10 py-3.5 text-2xl"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 px-5 pb-4">
          {telHref && (
            <a href={telHref} tabIndex={open ? 0 : -1} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-5 font-semibold text-ink">
              <PhoneIcon className="h-4 w-4" /> Call {site.phoneDisplay}
            </a>
          )}
        </div>
        <SocialLinks className="px-5 pb-8" />
      </nav>
    </header>
  );
}
