import type { Metadata } from "next";
import { AboutFeaturesGrid } from "@/components/AboutFeaturesGrid";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Header } from "@/components/Header";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { images } from "@/lib/content";

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
                A hostel created for travelers who seek balance, beauty, and connection with the Andes.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                AndeStay Hostel in Colpapampa balances comfort and adventure — cozy design,
                hospitality, and an atmosphere perfect for resting or celebrating.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg)] py-16 md:py-24">
        <div className="site-wrap max-w-3xl text-center">
          <Reveal>
            <h2 className="text-2xl font-light leading-snug tracking-tight text-[var(--ink)] sm:text-3xl md:text-4xl">
              Each space combines natural materials, warm textures, and thoughtful design to create
              an atmosphere where simplicity meets sophistication.
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-[var(--ink-soft)]">
              Whether you’re staying for a quiet night or a longer trek stop, AndeStay Hostel
              invites you to slow down, breathe deeply, and reconnect with what truly matters.
            </p>
          </Reveal>
        </div>
      </section>

      <AboutFeaturesGrid />
      <FaqSection />
      <ContactSection />
    </>
  );
}
