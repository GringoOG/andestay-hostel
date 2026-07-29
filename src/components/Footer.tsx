import Link from "next/link";
import { navLinks, site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-[var(--forest-deep)] text-[rgba(255,255,255,0.88)]">
      <div className="site-wrap border-b border-white/10 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mr-1 inline-block hover:text-white"
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

      <div className="site-wrap flex flex-col gap-4 py-10 sm:flex-row sm:items-end sm:justify-between">
        <p className="font-display text-4xl text-white sm:text-5xl">{site.name}</p>
        <p className="max-w-sm text-left text-lg leading-snug text-white/85 sm:text-right">
          Your base <em className="font-display italic">in Colpapampa.</em>
        </p>
      </div>
    </footer>
  );
}
