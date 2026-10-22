# Cafe Nu website: SEO, performance and UX audit

Site: https://cafenuofficial.com · Audit dates: 2026-10-19 → 2026-10-22 · Owner: Cafe Nu (DHA Phase 2, Karachi)

This file combines the audit report, implementation log, metadata inventory, performance and accessibility results, keyword map and post-deploy checklist. Every finding below was checked against the live site, the code or a tool run. Anything not checked is listed under [Limitations](#limitations).

## 1. Summary

The site was already in good technical shape before this work. It is a statically prerendered Next.js 16 site with unique titles, canonical tags, a valid sitemap and robots.txt, real business data in structured data, descriptive alt text and no fabricated ratings.

The audit found and fixed the following:
- a duplicate `www` host
- wrong social previews on `/menu`
- menu structured data on the wrong page
- an **invisible header on `/menu`** (white links on a cream background)
- slow mobile first paint caused by animation and the preloader logo
- missing security headers
- a crawlable paid API endpoint

Mobile LCP is the main remaining performance gap. Most of it comes from the hosting response time, which the code can't change (see §4).

## 2. Site facts

| Item | Value |
|---|---|
| Stack | Next.js 16.4 (App Router, static prerender + ISR 15 min), React 19, Tailwind 4, GSAP, Lenis, three.js (desktop and tablet only, lazy) |
| Hosting | Hostinger (hcdn), auto-deploys from GitHub `main` |
| Public pages | `/` (home), `/menu` |
| Other routes | `/api/reviews` (Google Places proxy), `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, icons, 404 |
| Customer actions | View menu (HTML and PDF), Get directions (Google Maps), Call, WhatsApp. **No booking or online ordering exists.** |
| Business data source | `src/content/site.ts` (from the Google Business Profile). The menu is in `src/content/menu.ts` (from the printed menu, 07.10.2026). |

## 3. Findings and status

Status codes: ✅ fixed and verified locally, 🌐 verified on production, ⏳ open, 👤 needs owner action.

| ID | Pri | Area | Finding (evidence) | Fix | Status |
|---|---|---|---|---|---|
| S1 | P1 | Indexing | `www.cafenuofficial.com` served 200, so the whole site was duplicated on a second host (curl) | 308 redirect from www to the main domain in `next.config.ts` | 🌐 |
| S2 | P1 | Metadata | `/menu` share preview used the **home** twitter title and description, and had no og:image, og:type or og:site_name (live HTML) | `buildMetadata({title, description, path})` in `src/lib/seo.ts` | 🌐 |
| S3 | P1 | Schema | The Menu (all items and prices) JSON-LD was on `/`, and `/menu` had none | Split into `SiteJsonLd` (`/`) and `MenuJsonLd` + BreadcrumbList (`/menu`) | 🌐 |
| U1 | P1 | UX | **Header invisible on `/menu`**: cream links and a cream menu button on a cream page, so phones had no visible menu button (screenshots) | Pages other than home always use the dark header bar (`Nav.tsx`) | ✅ |
| P1 | P1 | Perf | `/menu` mobile LCP text painted 3.9 s late: GSAP hid categories already on screen until JS ran (Lighthouse LCP breakdown) | Only below-the-fold categories animate (`MenuBoard.tsx`) | ✅ |
| P2 | P2 | Perf | The 130 KB preloader logo was preloaded on phones, where the preloader is hidden, competing with the hero image | `<picture>`: phones reuse the 24 KB header logo (`Preloader.tsx`) | ✅ |
| P3 | P2 | Perf | Desktop preloader held the page for 2.2 s and the hero buttons appeared at 2.25 s | Preloader 1.2 s, buttons from 1.0 s | 🌐 |
| P4 | P2 | Perf | Reel video was 7.6 MB | Re-encoded H.264 CRF 28, silent (it's always muted): **2.1 MB (−72%)**, same 720×1280, frames visually identical; new filename `cafe-nu-reel-720.mp4`, old URL 308s | ✅ |
| S4 | P2 | Crawl | Sitemap had no lastmod, and `/menu` listed no images | Fixed `contentUpdated` lastmod plus the six dish images shown on `/menu` | 🌐 |
| S5 | P2 | Crawl | `/api/reviews` was crawlable. With an API key set, each hit is a billed Places call | `Disallow: /api/` | ✅ |
| X1 | P2 | Security | No `X-Content-Type-Options`, `Referrer-Policy`, frame protection or `Permissions-Policy` (curl -I) | Added in `next.config.ts` `headers()` | ✅ |
| A1 | P2 | A11y | Active header link failed contrast on `/menu` desktop (Lighthouse a11y 96) | Fixed by U1 → 100 | ✅ |
| A2 | P3 | A11y | Gallery buttons' `aria-label` didn't match their visible content (label-content-name-mismatch) | Name now comes from content: sr-only "View larger:" + image alt | ✅ |
| A3 | P3 | A11y | Hidden phone quick-action bar was still exposed to screen readers | `aria-hidden={!show}` | ✅ |
| B1 | P2 | Brand | New "CAFE" badge logo. Hostinger and browsers kept old copies because the filenames stayed the same | New filenames (`cafe-nu-badge*`, `cafe-nu-icon-*`) plus 308s from the old URLs | 🌐 |
| C1 | P3 | Content | Drinks flip-card section removed at the owner's request. Links now point to `/menu#menu-hot-coffee` | | 🌐 |
| I1 | P3 | Images | Signature dish alt text was only the dish name | `"<dish> at Cafe Nu"` | 🌐 |
| O1 | P2 | Brand | The **PDF menu** had the old lowercase "Café" logo and old spellings (Break Fast, Ceaser, Crossiant) | New PDF built from `menu.ts` by `npm run menu-pdf`: new logo, same spellings and prices as `/menu`. Saved as `cafe-nu-menu-2026-10-22.pdf`; the old URL redirects to it | ✅ |
| O2 | P3 | UX | The WhatsApp panel auto-opened on desktop and covered menu prices on `/menu` | No auto-open on `/menu` (still opens on demand; home is unchanged) | ✅ |
| O3 | P3 | Reviews | `/api/reviews` returns `null` in production (no API key), so the section shows the hand-copied Google reviews (4.9 ★, 8 reviews) from `src/content/reviews.ts`. Keep them in sync by hand. | | 👤 |
| O4 | P3 | Security | No HSTS header. It wasn't added because it is hard to undo if HTTPS ever breaks. | Add `Strict-Transport-Security: max-age=31536000` after a month of stable HTTPS | ⏳ |

Checked and found fine: HTTP→HTTPS (301), `/menu/` → `/menu` (308), real 404 status, one H1 per page, `lang="en"`, viewport, no mixed content, no noindex, canonical tags self-referencing, no horizontal overflow at 360–412 px (Lighthouse emulation), `npm audit` 0 vulnerabilities, no secrets in git (`.env.example` only).

## 4. Performance (lab data, Lighthouse 12, simulated throttling)

Baseline: live site, 2026-10-22, before fixes P1, P2, U1 and A1–A3.

| Page | Device | Perf | A11y | BP | SEO | LCP | CLS | TBT | Weight |
|---|---|---|---|---|---|---|---|---|---|
| `/` | mobile | 80 | 100 | 100 | 100 | 5.0 s | 0 | 40 ms | 738 KB |
| `/` | desktop | 95 | 100 | 100 | 100 | 1.1 s | 0 | 0 ms | 1080 KB |
| `/menu` | mobile | 80 | 100 | 100 | 100 | 4.8 s | 0 | 40 ms | 445 KB |
| `/menu` | desktop | 99 | 96 | 100 | 100 | 0.6 s | 0 | 0 ms | 448 KB |

After the fixes, on a local production build (`npm start`). **Not directly comparable:** local has no network round-trip to Hostinger.

| Page | Device | Perf | A11y | LCP | CLS |
|---|---|---|---|---|---|
| `/` | mobile | 85 | 100 | 4.5 s | 0 |
| `/menu` | mobile | 93 | 100 | 3.3 s | 0 |
| `/menu` | desktop | n/a | 100 | n/a | 0 |

**Live, after deploy (2026-10-22, same Lighthouse settings as the baseline):**

| Page | Device | Perf | A11y | BP | SEO | LCP | CLS |
|---|---|---|---|---|---|---|---|
| `/` | desktop | 95 | 100 | 100 | 100 | 1.0 s | 0 |
| `/menu` | desktop | 93 | 100 | 100 | 100 | 1.4 s | 0 |
| `/` | mobile, 4 runs | 75–88 | 100 | 100 | 100 | 3.8–5.7 s | 0 |
| `/menu` | mobile, 4 runs | 79–86 | 100 | 100 | 100 | 3.6–4.6 s | 0 |

**How to read the mobile numbers:** Lighthouse's mobile LCP is a *simulated* estimate. In the same runs, the
*observed* LCP was 1.3–2.7 s, but that used an unthrottled connection, so it is optimistic. The simulated value varies ±1 s from
run to run and is driven mainly by the ~270 KB of JavaScript (Next/React plus GSAP), which the model assumes must load before the
first text paint. **Conclusion:** accessibility on `/menu` desktop went from 96 to 100 and CLS stays at 0. The mobile LCP change can't be
told apart from run-to-run noise in lab tests. Use Search Console field data (75th percentile) to judge it. The next real lever is
less JavaScript on first load, e.g. lazy-loading GSAP/Lenis for below-the-fold effects. That's a larger change and wasn't done here.

**What's left in mobile LCP on `/`:** TTFB from Hostinger is about 0.9–1.0 s, and the hero image waits for fonts and JS chunks on a throttled 4G connection. The hero image itself is only about 25 KB (AVIF, 750 w).

Next options, each with a trade-off:
1. Shorten the hero image's `fade-up` delay on mobile.
2. Drop one font weight or style (Playfair italic is used only for accents).
3. Ask Hostinger about edge caching of HTML (`x-hcdn-cache-status: DYNAMIC` on HTML today).

**Field data** (real users, 75th percentile) is not available to me. Check Search Console → Core Web Vitals or PageSpeed Insights once there's enough traffic.

## 5. Metadata inventory

| Route | Title | Description (start) | Canonical | Robots | OG/Twitter |
|---|---|---|---|---|---|
| `/` | Cafe Nu \| Modern Coffee Cafe & Restaurant in Karachi | "Cafe Nu in Karachi: specialty espresso, iced matcha, all-day breakfast…" | `https://cafenuofficial.com` | index, follow, max-image-preview:large | full, og-cafe-nu.jpg 1200×630 |
| `/menu` | Menu & Prices \| Cafe Nu, Karachi | "The full Cafe Nu menu with prices in PKR: breakfast, starters, pasta…" | `https://cafenuofficial.com/menu` | index, follow | full, its own title and description |
| 404 | Page not found \| Cafe Nu | n/a | n/a | status 404 | n/a |

Structured data:
- `/` has `CafeOrCoffeeShop` (address, phone, hours, price range, sameAs, hasMenu) and `WebSite`.
- `/menu` has `Menu` (16 sections, priced items in PKR, provider → cafe) and `BreadcrumbList`.
- No `aggregateRating` or `Review` markup. Google doesn't show review rich results that a business publishes about itself.

## 6. Keyword and search-intent map

There's no keyword tool access, so this table has **no search volumes**. The themes come from the real menu, the location and how people typically search for cafes. Validate them with Search Console queries after 4–8 weeks.

| Theme | Intent | Page | Current coverage | Action |
|---|---|---|---|---|
| "cafe nu", "cafe nu karachi", "cafe nu dha" | Brand / navigational | `/` | Title, H1, schema, GBP | Keep the NAP (name, address, phone) identical to the Google Business Profile |
| "cafe nu menu", "cafe nu prices" | Brand + menu | `/menu` | Title "Menu & Prices", full HTML menu | none |
| "cafe in dha phase 2", "cafe near sunset boulevard", "breakfast dha karachi" | Local discovery | `/` | Address in hero, Visit, footer, schema | Mostly decided by the Google Business Profile (reviews, photos, categories), not by the website |
| "all day breakfast karachi", "club sandwich dha", "tuscan chicken pasta karachi", "iced matcha karachi" | Dish / product | `/menu` | Dishes listed with descriptions and prices | Dish pages only if Search Console shows impressions for them |
| "cafe nu timings", "is cafe nu open now" | Practical | `/` | Hours in Visit, live open status, schema | none |
| "cafe nu booking", "cafe nu delivery", "parking" | Practical | n/a | **Unknown**. The site doesn't say. | Owner must confirm (see §7) |

## 7. Content plan (only with verified facts)

| Proposed | Why | Needs from the owner | Priority |
|---|---|---|---|
| Short FAQ on `/` (booking, delivery and apps, parking, payment methods, family or work seating, Wi-Fi) | These are real visitor questions; the WhatsApp quick replies already include "Can I book a table?" | The true answer to each one | P2 |
| Seasonal or special menu notes on `/menu` | Fresh, useful content | Real specials | P3 |
| Dish pages for top sellers | Only if Search Console shows dish-level demand | Photos and descriptions | P3 |

Deliberately not done: blog, city or area pages, a "best cafe" claim, or FAQ schema without visible answers.

## 8. Post-deployment checklist

After Hostinger deploys `main`:
- [ ] `curl -I https://www.cafenuofficial.com/` → 308 to the main domain
- [ ] `curl -I https://cafenuofficial.com/` shows nosniff, Referrer-Policy, X-Frame-Options and Permissions-Policy
- [ ] `https://cafenuofficial.com/robots.txt` includes `Disallow: /api/`
- [ ] `/menu` on a phone shows the dark header with a visible menu button
- [ ] Logo shows "CAFE" in capitals (hard refresh), and the tab icon is updated
- [ ] Gallery reel plays (new video filename)
- [ ] Re-run Lighthouse mobile on `/` and `/menu` and compare with §4
- [ ] Rich Results Test on `/` and `/menu` (structured data parses; rich results are never guaranteed)

Google accounts (owner):
- [ ] Search Console: add the domain property, submit `https://cafenuofficial.com/sitemap.xml`, and inspect `/` and `/menu` (request indexing once, not repeatedly)
- [ ] Google Business Profile: website field = `https://cafenuofficial.com`, menu link = `/menu`, hours match `site.ts`
- [ ] Optional: Places API key and place ID in Hostinger env vars for live reviews (billed, see README)

Monitoring:
- **30 days:** indexing and sitemap status, and the first queries.
- **60 days:** compare query CTR on `/` and `/menu`, and tune titles only if the data supports it.
- **90 days:** Core Web Vitals field data, and the FAQ once the owner's answers are in.

Crawling and ranking changes are decided by Google and take time. Nothing here guarantees rankings or traffic.

## Limitations

- No access to Search Console, Analytics, Business Profile, server logs or backlink data. No indexing or ranking statements are made.
- Performance numbers are Lighthouse lab runs (single runs, simulated throttling). Field Core Web Vitals were not available.
- Accessibility: Lighthouse/axe automated checks plus screenshot review. No full manual screen-reader pass, so this is not a WCAG conformance claim.
- Phone layout was checked with Lighthouse device emulation and headless Chrome, not on physical devices.
