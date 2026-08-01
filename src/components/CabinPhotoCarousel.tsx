"use client";

import { useEffect, useRef, useState } from "react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";

type CabinPhotoCarouselProps = {
  images: string[];
  label: string;
  sizes?: string;
};

export function CabinPhotoCarousel({
  images,
  label,
  sizes = "(max-width: 1023px) 100vw, 50vw",
}: CabinPhotoCarouselProps) {
  const photos = images.length > 0 ? images : [];
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const multi = photos.length > 1;

  useEffect(() => {
    setIndex(0);
  }, [photos]);

  if (photos.length === 0) {
    return (
      <PhotoPlaceholder
        label={label}
        fillParent
        sizes={sizes}
        quality={85}
        className="rounded-none"
      />
    );
  }

  const go = (delta: number) => {
    if (!multi) return;
    setIndex((i) => (i + delta + photos.length) % photos.length);
  };

  return (
    <div
      className="relative h-full w-full"
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null || !multi) return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) < 40) return;
        go(dx < 0 ? 1 : -1);
      }}
    >
      <PhotoPlaceholder
        key={photos[index]}
        label={`${label} (${index + 1}/${photos.length})`}
        src={photos[index]}
        fillParent
        sizes={sizes}
        quality={85}
        className="rounded-none"
      />

      {/* Always visible arrows — site-style circular, lightly transparent */}
      <button
        type="button"
        aria-label="Previous photo"
        aria-disabled={!multi}
        onClick={() => go(-1)}
        className="cabin-carousel-nav cabin-carousel-nav--prev"
      >
        <span aria-hidden>←</span>
      </button>
      <button
        type="button"
        aria-label="Next photo"
        aria-disabled={!multi}
        onClick={() => go(1)}
        className="cabin-carousel-nav cabin-carousel-nav--next"
      >
        <span aria-hidden>→</span>
      </button>

      {multi ? (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-[1] flex -translate-x-1/2 gap-1.5">
          {photos.map((src, i) => (
            <span
              key={src}
              className={`h-1.5 w-1.5 rounded-full transition-opacity ${
                i === index ? "bg-white/90" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
