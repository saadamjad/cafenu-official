"use client";
import { useEffect, useState } from "react";
import { site, telHref, whatsappHref } from "@/content/site";
import { DirectionsIcon, MenuBookIcon, PhoneIcon, WhatsAppIcon } from "@/components/Icons";

// Sticky thumb-zone action bar for phones. Appears after the hero, hides over the footer.
export function MobileActions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    let footerVisible = false;
    const io = new IntersectionObserver(([e]) => {
      footerVisible = e.isIntersecting;
      update();
    });
    if (footer) io.observe(footer);
    function update() {
      const past = window.scrollY > window.innerHeight * 0.6;
      setShow(past && !footerVisible);
      // Phones: past the hero the floating WhatsApp launcher steps aside, since the bar (and then the
      // footer) already offer WhatsApp and the launcher would cover content.
      document.documentElement.dataset.quickbar = past ? "on" : "off";
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  const items = [
    telHref && { href: telHref, label: "Call", Icon: PhoneIcon, external: false },
    whatsappHref && { href: whatsappHref, label: "WhatsApp", Icon: WhatsAppIcon, external: true },
    { href: site.directionsUrl, label: "Directions", Icon: DirectionsIcon, external: true },
    { href: "/menu", label: "Menu", Icon: MenuBookIcon, external: false },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof PhoneIcon; external: boolean }[];

  return (
    <nav
      aria-label="Quick actions"
      className={`fixed inset-x-3 bottom-3 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4 overflow-hidden rounded-2xl border border-gold/25 bg-coal/90 text-cream shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        {items.map(({ href, label, Icon, external }, i) => (
          <li key={label}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener" } : {})}
              tabIndex={show ? 0 : -1}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium tracking-wide active:bg-white/10 ${
                i === 0 ? "bg-gold text-ink" : ""
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
