import Image from "next/image";
import Link from "next/link";
import { formatTime, site, telHref, whatsappHref } from "@/content/site";
import { SocialLinks } from "@/components/SocialLinks";

async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

const heading = "label !text-gold";
const link = "inline-flex min-h-10 items-center text-cream/75 transition-colors hover:text-gold";

export function Footer() {
  const a = site.address;
  const h = site.hours[0];
  return (
    <footer className="relative bg-coal text-cream">
      <div className="tiles h-5 opacity-25" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:py-20">
        <div>
          <Link href="/#top" aria-label="Cafe Nu, back to top" className="group inline-block">
            <Image
              src="/images/cafe-nu-badge.png"
              alt="Cafe Nu"
              width={112}
              height={112}
              className="h-28 w-28 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[12deg]"
            />
          </Link>
          <p className="mt-5 max-w-xs leading-relaxed text-cream/65">
            {site.tagline} in DHA Phase 2, Karachi. Handcrafted coffee and all-day dining.
          </p>
          <SocialLinks variant="icon" className="mt-6" />
        </div>

        {a && (
          <div>
            <h2 className={heading}>Visit</h2>
            <address className="mt-4 not-italic leading-relaxed text-cream/75">
              {a.street}
              <br />
              {a.locality} {a.postalCode}
            </address>
            <a href={site.directionsUrl} target="_blank" rel="noopener" className={`mt-3 inline-block text-sm ${link}`}>
              Get directions →
            </a>
          </div>
        )}

        <div>
          <h2 className={heading}>Hours &amp; contact</h2>
          {h && (
            <p className="mt-4 text-cream/75">
              Every day
              <br />
              {formatTime(h.opens)} – {formatTime(h.closes)}
            </p>
          )}
          <ul className="mt-3">
            {telHref && (
              <li>
                <a className={link} href={telHref}>
                  {site.phoneDisplay}
                </a>
              </li>
            )}
            {whatsappHref && (
              <li>
                <a className={link} href={whatsappHref} target="_blank" rel="noopener">
                  WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className={heading}>Explore</h2>
          <ul className="mt-3">
            <li><Link className={link} href="/#about">About</Link></li>
            <li><Link className={link} href="/menu">Menu</Link></li>
            <li><Link className={link} href="/menu#menu-hot-coffee">Coffee &amp; matcha</Link></li>
            <li><Link className={link} href="/#reviews">Reviews</Link></li>
            <li><Link className={link} href="/#gallery">Gallery</Link></li>
            <li><Link className={link} href="/#faq">FAQ</Link></li>
            <li><a className={link} href={site.menuPdf} download>Download PDF menu</a></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 pb-24 text-sm text-cream/55 md:px-8 md:pb-6">
          <p>
            © <Year /> {site.name}. All rights reserved.
          </p>
          <Link href="/#top" className="inline-flex min-h-10 items-center transition-colors hover:text-gold">
            Back to top ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}
