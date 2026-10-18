import { formatTime, site, telHref, whatsappHref } from "@/content/site";
import { DirectionsIcon, PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { MagneticButton } from "@/components/MagneticButton";
import { MapEmbed } from "@/components/MapEmbed";
import { SocialLinks } from "@/components/SocialLinks";
import { OpenStatus } from "@/components/OpenStatus";

const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function Visit() {
  const a = site.address;
  const hoursFor = (d: string) => site.hours.find((h) => h.dayCodes.includes(d));

  return (
    <section id="visit" aria-labelledby="visit-title" className="relative overflow-hidden bg-gold py-24 md:py-32 text-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-5 !text-ink/80">Visit us</p>
          <h2 id="visit-title" className="h2">
            Come for coffee, <em className="font-medium">stay for brunch.</em>
          </h2>
          <p className="mt-4 font-medium">
            <OpenStatus />
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {a && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.22em]">Address</h3>
                <address className="mt-3 not-italic leading-relaxed">
                  {site.name}
                  <br />
                  {a.street}
                  <br />
                  {a.locality} {a.postalCode}, Pakistan
                </address>
              </div>
            )}
            {site.hours.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.22em]">Opening hours</h3>
                <table className="mt-3 w-full text-left">
                  <caption className="sr-only">Opening hours by day</caption>
                  <tbody>
                    {WEEK.map((d) => {
                      const h = hoursFor(d);
                      return (
                        <tr key={d} className="border-b border-ink/10 last:border-0">
                          <th scope="row" className="py-1.5 pr-4 font-normal">
                            {d}
                          </th>
                          <td className="py-1.5 text-right tabular-nums">
                            {h ? `${formatTime(h.opens)} – ${formatTime(h.closes)}` : "Closed"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-3 [&>a]:px-6">
            <MagneticButton href={site.directionsUrl} variant="dark" external>
              <DirectionsIcon /> Get directions
            </MagneticButton>
            {telHref && (
              <MagneticButton href={telHref} variant="ghost">
                <PhoneIcon /> Call us
              </MagneticButton>
            )}
            {whatsappHref && (
              <MagneticButton href={whatsappHref} variant="ghost" external>
                <WhatsAppIcon /> WhatsApp
              </MagneticButton>
            )}
          </div>

          <div className="mt-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em]">Follow Cafe Nu</h3>
            <SocialLinks className="mt-4" />
          </div>
        </div>

        <MapEmbed />
      </div>
    </section>
  );
}
