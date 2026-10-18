# Cafe Nu design guide

How the site should look and read. Keep new work inside these rules so the site stays calm and consistent.

## Feel
Relaxed, warm, premium. A guest should be able to skim a section in a few seconds. Fewer words, more space, one idea per section.

## Colour
Tokens live in `:root` in `src/app/globals.css`; use the Tailwind names, never raw hex.

| Token | Use |
|---|---|
| `coal` / `ink` | Dark sections, primary text on light |
| `cream` / `paper` | Light sections, cards |
| `gold` | Accents, buttons, labels on dark |
| `gold-deep` | Gold text on light backgrounds (AA contrast) |
| `muted` | Secondary text on light |

## Type
Use the shared classes instead of one-off sizes.

| Class | Use |
|---|---|
| `.eyebrow` (`.eyebrow--light` on dark) | Small kicker above every section heading |
| `.h2` | Section heading. One per section |
| `.lead` | Intro paragraph under a heading, and body copy. Max ~58ch |
| `.label` (`.label--light` on dark) | Card categories, info headings, UI hints ("Tap a card to flip") |

- Smallest text on the site: 12px (`text-xs`). No `text-[0.7rem]`, `text-[11px]` etc.
- At most three text sizes inside one card: label, body, heading.
- Headings use Playfair (`font-display`); everything else uses Outfit.

## Spacing
- Sections: `py-20 md:py-28`. Exceptions: About (`lg:min-h-screen`) and Signatures (`md:h-screen`) are pinned scroll scenes.
- Section header: eyebrow `mb-4` → `.h2` → `.lead` with `mt-5` → content `mt-12 md:mt-16`.
- Page gutters: `px-5 md:px-8`, content width `max-w-7xl`.

## Content
- Max two short paragraphs per section; say each fact once on the page.
- UI instructions are a `.label`, not a sentence.
- Long lists (the menu) show one group at a time; never dump everything at once.
- Never remove prices, hours, address, phone or WhatsApp. Business details come from `src/content/site.ts`, the menu from `src/content/menu.ts`.

## Motion
- Default reveal: opacity 0→1, y 24→0, 0.9s `expo.out`, stagger 0.05. No `rotateX` flips on reveal.
- Big moments only where they already exist: hero headline, About parallax, desktop Signatures carousel, Gallery phone.
- Every GSAP block starts with `if (prefersReducedMotion()) return;` (`src/lib/gsap`).
- Phones: no 3D transforms on scroll containers (they break iOS touch scrolling).

## Images
- Originals go in `resources/` (not in git). Add the file to `scripts/optimize-media.mjs` with an SEO slug (`cafe-nu-<dish>.jpg`) and run `npm run media`.
- Use `next/image` with `quality={85}` and a real `sizes` value. Write a descriptive `alt`.
- Avoid photos with text printed on them; crop it out in the media script if needed.

## Before deploying
1. `npm run typecheck && npm run lint && npm run build`
2. `npm start` and check at 375px and 1440px widths.
3. Turn on "reduce motion" in the OS and check the page still reads well.
