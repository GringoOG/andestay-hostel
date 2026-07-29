import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";

export function FaqSection() {
  return (
    <section className="bg-[var(--bg)] py-20 md:py-28">
      <div className="site-wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <span className="badge badge-dark">FAQ</span>
          <h2 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <FaqAccordion />
        </Reveal>
      </div>
    </section>
  );
}
