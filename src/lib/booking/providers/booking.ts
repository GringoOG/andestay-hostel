import { EMPTY_CAPABILITIES, BookingProviderId } from "../types";
import { createUnimplementedProvider } from "./base";

/** Booking.com channel stub. */
export function createBookingComProvider() {
  return createUnimplementedProvider(BookingProviderId.BOOKING, {
    ...EMPTY_CAPABILITIES,
    supportsCalendar: true,
    supportsAvailability: true,
  });
}
