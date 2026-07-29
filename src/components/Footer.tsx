"use client";

import Link from "next/link";
import { navHrefs, site } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  const links = navHrefs.map((item) => ({
    href: item.href,
    label: t.nav[item.key],
  }));

  return (
    <footer className="bg-[var(--forest-deep)] pb-[max(0px,var(--safe-bottom))] text-[rgba(255,255,255,0.88)]">
      <div className="site-wrap border-b border-white/10 py-5 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm sm:gap-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mr-1 inline-block py-1 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-4 text-sm opacity-80">
            <span aria-hidden>IG</span>
            <span aria-hidden>in</span>
            <span aria-hidden>f</span>
            <span aria-hidden>wa</span>
            <span aria-hidden>▶</span>
          </div>
        </div>
      </div>

      <div className="site-wrap flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:py-10">
        <p className="font-display text-[2rem] leading-none text-white sm:text-4xl md:text-5xl">
          {site.name}
        </p>
        <p className="max-w-sm text-left text-base leading-snug text-white/85 sm:text-right sm:text-lg">
          {t.footer.taglineBefore}{" "}
          <em className="font-display italic">{t.footer.taglineEm}</em>
        </p>
      </div>
    </footer>
  );
}
