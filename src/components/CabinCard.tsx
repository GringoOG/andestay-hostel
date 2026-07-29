"use client";

import { BookButton } from "@/components/BookButton";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { formatRoomPrice, type CabinMeta } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export function CabinCard({ cabin, reverse = false }: { cabin: CabinMeta; reverse?: boolean }) {
  const { t } = useI18n();
  const copy = t.cabins[cabin.id];
  const price = formatRoomPrice(cabin.pricePen);

  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] border border-white bg-white shadow-[0_10px_40px_rgba(20,24,20,0.06)]">
      <div
        className={`grid items-stretch lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="flex flex-col justify-between p-7 sm:p-10">
          <div>
            <h3 className="font-display text-3xl italic text-[var(--serif-green)] sm:text-4xl">
              {copy.name}
            </h3>
            <p className="mt-3 max-w-md text-[var(--ink-soft)]">{copy.blurb}</p>
            <ul className="mt-8 space-y-3">
              {copy.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 text-sm text-[var(--ink-soft)] sm:text-[0.95rem]"
                >
                  <span
                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--bg-muted)] text-[0.65rem] text-[var(--accent-green)]"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xl font-semibold tracking-tight">
              ${price.usd}{" "}
              <span className="text-[var(--ink-muted)]">·</span> PEN {price.pen}{" "}
              <span className="text-sm font-normal text-[var(--ink-muted)]">
                {t.common.perNight}
              </span>
            </p>
            <BookButton roomSlug={cabin.id} source="room-card" />
          </div>
        </div>

        <PhotoPlaceholder
          label={cabin.photoLabel}
          src={cabin.image}
          className="aspect-[4/5] min-h-[280px] rounded-none sm:min-h-[360px] lg:aspect-auto lg:min-h-[480px]"
        />
      </div>
    </article>
  );
}
