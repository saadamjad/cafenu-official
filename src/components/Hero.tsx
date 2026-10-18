import Image from "next/image";
import { HeroStage } from "@/components/HeroStage";
import { MagneticButton } from "@/components/MagneticButton";

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
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-espresso-deep pb-16 pt-28 text-cream"
    >
      {/* warm radial glow + tile hint */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_70%_45%,#5a3a26_0%,#2b211c_45%,#1a1411_80%)]" />

      <HeroStage>
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <p className="fade-up mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-latte" style={{ ["--d" as string]: "0.1s" }}>
              <span className="h-px w-10 bg-latte" /> Specialty coffee · All-day kitchen
            </p>
            <h1 className="font-display">
              <span className="sr-only">Cafe Nu: Modern Coffee Cafe &amp; Restaurant</span>
              <span className="block text-[clamp(4rem,13vw,10rem)] font-semibold leading-[0.85] tracking-tight">
                <Kinetic text="Cafe" />
                <span className="italic text-mustard">
                  <Kinetic text="Nu." offset={4} />
                </span>
              </span>
              <span className="mt-6 block max-w-xl text-[clamp(1.4rem,3vw,2.2rem)] font-light leading-tight text-cream/90">
                <Kinetic text="Modern Coffee Cafe & Restaurant" offset={8} />
              </span>
            </h1>
            <p className="fade-up mt-6 max-w-lg text-lg leading-relaxed text-cream/75" style={{ ["--d" as string]: "0.8s" }}>
              Espresso and iced matcha, all-day breakfast, creamy pastas, club sandwiches and steaks, served at
              warm oak tables and teal velvet chairs.
            </p>
            <div className="fade-up mt-10 flex flex-wrap gap-4" style={{ ["--d" as string]: "1s" }}>
              <MagneticButton href="#menu">View the menu</MagneticButton>
              <MagneticButton href="#visit" variant="ghost">
                Visit us
              </MagneticButton>
            </div>
          </div>

          {/* LCP image: always server-rendered, the 3D cup floats over it */}
          <div className="fade-up relative mx-auto w-full max-w-md" style={{ ["--d" as string]: "0.2s" }}>
            <div data-hero-arch className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl border border-latte/30 shadow-2xl shadow-black/50">
              <Image
                src="/images/cafe-nu-all-day-breakfast-latte.jpg"
                alt="Cafe Nu All Day Breakfast with fluffy eggs, halloumi and sausages beside a latte with latte art"
                fill
                quality={85}
                priority
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover object-[35%_50%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/70 via-transparent to-transparent" />
            </div>
            <p className="absolute -bottom-5 right-6 rounded-full bg-cream px-5 py-2 text-sm font-semibold text-espresso shadow-lg">
              All-day breakfast · Rs 1,450
            </p>
          </div>
        </div>
      </HeroStage>

      <a href="#about" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-cream/60 sm:flex">
        Scroll
        <span className="h-10 w-px animate-pulse bg-cream/50" />
      </a>
    </section>
  );
}
