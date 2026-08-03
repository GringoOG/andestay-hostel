"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { useI18n } from "@/lib/i18n";

export function HeroTitle() {
  const { t } = useI18n();

  return (
    <AnimatedHeading
      as="h1"
      className="hero-title mt-4 text-center text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] sm:mt-6"
      trigger="immediate"
      delayMs={220}
      staggerMs={28}
      parts={[
        { text: t.hero.unlockYour, br: true },
        { text: `${t.hero.refuge} ` },
        { text: t.hero.inNature, className: "font-display italic" },
      ]}
    />
  );
}
