export type { BookingCapabilities } from "./provider";

export const EMPTY_CAPABILITIES = {
  supportsPayments: false,
  supportsCalendar: false,
  supportsCoupons: false,
  supportsAvailability: false,
  supportsGuests: false,
} as const;
