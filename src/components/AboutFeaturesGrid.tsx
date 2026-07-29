import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { aboutCards } from "@/lib/content";

export function AboutFeaturesGrid() {
  return (
    <section className="bg-[var(--bg)] py-20 md:py-28">
      <div className="site-wrap text-center">
        <Reveal>
          <span className="badge badge-dark">About AndeStay</span>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl italic leading-tight text-[var(--ink)] sm:text-5xl">
            More than just a place to stay.
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-[var(--line)]" />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {aboutCards.map((card, i) => (
            <Reveal key={card.title} delay={80 + i * 80}>
              <article className="text-left">
                <PhotoPlaceholder
                  label={card.photoLabel}
                  src={card.image}
                  className="aspect-[4/5]"
                />
                <div className="mt-4 grid gap-2 sm:grid-cols-[0.85fr_1.15fr] sm:items-start">
                  <h3 className="font-display text-xl italic leading-snug text-[var(--serif-green)] pb-0.5">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-snug text-[var(--ink-soft)]">
                    {card.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
