"use client";

import Link from "next/link";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { BookButton } from "@/components/BookButton";
import { Header } from "@/components/Header";
import { useI18n } from "@/lib/i18n";

export default function BookPage() {
  const { t } = useI18n();

  return (
    <>
      <Header tone="light" />
      <main className="bg-[var(--bg)] pt-[calc(var(--nav-h)+2rem)] pb-16 sm:pt-[calc(var(--nav-h)+3rem)] sm:pb-20">
        <div className="site-wrap">
          <span className="badge badge-dark">{t.bookPage.badge}</span>
          <AnimatedHeading
            as="h1"
            className="mt-4 max-w-2xl text-[1.85rem] font-medium tracking-tight sm:mt-5 sm:text-4xl md:text-5xl"
            text={t.bookPage.title}
            trigger="immediate"
          />
          <p className="mt-3 max-w-xl text-[0.95rem] text-[var(--ink-soft)] sm:mt-4 sm:text-base">
            {t.bookPage.body}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <BookButton source="book-page" className="w-full justify-between sm:w-auto" />
            <Link href="/contact" className="btn-pill btn-pill-outline w-full justify-between sm:w-auto">
              <span>{t.bookPage.preferMessage}</span>
              <span className="btn-arrow" aria-hidden>
                <span className="btn-arrow-icon">→</span>
              </span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
