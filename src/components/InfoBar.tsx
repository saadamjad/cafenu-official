import { formatTime, site, telHref, whatsappHref } from "@/content/site";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import { OpenStatus } from "@/components/OpenStatus";

// Above-the-fold essentials: hours, location, contact. The first things restaurant visitors look for.
export function InfoBar() {
  const h = site.hours[0];
  const a = site.address;
  return (
    <section aria-label="Opening hours, location and contact" className="relative z-10 bg-coal text-cream">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <ul className="grid divide-y divide-white/10 border-y border-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          <li className="flex gap-4 py-6 md:pr-8">
            <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="label label--light">Hours</p>
              <p className="mt-1.5 font-medium">
                <OpenStatus />
              </p>
              {h && (
                <p className="mt-1 text-sm text-cream/60">
                  Every day, {formatTime(h.opens)} – {formatTime(h.closes)}
                </p>
              )}
            </div>
          </li>
          {a && (
            <li className="flex gap-4 py-6 md:px-8">
              <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="label label--light">Find us</p>
                <p className="mt-1.5 font-medium">Old Sunset Blvd, DHA Phase 2, {a.locality}</p>
                <a href={site.directionsUrl} target="_blank" rel="noopener" className="mt-1 inline-block text-sm text-gold underline-offset-4 hover:underline">
                  Get directions →
                </a>
              </div>
            </li>
          )}
          {telHref && (
            <li className="flex gap-4 py-6 md:pl-8">
              <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="label label--light">Call or message</p>
                <a href={telHref} className="mt-1.5 block font-medium hover:text-gold">
                  {site.phoneDisplay}
                </a>
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noopener" className="mt-1 inline-flex items-center gap-1.5 text-sm text-gold underline-offset-4 hover:underline">
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp us
                  </a>
                )}
              </div>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
