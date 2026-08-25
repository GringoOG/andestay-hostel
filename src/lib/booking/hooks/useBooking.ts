"use client";

import { BookingService } from "../booking.service";
import type { OpenBookingOptions, RoomSlug } from "../types";

/**
 * React hook — thin wrapper around BookingService.
 * Components still must not know the active provider.
 */
export function useBooking() {
  return {
    provider: BookingService.provider(),
    isExternal: BookingService.isExternal(),
    isEnabled: BookingService.isEnabled(),
    capabilities: BookingService.capabilities(),
    getUrl: (options?: OpenBookingOptions) => BookingService.getUrl(options),
    getRoomUrl: (roomSlug: RoomSlug, options?: OpenBookingOptions) =>
      BookingService.getRoomUrl(roomSlug, options),
    open: (options?: OpenBookingOptions) => BookingService.open(options),
    openRoom: (roomSlug: RoomSlug, options?: OpenBookingOptions) =>
      BookingService.openRoom(roomSlug, options),
  };
}
