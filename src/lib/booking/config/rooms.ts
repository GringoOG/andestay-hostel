/**
 * Room mapping: website slug → provider external ids.
 *
 * UI / content uses slugs only (e.g. "double-room").
 * Providers never hardcode marketing names — they resolve via this map.
 *
 * Inventory: 4 doble · 3 matrimonial · 1 triple · 1 simple
 */

import type { BookingProviderId, ProviderRoomRef, RoomSlug } from "../types";
import { BookingProviderId as Provider } from "../types";
import { env } from "./env";

type RoomProviderMap = Partial<Record<BookingProviderId, ProviderRoomRef>>;

/**
 * Keys = stable website room slugs (match hotel `HotelRoomId` / content cabin id).
 * Change QloApps product ids here / in env — not in React.
 * Inventory & prices live in `@/lib/hotel` — this map is provider IDs only.
 */
const ROOM_MAP: Record<RoomSlug, RoomProviderMap> = {
  "double-room": {
    [Provider.QLOAPPS]: {
      externalId: env("NEXT_PUBLIC_BOOKING_ROOM_DOUBLE_PRODUCT_ID", "1"),
      url: env("NEXT_PUBLIC_BOOKING_ROOM_DOUBLE_URL") || undefined,
      query: {
        id_product: env("NEXT_PUBLIC_BOOKING_ROOM_DOUBLE_PRODUCT_ID", "1"),
      },
    },
    [Provider.CUSTOM]: {
      externalId: "double-room",
      path: "/reservations",
      query: { room: "double-room" },
    },
  },
  "matrimonial-room": {
    [Provider.QLOAPPS]: {
      externalId: env("NEXT_PUBLIC_BOOKING_ROOM_MATRIMONIAL_PRODUCT_ID", "2"),
      url: env("NEXT_PUBLIC_BOOKING_ROOM_MATRIMONIAL_URL") || undefined,
      query: {
        id_product: env("NEXT_PUBLIC_BOOKING_ROOM_MATRIMONIAL_PRODUCT_ID", "2"),
      },
    },
    [Provider.CUSTOM]: {
      externalId: "matrimonial-room",
      path: "/reservations",
      query: { room: "matrimonial-room" },
    },
  },
  "triple-room": {
    [Provider.QLOAPPS]: {
      externalId: env("NEXT_PUBLIC_BOOKING_ROOM_TRIPLE_PRODUCT_ID", "3"),
      url: env("NEXT_PUBLIC_BOOKING_ROOM_TRIPLE_URL") || undefined,
      query: {
        id_product: env("NEXT_PUBLIC_BOOKING_ROOM_TRIPLE_PRODUCT_ID", "3"),
      },
    },
    [Provider.CUSTOM]: {
      externalId: "triple-room",
      path: "/reservations",
      query: { room: "triple-room" },
    },
  },
  "simple-room": {
    [Provider.QLOAPPS]: {
      externalId: env("NEXT_PUBLIC_BOOKING_ROOM_SIMPLE_PRODUCT_ID", "4"),
      url: env("NEXT_PUBLIC_BOOKING_ROOM_SIMPLE_URL") || undefined,
      query: {
        id_product: env("NEXT_PUBLIC_BOOKING_ROOM_SIMPLE_PRODUCT_ID", "4"),
      },
    },
    [Provider.CUSTOM]: {
      externalId: "simple-room",
      path: "/reservations",
      query: { room: "simple-room" },
    },
  },
};

export function getMappedRoom(
  roomSlug: RoomSlug,
  provider: BookingProviderId,
): ProviderRoomRef | undefined {
  return ROOM_MAP[roomSlug]?.[provider];
}

export function listRoomSlugs(): RoomSlug[] {
  return Object.keys(ROOM_MAP);
}

export { ROOM_MAP };
