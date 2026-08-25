import { bookingConfig } from "../config";
import { BookingLogger } from "../logger";
import {
  BookingProviderId,
  type BookingProvider,
  type OpenBookingOptions,
  type RoomSlug,
} from "../types";
import { buildQloAppsHotelUrl, mapBookingLocale, navigateTo } from "../utils";

/**
 * QloApps provider — hotel listing deep links.
 *
 * Phase 1: all Book CTAs open the hotel page
 *   https://book.andestay.com/{locale}/8-andestay-hostel
 * with optional date/occupancy query params.
 *
 * Per-cabin product URLs come later (do not use id_product yet).
 */
export function createQloAppsProvider(): BookingProvider {
  const resolveUrl = (opts: OpenBookingOptions = {}) =>
    buildQloAppsHotelUrl({
      baseUrl: bookingConfig.baseUrl,
      hotelSlug: bookingConfig.hotelListingSlug,
      locale: mapBookingLocale(opts.locale),
      checkIn: opts.checkIn,
      checkOut: opts.checkOut,
      adults: opts.adults,
      children: opts.children,
    });

  const provider: BookingProvider = {
    id: BookingProviderId.QLOAPPS,
    capabilities: {
      supportsPayments: true,
      supportsCalendar: true,
      supportsCoupons: true,
      supportsAvailability: true,
      supportsGuests: true,
      paymentMode: "online",
      availabilityMode: "live",
      supportsOnlinePayment: true,
      supportsPromoCodes: true,
      supportsRealtimeAvailability: true,
    },

    getUrl(opts: OpenBookingOptions = {}) {
      return resolveUrl(opts);
    },

    // Phase 1: room CTAs also open the hotel listing (no per-cabin product URLs yet).
    getRoomUrl(_roomSlug: RoomSlug, opts: OpenBookingOptions = {}) {
      return resolveUrl(opts);
    },

    open(opts: OpenBookingOptions = {}) {
      const url = resolveUrl(opts);
      const newTab =
        opts.newTab ?? (bookingConfig.external && bookingConfig.openInNewTab);
      BookingLogger.info("provider_open", { provider: BookingProviderId.QLOAPPS, url });
      navigateTo(url, newTab);
    },

    openRoom(roomSlug: RoomSlug, opts: OpenBookingOptions = {}) {
      const url = resolveUrl(opts);
      const newTab =
        opts.newTab ?? (bookingConfig.external && bookingConfig.openInNewTab);
      BookingLogger.info("provider_open_room", {
        provider: BookingProviderId.QLOAPPS,
        roomSlug,
        url,
        quantity: opts.quantity,
      });
      navigateTo(url, newTab);
    },
  };

  return provider;
}
