"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

function whatsappOfferUrl(offerTitle: string): string {
  const text = encodeURIComponent(
    `Hola AndeStay — me interesa el transporte: ${offerTitle}`,
  );
  return `${site.whatsappUrl}?text=${text}`;
}

export default function TransportPage() {
  const { t } = useI18n();
  const page = t.transportPage;

  return (
    <>
      <Header tone="light" />

      <section className="bg-[var(--bg)] pt-[calc(var(--nav-h)+2rem)] pb-10 sm:pt-[calc(var(--nav-h)+3rem)] sm:pb-14">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">{page.badge}</span>
            <AnimatedHeading
              as="h1"
              className="mt-4 max-w-2xl text-[1.85rem] font-medium tracking-tight sm:mt-5 sm:text-4xl md:text-5xl"
              text={page.title}
            />
            <p className="mt-3 max-w-xl text-[0.95rem] text-[var(--ink-soft)] sm:mt-4 sm:text-base">
              {page.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--bg-soft)] py-12 sm:py-16 md:py-20">
        <div className="site-wrap space-y-6 sm:space-y-8">
          {page.offers.map((offer, i) => (
            <Reveal key={offer.id} delay={i * 80}>
              <article className="grid gap-6 border-b border-[var(--line)] pb-8 last:border-b-0 last:pb-0 sm:gap-8 sm:pb-10 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)] uppercase">
                    {offer.route}
                  </p>
                  <h2 className="mt-2 font-display text-[1.45rem] italic leading-tight text-[var(--serif-green)] sm:text-2xl md:text-3xl">
                    {offer.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--ink-soft)] sm:text-base">
                    {offer.blurb}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {offer.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-[0.88rem] text-[var(--ink-soft)] sm:text-[0.95rem]"
                      >
                        <span
                          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--bg-muted)] text-[0.65rem] text-[var(--accent-green)]"
                          aria-hidden
                        >
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={whatsappOfferUrl(offer.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill w-full justify-between sm:w-auto"
                >
                  <span>{page.askWhatsApp}</span>
                  <span className="btn-arrow" aria-hidden>
                    <span className="btn-arrow-icon">→</span>
                  </span>
                </a>
              </article>
            </Reveal>
          ))}
          <p className="max-w-2xl text-sm text-[var(--ink-muted)]">{page.note}</p>
        </div>
      </section>
    </>
  );
}
