# Cafe Nu: cafenuofficial.com

Animated website for **Cafe Nu**, a modern coffee cafe & restaurant.
Next.js 16 (App Router, static prerender) · Tailwind CSS 4 · GSAP ScrollTrigger · Lenis · React Three Fiber.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
npm run media        # re-generate web images from /resources (originals, not in git)
npm run menu-pdf     # rebuild the downloadable PDF menu from src/content/menu.ts, then set site.menuPdf
```

## Where to edit content

| What | File |
|---|---|
| Address, phone, WhatsApp, hours, socials, city, Maps links | `src/content/site.ts` |
| Menu items, prices, descriptions, dish photos | `src/content/menu.ts` (then `npm run menu-pdf` for the PDF) |
| Title / description / Open Graph | `src/lib/seo.ts` |
| Structured data (LocalBusiness + Menu) | `src/components/JsonLd.tsx` |

Anything left `null` in `site.ts` is hidden on the page **and** omitted from structured data, so no fake
details are ever published. Setting `city` also adds it to the page title and description.

## Live Google reviews

The Reviews section reads the rating and up to 5 reviews from **Places API (New)** at request time, via
`/api/reviews`. Per Google's policy, review content is never cached. It is fetched only when a visitor scrolls to
the section. Set these environment variables in Hostinger (see `.env.example`):

- `GOOGLE_PLACES_API_KEY`: an API key restricted to Places API (New), with a daily quota cap
- `GOOGLE_PLACE_ID`: Cafe NU's place ID

Without them the section shows "Read all on Google / Write a review" links and no numbers. Reviews are billed at
the Places "Enterprise + Atmosphere" tier, so check current pricing in Google Cloud.

## Page structure (`/`)

Preloader (desktop only) → Hero with 3D cup + beans (WebGL, desktop/tablet only, lazy-loaded) → info bar →
About (pinned 3-layer parallax) → Signature plates (pinned horizontal 3D carousel) → Menu teaser (links to `/menu`) →
Google reviews → Gallery + reel in a 3D phone → Visit → Footer.
All motion is disabled under `prefers-reduced-motion`; phones get a lighter version without WebGL or a preloader.

`/menu` is the full priced menu (scroll-spy category pills, PDF download) with its own metadata and Menu JSON-LD.
SEO audit, metadata inventory and post-deploy checklist: [`docs/SEO_AUDIT.md`](docs/SEO_AUDIT.md).

**Logo / icons:** source is `resources/cafe-nu-logo-badge.png`. `npm run media` then `npm run icons`. When the logo
changes, give the output files new names (the host and browsers cache public files for a year).

## Media

`scripts/optimize-media.mjs` turns the 14–23 MB camera originals into 2000px JPEG masters in `public/images/`;
`next/image` serves AVIF/WebP at quality 85 and responsive sizes up to 3x pixel density. The reel (`public/video/cafe-nu-reel-720.mp4`, 720×1280, ~2 MB, silent) only loads when scrolled into view. It was encoded with
`ffmpeg -i IMG_9949.MOV -vf scale=720:-2 -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -an -movflags +faststart cafe-nu-reel-720.mp4`
(use a new filename for any re-encode; the host caches public files for a year).
`resources/IIV01305.jpg (1).jpeg` is a byte-identical duplicate and is not used.

## Menu spelling fixes (please verify)

Prices are copied exactly from `CAFÉ U Menu 07.10.2026.pdf`. These spellings were corrected:
Break Fast → Breakfast · Scramble Egg → Scrambled Egg · Omelet → Omelette · Ceaser → Caesar ·
Crossiant → Croissant · Parmesano Truffle Crinkle → Parmesan Truffle Crinkle Fries · Samble Oleke → Sambal Oelek ·
Hazel Nutt / Hanzalnuit / Hazalnut → Hazelnut · Caramil / caramell → Caramel · Margatita / Margritta → Margarita ·
Nu Pasion → Nu Passion · Ice Tea → Iced Tea · Browine → Brownie · flaffy / flacky / crearny → fluffy / flaky / creamy.
Long descriptions were lightly tightened without changing ingredients.

## Launch checklist

1. Fill in `src/content/site.ts` (address, city, phone, hours, socials, Maps link).
2. Deploy (e.g. Vercel) and point `cafenuofficial.com` at it; redirect `www` → apex (or vice versa) at the host.
3. Google Search Console: verify the domain, submit `https://cafenuofficial.com/sitemap.xml`, request indexing.
4. Create/claim the **Google Business Profile** with exactly the same name, address and phone as the site.
5. Test structured data with Google's Rich Results Test and the Schema.org validator.
