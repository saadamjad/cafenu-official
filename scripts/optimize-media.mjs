// Converts the high-res originals in /resources into web-ready assets in /public.
// next/image generates AVIF/WebP + responsive sizes from these masters at request time.
// Run: npm run media   (requires the original files in /resources)
import sharp from "sharp";
import { mkdir, copyFile, access } from "node:fs/promises";
import path from "node:path";

const SRC = "resources";
const OUT = "public/images";

// source file -> SEO-friendly slug
const photos = {
  "IIV02021.jpg.jpeg": "cafe-nu-all-day-breakfast-latte",
  "IIV02045.jpg.jpeg": "cafe-nu-scrambled-egg-croissant",
  "IIV01621.jpg.jpeg": "cafe-nu-club-sandwich",
  "IIV01305.jpg.jpeg": "cafe-nu-caesar-salad",
  "IIV02375.jpg.jpeg": "cafe-nu-creamy-tuscan-chicken-pasta",
  "IIV01662.jpg.jpeg": "cafe-nu-sandwich-and-coffee-cup",
};

await mkdir(OUT, { recursive: true });
for (const [file, slug] of Object.entries(photos)) {
  const input = sharp(path.join(SRC, file)).rotate();
  const base = input.clone().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true });
  await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/${slug}.jpg`);
  console.log("✓", slug);
}

// Open Graph card (1200x630) from the breakfast hero shot
await sharp(path.join(SRC, "IIV02021.jpg.jpeg"))
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/og-cafe-nu.jpg");

const pdf = path.join(SRC, "CAFÉ U Menu 07.10.2026.pdf");
try {
  await access(pdf);
  await copyFile(pdf, "public/cafe-nu-menu.pdf");
} catch {}
console.log("done");
