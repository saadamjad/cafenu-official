// Generates favicon.ico, icon.png, apple-icon.png and PWA icons from the Cafe Nu logo.
// Run: npm run icons   (after npm run media has produced public/images/cafe-nu-logo.png)
import sharp from "sharp";
import { writeFile, rm } from "node:fs/promises";

const LOGO = "public/images/cafe-nu-logo.png";
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
await writeFile("src/app/icon.png", await round(192));
await rm("src/app/icon.svg", { force: true });
await writeFile("src/app/apple-icon.png", await square(180, 0.92));
await writeFile("public/icon-192.png", await round(192));
await writeFile("public/icon-512.png", await sharp(LOGO).resize(512, 512).png().toBuffer());
await writeFile("public/icon-maskable-512.png", await square(512, 0.8));
console.log("icons generated");
