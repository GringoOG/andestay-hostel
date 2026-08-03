/**
 * Sanity content barrel — client, queries, mappers.
 * Import from here inside providers only (not from React components).
 */

export { sanityFetch, isSanityConfigured, SanityClientError } from "./client";
export type { SanityFetchOptions } from "./client";
export {
  roomsQuery,
  roomBySlugQuery,
  siteSettingsQuery,
  homepageQuery,
  mediaAssetsQuery,
  mediaAssetBySlugQuery,
  mediaAssetProjection,
  ROOM_FIELDS,
} from "./queries";
export { mapSanityRoom, mapSanityHomepage, mediaToContentImage } from "./mappers";
export type {
  SanityRoomDoc,
  SanityHomepageDoc,
  SanitySiteSettingsDoc,
  SanityMediaAsset,
} from "./types";
