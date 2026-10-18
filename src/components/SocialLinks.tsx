import { site } from "@/content/site";

const icons = {
  instagram: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V9c0-.6.4-1 1-1z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.3 2.2 1.7 3.8 4 4v3.2c-1.5 0-2.9-.4-4-1.2V15a6 6 0 1 1-6-6h.5v3.3a2.8 2.8 0 1 0 2.3 2.7V3h3.2z" />
    </svg>
  ),
} as const;

const labels = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" } as const;

type Variant = "pill" | "icon";

// Renders only networks that have a real URL in site.ts.
export function SocialLinks({ variant = "pill", className = "" }: { variant?: Variant; className?: string }) {
  const links = (Object.keys(labels) as (keyof typeof labels)[])
    .map((k) => ({ key: k, url: site.socials[k] }))
    .filter((l): l is { key: keyof typeof labels; url: string } => Boolean(l.url));
  if (!links.length) return null;

  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {links.map(({ key, url }) => (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={variant === "icon" ? `${site.name} on ${labels[key]}` : undefined}
            className={
              variant === "pill"
                ? "inline-flex min-h-12 items-center gap-2.5 rounded-full bg-cream px-5 py-3 font-semibold text-ink shadow-lg transition hover:-translate-y-0.5 hover:bg-gold"
                : "grid h-11 w-11 place-items-center rounded-full border border-current/30 transition hover:border-gold hover:bg-gold hover:text-ink"
            }
          >
            {icons[key]}
            {variant === "pill" && <span>{labels[key]}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
