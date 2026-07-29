"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ContactSection } from "@/components/ContactSection";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n";

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <>
      <Header tone="light" />

      <section className="bg-[var(--bg)] pt-[calc(var(--nav-h)+2rem)] pb-4 sm:pt-[calc(var(--nav-h)+3rem)] sm:pb-6">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">{t.contact.pageBadge}</span>
            <AnimatedHeading
              as="h1"
              className="mt-4 max-w-2xl text-[1.85rem] font-medium tracking-tight sm:mt-5 sm:text-4xl md:text-5xl"
              text={t.contact.pageTitle}
            />
            <p className="mt-3 max-w-lg text-[0.95rem] text-[var(--ink-soft)] sm:mt-4 sm:text-base">
              {t.contact.pageBody}
            </p>
          </Reveal>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
