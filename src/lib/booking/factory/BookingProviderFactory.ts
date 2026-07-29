import { BookingError, BookingErrorCode } from "../errors";
import { BookingLogger } from "../logger";
import {
  createBookingComProvider,
  createCloudbedsProvider,
  createCustomProvider,
  createQloAppsProvider,
  createSirvoyProvider,
} from "../providers";
import {
  BookingProviderId,
  type BookingProvider,
} from "../types";
import { bookingConfig } from "../config";

type ProviderFactoryFn = () => BookingProvider;

/**
 * BookingProviderFactory
 *
 * BookingService
 *        │
 *        ▼
 * BookingProviderFactory
 *        ├── QloAppsProvider
 *        ├── CustomProvider
 *        ├── CloudbedsProvider
 *        └── SirvoyProvider
 *
 * Adding a provider = new file + register() — no if/else chains in the service.
 */
export class BookingProviderFactory {
  private static readonly registry = new Map<BookingProviderId, ProviderFactoryFn>([
    [BookingProviderId.QLOAPPS, createQloAppsProvider],
    [BookingProviderId.CUSTOM, createCustomProvider],
    [BookingProviderId.CLOUDBEDS, createCloudbedsProvider],
    [BookingProviderId.SIRVOY, createSirvoyProvider],
    [BookingProviderId.BOOKING, createBookingComProvider],
  ]);

  static register(id: BookingProviderId, factory: ProviderFactoryFn): void {
    this.registry.set(id, factory);
    BookingLogger.info("provider_registered", { provider: id });
  }

  static has(id: BookingProviderId): boolean {
    return this.registry.has(id);
  }

  static create(id: BookingProviderId): BookingProvider {
    const factory = this.registry.get(id);
    if (!factory) {
      throw new BookingError(
        BookingErrorCode.PROVIDER_NOT_REGISTERED,
        `No booking provider registered for "${id}".`,
      );
    }
    return factory();
  }

  /** Active provider from NEXT_PUBLIC_BOOKING_PROVIDER. */
  static createActive(): BookingProvider {
    return this.create(bookingConfig.provider);
  }
}
