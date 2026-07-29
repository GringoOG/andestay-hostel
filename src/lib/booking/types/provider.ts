export enum BookingProviderId {
  QLOAPPS = "qloapps",
  CUSTOM = "custom",
  CLOUDBEDS = "cloudbeds",
  SIRVOY = "sirvoy",
  BOOKING = "booking",
}

export type BookingCapabilities = {
  supportsPayments: boolean;
  supportsCalendar: boolean;
  supportsCoupons: boolean;
  supportsAvailability: boolean;
  supportsGuests: boolean;
};

export type OpenBookingOptions = {
  newTab?: boolean;
  /** Optional UI source for analytics (e.g. "navbar", "room-card"). */
  source?: string;
};

/**
 * Website room identity is always a stable slug (e.g. "lake-cabana").
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
 * All providers implement the same surface.
 */
export interface BookingProvider {
  readonly id: BookingProviderId;
  readonly capabilities: BookingCapabilities;

  open(options?: OpenBookingOptions): void;
  openRoom(roomSlug: RoomSlug, options?: OpenBookingOptions): void;
  getUrl(): string;
  getRoomUrl(roomSlug: RoomSlug): string;
}
