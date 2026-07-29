"use client";

import { useEffect, useRef, useState } from "react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { floatingQuotes, images } from "@/lib/content";

/** Sticky parallax “A lasting experience” — Framer-style */
export function LastingExperience() {
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

  return (
    <section ref={sectionRef} className="relative h-[220vh] bg-[var(--bg)]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="site-wrap relative w-full">
          {/* Floating quotes — kept in the side gutters, clear of photos */}
          <p
            className="pointer-events-none absolute left-0 top-[8%] hidden max-w-[9.5rem] text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{ transform: `translateY(${p * -40}px)` }}
          >
            “{floatingQuotes[0].quote}”
          </p>
          <p
            className="pointer-events-none absolute right-0 top-[12%] hidden max-w-[9.5rem] text-right text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{ transform: `translateY(${p * -70}px)` }}
          >
            “{floatingQuotes[1].quote}”
          </p>
          <p
            className="pointer-events-none absolute bottom-[8%] left-0 hidden max-w-[9.5rem] text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{ transform: `translateY(${p * 50}px)` }}
          >
            “{floatingQuotes[2].quote}”
          </p>
          <p
            className="pointer-events-none absolute bottom-[10%] right-0 hidden max-w-[9.5rem] text-right text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{ transform: `translateY(${p * 30}px)` }}
          >
            “{floatingQuotes[3].quote}”
          </p>

          <Reveal>
            <h2
              className="mx-auto max-w-xl text-center text-4xl font-medium tracking-tight sm:text-5xl"
              style={{ transform: `scale(${1 + p * 0.06})`, opacity: 1 - p * 0.15 }}
            >
              A lasting experience
            </h2>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-2xl gap-5 sm:grid-cols-2 lg:max-w-3xl">
            <div style={{ transform: `translateY(${p * -60}px)` }}>
              <PhotoPlaceholder
                label="Misty mountains"
                src={images.lastingA}
                className="aspect-[16/10] shadow-lg"
              />
            </div>
            <div style={{ transform: `translateY(${p * 40}px)` }}>
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
