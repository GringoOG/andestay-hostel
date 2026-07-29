import type { BookingProviderId, RoomSlug } from "./provider";

export type BookingAnalyticsEvent =
  | "booking_click"
  | "booking_open"
  | "booking_open_room"
  | "booking_error";

export type BookingAnalyticsPayload = {
  event: BookingAnalyticsEvent;
  provider: BookingProviderId;
  roomSlug?: RoomSlug;
  source?: string;
  url?: string;
  errorCode?: string;
  meta?: Record<string, unknown>;
};
