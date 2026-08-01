/**
 * BookingService — sole public API for UI.
 *
 * UI never knows the provider. Swap via NEXT_PUBLIC_BOOKING_PROVIDER only.
 *
 * Flow: UI → BookingService → BookingEngine → BookingProvider
 */

import { trackBookingClick, trackBookingEvent } from "./analytics";
import { bookingConfig } from "./config";
import { bookingEngine } from "./engine";
import { BookingError, BookingErrorCode } from "./errors";
import { BookingLogger } from "./logger";
import type {
  BookingCapabilities,
  BookingProviderId,
  OpenBookingOptions,
  RoomSlug,
} from "./types";

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
    return bookingEngine.capabilities();
  },

  getUrl(): string {
    return bookingEngine.getUrl();
  },

  getRoomUrl(roomSlug: RoomSlug, options: OpenBookingOptions = {}): string {
    try {
      return bookingEngine.getRoomUrl(roomSlug, options);
    } catch (err) {
      reportError(err, roomSlug);
      return bookingEngine.getUrl();
    }
  },

  open(options: OpenBookingOptions = {}): void {
    if (!guardEnabled()) return;
    try {
      const url = bookingEngine.getUrl();
      trackBookingClick({
        provider: bookingConfig.provider,
        source: options.source,
        url,
      });
      bookingEngine.open(options);
    } catch (err) {
      reportError(err, undefined, options.source);
    }
  },

  openRoom(roomSlug: RoomSlug, options: OpenBookingOptions = {}): void {
    if (!guardEnabled()) return;
    try {
      const url = bookingEngine.getRoomUrl(roomSlug, options);
      trackBookingClick({
        provider: bookingConfig.provider,
        roomSlug,
        source: options.source,
        url,
      });
      bookingEngine.openRoom(roomSlug, options);
    } catch (err) {
      reportError(err, roomSlug, options.source);
    }
  },
} as const;
