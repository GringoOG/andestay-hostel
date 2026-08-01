export enum BookingProviderId {
  QLOAPPS = "qloapps",
  CUSTOM = "custom",
  CLOUDBEDS = "cloudbeds",
  SIRVOY = "sirvoy",
  BOOKING = "booking",
}

/** How the guest settles payment with this provider / hotel. */
export type PaymentMode = "none" | "offline" | "deposit" | "online";

/** How availability is sourced for this provider. */
export type AvailabilityMode = "none" | "cached" | "live";

/**
 * Provider capability surface.
 * Booleans kept for backward compatibility; prefer *Mode fields for new logic.
 */
export type BookingCapabilities = {
  supportsPayments: boolean;
  supportsCalendar: boolean;
  supportsCoupons: boolean;
  supportsAvailability: boolean;
  supportsGuests: boolean;

  paymentMode: PaymentMode;
  availabilityMode: AvailabilityMode;

  /** Optional richer flags — default false / omit until needed. */
  supportsRealtimeAvailability?: boolean;
  supportsOnlinePayment?: boolean;
  supportsPromoCodes?: boolean;
  supportsPartialPayment?: boolean;
  supportsMultiHotel?: boolean;
  supportsDynamicPricing?: boolean;
  supportsCalendarSync?: boolean;
  supportsInvoices?: boolean;
};

export type OpenBookingOptions = {
  newTab?: boolean;
  /** Optional UI source for analytics (e.g. "navbar", "room-card"). */
  source?: string;
  /** How many units of this room type to book (default 1). */
  quantity?: number;
};

/**
 * Website room identity is always a stable slug (e.g. "double-room").
 * Providers map slug → their internal product / room id.
 */
export type RoomSlug = string;

export type ProviderRoomRef = {
  /** External product / room id in the provider system. */
  externalId: string;
  /** Optional full URL override for this room. */
  url?: string;
  path?: string;
  query?: Record<string, string>;
};

export type BookingConfig = {
  provider: BookingProviderId;
  enabled: boolean;
  openInNewTab: boolean;
  external: boolean;
  baseUrl: string;
  defaultPath: string;
};

/**
 * Interchangeable booking provider (adapter).
 * Providers communicate with QloApps / custom API / OTAs only — no business rules.
 */
export interface BookingProvider {
  readonly id: BookingProviderId;
  readonly capabilities: BookingCapabilities;

  open(options?: OpenBookingOptions): void;
  openRoom(roomSlug: RoomSlug, options?: OpenBookingOptions): void;
  getUrl(): string;
  getRoomUrl(roomSlug: RoomSlug, options?: OpenBookingOptions): string;
}
