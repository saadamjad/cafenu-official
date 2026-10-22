// Builds the downloadable PDF menu from src/content/menu.ts (same data, spellings and prices as /menu).
// Run: npm run menu-pdf   (needs Google Chrome installed; set CHROME_PATH to override its location)
// Output gets a dated filename: the host and browsers cache public files for a year, so never overwrite one.
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const tmp = await mkdtemp(path.join(tmpdir(), "menu-pdf-"));

// menu.ts / site.ts are TypeScript with no imports: strip the types and load them as modules
async function load(file) {
  const src = await readFile(path.join(root, "src/content", file), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const out = path.join(tmp, file.replace(/\.ts$/, ".mjs"));
  await writeFile(out, js);
  return import(pathToFileURL(out).href);
}
const { menu, formatPrice } = await load("menu.ts");
const { site } = await load("site.ts");
const host = new URL(site.url).host;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const logo = pathToFileURL(path.join(root, "public/images/cafe-nu-badge.png")).href;

const section = (c) => `
  <section>
    <h2>${esc(c.title)}</h2>
    ${c.note ? `<p class="note">${esc(c.note)}</p>` : ""}
    ${c.items
      .map(
        (i) => `<div class="item">
      <div class="row"><h3>${esc(i.name)}</h3><span class="dots"></span><span class="price">${formatPrice(i.price)}</span></div>
      ${i.description ? `<p>${esc(i.description)}</p>` : ""}
    </div>`,
      )
      .join("")}
  </section>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&family=Playfair+Display:ital,wght@0,500;1,500&display=block" rel="stylesheet">
<style>
  @page { size: A4; margin: 14mm 14mm 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 300 9.5pt/1.45 Outfit, sans-serif; color: #1f1f1f; }
  header { display: flex; align-items: center; gap: 14px; padding-bottom: 10px; border-bottom: 1.5px solid #cfaa76; margin-bottom: 14px; }
  header img { width: 64px; height: 64px; }
  header h1 { font: italic 500 24pt/1 "Playfair Display", serif; margin: 0; }
  header p { margin: 4px 0 0; color: #615a52; }
  main { columns: 2; column-gap: 12mm; }
  section { break-inside: auto; margin-bottom: 12px; }
  h2 { font: italic 500 15pt/1.2 "Playfair Display", serif; margin: 0 0 6px; padding-bottom: 3px; border-bottom: 1px solid #e3dbcf; break-after: avoid; }
  .note { margin: 0 0 6px; color: #7a5a2b; font-size: 8.5pt; }
  .item { break-inside: avoid; margin-bottom: 6px; }
  .row { display: flex; align-items: baseline; gap: 6px; }
  h3 { font-weight: 500; font-size: 9.5pt; margin: 0; }
  .dots { flex: 1; border-bottom: 1px dotted #b9ad9c; translate: 0 -3px; }
  .price { font-weight: 500; color: #7a5a2b; white-space: nowrap; }
  .item p { margin: 1px 0 0; color: #615a52; font-size: 8.5pt; }
  footer { margin-top: 10px; padding-top: 6px; border-top: 1px solid #e3dbcf; color: #615a52; font-size: 8pt; text-align: center; }
</style></head><body>
<header><img src="${logo}" alt=""><div><h1>${esc(site.name)} Menu</h1><p>All prices in Pakistani rupees · ${host}/menu</p></div></header>
<main>${menu.map(section).join("")}</main>
<footer>${[site.address && `${site.address.street}, ${site.address.locality}`, site.phoneDisplay, host].filter(Boolean).map(esc).join(" · ")}</footer>
</body></html>`;

const htmlPath = path.join(tmp, "menu.html");
await writeFile(htmlPath, html);

const date = new Date().toISOString().slice(0, 10);
const out = path.join(root, `public/cafe-nu-menu-${date}.pdf`);
const chrome = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--virtual-time-budget=8000",
  `--print-to-pdf=${out}`,
  pathToFileURL(htmlPath).href,
], { stdio: "ignore" });
console.log(`wrote ${path.relative(root, out)}: set site.menuPdf in src/content/site.ts`);
