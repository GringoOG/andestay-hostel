import type { SchemaTypeDefinition } from "sanity";
import { homepage } from "./homepage";
import { mediaAsset } from "./mediaAsset";
import { room } from "./room";
import { siteSettings } from "./siteSettings";

/**
 * Schema registry.
 * Done: Room, SiteSettings, MediaAsset, Homepage
 * Next: ContentRepository wiring + .env.local
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  mediaAsset,
  room,
  siteSettings,
  homepage,
];
