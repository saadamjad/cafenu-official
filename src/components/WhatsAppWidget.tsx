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
    if (wasSeen()) return;
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
      className="fixed right-4 z-40 flex flex-col items-end gap-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:right-6 md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
      style={{ marginRight: "env(safe-area-inset-right)" }}
    >
      <div
        id="wa-panel"
        role="dialog"
        aria-labelledby="wa-title"
        aria-describedby="wa-greeting"
        inert={!open}
        className={`w-[min(22rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl border border-gold/25 bg-coal/90 text-cream shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        <header className="flex items-center gap-3 border-b border-gold/15 px-4 py-3.5">
          <Image src="/images/cafe-nu-logo-168.png" alt="" width={44} height={44} unoptimized className="h-11 w-11 shrink-0" />
          <div className="min-w-0 flex-1">
            <h2 id="wa-title" className="font-display text-lg leading-tight">
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

        <div className="max-h-[min(28rem,calc(100dvh-24rem))] overflow-y-auto px-4 pb-4 pt-4">
          <p className="mb-3 inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-cream/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" aria-hidden="true" />
            Replies on WhatsApp
          </p>
          <p id="wa-greeting" className="rounded-2xl rounded-tl-sm bg-ink-soft px-4 py-3 text-sm leading-relaxed">
            Hey there! 👋 Welcome to {site.name}. What can we help you with?
          </p>

          <ul className="mt-4 flex flex-col items-start gap-2" aria-label="Quick questions">
            {whatsappMessages.map((m) => (
              <li key={m}>
                <a
                  href={whatsappChatHref(m) ?? chatHref}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-11 items-center rounded-full focus-visible:rounded-full! border border-gold/25 px-4 py-2 text-left text-sm transition-colors hover:border-gold/50 hover:bg-white/10"
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
            className="flex min-h-12 items-center justify-center gap-2 rounded-full focus-visible:rounded-full! bg-[#25D366] text-sm font-medium text-ink transition-colors hover:bg-[#2fe074]"
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
        className="ring-logo group relative grid focus-visible:rounded-full! h-14 w-14 place-items-center rounded-full bg-coal text-cream transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-95"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <WhatsAppIcon className="h-6 w-6 transition-transform duration-500 group-hover:rotate-[12deg]" />}
        <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-coal bg-[#25D366]" aria-hidden="true" />
      </button>
    </div>
  );
}
