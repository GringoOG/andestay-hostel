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
import { aboutStory, cabins, heroCopy, images } from "@/lib/content";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <Header tone="over-hero" />

      {/* Hero */}
      <section className="relative min-h-[100svh] overflow-hidden bg-[var(--forest-deep)] text-white">
        <div className="absolute inset-0">
          <PhotoPlaceholder
            label="AndeStay Hostel hero"
            src={images.hero}
            priority
            fillParent
            objectPosition="35% 45%"
            className="rounded-none scale-105 animate-[heroZoom_18s_ease-out_forwards]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,16,12,0.72)] via-[rgba(10,16,12,0.4)] to-[rgba(10,16,12,0.22)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,16,12,0.62)] via-transparent to-[rgba(10,16,12,0.28)]" />

        <div className="site-wrap relative flex min-h-[100svh] flex-col justify-end pb-16 pt-[calc(var(--nav-h)+3rem)] md:pb-24">
          <div className="max-w-3xl">
            <span className="badge badge-light animate-[fadeUp_0.8s_ease_both]">
              {heroCopy.badge}
            </span>
            <HeroTitle />
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-lg animate-[fadeUp_1s_ease_0.35s_both]">
              {heroCopy.support}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 animate-[fadeUp_1s_ease_0.55s_both]">
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
              <p className="max-w-[14rem] text-sm text-white/85">
                One of the <strong className="font-semibold text-white">most popular</strong>{" "}
                accommodations among guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro dark */}
      <section className="bg-[var(--forest)] py-20 text-white md:py-28">
        <div className="site-wrap max-w-3xl">
          <Reveal>
            <span className="badge badge-light">Escape. Breathe. Belong.</span>
            <h2 className="mt-6 text-3xl font-light leading-[1.15] tracking-[-0.04em] sm:text-4xl md:text-5xl">
              Nestled in Colpapampa, AndeStay Hostel is a place where{" "}
              <strong className="font-bold">comfort meets the Andes.</strong>
            </h2>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/70">
              {aboutStory.paragraphs[0]}
            </p>
          </Reveal>
        </div>
      </section>

      <AboutStickyGallery />

      {/* Unique stays / cabins */}
      <section className="bg-[var(--bg-soft)] py-20 md:py-28">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">Unique stay experiences</span>
            <h2 className="mt-6 max-w-3xl text-[1.85rem] font-light leading-[1.15] tracking-[-0.04em] text-[var(--ink)] sm:text-[2.35rem] md:text-[2.75rem] lg:text-[3rem]">
              Each cabin was designed to provide well-being, privacy, and a{" "}
              <strong className="font-bold">true connection with nature.</strong>
            </h2>
            <p className="mt-7 max-w-xl text-[0.98rem] font-light leading-[1.6] text-[var(--ink-soft)]">
              AndeStay Hostel is the balance between comfort and nature. A space that combines cozy
              design, hospitality, and an atmosphere perfect for relaxing or celebrating.
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
