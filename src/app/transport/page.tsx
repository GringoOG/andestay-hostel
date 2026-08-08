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

function TransportVideo() {
  return (
    <div className="relative w-full overflow-hidden rounded-[1.15rem] bg-[var(--bg-muted)] shadow-[0_10px_32px_rgba(20,24,20,0.08)] ring-1 ring-black/5 sm:rounded-[1.35rem]">
      <div className="relative aspect-video w-full overflow-hidden">
        {/* Slight zoom + crop hides residual Gemini sparkle in the source corner */}
        <video
          className="absolute inset-0 h-full w-full origin-top-left scale-[1.07] object-cover"
          poster="/videos/transporte-auto-poster.jpg"
          preload="metadata"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          aria-label="AndeStay Hostel transport van"
        >
          <source src="/videos/transporte-auto.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
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
        <div className="site-wrap space-y-10 sm:space-y-12 md:space-y-14">
          {page.offers.map((offer, i) => {
            const showVideo = offer.id === "colectivo";
            return (
              <Reveal key={offer.id} delay={i * 80}>
                <article
                  className={`border-b border-[var(--line)] pb-10 last:border-b-0 last:pb-0 sm:pb-12 ${
                    showVideo
                      ? "grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-10"
                      : "grid gap-5"
                  }`}
                >
                  <div className="min-w-0">
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
                    <a
                      href={whatsappOfferUrl(offer.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill mt-6 inline-flex w-full max-w-sm justify-between sm:w-auto"
                    >
                      <span>{page.askWhatsApp}</span>
                      <span className="btn-arrow" aria-hidden>
                        <span className="btn-arrow-icon">→</span>
                      </span>
                    </a>
                  </div>

                  {showVideo ? (
                    <div className="min-w-0 lg:justify-self-stretch">
                      {/* Mobile: under copy; desktop: right column where the button used to sit */}
                      <TransportVideo />
                    </div>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
          <p className="max-w-2xl text-sm text-[var(--ink-muted)]">{page.note}</p>
        </div>
      </section>
    </>
  );
}
