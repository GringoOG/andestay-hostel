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
        {/*
          Mobile: photo sits in a 4:3 frame (matches the landscape file) so the whole image is visible.
          Desktop: full-bleed cover + soft zoom, as before.
        */}
        <div className="absolute inset-x-0 top-0 aspect-[4/3] overflow-hidden md:inset-0 md:aspect-auto">
          <PhotoPlaceholder
            label="AndeStay Hostel hero"
            src={images.hero}
            priority
            fillParent
            objectPosition="48% 45%"
            sizes="100vw"
            quality={85}
            imageClassName="object-cover"
            className="rounded-none md:origin-center md:scale-105 md:animate-[heroZoom_18s_ease-out_forwards]"
          />
        </div>

        {/* Desktop soft forest veil */}
        <div className="pointer-events-none absolute inset-0 hidden photo-green-veil md:block" />
        <div className="pointer-events-none absolute inset-0 hidden photo-green-shade md:block" />

        {/* Mobile: fade from photo into deep forest so copy stays readable below */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-0% via-transparent via-[28%] to-[var(--forest-deep)] to-[48%] md:hidden" />

        <div className="site-wrap relative flex min-h-[100svh] flex-col items-center justify-center pb-[max(2.25rem,calc(1rem+var(--safe-bottom)))] pt-[calc(var(--nav-h)+1.25rem)] text-center sm:pb-16 sm:pt-[calc(var(--nav-h)+2rem)] md:pb-24 md:pt-[calc(var(--nav-h)+3rem)]">
          <div className="flex w-full max-w-3xl flex-col items-center px-0.5">
            <span className="badge badge-light animate-[fadeUp_0.8s_ease_both]">
              {t.hero.badge}
            </span>
            <HeroTitle />
            <p className="mt-4 max-w-[20.5rem] text-[0.92rem] leading-relaxed text-white/90 sm:mt-6 sm:max-w-md sm:text-base md:text-lg animate-[fadeUp_1s_ease_0.35s_both]">
              {t.hero.support}
            </p>

            <div className="mt-7 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 animate-[fadeUp_1s_ease_0.55s_both]">
              <div className="flex items-center">
                {images.avatars.map((src) => (
                  <div
                    key={src}
                    className="relative -ml-2 h-9 w-9 overflow-hidden rounded-full border-2 border-white/40 first:ml-0 sm:h-10 sm:w-10"
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                ))}
                <div className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[0.7rem] font-semibold text-[var(--ink)] sm:h-10 sm:w-10 sm:text-xs">
                  +56
                </div>
              </div>
              <p className="max-w-[17.5rem] text-center text-[0.8rem] leading-snug text-white/88 sm:max-w-[16rem] sm:text-sm">
                {t.hero.socialProofBefore}
                <strong className="font-semibold text-white">{t.hero.socialProofBold}</strong>
                {t.hero.socialProofAfter}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--forest)] py-14 text-white sm:py-20 md:py-28">
        <div className="site-wrap max-w-3xl">
          <Reveal>
            <span className="badge badge-light">{t.intro.badge}</span>
            <AnimatedHeading
              as="h2"
              className="mt-5 text-[1.65rem] font-light leading-[1.18] tracking-[-0.04em] sm:mt-6 sm:text-3xl md:text-4xl lg:text-5xl"
              parts={[
                { text: t.intro.before },
                { text: t.intro.bold, className: "font-bold" },
              ]}
            />
            <p className="mt-5 max-w-xl text-[0.95rem] font-light leading-relaxed text-white/70 sm:mt-6 sm:text-base">
              {t.aboutStory.paragraphs[0]}
            </p>
          </Reveal>
        </div>
      </section>

      <AboutStickyGallery />

      <section className="bg-[var(--bg-soft)] py-14 sm:py-20 md:py-28">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">{t.accommodations.badge}</span>
            <AnimatedHeading
              as="h2"
              className="mt-5 max-w-3xl text-[1.55rem] font-light leading-[1.18] tracking-[-0.04em] text-[var(--ink)] sm:mt-6 sm:text-[1.85rem] md:text-[2.35rem] lg:text-[3rem]"
              parts={[
                { text: t.accommodations.titleBefore },
                { text: t.accommodations.titleBold, className: "font-bold" },
              ]}
            />
            <p className="mt-5 max-w-xl text-[0.95rem] font-light leading-[1.6] text-[var(--ink-soft)] sm:mt-7 sm:text-[0.98rem]">
              {t.accommodations.body}
            </p>
          </Reveal>

          <div className="mt-10 space-y-7 sm:mt-14 sm:space-y-10 md:mt-16">
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
