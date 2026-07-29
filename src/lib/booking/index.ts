/**
 * Public booking barrel.
 * UI: `import { BookingService } from "@/lib/booking"`
 */

export { BookingService } from "./booking.service";
export { BookingProviderFactory } from "./factory";
export { BookingError, BookingErrorCode } from "./errors";
export { BookingLogger } from "./logger";
export { registerBookingAnalyticsSink, trackBookingClick } from "./analytics";
export { useBooking, useBookingCapabilities } from "./hooks";
export { bookingConfig } from "./config";
export { getMappedRoom, listRoomSlugs } from "./config/rooms";

export { BookingProviderId, EMPTY_CAPABILITIES } from "./types";
export type {
  BookingCapabilities,
  BookingConfig,
  BookingProvider,
  OpenBookingOptions,
  ProviderRoomRef,
  RoomSlug,
  BookingAnalyticsPayload,
} from "./types";
