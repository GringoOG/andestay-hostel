"use client";

import { BookingService } from "../booking.service";
import type { BookingCapabilities } from "../types";

/** Feature flags from the active provider — drive conditional UI later. */
export function useBookingCapabilities(): BookingCapabilities {
  return BookingService.capabilities();
}
