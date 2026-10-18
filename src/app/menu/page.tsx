import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { MenuBoard } from "@/components/MenuBoard";
import { Footer } from "@/components/Footer";
import { MobileActions } from "@/components/MobileActions";
import { MenuJsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/content/site";

const title = `Menu & Prices | ${site.name}${site.city ? `, ${site.city}` : ""}`;
const description = `The full ${site.name} menu with prices in PKR: breakfast, starters, pasta, sandwiches, burgers, pizza, grills, coffee, iced matcha, frappés, mocktails and dessert.`;

export const metadata: Metadata = buildMetadata({ title, description, path: "/menu" });

export default function MenuPage() {
  return (
    <>
      <MenuJsonLd />
      <Nav />
      <main id="main">
        <MenuBoard />
      </main>
      <Footer />
      <MobileActions />
    </>
  );
}
