/**
 * Public booking barrel.
 * UI: `import { BookingService } from "@/lib/booking"`
 *
 * Flow: UI → BookingService → BookingEngine → BookingProvider
 */

export { BookingService } from "./booking.service";
export { bookingEngine, BookingEngine } from "./engine";
export { BookingProviderFactory } from "./factory";
export { BookingError, BookingErrorCode } from "./errors";
export { BookingLogger } from "./logger";
export { registerBookingAnalyticsSink, trackBookingClick } from "./analytics";
export { useBooking, useBookingCapabilities } from "./hooks";
export { bookingConfig } from "./config";
export { getMappedRoom, listRoomSlugs } from "./config/rooms";
export { buildQloAppsHotelUrl, mapBookingLocale } from "./utils";

export { BookingProviderId, EMPTY_CAPABILITIES } from "./types";
export type {
  AvailabilityMode,
  BookingCapabilities,
  BookingConfig,
  BookingProvider,
  OpenBookingOptions,
  PaymentMode,
  ProviderRoomRef,
  RoomSlug,
  BookingAnalyticsPayload,
} from "./types";

export type {
  AvailabilityRequest,
  AvailabilityResponse,
  BookingRequest,
  BookingResponse,
  PaymentRequest,
  PaymentResponse,
} from "./api";
