"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { site, telHref, whatsappHref } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export function ContactSection() {
  const { t } = useI18n();

  return (
    <section className="bg-[var(--bg-contact)] py-14 sm:py-20 md:py-28">
      <div className="site-wrap grid gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <span className="badge badge-dark">{t.contact.badge}</span>
          <AnimatedHeading
            as="h2"
            className="mt-5 max-w-md text-[1.65rem] font-medium leading-tight tracking-tight text-[var(--ink)] sm:mt-6 sm:text-3xl md:text-4xl"
            text={t.contact.title}
          />

          <ul className="mt-8 space-y-6 sm:mt-12 sm:space-y-8">
            <li>
              <p className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
                {t.contact.email}
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-1 block break-all text-base hover:opacity-70 sm:text-lg"
              >
                {site.email}
              </a>
            </li>
            <li>
              <p className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
                {t.contact.telephone}
              </p>
              <div className="mt-1 space-y-2">
                {site.phones.map((phone) => (
                  <div
                    key={phone.e164}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base sm:text-lg"
                  >
                    <a href={telHref(phone)} className="hover:opacity-70">
                      {phone.label}
                    </a>
                    <a
                      href={whatsappHref(phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--serif-green)] hover:opacity-70"
                    >
                      WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            </li>
            <li>
              <p className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
                {t.contact.address}
              </p>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-base hover:opacity-70 sm:text-lg"
              >
                {site.address}
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={140}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
