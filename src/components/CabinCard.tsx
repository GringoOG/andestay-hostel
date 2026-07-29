import { BookButton } from "@/components/BookButton";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { cabins, formatRoomPrice } from "@/lib/content";

type Cabin = (typeof cabins)[number];

export function CabinCard({ cabin, reverse = false }: { cabin: Cabin; reverse?: boolean }) {
  const price = formatRoomPrice(cabin.pricePen);

  return (
    <article className="group overflow-hidden rounded-[var(--radius-lg)] border border-transparent bg-transparent transition-[border-color,box-shadow] duration-300 hover:border-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.9)]">
      <div
        className={`grid items-stretch lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="flex flex-col justify-between p-7 sm:p-10">
          <div>
            <h3 className="font-display text-3xl italic text-[var(--serif-green)] sm:text-4xl">
              {cabin.name}
            </h3>
            <p className="mt-3 max-w-md text-[var(--ink-soft)]">{cabin.blurb}</p>
            <ul className="mt-8 space-y-3">
              {cabin.features.map((feature) => (
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
              <span className="text-sm font-normal text-[var(--ink-muted)]">/ night</span>
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
