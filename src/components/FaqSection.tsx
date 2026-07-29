"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n";

export function FaqSection() {
  const { t } = useI18n();

  return (
    <section className="bg-[var(--bg)] py-14 sm:py-20 md:py-28">
      <div className="site-wrap grid min-w-0 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <span className="badge badge-dark">{t.faq.badge}</span>
          <AnimatedHeading
            as="h2"
            className="mt-4 text-[1.65rem] font-medium tracking-tight sm:mt-5 sm:text-3xl md:text-4xl"
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
