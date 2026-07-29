"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { images } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

const STICKY_MQ = "(min-width: 768px) and (hover: hover)";

function subscribeSticky(onStoreChange: () => void) {
  const mq = window.matchMedia(STICKY_MQ);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getStickySnapshot() {
  return window.matchMedia(STICKY_MQ).matches;
}

/**
 * Desktop: compact sticky exit — photos leave upward.
 * Mobile: static section (no tall scroll track).
 */
export function LastingExperience() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const stickyMode = useSyncExternalStore(subscribeSticky, getStickySnapshot, () => false);

  useEffect(() => {
    if (!stickyMode) return;
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
  }, [stickyMode]);

  const exit = Math.min(1, p * 1.25);
  const fade = Math.max(0, 1 - exit * 1.15);

  const photos = (
    <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:mt-10 sm:gap-5 sm:grid-cols-2 lg:mt-14 lg:max-w-3xl">
      <div style={stickyMode ? { transform: `translateY(${exit * -120}vh)` } : undefined}>
        <PhotoPlaceholder
          label="Misty mountains"
          src={images.lastingA}
          className="aspect-[16/10] shadow-lg"
        />
      </div>
      <div style={stickyMode ? { transform: `translateY(${exit * -105}vh)` } : undefined}>
        <PhotoPlaceholder
          label="Cabins at night"
          src={images.lastingB}
          className="aspect-[16/10] shadow-lg"
        />
      </div>
    </div>
  );

  const title = (
    <AnimatedHeading
      as="h2"
      className="mx-auto max-w-xl text-center text-[1.85rem] font-light tracking-[-0.04em] sm:text-4xl md:text-5xl"
      text={t.lasting.title}
    />
  );

  if (!stickyMode) {
    return (
      <section className="relative bg-[var(--bg)] py-14 sm:py-20">
        <div className="site-wrap relative w-full">
          {title}
          {photos}
        </div>
      </section>
    );
  }

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
            {title}
          </div>

          {photos}
        </div>
      </div>
    </section>
  );
}
