"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { images } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

/**
 * Compact sticky exit — photos leave upward quickly,
 * then testimonials follow without a full empty viewport gap.
 */
export function LastingExperience() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      setP(Math.min(1, Math.max(0, -rect.top / total)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Finish the exit early so sticky doesn't linger empty */
  const exit = Math.min(1, p * 1.25);
  const fade = Math.max(0, 1 - exit * 1.15);

  return (
    <section ref={sectionRef} className="relative h-[145vh] bg-[var(--bg)]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div
          className="site-wrap relative w-full"
          style={{ opacity: fade, pointerEvents: fade < 0.05 ? "none" : undefined }}
        >
          <p
            className="pointer-events-none absolute left-0 top-[8%] hidden max-w-[9.5rem] text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{ transform: `translateY(${exit * -70}vh)` }}
          >
            “{t.lasting.quotes[0]}”
          </p>
          <p
            className="pointer-events-none absolute right-0 top-[12%] hidden max-w-[9.5rem] text-right text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{ transform: `translateY(${exit * -80}vh)` }}
          >
            “{t.lasting.quotes[1]}”
          </p>
          <p
            className="pointer-events-none absolute bottom-[8%] left-0 hidden max-w-[9.5rem] text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{ transform: `translateY(${exit * -65}vh)` }}
          >
            “{t.lasting.quotes[2]}”
          </p>
          <p
            className="pointer-events-none absolute bottom-[10%] right-0 hidden max-w-[9.5rem] text-right text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{ transform: `translateY(${exit * -70}vh)` }}
          >
            “{t.lasting.quotes[3]}”
          </p>

          <div
            style={{
              transform: `translateY(${exit * -55}vh) scale(${1 + exit * 0.06})`,
            }}
          >
            <AnimatedHeading
              as="h2"
              className="mx-auto max-w-xl text-center text-4xl font-light tracking-[-0.04em] sm:text-5xl"
              text={t.lasting.title}
            />
          </div>

          <div className="mx-auto mt-14 grid max-w-2xl gap-5 sm:grid-cols-2 lg:max-w-3xl">
            <div style={{ transform: `translateY(${exit * -120}vh)` }}>
              <PhotoPlaceholder
                label="Misty mountains"
                src={images.lastingA}
                className="aspect-[16/10] shadow-lg"
              />
            </div>
            <div style={{ transform: `translateY(${exit * -105}vh)` }}>
              <PhotoPlaceholder
                label="Cabins at night"
                src={images.lastingB}
                className="aspect-[16/10] shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
