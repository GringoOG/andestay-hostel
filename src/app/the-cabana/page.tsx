"use client";

import { AboutFeaturesGrid } from "@/components/AboutFeaturesGrid";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Header } from "@/components/Header";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { images } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <>
      <Header tone="light" />

      <section className="bg-[var(--bg)] pt-[calc(var(--nav-h)+1.25rem)] sm:pt-[calc(var(--nav-h)+2rem)]">
        <div className="site-wrap pb-8 sm:pb-10">
          <div className="relative overflow-hidden rounded-[1.25rem] sm:rounded-[var(--radius-lg)]">
            <div className="photo-green-grade">
              <PhotoPlaceholder
                label="About AndeStay Hostel"
                src={images.aboutHero}
                priority
                objectPosition="50% 78%"
                className="aspect-[4/5] min-h-[280px] rounded-[1.25rem] sm:aspect-[2.35/1] sm:min-h-[240px] sm:rounded-[var(--radius-lg)] md:aspect-[2.6/1] md:min-h-0"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 photo-green-veil" />
            <div className="pointer-events-none absolute inset-0 photo-green-shade" />

            <div className="absolute inset-0 flex flex-col justify-end p-5 text-white sm:p-8 md:p-10 lg:p-12">
              <span className="badge badge-light w-fit text-[0.62rem]">
                {t.aboutPage.welcomeBadge}
              </span>

              <div className="mt-3 flex flex-col gap-4 sm:mt-4 sm:gap-5 md:mt-5 md:flex-row md:items-end md:justify-between md:gap-12 lg:gap-20">
                <h1 className="max-w-xl text-[1.25rem] font-light leading-[1.22] tracking-[-0.03em] sm:text-[1.65rem] md:max-w-[28rem] md:text-[1.85rem] lg:text-[2.05rem]">
                  {t.aboutPage.heroTitle}
                </h1>
                <p className="max-w-sm text-[0.8rem] font-light leading-relaxed text-white/85 sm:text-[0.82rem] md:max-w-[15.5rem] md:pb-0.5 md:text-[0.88rem]">
                  {t.aboutPage.heroSupport}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg)] py-12 sm:py-16 md:py-24">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">{t.aboutStory.badge}</span>
            <div className="mt-6 flex flex-col gap-10 sm:mt-7 lg:mt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
              <div className="max-w-2xl">
                <AnimatedHeading
                  as="h2"
                  className="text-[1.55rem] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ink)] sm:text-[2.35rem] md:text-[2.75rem]"
                  text={t.aboutStory.title}
                />
                <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed text-[var(--ink-soft)] sm:mt-8 sm:space-y-5 sm:text-[0.98rem]">
                  {t.aboutStory.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                  <p className="text-[var(--ink)]">{t.aboutStory.closing}</p>
                </div>
              </div>

              <aside className="shrink-0 lg:w-[18rem] lg:pt-2">
                <h3 className="font-ui text-[0.72rem] font-medium tracking-[0.14em] text-[var(--ink-muted)] uppercase">
                  {t.aboutStory.whyTitle}
                </h3>
                <ul className="mt-4 space-y-3 border-t border-[var(--line)] pt-4 sm:mt-5 sm:space-y-3.5 sm:pt-5">
                  {t.aboutStory.why.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[0.92rem] leading-snug text-[var(--ink)] sm:text-[0.95rem]"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--serif-green)]"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </Reveal>
        </div>
      </section>

      <AboutFeaturesGrid />
      <FaqSection />
      <ContactSection />
    </>
  );
}
