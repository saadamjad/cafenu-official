import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { buildMetadata } from "@/lib/seo";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1f1f1f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        {children}
        <WhatsAppWidget />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
