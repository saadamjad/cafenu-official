// Generates favicon.ico, apple-icon.png and PWA icons from src/app/icon.svg.
// Run: npm run icons
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const svg = await readFile("src/app/icon.svg");
const png = (size, src = svg) => sharp(src, { density: 384 }).resize(size, size).png().toBuffer();

// favicon.ico with 16/32/48 PNG entries (ICO supports embedded PNG)
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(s)));
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

// Apple touch icon: full-bleed square (iOS rounds corners itself)
const fullBleed = Buffer.from(
  svg.toString().replace('rx="16"', 'rx="0"'),
);
await writeFile("src/app/apple-icon.png", await png(180, fullBleed));

// PWA icons
await writeFile("public/icon-192.png", await png(192));
await writeFile("public/icon-512.png", await png(512));
// Maskable: bean shrunk into the 80% safe zone on a full-bleed background
const maskable = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#2b211c"/><g transform="translate(32 32) scale(0.72) translate(-32 -32)"><g transform="rotate(-30 32 32)"><ellipse cx="32" cy="32" rx="13" ry="19" fill="#d9b98c"/><path d="M32 13c-6 7 6 13 0 19s6 13 0 19" fill="none" stroke="#2b211c" stroke-width="3" stroke-linecap="round"/></g></g></svg>`,
);
await writeFile("public/icon-maskable-512.png", await png(512, maskable));
console.log("icons generated");
