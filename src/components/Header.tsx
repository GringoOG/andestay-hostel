"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookButton } from "@/components/BookButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { navHrefs } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

type HeaderProps = {
  tone?: "over-hero" | "light";
};

export function Header({ tone = "light" }: HeaderProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overHero = tone === "over-hero" && !scrolled && !open;
  const glass = scrolled || tone === "light" || open;
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

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 px-2.5 pt-[max(0.65rem,var(--safe-top))] sm:px-4 sm:pt-3"
    >
      <div
        className={`mx-auto flex h-[var(--nav-h)] max-w-[var(--max)] items-center justify-between gap-2 transition-all duration-300 sm:gap-4 ${
          glass
            ? "rounded-full border border-[rgba(60,80,60,0.12)] bg-[rgba(197,209,195,0.72)] px-3 shadow-[0_8px_30px_rgba(20,24,20,0.08)] backdrop-blur-xl sm:px-6"
            : "rounded-full bg-transparent px-1.5 sm:px-2"
        }`}
      >
        <Link
          href="/"
          className={`inline-block origin-left min-w-0 shrink text-[1.05rem] font-medium leading-none tracking-tight transition-[color,transform] duration-300 ease-out hover:scale-[1.06] min-[380px]:text-[1.15rem] sm:text-[1.4rem] md:text-[1.55rem] ${
            overHero ? "drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]" : ""
          }`}
          style={{ color: navColor }}
          onClick={() => setOpen(false)}
        >
          AndeStay
          <span className="hidden min-[360px]:inline"> Hostel</span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-6 text-[1.02rem] transition-colors duration-300 lg:flex xl:gap-9 xl:text-[1.08rem]"
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

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
          <LanguageSwitcher tone={switcherTone} compact />
          <button
            type="button"
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
              overHero
                ? "border-white/30 text-white"
                : "border-[rgba(20,24,20,0.15)] text-[var(--ink-soft)]"
            }`}
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mt-2 max-h-[min(78svh,560px)] overflow-y-auto rounded-[1.35rem] border border-[rgba(60,80,60,0.12)] bg-[rgba(197,209,195,0.96)] px-5 py-5 shadow-lg backdrop-blur-xl sm:rounded-[1.5rem] sm:px-6 sm:py-6 lg:hidden">
          <nav className="flex flex-col gap-1 text-[1.15rem]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-2 py-3 transition hover:bg-white/35"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 border-t border-[rgba(20,24,20,0.1)] pt-5">
            <BookButton source="navbar-mobile" className="w-full justify-between sm:w-auto">
              {t.common.bookStay}
            </BookButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
