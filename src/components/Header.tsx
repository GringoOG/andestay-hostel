"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookButton } from "@/components/BookButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { navHrefs } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

type HeaderProps = {
  tone?: "over-hero" | "light";
};

function scrollHomeToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Header({ tone = "light" }: HeaderProps) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overHero = tone === "over-hero" && !scrolled && !open;
  const glass = scrolled || tone === "light" || open;
  const navColor = overHero ? "#ffffff" : "var(--ink-soft)";
  const switcherTone = overHero ? "over-hero" : "light";
  const onHome = pathname === "/";

  const links = navHrefs.map((item) => ({
    href: item.href,
    label: t.nav[item.key],
  }));

  const goHome = () => {
    setOpen(false);
    if (onHome) scrollHomeToTop();
  };

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
    <header className="fixed inset-x-0 top-0 z-50 px-2.5 pt-[max(0.55rem,var(--safe-top))] sm:px-4 sm:pt-3">
      <div
        className={`mx-auto flex h-[var(--nav-h)] max-w-[var(--max)] items-center justify-between gap-2 transition-all duration-300 sm:gap-4 ${
          glass
            ? "rounded-full border border-[rgba(60,80,60,0.12)] bg-[rgba(197,209,195,0.78)] px-3 shadow-[0_8px_30px_rgba(20,24,20,0.08)] backdrop-blur-xl sm:px-6"
            : "rounded-full bg-transparent px-1.5 sm:px-2"
        }`}
      >
        <Link
          href="/"
          className={`inline-flex min-h-11 min-w-0 shrink items-center origin-left py-2 text-[1.05rem] font-medium leading-none tracking-tight transition-[color,transform] duration-300 ease-out [@media(hover:hover)]:hover:scale-[1.06] min-[380px]:text-[1.15rem] sm:text-[1.4rem] md:text-[1.55rem] ${
            overHero ? "drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]" : ""
          }`}
          style={{ color: navColor }}
          onClick={goHome}
        >
          AndeStay
          <span className="hidden min-[360px]:inline"> Hostel</span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-6 text-[1.02rem] transition-colors duration-300 lg:flex xl:gap-9 xl:text-[1.08rem]"
          style={{ color: navColor }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:opacity-70"
              onClick={() => {
                if (link.href === "/" && onHome) scrollHomeToTop();
              }}
            >
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5 lg:hidden">
          <LanguageSwitcher tone={switcherTone} compact />
          <button
            type="button"
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
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
        <div className="mt-2 max-h-[min(80svh,580px)] overflow-y-auto overscroll-contain rounded-[1.35rem] border border-[rgba(60,80,60,0.12)] bg-[rgba(197,209,195,0.97)] px-4 py-4 shadow-lg backdrop-blur-xl sm:rounded-[1.5rem] sm:px-6 sm:py-6 lg:hidden">
          <nav className="flex flex-col gap-0.5 text-[1.12rem]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setOpen(false);
                  if (link.href === "/" && onHome) scrollHomeToTop();
                }}
                className="rounded-xl px-3 py-3.5 transition active:bg-white/45"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-[rgba(20,24,20,0.1)] pt-4">
            <BookButton source="navbar-mobile" className="w-full justify-between">
              {t.common.bookStay}
            </BookButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
