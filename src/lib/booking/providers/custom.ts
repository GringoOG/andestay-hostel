import { bookingConfig } from "../config";
import { getMappedRoom } from "../config/rooms";
import { BookingLogger } from "../logger";
import {
  BookingProviderId,
  type BookingProvider,
  type OpenBookingOptions,
  type RoomSlug,
} from "../types";
import { buildRoomUrl, joinUrl, navigateTo, withQuery } from "../utils";

/**
 * Custom engine stub — activate with NEXT_PUBLIC_BOOKING_PROVIDER=custom.
 * Implement real availability / checkout here later; UI stays unchanged.
 */
export function createCustomProvider(): BookingProvider {
  const base = bookingConfig.baseUrl;
  const path = bookingConfig.defaultPath || "/reservations";

  const applyQuantity = (url: string, quantity?: number) => {
    if (!quantity || quantity < 2) return url;
    return withQuery(url, { quantity: String(quantity) });
  };

  const provider: BookingProvider = {
    id: BookingProviderId.CUSTOM,
    capabilities: {
      supportsPayments: false,
      supportsCalendar: false,
      supportsCoupons: false,
      supportsAvailability: false,
      supportsGuests: false,
      paymentMode: "none",
      availabilityMode: "none",
    },

    getUrl(opts: OpenBookingOptions = {}) {
      void opts;
      return base ? joinUrl(base, path) : path.startsWith("/") ? path : `/${path}`;
    },

    getRoomUrl(roomSlug: RoomSlug, opts: OpenBookingOptions = {}) {
      const mapped = getMappedRoom(roomSlug, BookingProviderId.CUSTOM);
      const fallback = `${provider.getUrl(opts)}${provider.getUrl(opts).includes("?") ? "&" : "?"}room=${encodeURIComponent(roomSlug)}`;
      return applyQuantity(buildRoomUrl(base, path, mapped, fallback), opts.quantity);
    },

    open(opts = {}) {
      const url = provider.getUrl(opts);
      const newTab = opts.newTab ?? false;
      BookingLogger.info("custom_open", { url });
      navigateTo(url, newTab);
    },

    openRoom(roomSlug, opts = {}) {
      const url = provider.getRoomUrl(roomSlug, opts);
      const newTab = opts.newTab ?? false;
      BookingLogger.info("custom_open_room", {
        roomSlug,
        url,
        quantity: opts.quantity,
      });
      navigateTo(url, newTab);
    },
  };

  return provider;
}
