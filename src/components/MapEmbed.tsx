"use client";
import { useState } from "react";
import { site } from "@/content/site";
import { PinIcon } from "@/components/Icons";

// Click-to-load Google Map: no third-party requests (or layout cost) until the visitor asks for it.
export function MapEmbed() {
  const [load, setLoad] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink ring-logo md:aspect-auto md:h-full md:min-h-[420px]">
      {load ? (
        <iframe
          title="Map showing Cafe Nu in DHA Phase 2, Karachi"
          src={site.mapEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoad(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-cream"
        >
          <span className="tiles absolute inset-0 opacity-[0.07]" aria-hidden="true" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gold text-ink shadow-xl transition-transform duration-500 group-hover:scale-110">
            <PinIcon className="h-7 w-7" />
          </span>
          <span className="relative font-display text-2xl">Old Sunset Blvd, DHA Phase 2</span>
          <span className="relative rounded-full border border-cream/30 px-5 py-2.5 text-sm font-medium transition group-hover:border-gold group-hover:text-gold">
            Show interactive map
          </span>
        </button>
      )}
    </div>
  );
}
