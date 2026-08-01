"use client";

import { useState } from "react";
import { BookButton } from "@/components/BookButton";
import { CabinPhotoCarousel } from "@/components/CabinPhotoCarousel";
import { formatRoomPrice, type CabinMeta } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

export function CabinCard({ cabin, reverse = false }: { cabin: CabinMeta; reverse?: boolean }) {
  const { t } = useI18n();
  const copy = t.cabins[cabin.id];
  const [quantity, setQuantity] = useState(1);
  const showQty = cabin.units > 1;
  const unitPrice = formatRoomPrice(cabin.pricePen);
  const totalPen = cabin.pricePen * quantity;
  const totalPrice = formatRoomPrice(totalPen);
  const availableLabel = t.common.cabinsAvailable.replace(
    "{count}",
    String(cabin.units),
  );

  return (
    <article
      className={`group overflow-hidden rounded-[1.25rem] border border-white/90 bg-white/85 shadow-[0_8px_28px_rgba(20,24,20,0.05)] transition-[background-color,box-shadow,border-color] duration-300 sm:rounded-[var(--radius-lg)] md:border-transparent md:bg-transparent md:shadow-none md:hover:border-white md:hover:bg-white md:hover:shadow-[0_10px_40px_rgba(20,24,20,0.06)]`}
    >
      <div
        className={`grid grid-cols-1 items-stretch lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="order-2 flex flex-col justify-between p-5 sm:p-8 md:p-10 lg:order-none">
          <div>
            <h3 className="font-display text-[1.55rem] italic leading-tight text-[var(--serif-green)] sm:text-3xl md:text-4xl">
              {copy.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">{availableLabel}</p>
            <p className="mt-2.5 max-w-md text-[0.92rem] leading-relaxed text-[var(--ink-soft)] sm:mt-3 sm:text-base">
              {copy.blurb}
            </p>
            <ul className="mt-5 space-y-2.5 sm:mt-8 sm:space-y-3">
              {copy.features.map((feature) => {
                const highlight = feature === t.common.dinnerBreakfastIncluded;
                return (
                  <li
                    key={feature}
                    className={`flex gap-3 text-[0.88rem] sm:text-[0.95rem] ${
                      highlight
                        ? "-mx-2 rounded-lg bg-[var(--bg-muted)] px-2 py-1.5 font-semibold text-[var(--serif-green)]"
                        : "text-[var(--ink-soft)]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] ${
                        highlight
                          ? "bg-[var(--accent-green)] text-white"
                          : "bg-[var(--bg-muted)] text-[var(--accent-green)]"
                      }`}
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-7 flex flex-col gap-3.5 sm:mt-10">
            {showQty ? (
              <label className="flex flex-wrap items-center gap-3 text-sm text-[var(--ink-soft)]">
                <span>{t.common.cabinsToBook}</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="min-h-11 min-w-[4.5rem] rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-base text-[var(--ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-green)]/40"
                >
                  {Array.from({ length: cabin.units }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
              <div>
                <p className="text-[1.05rem] font-semibold tracking-tight sm:text-xl">
                  ${totalPrice.usd}{" "}
                  <span className="text-[var(--ink-muted)]">·</span> PEN {totalPrice.pen}{" "}
                  <span className="text-sm font-normal text-[var(--ink-muted)]">
                    {t.common.perNight}
                  </span>
                </p>
                {showQty && quantity > 1 ? (
                  <p className="mt-0.5 text-sm text-[var(--ink-muted)]">
                    ${unitPrice.usd} · PEN {unitPrice.pen} {t.common.perCabin}
                  </p>
                ) : null}
              </div>
              <BookButton
                roomSlug={cabin.id}
                quantity={quantity}
                source="room-card"
                className="w-full justify-between sm:w-auto"
              />
            </div>
          </div>
        </div>

        <div className="relative order-1 aspect-[5/4] w-full min-w-0 overflow-hidden sm:aspect-[4/5] lg:order-none lg:aspect-auto lg:min-h-[480px]">
          <CabinPhotoCarousel images={cabin.images} label={cabin.photoLabel} />
        </div>
      </div>
    </article>
  );
}
