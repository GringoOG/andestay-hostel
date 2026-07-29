import type { Metadata } from "next";
import { AboutFeaturesGrid } from "@/components/AboutFeaturesGrid";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Header } from "@/components/Header";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { aboutStory, images } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <Header tone="light" />

      <section className="bg-[var(--bg)] pt-[calc(var(--nav-h)+2rem)]">
        <div className="site-wrap pb-10">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)]">
            <PhotoPlaceholder
              label="About AndeStay Hostel"
              src={images.aboutHero}
              priority
              className="aspect-[16/9] min-h-[420px] rounded-[var(--radius-lg)]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,16,12,0.72)] via-[rgba(10,16,12,0.35)] to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white sm:p-12 md:p-14">
              <span className="badge badge-light w-fit">Welcome to AndeStay Hostel</span>
              <h1 className="mt-5 max-w-2xl text-3xl font-light leading-snug tracking-tight sm:text-4xl md:text-5xl">
                A hostel for travelers who seek rest, good food, and connection with the Andes.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
                Rest after the Salkantay trek in Colpapampa — with American breakfast and homemade
                dinner always included.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg)] py-16 md:py-24">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">{aboutStory.badge}</span>
            <div className="mt-7 flex flex-col gap-10 lg:mt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
              <div className="max-w-2xl">
                <h2 className="text-[1.85rem] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ink)] sm:text-[2.35rem] md:text-[2.75rem]">
                  {aboutStory.title}
                </h2>
                <div className="mt-8 space-y-5 text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
                  {aboutStory.paragraphs.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                  <p className="text-[var(--ink)]">{aboutStory.closing}</p>
                </div>
              </div>

              <aside className="shrink-0 lg:w-[18rem] lg:pt-2">
                <h3 className="font-ui text-[0.72rem] font-medium tracking-[0.14em] text-[var(--ink-muted)] uppercase">
                  {aboutStory.whyTitle}
                </h3>
                <ul className="mt-5 space-y-3.5 border-t border-[var(--line)] pt-5">
                  {aboutStory.why.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[0.95rem] leading-snug text-[var(--ink)]"
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
