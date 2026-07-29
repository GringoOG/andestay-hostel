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

      <section className="bg-[var(--bg)] pt-[calc(var(--nav-h)+3rem)] pb-6">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">{t.contact.pageBadge}</span>
            <AnimatedHeading
              as="h1"
              className="mt-5 max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl"
              text={t.contact.pageTitle}
            />
            <p className="mt-4 max-w-lg text-[var(--ink-soft)]">{t.contact.pageBody}</p>
          </Reveal>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
