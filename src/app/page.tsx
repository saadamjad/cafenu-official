import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { InfoBar } from "@/components/InfoBar";
import { About } from "@/components/About";
import { Signatures } from "@/components/Signatures";
import { MenuTeaser } from "@/components/MenuTeaser";
import { Drinks } from "@/components/Drinks";
import { Reviews } from "@/components/Reviews";
import { Gallery } from "@/components/Gallery";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";
import { MobileActions } from "@/components/MobileActions";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Preloader />
      <Nav />
      <main id="main">
        <Hero />
        <InfoBar />
        <About />
        <Signatures />
        <MenuTeaser />
        <Drinks />
        <Reviews />
        <Gallery />
        <Visit />
      </main>
      <Footer />
      <MobileActions />
    </>
  );
}
