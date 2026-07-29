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
      <main className="bg-[var(--bg)] pt-[calc(var(--nav-h)+3rem)] pb-20">
        <div className="site-wrap">
          <span className="badge badge-dark">{t.bookPage.badge}</span>
          <AnimatedHeading
            as="h1"
            className="mt-5 max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl"
            text={t.bookPage.title}
            trigger="immediate"
          />
          <p className="mt-4 max-w-xl text-[var(--ink-soft)]">{t.bookPage.body}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <BookButton source="book-page" />
            <Link href="/contact" className="btn-pill btn-pill-outline">
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
