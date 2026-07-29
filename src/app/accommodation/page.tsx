import type { Metadata } from "next";
import { CabinCard } from "@/components/CabinCard";
import { ContactSection } from "@/components/ContactSection";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { cabins } from "@/lib/content";

export const metadata: Metadata = {
  title: "Rooms",
};

export default function AccommodationPage() {
  return (
    <>
      <Header tone="light" />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f3f5f1_0%,#e8ede6_45%,#e2e8e0_100%)] pt-[calc(var(--nav-h)+3.5rem)] pb-16 md:pb-20">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">Our accommodations</span>
            <div className="mt-7 flex flex-col gap-8 lg:mt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-20 xl:gap-28">
              <h1 className="max-w-[22ch] text-[2.35rem] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--ink)] sm:text-[2.85rem] md:max-w-[20ch] md:text-[3.35rem] lg:max-w-[18.5ch] lg:flex-1 lg:text-[3.55rem] xl:text-[3.75rem]">
                Each cabin was designed to provide well-being, privacy, and a true
                connection with nature. Choose yours and live special moments.
              </h1>
              <p className="max-w-[22rem] text-[0.98rem] leading-[1.55] text-[var(--ink)] lg:max-w-[15.5rem] lg:shrink-0 lg:pb-1.5 xl:max-w-[16.5rem]">
                AndeStay Hostel is the balance between comfort and nature. A space that
                combines cozy design, hospitality, and an atmosphere perfect for relaxing
                or celebrating.
              </p>
            </div>
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
