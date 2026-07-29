"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n";

export function FaqSection() {
  const { t } = useI18n();

  return (
    <section className="bg-[var(--bg)] py-20 md:py-28">
      <div className="site-wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <span className="badge badge-dark">{t.faq.badge}</span>
          <AnimatedHeading
            as="h2"
            className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl"
            text={t.faq.title}
          />
        </Reveal>
        <Reveal delay={120}>
          <FaqAccordion />
        </Reveal>
      </div>
    </section>
  );
}
