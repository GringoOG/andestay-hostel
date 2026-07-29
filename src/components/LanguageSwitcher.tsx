"use client";

import { useEffect, useRef, useState } from "react";
import { localeLabels, locales, useI18n, type Locale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  tone?: "over-hero" | "light";
};

export function LanguageSwitcher({ tone = "light" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const overHero = tone === "over-hero";

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.common.language}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition ${
          overHero
            ? "border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            : "border-[rgba(20,24,20,0.12)] bg-white text-[var(--ink)] shadow-sm hover:bg-[var(--bg-soft)]"
        }`}
      >
        <span className="uppercase tracking-wide">{locale}</span>
        <span aria-hidden className="text-[0.65rem] opacity-70">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t.common.language}
          className="absolute right-0 z-50 mt-2 min-w-[10.5rem] overflow-hidden rounded-2xl border border-[rgba(60,80,60,0.12)] bg-white py-1.5 shadow-[0_12px_40px_rgba(20,24,20,0.14)]"
        >
          {locales.map((code) => {
            const selected = code === locale;
            return (
              <li key={code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-[var(--bg-soft)] ${
                    selected ? "font-semibold text-[var(--serif-green)]" : "text-[var(--ink)]"
                  }`}
                  onClick={() => {
                    setLocale(code as Locale);
                    setOpen(false);
                  }}
                >
                  <span>{localeLabels[code]}</span>
                  <span className="text-xs uppercase tracking-wide text-[var(--ink-muted)]">
                    {code}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
