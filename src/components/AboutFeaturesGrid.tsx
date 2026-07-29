"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { aboutCardImages } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export function AboutFeaturesGrid() {
  const { t } = useI18n();

  return (
    <section className="bg-[var(--bg)] py-20 md:py-28">
      <div className="site-wrap text-center">
        <Reveal>
          <span className="badge badge-dark">{t.aboutPage.featuresBadge}</span>
          <AnimatedHeading
            as="h2"
            className="mx-auto mt-5 max-w-2xl font-display text-4xl italic leading-tight text-[var(--ink)] sm:text-5xl"
            text={t.aboutPage.featuresTitle}
            staggerMs={30}
          />
          <div className="mx-auto mt-5 h-px w-16 bg-[var(--line)]" />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {t.aboutCards.map((card, i) => (
            <Reveal key={card.title} delay={80 + i * 80}>
              <article className="text-left">
                <PhotoPlaceholder
                  label={card.title}
                  src={aboutCardImages[i] ?? aboutCardImages[0]}
                  className="aspect-[4/5]"
                />
                <div className="mt-4 grid gap-2 sm:grid-cols-[0.85fr_1.15fr] sm:items-start">
                  <h3 className="pb-0.5 font-display text-xl italic leading-snug text-[var(--serif-green)]">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-snug text-[var(--ink-soft)]">{card.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
