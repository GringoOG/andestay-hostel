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

/**
 * Letter reveal that still wraps on small screens.
 * Words stay together; regular spaces between words allow soft wraps.
 */
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
      { threshold: 0.28, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger, delayMs]);

  const segments: AnimatedHeadingPart[] = parts ?? [{ text: text ?? "" }];
  const fullText = segments
    .map((s, i) => {
      const next = segments[i + 1];
      if (s.br && next && !s.text.endsWith(" ") && !next.text.startsWith(" ")) {
        return `${s.text} `;
      }
      return s.text;
    })
    .join("");

  let charIndex = 0;
  const nodes: ReactNode[] = [];

  segments.forEach((segment, sIdx) => {
    const tokens = segment.text.split(/(\s+)/);

    tokens.forEach((token, tIdx) => {
      if (!token) return;

      if (/^\s+$/.test(token)) {
        // Real whitespace — allows the heading to wrap on narrow viewports
        nodes.push(
          <span key={`${sIdx}-sp-${tIdx}`} className="char-space">
            {" "}
          </span>,
        );
        return;
      }

      const wordChars = Array.from(token).map((ch, cIdx) => {
        const i = charIndex++;
        return (
          <span
            key={`${sIdx}-${tIdx}-${cIdx}`}
            className={`char-reveal ${segment.className ?? ""} ${active ? "is-in" : ""}`}
            style={{ transitionDelay: `${delayMs + i * staggerMs}ms` }}
            aria-hidden
          >
            {ch}
          </span>
        );
      });

      nodes.push(
        <span key={`${sIdx}-w-${tIdx}`} className="char-word">
          {wordChars}
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
      className: `animated-heading ${className}`.trim(),
      "aria-label": fullText,
    },
    nodes,
  );
}
