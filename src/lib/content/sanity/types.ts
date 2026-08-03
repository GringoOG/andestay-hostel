/**
 * Sanity document shapes returned by GROQ (before mapping to ContentRepository).
 */

export type SanityMediaAsset = {
  _id?: string;
  title?: string;
  altText?: string;
  caption?: string;
  url?: string | null;
  lqip?: string | null;
  width?: number;
  height?: number;
  category?: string;
  assetType?: string;
};

export type SanityRoomDoc = {
  _id?: string;
  _updatedAt?: string;
  id?: string;
  slug?: string;
  name?: string;
  photoLabel?: string;
  shortDescription?: string;
  description?: string;
  pricePen?: number;
  capacityAdults?: number;
  capacityChildren?: number;
  units?: number;
  beds?: string;
  size?: string;
  breakfastIncluded?: boolean;
  dinnerIncluded?: boolean;
  amenities?: string[];
  active?: boolean;
  order?: number;
  featured?: boolean;
  badge?: string;
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: SanityMediaAsset | null;
  heroImage?: SanityMediaAsset | null;
  gallery?: Array<SanityMediaAsset | null> | null;
};

export type SanityHomepageDoc = {
  _id?: string;
  _updatedAt?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  aboutTitle?: string;
  aboutText?: unknown[];
  gallerySectionTitle?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  features?: Array<{
    icon?: string;
    title?: string;
    description?: string;
  }>;
  heroMedia?: SanityMediaAsset | null;
  aboutImage?: SanityMediaAsset | null;
  galleryItems?: Array<SanityMediaAsset | null> | null;
};

export type SanitySiteSettingsDoc = {
  _id?: string;
  siteTitle?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  googleMapsUrl?: string;
  facebook?: string;
  instagram?: string;
  bookingCom?: string;
  airbnb?: string;
  tripadvisor?: string;
  copyright?: string;
  footerText?: string;
  checkInTime?: string;
  checkOutTime?: string;
  breakfastTime?: string;
  dinnerTime?: string;
  defaultCurrency?: string;
  locale?: string;
  logo?: { alt?: string; url?: string | null };
  favicon?: { url?: string | null };
  heroImage?: { alt?: string; url?: string | null };
  ogImage?: { alt?: string; url?: string | null };
};
