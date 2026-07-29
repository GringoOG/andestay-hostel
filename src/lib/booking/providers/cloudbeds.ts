import { EMPTY_CAPABILITIES, BookingProviderId } from "../types";
import { createUnimplementedProvider } from "./base";

export function createCloudbedsProvider() {
  return createUnimplementedProvider(BookingProviderId.CLOUDBEDS, {
    ...EMPTY_CAPABILITIES,
    supportsPayments: true,
    supportsAvailability: true,
    supportsGuests: true,
  });
}
