import type { Metadata } from "next";
import Link from "next/link";
import { BookButton } from "@/components/BookButton";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Book a stay",
  description: "Reserve a stay at AndeStay Hostel in Colpapampa via our secure booking partner.",
};

/**
 * Phase 1: entry point via BookingService (provider adapter).
 * No reservation logic on this page.
 */
export default function BookPage() {
  return (
    <>
      <Header tone="light" />
      <main className="bg-[var(--bg)] pt-[calc(var(--nav-h)+3rem)] pb-20">
        <div className="site-wrap">
          <span className="badge badge-dark">Reservations</span>
          <h1 className="mt-5 max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl">
            Book a stay
          </h1>
          <p className="mt-4 max-w-xl text-[var(--ink-soft)]">
            You will continue to our booking partner (QloApps) to check dates and pay securely.
            The website itself does not process reservations.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <BookButton source="book-page" />
            <Link
              href="/contact"
              className="btn-pill btn-pill-outline"
            >
              <span>Prefer to message us</span>
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
