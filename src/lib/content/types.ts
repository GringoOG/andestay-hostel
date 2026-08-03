/**
 * Content domain types — CMS-agnostic room / homepage models.
 */

export type RoomSlug =
  | "simple-room"
  | "double-room"
  | "triple-room"
  | "matrimonial-room"
  | (string & {});

export type ContentImage = {
  src: string;
  alt?: string;
};

/**
 * Who last wrote the record — for audit / sync later.
 * Unused in UI today; reserved for admin + webhooks.
 */
export type ContentActor = "Owner" | "Admin" | "System";

export type Room = {
  id: string;
  slug: RoomSlug;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  price: number;
  currency: "PEN";
  capacity: number;
  inventory: number;
  breakfastIncluded: boolean;
  dinnerIncluded: boolean;
  amenities: string[];
  coverImage: ContentImage;
  gallery: ContentImage[];
  active: boolean;
  /** Display order (ascending). */
  order: number;
  /**
   * Monotonic content revision (cache keys, ISR, sync cursors).
   * Bump when the room payload meaningfully changes.
   */
  version: number;
  /** ISO-8601 timestamp of last content change. */
  updatedAt: string;
  /** Actor that last modified this room. */
  lastModifiedBy: ContentActor;
};

export type HomeContent = {
  heroImage: ContentImage;
  aboutHeroImage: ContentImage;
  lastingImages: [ContentImage, ContentImage];
  avatarImages: ContentImage[];
};

export type ContentProviderId = "local" | "sanity" | "api";

export type ContentConfig = {
  provider: ContentProviderId;
  /** Sanity project id (when provider = sanity). */
  sanityProjectId: string;
  sanityDataset: string;
  sanityApiVersion: string;
  /** Server-only Sanity token (optional). */
  sanityApiToken: string;
  /** Future custom admin / CMS API base. */
  apiBaseUrl: string;
};
