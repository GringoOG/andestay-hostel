/**
 * BookingEngine — domain orchestration between BookingService and providers.
 *
 * Providers only talk to QloApps / custom API / OTAs.
 * Business rules (min nights, promos, fees, seasonal pricing, cancel) belong here.
 *
 * Phase 1: passthrough to the active provider (identical runtime behavior).
 */

import { BookingProviderFactory } from "../factory";
import type {
  BookingCapabilities,
  BookingProvider,
  OpenBookingOptions,
  RoomSlug,
} from "../types";

export class BookingEngine {
  constructor(private readonly resolveProvider: () => BookingProvider) {}

  private provider(): BookingProvider {
    return this.resolveProvider();
  }

  capabilities(): BookingCapabilities {
    return this.provider().capabilities;
  }

  getUrl(): string {
    return this.provider().getUrl();
  }

  getRoomUrl(roomSlug: RoomSlug, options: OpenBookingOptions = {}): string {
    // Future: validate quantity vs hotel inventory, attach rate snapshot, etc.
    return this.provider().getRoomUrl(roomSlug, options);
  }

  open(options: OpenBookingOptions = {}): void {
    this.provider().open(options);
  }

  openRoom(roomSlug: RoomSlug, options: OpenBookingOptions = {}): void {
    // Future: enforce policies.minNights, clamp quantity, apply promo.
    this.provider().openRoom(roomSlug, options);
  }
}

/** Singleton engine — always uses the env-selected provider. */
export const bookingEngine = new BookingEngine(() =>
  BookingProviderFactory.createActive(),
);
