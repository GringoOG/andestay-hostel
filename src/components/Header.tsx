"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookButton } from "@/components/BookButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { navHrefs, site } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

type HeaderProps = {
  tone?: "over-hero" | "light";
};

export function Header({ tone = "light" }: HeaderProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overHero = tone === "over-hero" && !scrolled;
  const glass = scrolled || tone === "light";
  const navColor = overHero ? "#ffffff" : "var(--ink-soft)";
  const switcherTone = overHero ? "over-hero" : "light";

  const links = navHrefs.map((item) => ({
    href: item.href,
    label: t.nav[item.key],
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className={`mx-auto flex h-[var(--nav-h)] max-w-[var(--max)] items-center justify-between gap-3 transition-all duration-300 sm:gap-4 ${
          glass
            ? "rounded-full border border-[rgba(60,80,60,0.12)] bg-[rgba(197,209,195,0.58)] px-4 shadow-[0_8px_30px_rgba(20,24,20,0.08)] backdrop-blur-xl sm:px-6"
            : "rounded-full bg-transparent px-2"
        }`}
      >
        <Link
          href="/"
          className={`shrink-0 text-[1.35rem] font-medium leading-none tracking-tight transition-colors duration-300 sm:text-[1.55rem] ${
            overHero ? "drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]" : ""
          }`}
          style={{ color: navColor }}
        >
          {site.name}
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-7 text-[1.08rem] transition-colors duration-300 lg:flex xl:gap-9"
          style={{ color: navColor }}
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:opacity-70">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
          <LanguageSwitcher tone={switcherTone} />
          <BookButton
            source="navbar"
            className={
              overHero ? "" : "border border-[rgba(20,24,20,0.1)] bg-white shadow-sm"
            }
          >
            {t.common.bookStay}
          </BookButton>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher tone={switcherTone} />
          <button
            type="button"
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
              overHero
                ? "border-white/30 text-white"
                : "border-[rgba(20,24,20,0.15)] text-[var(--ink-soft)]"
            }`}
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mt-2 rounded-[1.5rem] border border-[rgba(60,80,60,0.12)] bg-[rgba(197,209,195,0.92)] px-6 py-6 shadow-lg backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-4 text-lg">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6">
            <BookButton source="navbar-mobile">{t.common.bookStay}</BookButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
