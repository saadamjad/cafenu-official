import { site } from "@/content/site";
import Image from "next/image";
import { SocialLinks } from "@/components/SocialLinks";

async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="relative bg-coal text-cream">
      <div className="tiles h-6 opacity-30" aria-hidden="true" />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <a href="#top" aria-label="Cafe Nu, back to top" className="group inline-block">
            <Image
              src="/images/cafe-nu-logo.png"
              alt="Cafe Nu"
              width={160}
              height={160}
              className="h-32 w-32 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[12deg] sm:h-40 sm:w-40"
            />
          </a>
          <p className="mt-5 text-cream/70">{site.tagline}</p>
          <SocialLinks variant="icon" className="mt-6" />
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-cream/80">
            <li><a className="hover:text-gold" href="#about">About</a></li>
            <li><a className="hover:text-gold" href="#menu">Menu</a></li>
            <li><a className="hover:text-gold" href="#drinks">Coffee &amp; matcha</a></li>
            <li><a className="hover:text-gold" href="#gallery">Gallery</a></li>
            <li><a className="hover:text-gold" href="#visit">Visit</a></li>
            <li><a className="hover:text-gold" href="/cafe-nu-menu.pdf" download>PDF menu</a></li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 border-t border-white/10 px-4 py-6 text-sm text-cream/60 sm:px-8">
        <p>© <Year /> {site.name}. All rights reserved.</p>
        <a href="#top" className="hover:text-gold">Back to top ↑</a>
      </div>
    </footer>
  );
}
