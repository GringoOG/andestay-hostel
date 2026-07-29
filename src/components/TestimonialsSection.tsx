import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { testimonials } from "@/lib/content";

export function TestimonialsSection() {
  return (
    <section className="bg-[var(--bg-soft)] py-20 md:py-28">
      <div className="site-wrap">
        <Reveal>
          <span className="badge badge-dark">Testimonials</span>
          <h2 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">
            Reflections from our guests
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={100 + i * 90}>
              <article className="flex flex-col">
                <p className="text-[var(--ink-muted)]" aria-label="5 star rating">
                  ★ ★ ★ ★ ★
                </p>
                <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
                  {t.text}
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[var(--bg-muted)]">
                    <Image src={t.avatar} alt="" fill className="object-cover" sizes="44px" />
                  </div>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-[var(--ink-muted)]">{t.from}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
