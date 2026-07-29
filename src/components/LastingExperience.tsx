"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { images } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

/**
 * Compact lasting-experience block — no tall sticky scroll track,
 * so testimonials follow immediately underneath.
 */
export function LastingExperience() {
  const { t } = useI18n();

  return (
    <section className="relative bg-[var(--bg)] py-14 sm:py-16 md:py-20">
      <div className="site-wrap relative w-full">
        <p className="pointer-events-none absolute left-0 top-[6%] hidden max-w-[9.5rem] text-sm leading-snug text-[var(--ink-muted)] lg:block">
          “{t.lasting.quotes[0]}”
        </p>
        <p className="pointer-events-none absolute right-0 top-[10%] hidden max-w-[9.5rem] text-right text-sm leading-snug text-[var(--ink-muted)] lg:block">
          “{t.lasting.quotes[1]}”
        </p>
        <p className="pointer-events-none absolute bottom-[4%] left-0 hidden max-w-[9.5rem] text-sm leading-snug text-[var(--ink-muted)] lg:block">
          “{t.lasting.quotes[2]}”
        </p>
        <p className="pointer-events-none absolute bottom-[6%] right-0 hidden max-w-[9.5rem] text-right text-sm leading-snug text-[var(--ink-muted)] lg:block">
          “{t.lasting.quotes[3]}”
        </p>

        <Reveal>
          <AnimatedHeading
            as="h2"
            className="mx-auto max-w-xl text-center text-[1.85rem] font-light tracking-[-0.04em] sm:text-4xl md:text-5xl"
            text={t.lasting.title}
          />
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:mt-10 sm:gap-5 sm:grid-cols-2 lg:mt-12 lg:max-w-3xl">
          <Reveal delay={80}>
            <PhotoPlaceholder
              label="Misty mountains"
              src={images.lastingA}
              className="aspect-[16/10] shadow-lg"
            />
          </Reveal>
          <Reveal delay={140}>
            <PhotoPlaceholder
              label="Cabins at night"
              src={images.lastingB}
              className="aspect-[16/10] shadow-lg"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
