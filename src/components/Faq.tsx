import type { ReactNode } from "react";
import { formatTime, site, telHref, whatsappHref } from "@/content/site";

// Answers confirmed by the owner (2026-10-22). Keep to facts: no FAQ schema (Google limits FAQ rich results),
// but plain HTML answers are readable by search engines and AI answers.
export function Faq() {
  const a = site.address;
  const hours = site.hours[0];
  const link = "font-medium text-gold-deep underline underline-offset-4";
  const contact = (
    <>
      {whatsappHref && (
        <a className={link} href={whatsappHref} target="_blank" rel="noopener">
          WhatsApp
        </a>
      )}
      {whatsappHref && telHref && " or call "}
      {telHref && (
        <a className={link} href={telHref}>
          {site.phoneDisplay}
        </a>
      )}
    </>
  );

  const items: { q: string; a: ReactNode }[] = [
    { q: "Can I book a table?", a: <>Yes. Message us on {contact} to reserve.</> },
    { q: "Do you do takeaway and delivery?", a: <>Yes: dine in, take away or get it delivered. To order, message us on {contact}.</> },
    hours && {
      q: "What are your opening hours?",
      a: <>{hours.days}, {formatTime(hours.opens)} to {formatTime(hours.closes)}.</>,
    },
    a && {
      q: "Where are you?",
      a: (
        <>
          {a.street}, {a.locality}.{" "}
          <a className={link} href={site.directionsUrl} target="_blank" rel="noopener">
            Get directions
          </a>
        </>
      ),
    },
    { q: "Is there parking?", a: <>Yes, at the building and along Old Sunset Boulevard.</> },
    { q: "Can I pay by card?", a: <>Yes, debit and credit cards are accepted.</> },
    {
      q: "Where can I see the menu and prices?",
      a: (
        <>
          The{" "}
          <a className={link} href="/menu">
            full menu with prices
          </a>{" "}
          is online, or{" "}
          <a className={link} href={site.menuPdf} download>
            download the PDF
          </a>
          .
        </>
      ),
    },
  ].filter(Boolean) as { q: string; a: ReactNode }[];

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="eyebrow mb-4">Good to know</p>
        <h2 id="faq-title" className="h2 text-ink">
          Questions, <em className="font-medium">answered.</em>
        </h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {items.map(({ q, a }) => (
            <details key={q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden="true" className="text-2xl leading-none text-gold-deep transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-5 leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
