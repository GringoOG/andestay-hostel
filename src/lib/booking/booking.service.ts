/**
 * BookingService — sole public API for UI.
 *
 * UI never knows the provider. Swap via NEXT_PUBLIC_BOOKING_PROVIDER only.
 */

import { trackBookingClick, trackBookingEvent } from "./analytics";
import { bookingConfig } from "./config";
import { BookingError, BookingErrorCode } from "./errors";
import { BookingProviderFactory } from "./factory";
import { BookingLogger } from "./logger";
import type {
  BookingCapabilities,
  BookingProviderId,
  OpenBookingOptions,
  RoomSlug,
} from "./types";

function active() {
  return BookingProviderFactory.createActive();
}

function guardEnabled(): boolean {
  if (!bookingConfig.enabled) {
    BookingLogger.warn("booking_disabled");
    return false;
  }
  return true;
}

function reportError(err: unknown, roomSlug?: RoomSlug, source?: string): void {
  const code =
    err instanceof BookingError ? err.code : BookingErrorCode.UNKNOWN;
  const message = err instanceof Error ? err.message : String(err);

  BookingLogger.error(message, { code, roomSlug, source });
  trackBookingEvent({
    event: "booking_error",
    provider: bookingConfig.provider,
    roomSlug,
    source,
    errorCode: code,
  });
}

export const BookingService = {
  provider(): BookingProviderId {
    return bookingConfig.provider;
  },

  isExternal(): boolean {
    return bookingConfig.external;
  },

  isEnabled(): boolean {
    return bookingConfig.enabled;
  },

  capabilities(): BookingCapabilities {
    return active().capabilities;
  },

  getUrl(): string {
    return active().getUrl();
  },

  getRoomUrl(roomSlug: RoomSlug): string {
    try {
      return active().getRoomUrl(roomSlug);
    } catch (err) {
      reportError(err, roomSlug);
      return active().getUrl();
    }
  },

  open(options: OpenBookingOptions = {}): void {
    if (!guardEnabled()) return;
    try {
      const url = active().getUrl();
      trackBookingClick({
        provider: bookingConfig.provider,
        source: options.source,
        url,
      });
      active().open(options);
    } catch (err) {
      reportError(err, undefined, options.source);
    }
  },

  openRoom(roomSlug: RoomSlug, options: OpenBookingOptions = {}): void {
    if (!guardEnabled()) return;
    try {
      const url = active().getRoomUrl(roomSlug);
      trackBookingClick({
        provider: bookingConfig.provider,
        roomSlug,
        source: options.source,
        url,
      });
      active().openRoom(roomSlug, options);
    } catch (err) {
      reportError(err, roomSlug, options.source);
    }
  },
} as const;
