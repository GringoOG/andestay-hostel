export type {
  AvailabilityMode,
  BookingCapabilities,
  PaymentMode,
} from "./provider";

export const EMPTY_CAPABILITIES = {
  supportsPayments: false,
  supportsCalendar: false,
  supportsCoupons: false,
  supportsAvailability: false,
  supportsGuests: false,
  paymentMode: "none" as const,
  availabilityMode: "none" as const,
} as const;
