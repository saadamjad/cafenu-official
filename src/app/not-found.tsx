import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found | Cafe Nu" };

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-screen place-items-center bg-coal px-4 text-center text-cream">
      <div>
        <p className="font-display text-[clamp(5rem,20vw,12rem)] font-semibold leading-none text-gold">404</p>
        <h1 className="font-display mt-4 text-3xl">This cup is empty.</h1>
        <p className="mt-3 text-cream/70">The page you were looking for doesn&apos;t exist.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="rounded-full bg-gold px-6 py-3 font-semibold text-ink">Back to Cafe Nu</Link>
          <Link href="/menu" className="rounded-full border border-cream px-6 py-3 font-semibold">See the menu</Link>
        </div>
      </div>
    </main>
  );
}
