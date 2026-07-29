"use client";

import { FormEvent, useState } from "react";
import { site } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export function ContactForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sent");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-8">
      <p className="text-sm text-[var(--ink-soft)]">{t.contact.formIntro}</p>

      <label className="block w-full">
        <span className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
          {t.contact.name}
        </span>
        <input name="name" required className="field-line" />
      </label>

      <label className="block w-full">
        <span className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
          {t.contact.email}
        </span>
        <input type="email" name="email" required className="field-line" />
      </label>

      <label className="block w-full">
        <span className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
          {t.contact.message}
        </span>
        <textarea name="message" required rows={4} className="field-line min-h-[6rem] resize-y" />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        {status === "sent" ? (
          <p className="text-sm text-[var(--serif-green)]">{t.contact.send}</p>
        ) : (
          <span className="break-all text-sm text-[var(--ink-muted)]">{site.email}</span>
        )}
        <button type="submit" className="btn-pill w-full shrink-0 justify-between sm:w-auto">
          <span>{t.contact.send}</span>
          <span className="btn-arrow" aria-hidden>
            <span className="btn-arrow-icon">→</span>
          </span>
        </button>
      </div>
    </form>
  );
}
