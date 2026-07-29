"use client";

import { FormEvent, useState } from "react";
import { site } from "@/lib/content";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sent");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-8">
      <p className="text-sm text-[var(--ink-soft)]">
        Or fill out the form and we’ll reply shortly.
      </p>

      <label className="block w-full">
        <span className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
          NAME
        </span>
        <input name="name" required className="field-line" />
      </label>

      <label className="block w-full">
        <span className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
          E-MAIL
        </span>
        <input type="email" name="email" required className="field-line" />
      </label>

      <label className="block w-full">
        <span className="font-ui text-[0.7rem] tracking-[0.14em] text-[var(--ink-muted)]">
          MESSAGE
        </span>
        <textarea name="message" required rows={4} className="field-line min-h-[6rem] resize-y" />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {status === "sent" ? (
          <p className="text-sm text-[var(--serif-green)]">Message sent — we’ll reply soon.</p>
        ) : (
          <span className="text-sm text-[var(--ink-muted)]">{site.email}</span>
        )}
        <button type="submit" className="btn-pill shrink-0">
          <span>Send message</span>
          <span className="btn-arrow" aria-hidden>
            <span className="btn-arrow-icon">→</span>
          </span>
        </button>
      </div>
    </form>
  );
}
