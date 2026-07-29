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
    <article
      className={`group overflow-hidden rounded-[1.25rem] border border-white/90 bg-white/85 shadow-[0_8px_28px_rgba(20,24,20,0.05)] transition-[background-color,box-shadow,border-color] duration-300 sm:rounded-[var(--radius-lg)] md:border-transparent md:bg-transparent md:shadow-none md:hover:border-white md:hover:bg-white md:hover:shadow-[0_10px_40px_rgba(20,24,20,0.06)]`}
    >
      <div
        className={`grid grid-cols-1 items-stretch lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Text — below photo on mobile, side-by-side on desktop */}
        <div className="order-2 flex flex-col justify-between p-5 sm:p-8 md:p-10 lg:order-none">
          <div>
            <h3 className="font-display text-[1.55rem] italic leading-tight text-[var(--serif-green)] sm:text-3xl md:text-4xl">
              {copy.name}
            </h3>
            <p className="mt-2.5 max-w-md text-[0.92rem] leading-relaxed text-[var(--ink-soft)] sm:mt-3 sm:text-base">
              {copy.blurb}
            </p>
            <ul className="mt-5 space-y-2.5 sm:mt-8 sm:space-y-3">
              {copy.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 text-[0.88rem] text-[var(--ink-soft)] sm:text-[0.95rem]"
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

          <div className="mt-7 flex flex-col gap-3.5 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            <p className="text-[1.05rem] font-semibold tracking-tight sm:text-xl">
              ${price.usd}{" "}
              <span className="text-[var(--ink-muted)]">·</span> PEN {price.pen}{" "}
              <span className="text-sm font-normal text-[var(--ink-muted)]">
                {t.common.perNight}
              </span>
            </p>
            <BookButton
              roomSlug={cabin.id}
              source="room-card"
              className="w-full justify-between sm:w-auto"
            />
          </div>
        </div>

        {/* Mobile: edge-to-edge across the card; desktop: half of the 2-col row */}
        <div className="relative order-1 aspect-[5/4] w-full min-w-0 overflow-hidden sm:aspect-[4/5] lg:order-none lg:aspect-auto lg:min-h-[480px]">
          <PhotoPlaceholder
            label={cabin.photoLabel}
            src={cabin.image}
            fillParent
            sizes="(max-width: 1023px) 100vw, 50vw"
            quality={85}
            className="rounded-none"
          />
        </div>
      </div>
    </article>
  );
}
