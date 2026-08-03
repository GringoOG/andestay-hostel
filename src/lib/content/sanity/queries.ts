/**
 * GROQ projections aligned with studio schemas:
 * room, siteSettings, homepage, mediaAsset
 */

/** Shared mediaAsset → { url, altText, title } */
export const mediaAssetProjection = `{
  _id,
  title,
  altText,
  caption,
  "url": image.asset->url,
  "lqip": image.asset->metadata.lqip,
  width,
  height,
  category,
  assetType
}`;

export const ROOM_FIELDS = `
  _id,
  _updatedAt,
  id,
  "slug": slug.current,
  name,
  photoLabel,
  shortDescription,
  description,
  pricePen,
  capacityAdults,
  capacityChildren,
  units,
  beds,
  size,
  breakfastIncluded,
  dinnerIncluded,
  amenities,
  active,
  order,
  featured,
  badge,
  seoTitle,
  seoDescription,
  coverImage->${mediaAssetProjection},
  heroImage->${mediaAssetProjection},
  gallery[]->${mediaAssetProjection}
`;

export const roomsQuery = `*[_type == "room" && active != false] | order(order asc) {
  ${ROOM_FIELDS}
}`;

export const roomBySlugQuery = `*[_type == "room" && slug.current == $slug][0] {
  ${ROOM_FIELDS}
}`;

export const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  _id,
  _updatedAt,
  siteTitle,
  tagline,
  description,
  email,
  phone,
  whatsapp,
  address,
  googleMapsUrl,
  facebook,
  instagram,
  bookingCom,
  airbnb,
  tripadvisor,
  heroTitle,
  heroSubtitle,
  heroButtonText,
  heroButtonLink,
  seoTitle,
  seoDescription,
  copyright,
  footerText,
  checkInTime,
  checkOutTime,
  breakfastTime,
  dinnerTime,
  defaultCurrency,
  locale,
  "logo": logo{ alt, "url": asset->url },
  "favicon": favicon{ "url": asset->url },
  "heroImage": heroImage{ alt, "url": asset->url },
  "ogImage": ogImage{ alt, "url": asset->url }
}`;

export const homepageQuery = `*[_type == "homepage" && _id == "homepage"][0]{
  _id,
  _updatedAt,
  heroTitle,
  heroSubtitle,
  ctaText,
  ctaLink,
  aboutTitle,
  aboutText,
  gallerySectionTitle,
  ctaTitle,
  ctaDescription,
  ctaButtonText,
  ctaButtonLink,
  features[]{
    icon,
    title,
    description
  },
  heroMedia->${mediaAssetProjection},
  aboutImage->${mediaAssetProjection},
  galleryItems[]->${mediaAssetProjection}
}`;

export const mediaAssetsQuery = `*[_type == "mediaAsset"] | order(category asc, order asc) {
  ${mediaAssetProjection},
  slug,
  tags,
  featured,
  order,
  copyright,
  videoUrl,
  "fileUrl": file.asset->url
}`;

export const mediaAssetBySlugQuery = `*[_type == "mediaAsset" && slug.current == $slug][0] {
  ${mediaAssetProjection},
  slug,
  tags,
  featured,
  order,
  copyright,
  videoUrl,
  "fileUrl": file.asset->url
}`;
