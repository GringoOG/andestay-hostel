/**
 * Sanity content provider + local fallback.
 *
 * Primary: Sanity Content Lake (project nnfu4wmn / production).
 * Fallback: local hotel/ + site-data when:
 *   - network / API error
 *   - Sanity returns empty rooms / incomplete homepage
 *   - project id missing
 *
 * React never imports this module — only ContentService / factory.
 */

import { createLocalContentProvider } from "./local";
import type { ContentRepository } from "../repository";
import type { HomeContent, Room, RoomSlug } from "../types";
import {
  homepageQuery,
  isSanityConfigured,
  mapSanityHomepage,
  mapSanityRoom,
  roomBySlugQuery,
  roomsQuery,
  sanityFetch,
  type SanityHomepageDoc,
  type SanityRoomDoc,
} from "../sanity";

function createSanityOnlyProvider(): ContentRepository {
  return {
    async getRooms(): Promise<Room[]> {
      const docs = await sanityFetch<SanityRoomDoc[]>(roomsQuery);
      return docs
        .map(mapSanityRoom)
        .filter((r): r is Room => r !== null)
        .filter((r) => r.active)
        .sort((a, b) => a.order - b.order);
    },

    async getRoom(slug: RoomSlug): Promise<Room | null> {
      const doc = await sanityFetch<SanityRoomDoc | null>(roomBySlugQuery, {
        params: { slug: String(slug) },
      });
      if (!doc) return null;
      const room = mapSanityRoom(doc);
      if (!room || !room.active) return null;
      return room;
    },

    async getHomepage(): Promise<HomeContent> {
      const doc = await sanityFetch<SanityHomepageDoc | null>(homepageQuery);
      const mapped = mapSanityHomepage(doc);
      if (!mapped) {
        throw new Error("Sanity homepage missing or incomplete (no hero media).");
      }
      return mapped;
    },
  };
}

function logFallback(method: string, reason: unknown): void {
  const message =
    reason instanceof Error ? reason.message : String(reason ?? "unknown");
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[content] Sanity ${method} → local fallback: ${message}`);
  }
}

/**
 * Sanity provider with robust local fallback.
 * Preserves ContentRepository interface for UI.
 */
export function createSanityContentProvider(): ContentRepository {
  const local = createLocalContentProvider();

  if (!isSanityConfigured()) {
    logFallback("init", "Sanity not configured (missing project id)");
    return local;
  }

  const sanity = createSanityOnlyProvider();

  return {
    async getRooms(): Promise<Room[]> {
      try {
        const rooms = await sanity.getRooms();
        if (rooms.length === 0) {
          logFallback("getRooms", "empty result");
          return local.getRooms();
        }
        return rooms;
      } catch (err) {
        logFallback("getRooms", err);
        return local.getRooms();
      }
    },

    async getRoom(slug: RoomSlug): Promise<Room | null> {
      try {
        const room = await sanity.getRoom(slug);
        if (!room) {
          // Prefer local twin if Sanity has no document yet
          return local.getRoom(slug);
        }
        return room;
      } catch (err) {
        logFallback("getRoom", err);
        return local.getRoom(slug);
      }
    },

    async getHomepage(): Promise<HomeContent> {
      try {
        return await sanity.getHomepage();
      } catch (err) {
        logFallback("getHomepage", err);
        return local.getHomepage();
      }
    },
  };
}
