"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { site, whatsappChatHref, whatsappHref, whatsappMessages } from "@/content/site";
import { CloseIcon, WhatsAppIcon } from "@/components/Icons";

const SEEN_KEY = "cafenu-wa-seen";
const AUTO_OPEN_DELAY = 1500;

// sessionStorage can throw (private mode, blocked site data); the widget must keep working without it.
function wasSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}
function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {}
}

// Floating WhatsApp chat: opens once per session on first visit, then only on demand.
export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Phones: never auto-open. A panel popping over the page on a small screen is intrusive.
    if (wasSeen() || !window.matchMedia("(min-width: 768px)").matches) return;
    const t = window.setTimeout(() => {
      if (wasSeen()) return; // visitor already opened/closed it manually
      markSeen();
      setOpen(true); // no focus move: never pull keyboard users away from what they're doing
    }, AUTO_OPEN_DELAY);
    return () => window.clearTimeout(t);
  }, []);

  const close = useCallback((restoreFocus: boolean) => {
    markSeen();
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!whatsappHref) return null;
  const chatHref = whatsappHref;

  function toggle() {
    if (open) return close(false);
    markSeen();
    setOpen(true);
    requestAnimationFrame(() => closeRef.current?.focus());
  }

  return (
    <div
      className="wa-widget fixed right-3 z-40 flex flex-col items-end gap-2 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] md:gap-3 md:right-6 md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
      style={{ marginRight: "env(safe-area-inset-right)" }}
    >
      <div
        id="wa-panel"
        role="dialog"
        aria-labelledby="wa-title"
        aria-describedby="wa-greeting"
        inert={!open}
        className={`w-[min(20rem,calc(100vw-1.5rem))] md:w-[22rem] origin-bottom-right overflow-hidden rounded-2xl border border-gold/25 bg-coal/90 text-cream shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        <header className="flex items-center gap-3 border-b border-gold/15 px-4 py-2.5 md:py-3.5">
          <Image src="/images/cafe-nu-badge-168.png" alt="" width={44} height={44} unoptimized className="h-9 w-9 shrink-0 md:h-11 md:w-11" />
          <div className="min-w-0 flex-1">
            <h2 id="wa-title" className="font-display text-base leading-tight md:text-lg">
              {site.name}
            </h2>
            <p className="mt-0.5 text-xs text-cream/70">How can we help you today?</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => close(true)}
            aria-label="Close chat"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full focus-visible:rounded-full! text-cream/70 transition-colors hover:bg-white/10 hover:text-cream"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="max-h-[min(28rem,calc(100dvh-16rem))] overflow-y-auto overscroll-contain px-4 pb-3 pt-3 md:pb-4 md:pt-4">
          <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-cream/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" aria-hidden="true" />
            Replies on WhatsApp
          </p>
          <p id="wa-greeting" className="rounded-2xl rounded-tl-sm bg-ink-soft px-3.5 py-2.5 text-sm leading-relaxed">
            Hey there! 👋 Welcome to {site.name}. What can we help you with?
          </p>

          <ul className="mt-3 flex flex-col items-start gap-1.5 md:mt-4 md:gap-2" aria-label="Quick questions">
            {whatsappMessages.map((m) => (
              <li key={m}>
                <a
                  href={whatsappChatHref(m) ?? chatHref}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-10 items-center rounded-full focus-visible:rounded-full! border border-gold/25 px-3.5 py-1.5 text-left text-[0.8rem] md:min-h-11 md:px-4 md:py-2 md:text-sm transition-colors hover:border-gold/50 hover:bg-white/10"
                >
                  {m}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gold/15 p-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            className="flex min-h-11 items-center justify-center gap-2 rounded-full md:min-h-12 focus-visible:rounded-full! bg-[#25D366] text-sm font-medium text-ink transition-colors hover:bg-[#2fe074]"
          >
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
        </div>
      </div>

      <button
        ref={toggleRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="wa-panel"
        aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
        className="ring-logo group relative grid focus-visible:rounded-full! h-12 w-12 place-items-center md:h-14 md:w-14 rounded-full bg-coal text-cream transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-95"
      >
        {open ? <CloseIcon className="h-5 w-5 md:h-6 md:w-6" /> : <WhatsAppIcon className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-500 group-hover:rotate-[12deg]" />}
        <span className="absolute right-0 top-0 h-2.5 w-2.5 md:right-0.5 md:top-0.5 md:h-3 md:w-3 rounded-full border-2 border-coal bg-[#25D366]" aria-hidden="true" />
      </button>
    </div>
  );
}
