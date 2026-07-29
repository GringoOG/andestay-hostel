"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { CabinCard } from "@/components/CabinCard";
import { ContactSection } from "@/components/ContactSection";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { cabins } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export default function AccommodationPage() {
  const { t } = useI18n();

  return (
    <>
      <Header tone="light" />

      <section className="bg-[var(--bg-soft)] pt-[calc(var(--nav-h)+3.5rem)] pb-16 md:pb-20">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">{t.accommodations.badge}</span>
            <AnimatedHeading
              as="h1"
              className="mt-6 max-w-3xl text-[1.85rem] font-light leading-[1.15] tracking-[-0.04em] text-[var(--ink)] sm:text-[2.35rem] md:text-[2.75rem] lg:text-[3rem]"
              parts={[
                { text: t.accommodations.titleBefore },
                { text: t.accommodations.titleBold, className: "font-bold" },
              ]}
            />
            <p className="mt-7 max-w-xl text-[0.98rem] font-light leading-[1.6] text-[var(--ink-soft)]">
              {t.accommodations.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--bg-soft)] py-16 md:py-24">
        <div className="site-wrap space-y-10">
          {cabins.map((cabin, i) => (
            <Reveal key={cabin.id}>
              <CabinCard cabin={cabin} reverse={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </section>

      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
