import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { InfoBar } from "@/components/InfoBar";
import { About } from "@/components/About";
import { Signatures } from "@/components/Signatures";
import { MenuTeaser } from "@/components/MenuTeaser";
import { Reviews } from "@/components/Reviews";
import { Gallery } from "@/components/Gallery";
import { Faq } from "@/components/Faq";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";
import { MobileActions } from "@/components/MobileActions";
import { SiteJsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <SiteJsonLd />
      <Preloader />
      <Nav />
      <main id="main">
        <Hero />
        <InfoBar />
        <About />
        <Signatures />
        <MenuTeaser />
        <Reviews />
        <Gallery />
        <Faq />
        <Visit />
      </main>
      <Footer />
      <MobileActions />
    </>
  );
}
