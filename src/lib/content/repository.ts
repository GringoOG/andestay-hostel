import type { HomeContent, Room, RoomSlug } from "./types";

/**
 * ContentRepository — sole content port for the app.
 *
 * React → ContentService → ContentRepository → provider (local | sanity | api)
 */
export interface ContentRepository {
  getRooms(): Promise<Room[]>;
  getRoom(slug: RoomSlug): Promise<Room | null>;
  getHomepage(): Promise<HomeContent>;
}
