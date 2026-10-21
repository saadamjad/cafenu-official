import Image from "next/image";
import { HeroStage } from "@/components/HeroStage";
import { MagneticButton } from "@/components/MagneticButton";
import { OpenStatus } from "@/components/OpenStatus";
import { DirectionsIcon } from "@/components/Icons";
import { site } from "@/content/site";

function Kinetic({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <span aria-hidden="true" className="kinetic block [perspective:600px]">
      {text.split("").map((ch, i) => (
        <span key={i} className="char" style={{ ["--i" as string]: i + offset }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-coal pb-16 pt-28 text-cream"
    >
      {/* warm radial glow + tile hint */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_72%_40%,#3b3227_0%,#1f1f1f_42%,#141414_80%)]" />

      <HeroStage>
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <p className="fade-up eyebrow eyebrow--light mb-4" style={{ ["--d" as string]: "0.1s" }}>
              Specialty coffee &amp; all-day kitchen
            </p>
            <h1 className="font-display">
              <span className="sr-only">Cafe Nu: Modern Coffee Cafe &amp; Restaurant</span>
              <span className="block text-[clamp(4.2rem,14vw,10.5rem)] font-medium leading-[0.86] tracking-[-0.02em]">
                <Kinetic text="Cafe" />
                <span className="italic text-gold">
                  <Kinetic text="Nu." offset={4} />
                </span>
              </span>
              <span className="mt-6 block max-w-xl text-[clamp(1.35rem,3vw,2.1rem)] font-normal italic leading-tight text-cream/90">
                <Kinetic text="Modern Coffee Cafe & Restaurant" offset={8} />
              </span>
            </h1>
            <p className="fade-up mt-6 max-w-md text-lg font-light leading-relaxed text-cream/75" style={{ ["--d" as string]: "0.3s" }}>
              Handcrafted coffee, fresh-baked bread and all-day dining in DHA Phase 2, Karachi.
            </p>
            <div className="fade-up mt-10 flex flex-wrap gap-4" style={{ ["--d" as string]: "0.4s" }}>
              <MagneticButton href="/menu">View the menu</MagneticButton>
              <MagneticButton href={site.directionsUrl} variant="ghost" external>
                <DirectionsIcon /> Get directions
              </MagneticButton>
            </div>
            <p className="fade-up mt-8 text-sm text-cream/75" style={{ ["--d" as string]: "0.5s" }}>
              <OpenStatus />
            </p>
          </div>

          {/* LCP image: always server-rendered, the 3D cup floats over it */}
          <div className="fade-up relative mx-auto w-full max-w-md" style={{ ["--d" as string]: "0.2s" }}>
            <div data-hero-arch className="relative aspect-[4/5] overflow-hidden ring-logo rounded-t-[999px] rounded-b-3xl">
              <Image
                src="/images/cafe-nu-all-day-breakfast-latte.jpg"
                alt="Cafe Nu All Day Breakfast with fluffy eggs, halloumi and sausages beside a latte with latte art"
                fill
                quality={85}
                priority
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover object-[35%_50%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coal/70 via-transparent to-transparent" />
            </div>
            <div className="float-slow absolute -left-4 -top-4 h-24 w-24 sm:-left-8 sm:-top-6 sm:h-28 sm:w-28">
              <Image src="/images/cafe-nu-logo.png" alt="Cafe Nu logo" fill sizes="7rem" className="drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]" />
            </div>
            <p className="absolute -bottom-5 right-6 rounded-full bg-cream px-5 py-2 text-sm font-medium text-ink shadow-lg">
              All-day breakfast · <span className="font-semibold">Rs 1,450</span>
            </p>
          </div>
        </div>
      </HeroStage>

      <a href="#about" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-cream/60 sm:flex">
        Scroll
        <span className="relative h-12 w-px overflow-hidden bg-cream/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-gold" />
        </span>
      </a>
    </section>
  );
}
