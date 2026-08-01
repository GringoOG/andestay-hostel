"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";
import { useI18n } from "@/lib/i18n";

export function HeroTitle() {
  const { t } = useI18n();

  return (
    <AnimatedHeading
      as="h1"
      className="hero-title mt-6 text-center text-white"
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
