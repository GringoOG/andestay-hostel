"use client";

import { useEffect, useRef, useState } from "react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { aboutGallery } from "@/lib/content";

const CARD_STEP = 360;

/** Sticky horizontal gallery — Framer-style scroll scrubbing */
export function AboutStickyGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [maxShift, setMaxShift] = useState(900);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const measure = () => {
      setMaxShift(
        Math.max(0, aboutGallery.length * CARD_STEP - window.innerWidth * 0.55),
      );
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const raw = -rect.top / total;
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      measure();
      onScroll();
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[360vh] bg-[var(--bg)]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden py-16">
        <div className="site-wrap text-center">
          <Reveal>
            <span className="badge badge-dark">About AndeStay</span>
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl italic leading-tight text-[var(--ink)] sm:text-5xl">
              More than just a place to stay.
            </h2>
            <div className="mx-auto mt-5 h-px w-16 bg-[var(--line)]" />
          </Reveal>
        </div>

        <div className="mt-12 overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max gap-6 px-[max(1.25rem,calc((100vw-var(--max))/2))] will-change-transform"
            style={{ transform: `translate3d(${-progress * maxShift}px, 0, 0)` }}
          >
            {aboutGallery.map((card, i) => (
              <article
                key={`${card.title}-${i}`}
                className="w-[min(78vw,320px)] shrink-0 text-left sm:w-[340px]"
              >
                <PhotoPlaceholder
                  label={card.photoLabel}
                  src={card.image}
                  className="aspect-[4/5] transition-transform duration-500 hover:scale-[1.02]"
                />
                <div className="mt-4 grid gap-2 sm:grid-cols-[0.85fr_1.15fr] sm:items-start">
                  <h3 className="pb-0.5 font-display text-xl italic leading-snug text-[var(--serif-green)]">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-snug text-[var(--ink-soft)]">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="site-wrap mt-8">
          <div className="mx-auto h-1 max-w-xs overflow-hidden rounded-full bg-[var(--bg-muted)]">
            <div
              className="h-full rounded-full bg-[var(--accent-green)] transition-[width] duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
