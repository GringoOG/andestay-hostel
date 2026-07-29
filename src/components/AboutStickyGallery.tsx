"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { Reveal } from "@/components/Reveal";
import { aboutGalleryImages } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

const CARD_STEP = 360;
const STICKY_MQ = "(min-width: 768px) and (hover: hover)";

function subscribeSticky(onStoreChange: () => void) {
  const mq = window.matchMedia(STICKY_MQ);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getStickySnapshot() {
  return window.matchMedia(STICKY_MQ).matches;
}

export function AboutStickyGallery() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [maxShift, setMaxShift] = useState(900);
  const stickyMode = useSyncExternalStore(subscribeSticky, getStickySnapshot, () => false);
  const count = t.aboutGallery.length;

  useEffect(() => {
    if (!stickyMode) return;
    const section = sectionRef.current;
    if (!section) return;

    const measure = () => {
      setMaxShift(Math.max(0, count * CARD_STEP - window.innerWidth * 0.55));
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      setProgress(Math.min(1, Math.max(0, -rect.top / total)));
    };

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [count, stickyMode]);

  const cards = t.aboutGallery.map((card, i) => (
    <article
      key={`${card.title}-${i}`}
      className="w-[min(78vw,280px)] shrink-0 snap-center text-left sm:w-[300px] md:w-[340px]"
    >
      <PhotoPlaceholder
        label={card.title}
        src={aboutGalleryImages[i] ?? aboutGalleryImages[0]}
        className="aspect-[4/5] transition-transform duration-500 hover:scale-[1.02]"
      />
      <div className="mt-3 grid gap-1.5 sm:mt-4 sm:gap-2 sm:grid-cols-[0.85fr_1.15fr] sm:items-start">
        <h3 className="pb-0.5 font-display text-lg italic leading-snug text-[var(--serif-green)] sm:text-xl">
          {card.title}
        </h3>
        <p className="text-[0.82rem] leading-snug text-[var(--ink-soft)] sm:text-sm">
          {card.description}
        </p>
      </div>
    </article>
  ));

  const heading = (
    <div className="site-wrap text-center">
      <Reveal>
        <span className="badge badge-dark">{t.aboutPage.featuresBadge}</span>
        <AnimatedHeading
          as="h2"
          className="mx-auto mt-4 max-w-2xl font-display text-[1.85rem] italic leading-tight text-[var(--ink)] sm:mt-5 sm:text-4xl md:text-5xl"
          text={t.aboutPage.featuresTitle}
          staggerMs={30}
        />
        <div className="mx-auto mt-4 h-px w-16 bg-[var(--line)] sm:mt-5" />
      </Reveal>
    </div>
  );

  /* Mobile / touch: native horizontal scroll — no tall sticky track */
  if (!stickyMode) {
    return (
      <section className="bg-[var(--bg)] py-14 sm:py-20">
        {heading}
        <div className="mt-10 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-4 px-[var(--page-pad)] snap-x snap-mandatory sm:gap-5">
            {cards}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[280vh] bg-[var(--bg)] lg:h-[360vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden py-12 md:py-16">
        {heading}

        <div className="mt-10 overflow-hidden md:mt-12">
          <div
            className="flex w-max gap-5 px-[max(1.25rem,calc((100vw-var(--max))/2))] will-change-transform md:gap-6"
            style={{ transform: `translate3d(${-progress * maxShift}px, 0, 0)` }}
          >
            {cards}
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
