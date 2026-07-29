"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { aboutCardImages } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export function AboutFeaturesGrid() {
  const { t } = useI18n();

  return (
    <section className="bg-[var(--bg)] py-14 sm:py-20 md:py-28">
      <div className="site-wrap text-center">
        <Reveal>
          <span className="badge badge-dark">{t.aboutPage.featuresBadge}</span>
          <AnimatedHeading
            as="h2"
            className="mx-auto mt-4 max-w-2xl font-display text-[1.85rem] italic leading-tight text-[var(--ink)] sm:mt-5 sm:text-4xl md:text-5xl"
            text={t.aboutPage.featuresTitle}
            staggerMs={30}
          />
          <div className="mx-auto mt-4 h-px w-16 bg-[var(--line)] sm:mt-5" />
        </Reveal>

        <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 xl:grid-cols-4">
          {t.aboutCards.map((card, i) => (
            <Reveal key={card.title} delay={80 + i * 80}>
              <article className="text-left">
                <PhotoPlaceholder
                  label={card.title}
                  src={aboutCardImages[i] ?? aboutCardImages[0]}
                  className="aspect-[4/5]"
                />
                <div className="mt-3 grid gap-1.5 sm:mt-4 sm:gap-2 sm:grid-cols-[0.85fr_1.15fr] sm:items-start">
                  <h3 className="pb-0.5 font-display text-lg italic leading-snug text-[var(--serif-green)] sm:text-xl">
                    {card.title}
                  </h3>
                  <p className="text-[0.82rem] leading-snug text-[var(--ink-soft)] sm:text-sm">
                    {card.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
