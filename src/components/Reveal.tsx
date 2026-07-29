"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Extra delay before the fade starts (ms). */
  delay?: number;
};

/**
 * Scroll reveal — fades + lifts content when the section enters the viewport.
 * Use around each section heading / block so it animates on arrival.
 */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.classList.add("is-visible");
      return;
    }

    if (delay) {
      el.style.setProperty("--reveal-delay", `${delay}ms`);
    }

    const show = () => el.classList.add("is-visible");

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      {
        threshold: 0.15,
        // Trigger a bit before the block is fully centered
        rootMargin: "0px 0px -12% 0px",
      },
    );

    io.observe(el);

    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
