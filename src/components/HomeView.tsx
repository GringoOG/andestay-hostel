"use client";

import Image from "next/image";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { AboutStickyGallery } from "@/components/AboutStickyGallery";
import { CabinCard } from "@/components/CabinCard";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Header } from "@/components/Header";
import { HeroTitle } from "@/components/HeroTitle";
import { LastingExperience } from "@/components/LastingExperience";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { cabins, images } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export function HomeView() {
  const { t } = useI18n();

  return (
    <>
      <Header tone="over-hero" />

      <section className="relative min-h-[100svh] overflow-hidden bg-[var(--forest-deep)] text-white">
        <div className="absolute inset-0 photo-green-grade">
          <PhotoPlaceholder
            label="AndeStay Hostel hero"
            src={images.hero}
            priority
            fillParent
            objectPosition="50% 42%"
            className="rounded-none scale-105 animate-[heroZoom_18s_ease-out_forwards]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 photo-green-veil" />
        <div className="pointer-events-none absolute inset-0 photo-green-shade" />

        <div className="site-wrap relative flex min-h-[100svh] flex-col items-center justify-end pb-16 pt-[calc(var(--nav-h)+3rem)] text-center md:pb-24">
          <div className="flex w-full max-w-3xl flex-col items-center">
            <span className="badge badge-light animate-[fadeUp_0.8s_ease_both]">
              {t.hero.badge}
            </span>
            <HeroTitle />
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-lg animate-[fadeUp_1s_ease_0.35s_both]">
              {t.hero.support}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-[fadeUp_1s_ease_0.55s_both]">
              <div className="flex items-center">
                {images.avatars.map((src) => (
                  <div
                    key={src}
                    className="relative -ml-2 h-10 w-10 overflow-hidden rounded-full border-2 border-white/40 first:ml-0"
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                ))}
                <div className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-semibold text-[var(--ink)]">
                  +56
                </div>
              </div>
              <p className="max-w-[16rem] text-sm text-white/85">
                {t.hero.socialProofBefore}
                <strong className="font-semibold text-white">{t.hero.socialProofBold}</strong>
                {t.hero.socialProofAfter}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--forest)] py-20 text-white md:py-28">
        <div className="site-wrap max-w-3xl">
          <Reveal>
            <span className="badge badge-light">{t.intro.badge}</span>
            <AnimatedHeading
              as="h2"
              className="mt-6 text-3xl font-light leading-[1.15] tracking-[-0.04em] sm:text-4xl md:text-5xl"
              parts={[
                { text: t.intro.before },
                { text: t.intro.bold, className: "font-bold" },
              ]}
            />
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/70">
              {t.aboutStory.paragraphs[0]}
            </p>
          </Reveal>
        </div>
      </section>

      <AboutStickyGallery />

      <section className="bg-[var(--bg-soft)] py-20 md:py-28">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">{t.accommodations.badge}</span>
            <AnimatedHeading
              as="h2"
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

          <div className="mt-14 space-y-10 md:mt-16">
            {cabins.map((cabin, i) => (
              <Reveal key={cabin.id}>
                <CabinCard cabin={cabin} reverse={i % 2 === 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <LastingExperience />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
