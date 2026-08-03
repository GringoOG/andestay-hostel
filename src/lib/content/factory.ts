import { contentConfig } from "./config";
import {
  createApiContentProvider,
  createLocalContentProvider,
  createSanityContentProvider,
} from "./providers";
import type { ContentRepository } from "./repository";
import type { ContentProviderId } from "./types";

type ProviderFactoryFn = () => ContentRepository;

/**
 * ContentProviderFactory — same pattern as BookingProviderFactory.
 *
 * ContentService
 *        │
 *        ▼
 * ContentProviderFactory
 *        ├── LocalContentProvider
 *        ├── SanityContentProvider
 *        └── ApiContentProvider (future admin / Postgres / Supabase / Payload)
 */
export class ContentProviderFactory {
  private static readonly registry = new Map<ContentProviderId, ProviderFactoryFn>([
    ["local", createLocalContentProvider],
    ["sanity", createSanityContentProvider],
    ["api", createApiContentProvider],
  ]);

  static register(id: ContentProviderId, factory: ProviderFactoryFn): void {
    this.registry.set(id, factory);
  }

  static has(id: ContentProviderId): boolean {
    return this.registry.has(id);
  }

  static create(id: ContentProviderId): ContentRepository {
    const factory = this.registry.get(id);
    if (!factory) {
      throw new Error(`No content provider registered for "${id}".`);
    }
    return factory();
  }

  /** Active provider from NEXT_PUBLIC_CONTENT_PROVIDER (default: local). */
  static createActive(): ContentRepository {
    return this.create(contentConfig.provider);
  }
}
