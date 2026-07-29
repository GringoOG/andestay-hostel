"use client";

import { useEffect, useRef, useState } from "react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { floatingQuotes, images } from "@/lib/content";

/**
 * Sticky “A lasting experience” — Framer Cabana Mountain style:
 * photos drift upward and leave the viewport completely before the next section.
 */
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
    <section ref={sectionRef} className="relative h-[260vh] bg-[var(--bg)]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="site-wrap relative w-full">
          <p
            className="pointer-events-none absolute left-0 top-[8%] hidden max-w-[9.5rem] text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{
              transform: `translateY(${p * -55}vh)`,
              opacity: Math.max(0, 1 - p * 1.2),
            }}
          >
            “{floatingQuotes[0].quote}”
          </p>
          <p
            className="pointer-events-none absolute right-0 top-[12%] hidden max-w-[9.5rem] text-right text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{
              transform: `translateY(${p * -70}vh)`,
              opacity: Math.max(0, 1 - p * 1.2),
            }}
          >
            “{floatingQuotes[1].quote}”
          </p>
          <p
            className="pointer-events-none absolute bottom-[8%] left-0 hidden max-w-[9.5rem] text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{
              transform: `translateY(${p * -45}vh)`,
              opacity: Math.max(0, 1 - p * 1.2),
            }}
          >
            “{floatingQuotes[2].quote}”
          </p>
          <p
            className="pointer-events-none absolute bottom-[10%] right-0 hidden max-w-[9.5rem] text-right text-sm leading-snug text-[var(--ink-muted)] lg:block"
            style={{
              transform: `translateY(${p * -50}vh)`,
              opacity: Math.max(0, 1 - p * 1.2),
            }}
          >
            “{floatingQuotes[3].quote}”
          </p>

          <Reveal>
            <h2
              className="mx-auto max-w-xl text-center text-4xl font-light tracking-[-0.04em] sm:text-5xl"
              style={{
                transform: `translateY(${p * -35}vh) scale(${1 + p * 0.08})`,
                opacity: Math.max(0, 1 - p * 1.1),
              }}
            >
              A lasting experience
            </h2>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-2xl gap-5 sm:grid-cols-2 lg:max-w-3xl">
            <div
              style={{
                transform: `translateY(${p * -115}vh)`,
                opacity: Math.max(0, 1 - p * 0.95),
              }}
            >
              <PhotoPlaceholder
                label="Misty mountains"
                src={images.lastingA}
                className="aspect-[16/10] shadow-lg"
              />
            </div>
            <div
              style={{
                transform: `translateY(${p * -100}vh)`,
                opacity: Math.max(0, 1 - p * 0.95),
              }}
            >
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
