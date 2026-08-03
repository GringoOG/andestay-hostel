/**
 * UI presentation adapter — Room → CabinMeta for existing CabinCard.
 * Keeps card props identical to the former content.ts join.
 */

import type { CabinId } from "@/lib/i18n";
import type { CabinMarketing } from "./site-data";
import type { Room } from "./types";

export type { CabinMarketing };

export type CabinMeta = CabinMarketing & {
  units: number;
  capacity: number;
  pricePen: number;
};

export function roomToCabinMeta(room: Room): CabinMeta {
  const images = [
    room.coverImage.src,
    ...room.gallery.map((g) => g.src).filter((src) => src !== room.coverImage.src),
  ].filter(Boolean);

  return {
    id: room.slug as CabinId,
    images,
    photoLabel: room.subtitle || room.coverImage.alt || room.title,
    units: room.inventory,
    capacity: room.capacity,
    pricePen: room.price,
  };
}
