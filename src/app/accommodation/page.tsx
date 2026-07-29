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

      <section className="bg-[var(--bg-soft)] pt-[calc(var(--nav-h)+3.5rem)] pb-16 md:pb-20">
        <div className="site-wrap">
          <Reveal>
            <span className="badge badge-dark">Unique stay experiences</span>
            <h1 className="mt-6 max-w-3xl text-[1.85rem] font-light leading-[1.15] tracking-[-0.04em] text-[var(--ink)] sm:text-[2.35rem] md:text-[2.75rem] lg:text-[3rem]">
              Each cabin was designed to provide well-being, privacy, and a{" "}
              <strong className="font-bold">true connection with nature.</strong>
            </h1>
            <p className="mt-7 max-w-xl text-[0.98rem] font-light leading-[1.6] text-[var(--ink-soft)]">
              AndeStay Hostel is the balance between comfort and nature. A space that combines cozy
              design, hospitality, and an atmosphere perfect for relaxing or celebrating.
            </p>
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
