/**
 * ContentService / HotelService
 *
 * UI → ContentService → ContentRepository → provider (local | sanity | api)
 *
 * React never imports Sanity SDK or provider internals.
 * Swap source with NEXT_PUBLIC_CONTENT_PROVIDER only.
 */

import { ContentProviderFactory } from "./factory";
import type { ContentRepository } from "./repository";
import type { HomeContent, Room, RoomSlug } from "./types";

export class ContentService {
  private static repo: ContentRepository | null = null;

  private static getRepo(): ContentRepository {
    if (!this.repo) {
      this.repo = ContentProviderFactory.createActive();
    }
    return this.repo;
  }

  /** Reset cached provider (tests / hot provider switch). */
  static reset(): void {
    this.repo = null;
  }

  static getRooms(): Promise<Room[]> {
    return this.getRepo().getRooms();
  }

  static getRoom(slug: RoomSlug): Promise<Room | null> {
    return this.getRepo().getRoom(slug);
  }

  static getHomepage(): Promise<HomeContent> {
    return this.getRepo().getHomepage();
  }
}

/**
 * Alias — hotel/ops-facing name for the same content port.
 * Prefer ContentService in marketing UI; HotelService in booking-adjacent code.
 */
export const HotelService = ContentService;
