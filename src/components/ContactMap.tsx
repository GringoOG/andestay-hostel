"use client";

import { site } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export function ContactMap() {
  const { t } = useI18n();

  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-[rgba(60,80,60,0.1)] bg-[var(--bg-muted)] shadow-[0_8px_28px_rgba(20,24,20,0.05)] sm:rounded-[var(--radius-lg)]">
      <div className="relative aspect-[16/11] w-full min-h-[220px] sm:aspect-[21/9] sm:min-h-[280px]">
        <iframe
          title={`${site.name} — Google Maps`}
          src={site.mapsEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="flex flex-col gap-3 border-t border-[rgba(60,80,60,0.08)] px-4 py-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-5">
        <div className="min-w-0">
          <p className="text-sm text-[var(--ink-soft)]">{site.address}</p>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{t.contact.mapHint}</p>
        </div>
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm font-medium text-[var(--serif-green)] hover:opacity-70"
        >
          {t.contact.openInMaps}
        </a>
      </div>
    </div>
  );
}
