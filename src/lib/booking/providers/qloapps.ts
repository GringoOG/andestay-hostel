import { BookingProviderId } from "../types";
import { createExternalUrlProvider } from "./base";

export function createQloAppsProvider() {
  return createExternalUrlProvider({
    id: BookingProviderId.QLOAPPS,
    capabilities: {
      supportsPayments: true,
      supportsCalendar: true,
      supportsCoupons: true,
      supportsAvailability: true,
      supportsGuests: true,
    },
  });
}
