/**
 * Public content barrel.
 *
 * Architecture:
 *   React → ContentService / HotelService → ContentRepository → provider
 *     ├── local  (site-data + hotel/)
 *     ├── sanity — Sanity API + automatic local fallback
 *     └── api    — future admin / Postgres / Supabase / Payload
 *
 * UI must not import Sanity client/SDK. Switch with NEXT_PUBLIC_CONTENT_PROVIDER.
 */

export { contentConfig } from "./config";
export { ContentProviderFactory } from "./factory";
export type { ContentRepository } from "./repository";
export { ContentService, HotelService } from "./service";
export { buildLocalRooms } from "./providers/local";
export { roomToCabinMeta, type CabinMeta, type CabinMarketing } from "./cabinMeta";

export type {
  ContentActor,
  ContentConfig,
  ContentImage,
  ContentProviderId,
  HomeContent,
  Room,
  RoomSlug,
} from "./types";

export {
  site,
  sitePhones,
  telHref,
  whatsappHref,
  navHrefs,
  images,
  cabinMarketing,
  PEN_PER_USD,
  priceUsdFromPen,
  formatRoomPrice,
  aboutCardImages,
  aboutGalleryImages,
  testimonialAvatars,
  type SitePhone,
} from "./site-data";

import { buildLocalRooms } from "./providers/local";
import { roomToCabinMeta, type CabinMeta } from "./cabinMeta";

/**
 * Cabin cards for the website — local join (sync) for existing client components.
 * Async / Sanity path: ContentService.getRooms() + roomToCabinMeta.
 */
export const cabins: CabinMeta[] = buildLocalRooms().map(roomToCabinMeta);
