import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Signatures } from "@/components/Signatures";
import { MenuBoard } from "@/components/MenuBoard";
import { Drinks } from "@/components/Drinks";
import { Gallery } from "@/components/Gallery";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Preloader />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Signatures />
        <MenuBoard />
        <Drinks />
        <Gallery />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
