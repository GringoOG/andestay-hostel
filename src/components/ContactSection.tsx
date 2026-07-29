"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export function ContactSection() {
  const { t } = useI18n();

  return (
    <section className="bg-[var(--bg-contact)] py-20 md:py-28">
      <div className="site-wrap grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <span className="badge badge-dark">{t.contact.badge}</span>
          <AnimatedHeading
            as="h2"
            className="mt-6 max-w-md text-3xl font-medium leading-tight tracking-tight text-[var(--ink)] sm:text-4xl"
            text={t.contact.title}
          />

          <ul className="mt-12 space-y-8">
            <li>
              <p className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
                {t.contact.email}
              </p>
              <a href={`mailto:${site.email}`} className="mt-1 block text-lg hover:opacity-70">
                {site.email}
              </a>
            </li>
            <li>
              <p className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
                {t.contact.telephone}
              </p>
              <a href={site.phoneHref} className="mt-1 block text-lg hover:opacity-70">
                {site.phone}
              </a>
            </li>
            <li>
              <p className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
                {t.contact.address}
              </p>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-lg hover:opacity-70"
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
