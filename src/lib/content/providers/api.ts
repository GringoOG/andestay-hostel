/**
 * Future Admin / CMS HTTP API adapter stub.
 * Activate later with NEXT_PUBLIC_CONTENT_PROVIDER=api
 * and NEXT_PUBLIC_CONTENT_API_BASE_URL.
 */

import { contentConfig } from "../config";
import type { ContentRepository } from "../repository";
import type { HomeContent, Room, RoomSlug } from "../types";

async function apiGet<T>(path: string): Promise<T> {
  const base = contentConfig.apiBaseUrl.replace(/\/$/, "");
  if (!base) {
    throw new Error(
      "Content API provider requires NEXT_PUBLIC_CONTENT_API_BASE_URL.",
    );
  }

  const res = await fetch(`${base}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Content API ${path} failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export function createApiContentProvider(): ContentRepository {
  return {
    async getRooms(): Promise<Room[]> {
      const rooms = await apiGet<Room[]>("/rooms");
      return rooms.filter((r) => r.active).sort((a, b) => a.order - b.order);
    },

    async getRoom(slug: RoomSlug): Promise<Room | null> {
      try {
        return await apiGet<Room>(`/rooms/${encodeURIComponent(String(slug))}`);
      } catch {
        return null;
      }
    },

    async getHomepage(): Promise<HomeContent> {
      return apiGet<HomeContent>("/homepage");
    },
  };
}
