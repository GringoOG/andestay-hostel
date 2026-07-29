import { bookingConfig } from "../config";
import { getMappedRoom } from "../config/rooms";
import { BookingLogger } from "../logger";
import { BookingProviderId, type BookingProvider, type RoomSlug } from "../types";
import { buildRoomUrl, joinUrl, navigateTo } from "../utils";

/**
 * Custom engine stub — activate with NEXT_PUBLIC_BOOKING_PROVIDER=custom.
 * Implement real availability / checkout here later; UI stays unchanged.
 */
export function createCustomProvider(): BookingProvider {
  const base = bookingConfig.baseUrl;
  const path = bookingConfig.defaultPath || "/reservations";

  const provider: BookingProvider = {
    id: BookingProviderId.CUSTOM,
    capabilities: {
      supportsPayments: false,
      supportsCalendar: false,
      supportsCoupons: false,
      supportsAvailability: false,
      supportsGuests: false,
    },

    getUrl() {
      return base ? joinUrl(base, path) : path.startsWith("/") ? path : `/${path}`;
    },

    getRoomUrl(roomSlug: RoomSlug) {
      const mapped = getMappedRoom(roomSlug, BookingProviderId.CUSTOM);
      const fallback = `${provider.getUrl()}${provider.getUrl().includes("?") ? "&" : "?"}room=${encodeURIComponent(roomSlug)}`;
      return buildRoomUrl(base, path, mapped, fallback);
    },

    open(opts = {}) {
      const url = provider.getUrl();
      const newTab = opts.newTab ?? false;
      BookingLogger.info("custom_open", { url });
      navigateTo(url, newTab);
    },

    openRoom(roomSlug, opts = {}) {
      const url = provider.getRoomUrl(roomSlug);
      const newTab = opts.newTab ?? false;
      BookingLogger.info("custom_open_room", { roomSlug, url });
      navigateTo(url, newTab);
    },
  };

  return provider;
}
