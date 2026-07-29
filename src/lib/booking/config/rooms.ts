/**
 * Room mapping: website slug → provider external ids.
 *
 * UI / content uses slugs only (e.g. "double-room").
 * Providers never hardcode marketing names — they resolve via this map.
 */

import type { BookingProviderId, ProviderRoomRef, RoomSlug } from "../types";
import { BookingProviderId as Provider } from "../types";
import { env } from "./env";

type RoomProviderMap = Partial<Record<BookingProviderId, ProviderRoomRef>>;

/**
 * Keys = stable website room slugs (match content `cabins[].id`).
 * Change QloApps product ids here / in env — not in React.
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
  "family-room": {
    [Provider.QLOAPPS]: {
      externalId: env("NEXT_PUBLIC_BOOKING_ROOM_FAMILY_PRODUCT_ID", "2"),
      url: env("NEXT_PUBLIC_BOOKING_ROOM_FAMILY_URL") || undefined,
      query: {
        id_product: env("NEXT_PUBLIC_BOOKING_ROOM_FAMILY_PRODUCT_ID", "2"),
      },
    },
    [Provider.CUSTOM]: {
      externalId: "family-room",
      path: "/reservations",
      query: { room: "family-room" },
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
  "deluxe-room": {
    [Provider.QLOAPPS]: {
      externalId: env("NEXT_PUBLIC_BOOKING_ROOM_DELUXE_PRODUCT_ID", "4"),
      url: env("NEXT_PUBLIC_BOOKING_ROOM_DELUXE_URL") || undefined,
      query: {
        id_product: env("NEXT_PUBLIC_BOOKING_ROOM_DELUXE_PRODUCT_ID", "4"),
      },
    },
    [Provider.CUSTOM]: {
      externalId: "deluxe-room",
      path: "/reservations",
      query: { room: "deluxe-room" },
    },
  },
  "deluxe-family-room": {
    [Provider.QLOAPPS]: {
      externalId: env("NEXT_PUBLIC_BOOKING_ROOM_DELUXE_FAMILY_PRODUCT_ID", "5"),
      url: env("NEXT_PUBLIC_BOOKING_ROOM_DELUXE_FAMILY_URL") || undefined,
      query: {
        id_product: env("NEXT_PUBLIC_BOOKING_ROOM_DELUXE_FAMILY_PRODUCT_ID", "5"),
      },
    },
    [Provider.CUSTOM]: {
      externalId: "deluxe-family-room",
      path: "/reservations",
      query: { room: "deluxe-family-room" },
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
