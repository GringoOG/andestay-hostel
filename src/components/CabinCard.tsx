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
    <article className="overflow-hidden rounded-[1.35rem] border border-white bg-white shadow-[0_10px_40px_rgba(20,24,20,0.06)] sm:rounded-[var(--radius-lg)]">
      <div
        className={`grid items-stretch lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="flex flex-col justify-between p-5 sm:p-8 md:p-10">
          <div>
            <h3 className="font-display text-[1.7rem] italic leading-tight text-[var(--serif-green)] sm:text-3xl md:text-4xl">
              {copy.name}
            </h3>
            <p className="mt-2.5 max-w-md text-[0.95rem] leading-relaxed text-[var(--ink-soft)] sm:mt-3 sm:text-base">
              {copy.blurb}
            </p>
            <ul className="mt-6 space-y-2.5 sm:mt-8 sm:space-y-3">
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

          <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="text-lg font-semibold tracking-tight sm:text-xl">
              ${price.usd}{" "}
              <span className="text-[var(--ink-muted)]">·</span> PEN {price.pen}{" "}
              <span className="text-sm font-normal text-[var(--ink-muted)]">
                {t.common.perNight}
              </span>
            </p>
            <BookButton roomSlug={cabin.id} source="room-card" className="w-full justify-between sm:w-auto" />
          </div>
        </div>

        <PhotoPlaceholder
          label={cabin.photoLabel}
          src={cabin.image}
          className="aspect-[5/4] min-h-[220px] rounded-none sm:aspect-[4/5] sm:min-h-[320px] lg:aspect-auto lg:min-h-[480px]"
        />
      </div>
    </article>
  );
}
