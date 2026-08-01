import { bookingConfig } from "../config";
import { BookingError } from "../errors";
import { BookingLogger } from "../logger";
import type {
  BookingCapabilities,
  BookingProvider,
  BookingProviderId,
  OpenBookingOptions,
  RoomSlug,
} from "../types";
import { getMappedRoom } from "../config/rooms";
import { buildRoomUrl, joinUrl, navigateTo, withQuery } from "../utils";

type ExternalProviderOptions = {
  id: BookingProviderId;
  capabilities: BookingCapabilities;
  /** When true, missing room mapping throws; otherwise falls back to getUrl(). */
  strictRoomMapping?: boolean;
};

function applyQuantity(url: string, quantity?: number): string {
  if (!quantity || quantity < 2) return url;
  return withQuery(url, { quantity: String(quantity) });
}

/**
 * Shared external-URL provider base (QloApps / future OTAs).
 * Concrete providers only supply id + capabilities (+ optional URL tweaks).
 */
export function createExternalUrlProvider(
  options: ExternalProviderOptions,
): BookingProvider {
  const { id, capabilities, strictRoomMapping = false } = options;

  const provider: BookingProvider = {
    id,
    capabilities,

    getUrl() {
      return joinUrl(bookingConfig.baseUrl, bookingConfig.defaultPath);
    },

    getRoomUrl(roomSlug: RoomSlug, opts: OpenBookingOptions = {}) {
      const mapped = getMappedRoom(roomSlug, id);
      if (!mapped) {
        if (strictRoomMapping) {
          throw BookingError.roomNotFound(roomSlug);
        }
        BookingLogger.warn("room_mapping_missing_fallback", { roomSlug, provider: id });
        return applyQuantity(provider.getUrl(), opts.quantity);
      }
      return applyQuantity(
        buildRoomUrl(
          bookingConfig.baseUrl,
          bookingConfig.defaultPath,
          mapped,
          provider.getUrl(),
        ),
        opts.quantity,
      );
    },

    open(opts: OpenBookingOptions = {}) {
      const url = provider.getUrl();
      const newTab =
        opts.newTab ?? (bookingConfig.external && bookingConfig.openInNewTab);
      BookingLogger.info("provider_open", { provider: id, url });
      navigateTo(url, newTab);
    },

    openRoom(roomSlug: RoomSlug, opts: OpenBookingOptions = {}) {
      const url = provider.getRoomUrl(roomSlug, opts);
      const newTab =
        opts.newTab ?? (bookingConfig.external && bookingConfig.openInNewTab);
      BookingLogger.info("provider_open_room", {
        provider: id,
        roomSlug,
        url,
        quantity: opts.quantity,
      });
      navigateTo(url, newTab);
    },
  };

  return provider;
}

/** Stub for providers not yet implemented. */
export function createUnimplementedProvider(
  id: BookingProviderId,
  capabilities: BookingCapabilities,
): BookingProvider {
  const fail = (): never => {
    throw BookingError.providerUnavailable(
      `Booking provider "${id}" is registered but not implemented yet.`,
    );
  };

  return {
    id,
    capabilities,
    getUrl: fail,
    getRoomUrl: fail,
    open: fail,
    openRoom: fail,
  };
}
