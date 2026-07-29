"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export function FaqAccordion() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
      {t.faq.items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex min-h-[3.25rem] w-full items-center justify-between gap-4 py-4 text-left sm:py-5"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span className="text-[0.92rem] text-[var(--ink)] sm:text-[0.98rem] md:text-base">
                {item.q}
              </span>
              <span
                className={`text-xl leading-none text-[var(--ink-muted)] transition ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            {isOpen ? (
              <div className="overflow-hidden">
                <p className="pb-5 pr-8 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {item.a}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
