/**
 * Map Sanity documents → ContentRepository domain types (UI-stable).
 */

import type { ContentImage, HomeContent, Room } from "../types";
import type {
  SanityHomepageDoc,
  SanityMediaAsset,
  SanityRoomDoc,
} from "./types";

export function mediaToContentImage(
  asset: SanityMediaAsset | null | undefined,
  fallbackAlt = "",
): ContentImage | null {
  const src = asset?.url?.trim();
  if (!src) return null;
  return {
    src,
    alt: asset?.altText?.trim() || asset?.title?.trim() || fallbackAlt || undefined,
  };
}

export function mapSanityRoom(doc: SanityRoomDoc): Room | null {
  const slug = doc.slug?.trim() || doc.id?.trim();
  if (!slug) return null;

  const title = doc.name?.trim() || slug;
  const cover =
    mediaToContentImage(doc.coverImage, title) ||
    mediaToContentImage(doc.heroImage, title);

  if (!cover) {
    // Room without resolvable image — skip (incomplete CMS entry)
    return null;
  }

  const gallery: ContentImage[] = [];
  const hero = mediaToContentImage(doc.heroImage, title);
  if (hero && hero.src !== cover.src) {
    gallery.push(hero);
  }
  for (const item of doc.gallery ?? []) {
    const img = mediaToContentImage(item, title);
    if (img && img.src !== cover.src && !gallery.some((g) => g.src === img.src)) {
      gallery.push(img);
    }
  }

  return {
    id: doc.id?.trim() || doc._id?.trim() || slug,
    slug,
    title,
    subtitle: doc.photoLabel?.trim() || "",
    shortDescription: doc.shortDescription?.trim() || "",
    description: doc.description?.trim() || "",
    price: typeof doc.pricePen === "number" ? doc.pricePen : 0,
    currency: "PEN",
    capacity:
      typeof doc.capacityAdults === "number" ? doc.capacityAdults : 1,
    inventory: typeof doc.units === "number" ? doc.units : 1,
    breakfastIncluded: Boolean(doc.breakfastIncluded),
    dinnerIncluded: Boolean(doc.dinnerIncluded),
    amenities: Array.isArray(doc.amenities)
      ? doc.amenities.filter((a): a is string => typeof a === "string")
      : [],
    coverImage: cover,
    gallery,
    active: doc.active !== false,
    order: typeof doc.order === "number" ? doc.order : 0,
    version: 1,
    updatedAt: doc._updatedAt?.trim() || new Date(0).toISOString(),
    lastModifiedBy: "Admin",
  };
}

/**
 * Map Sanity Homepage → existing HomeContent shape used by UI helpers.
 * Extra CMS fields (features, portable text, CTAs) stay available via queries
 * for a future homepage service — not required by current interface.
 */
export function mapSanityHomepage(
  doc: SanityHomepageDoc | null,
): HomeContent | null {
  if (!doc) return null;

  const hero = mediaToContentImage(doc.heroMedia, doc.heroTitle || "AndeStay Hostel");
  const about = mediaToContentImage(
    doc.aboutImage,
    doc.aboutTitle || "AndeStay Hostel",
  );

  if (!hero) return null;

  const galleryImgs = (doc.galleryItems ?? [])
    .map((item) => mediaToContentImage(item))
    .filter((img): img is ContentImage => img !== null);

  const lastingA = galleryImgs[0] ?? about ?? hero;
  const lastingB = galleryImgs[1] ?? lastingA;

  return {
    heroImage: hero,
    aboutHeroImage: about ?? hero,
    lastingImages: [lastingA, lastingB],
    avatarImages: galleryImgs.slice(2, 6),
  };
}
