// Generates favicon.ico, the apple-touch icon and PWA icons from the Cafe Nu logo.
// Run: npm run icons   (after npm run media has produced public/images/cafe-nu-badge.png)
import sharp from "sharp";
import { writeFile, rm } from "node:fs/promises";

const LOGO = "public/images/cafe-nu-badge.png";
const BG = "#1f1f1f"; // logo charcoal

const round = (size) => sharp(LOGO).resize(size, size).png().toBuffer();
// Full-bleed square on charcoal (for iOS / maskable), logo scaled into the safe zone
const square = async (size, scale) => {
  const inner = Math.round(size * scale);
  return sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: await sharp(LOGO).resize(inner, inner).toBuffer(), gravity: "center" }])
    .png()
    .toBuffer();
};

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(round));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
await writeFile("src/app/favicon.ico", Buffer.concat([header, ...images]));
// Icons live in public/ under cafe-nu-* names (declared in src/lib/seo.ts). Rename them when the logo
// changes: the host keeps serving old copies of public files whose names stay the same.
await rm("src/app/icon.png", { force: true });
await writeFile("public/cafe-nu-apple-icon.png", await square(180, 0.92));
await writeFile("public/cafe-nu-icon-192.png", await round(192));
await writeFile("public/cafe-nu-icon-512.png", await sharp(LOGO).resize(512, 512).png().toBuffer());
await writeFile("public/cafe-nu-icon-maskable-512.png", await square(512, 0.8));
// small, pre-sized logo for the header (3x of 56px): served as-is so it paints instantly
await writeFile("public/images/cafe-nu-badge-168.png", await sharp(LOGO).resize(168, 168).png({ compressionLevel: 9 }).toBuffer());
console.log("icons generated");
