"use client";
import { useEffect, useState } from "react";
import { formatTime, openStatus, site } from "@/content/site";

// Server HTML shows the static hours; the live open/closed state (Karachi time) fills in on the client.
export function OpenStatus({ className = "" }: { className?: string }) {
  const h = site.hours[0];
  const fallback = h ? `Open daily · ${formatTime(h.opens)} – ${formatTime(h.closes)}` : "";
  const [state, setState] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const tick = () => setState(openStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!h) return null;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${state ? (state.open ? "bg-emerald-400" : "bg-red-400") : "bg-gold"}`}
      >
        {state?.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />}
      </span>
      <span aria-live="polite">{state?.label ?? fallback}</span>
    </span>
  );
}
