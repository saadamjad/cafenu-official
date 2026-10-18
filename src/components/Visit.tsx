import { sameAs, site } from "@/content/site";
import { MagneticButton } from "@/components/MagneticButton";
import { SocialLinks } from "@/components/SocialLinks";

// Renders only details that exist in site.ts. Empty TODOs never show fake data.
export function Visit() {
  const a = site.address;

  return (
    <section id="visit" aria-labelledby="visit-title" className="relative overflow-hidden bg-gold py-28 text-ink">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-5 !text-ink/80">Visit us</p>
          <h2 id="visit-title" className="font-display text-[clamp(2.8rem,7vw,6rem)] font-medium leading-[0.9]">
            Come for coffee, <em className="font-medium">stay for brunch.</em>
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            {site.mapsUrl && (
              <MagneticButton href={site.mapsUrl} variant="dark">Get directions</MagneticButton>
            )}
            {site.whatsapp && (
              <MagneticButton href={`https://wa.me/${site.whatsapp}`} variant="ghost">
                WhatsApp us
              </MagneticButton>
            )}
            <MagneticButton href="#menu" variant={site.mapsUrl ? "ghost" : "dark"}>
              Browse the menu
            </MagneticButton>
          </div>
        </div>

        <dl className="grid content-start gap-8 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-ink">Address</dt>
            <dd className="mt-3 text-lg leading-relaxed">
              {a ? (
                <address className="not-italic">
                  {a.street}
                  <br />
                  {a.locality}, {a.region} {a.postalCode}
                </address>
              ) : (
                "Address coming soon"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-ink">Opening hours</dt>
            <dd className="mt-3 text-lg">
              {site.hours.length ? (
                <ul className="space-y-1">
                  {site.hours.map((h) => (
                    <li key={h.days} className="flex justify-between gap-6">
                      <span>{h.days}</span>
                      <span className="tabular-nums">
                        {h.opens} – {h.closes}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                "Hours coming soon"
              )}
            </dd>
          </div>
          {(site.phone || site.email) && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-ink">Contact</dt>
              <dd className="mt-3 space-y-1 text-lg">
                {site.phone && <a className="block underline-offset-4 hover:underline" href={`tel:${site.phone}`}>{site.phone}</a>}
                {site.email && <a className="block underline-offset-4 hover:underline" href={`mailto:${site.email}`}>{site.email}</a>}
              </dd>
            </div>
          )}
          {sameAs.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-ink">Follow Cafe Nu</dt>
            <dd className="mt-4">
              <SocialLinks />
            </dd>
          </div>
          )}
        </dl>
      </div>
    </section>
  );
}
