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

// Phone shots / promo posts (already ~1320px wide): keep full native resolution, light compression.
const phonePhotos = {
  "IMG_2735.jpg": "cafe-nu-club-sandwich-dining-room",
  "IMG_2736.jpg": "cafe-nu-iced-frappe",
  "IMG_2738.jpg": "cafe-nu-pizza-pasta-sandwich-spread",
};
for (const [file, slug] of Object.entries(phonePhotos)) {
  await sharp(path.join(SRC, file)).rotate().jpeg({ quality: 90, mozjpeg: true }).toFile(`${OUT}/${slug}.jpg`);
  console.log("✓", slug);
}
// Bruschetta poster: crop off the printed title/description so the card caption isn't duplicated.
{
  const file = path.join(SRC, "IMG_2737.jpg");
  const { width, height } = await sharp(file).metadata();
  const top = Math.round(height * 0.44);
  await sharp(file).rotate().extract({ left: 0, top, width, height: height - top }).jpeg({ quality: 90, mozjpeg: true }).toFile(`${OUT}/cafe-nu-rustic-chicken-bruschetta.jpg`);
  console.log("✓ cafe-nu-rustic-chicken-bruschetta");
}

// Logo: mask the round badge onto a transparent background
const LOGO = path.join(SRC, "cafe-nu-logo-badge.png");
const size = 480;
const circle = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="#fff"/></svg>`);
// trim the white margin first so the circle mask follows the gold ring
const trimmed = await sharp(LOGO).trim({ background: "#ffffff", threshold: 30 }).toBuffer();
await sharp(trimmed)
  .resize(size, size, { fit: "cover" })
  .ensureAlpha()
  .composite([{ input: circle, blend: "dest-in" }])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/cafe-nu-logo.png`);
console.log("✓ logo");

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
