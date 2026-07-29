"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

export type AnimatedHeadingPart = {
  text: string;
  className?: string;
  /** Force a line break after this part */
  br?: boolean;
};

type AnimatedHeadingProps = {
  as?: ElementType;
  className?: string;
  /** Plain string — split into letters */
  text?: string;
  /** Rich parts (mixed styles / line breaks) */
  parts?: AnimatedHeadingPart[];
  /** immediate = on mount (hero); inView = when scrolled into view */
  trigger?: "immediate" | "inView";
  staggerMs?: number;
  delayMs?: number;
};

function splitChars(text: string): string[] {
  return Array.from(text);
}

export function AnimatedHeading({
  as = "h2",
  className = "",
  text,
  parts,
  trigger = "inView",
  staggerMs = 26,
  delayMs = 80,
}: AnimatedHeadingProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger === "immediate") {
      const t = window.setTimeout(() => setActive(true), delayMs);
      return () => window.clearTimeout(t);
    }

    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger, delayMs]);

  const segments: AnimatedHeadingPart[] = parts ?? [{ text: text ?? "" }];
  const fullText = segments.map((s) => s.text).join("");

  let charIndex = 0;
  const nodes: ReactNode[] = [];

  segments.forEach((segment, sIdx) => {
    const chars = splitChars(segment.text);
    chars.forEach((ch, cIdx) => {
      const i = charIndex++;
      const isSpace = ch === " ";
      nodes.push(
        <span
          key={`${sIdx}-${cIdx}`}
          className={`char-reveal ${segment.className ?? ""} ${active ? "is-in" : ""}`}
          style={{ transitionDelay: `${delayMs + i * staggerMs}ms` }}
          aria-hidden
        >
          {isSpace ? "\u00A0" : ch}
        </span>,
      );
    });
    if (segment.br) {
      nodes.push(<br key={`br-${sIdx}`} />);
    }
  });

  return createElement(
    as,
    {
      ref: rootRef,
      className,
      "aria-label": fullText,
    },
    nodes,
  );
}
