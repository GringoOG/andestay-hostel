"use client";

import { useEffect, useState } from "react";

/**
 * Cabana Mountain hero title — exact line break:
 * Unlock your
 * refuge in nature.
 */
export function HeroTitle() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <h1
      className={`hero-title mt-6 text-white transition-[opacity,filter,transform] duration-900 ease-out ${
        ready ? "translate-y-0 opacity-100 blur-0" : "translate-y-3 opacity-0 blur-md"
      }`}
    >
      Unlock your
      <br />
      refuge <em className="font-display italic">in nature.</em>
    </h1>
  );
}
