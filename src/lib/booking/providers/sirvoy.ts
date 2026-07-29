import { EMPTY_CAPABILITIES, BookingProviderId } from "../types";
import { createUnimplementedProvider } from "./base";

export function createSirvoyProvider() {
  return createUnimplementedProvider(BookingProviderId.SIRVOY, {
    ...EMPTY_CAPABILITIES,
    supportsPayments: true,
    supportsCalendar: true,
    supportsAvailability: true,
  });
}
