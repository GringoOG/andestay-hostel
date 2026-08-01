import type { CabinId } from "@/lib/i18n";

export const site = {
  name: "AndeStay Hostel",
  tagline: "Your base in the Andes.",
  location: "Colpapampa",
  email: "hello@andestayhostel.com",
  phone: "+51 000 000 000",
  phoneHref: "tel:+51000000000",
  address: "Colpapampa, Peru",
  mapsUrl: "https://maps.google.com/?q=Colpapampa+Peru",
};

export const navHrefs = [
  { href: "/", key: "home" as const },
  { href: "/the-cabana", key: "about" as const },
  { href: "/accommodation", key: "rooms" as const },
  { href: "/contact", key: "contact" as const },
] as const;

/**
 * Photo map (foto Leňa):
 * hero.jpg — landing hero (complex / cabins overview)
 * 8107, 8109, 8114, 8272, 8321, 8322, 8335, 8363, 8364 → used across sections
 */
export const images = {
  /** Landing hero — property overview */
  hero: "/images/hero.jpg",
  /** IMG_8322 */
  aboutHero: "/images/lena-8322.jpg",
  lastingA: "/images/lena-8321.jpg",
  lastingB: "/images/lena-8335.jpg",
  avatars: [
    "/images/avatar-1.jpg",
    "/images/avatar-2.jpg",
    "/images/avatar-3.jpg",
    "/images/avatar-4.jpg",
  ],
} as const;

export type CabinMeta = {
  id: CabinId;
  /** Inventory count for this room type (how many physical cabins). */
  units: number;
  /** Capacity (adults) — used for price context. */
  capacity: number;
  pricePen: number;
  /**
   * Gallery for the cabin card carousel.
   * First image = cover / opening photo.
   */
  images: string[];
  photoLabel: string;
};

/**
 * Client inventory (display order):
 * 1 simple · 4 dobles · 1 triple · 3 matrimonial
 *
 * Add more paths to `images` as photos arrive; index 0 stays the cover.
 */
export const cabins: CabinMeta[] = [
  {
    id: "simple-room",
    units: 1,
    capacity: 1,
    pricePen: 80,
    photoLabel: "Simple cabin for one guest",
    images: ["/images/lena-8109.jpg"],
  },
  {
    id: "double-room",
    units: 4,
    capacity: 2,
    pricePen: 120,
    photoLabel: "Double cabin with two beds",
    images: ["/images/room-double-01.jpg", "/images/room-double-02.jpg"],
  },
  {
    id: "triple-room",
    units: 1,
    capacity: 3,
    pricePen: 180,
    photoLabel: "Triple cabin with three beds",
    images: ["/images/room-triple-01.jpg", "/images/room-triple-02.jpg"],
  },
  {
    id: "matrimonial-room",
    units: 3,
    capacity: 2,
    pricePen: 120,
    photoLabel: "Matrimonial cabin with double bed",
    images: ["/images/lena-8364.jpg"],
  },
];

/** Approx. soles per USD for display (rates change; PEN is the source of truth). */
export const PEN_PER_USD = 3.4;

export function priceUsdFromPen(pricePen: number): number {
  return Math.round(pricePen / PEN_PER_USD);
}

export function formatRoomPrice(pricePen: number): { usd: number; pen: number; label: string } {
  const usd = priceUsdFromPen(pricePen);
  return {
    usd,
    pen: pricePen,
    label: `$${usd} · PEN ${pricePen}`,
  };
}

export const aboutCardImages = [
  "/images/lena-8109.jpg",
  "/images/lena-8114.jpg",
  "/images/lena-8363.jpg",
  "/images/lena-8321.jpg",
] as const;

export const aboutGalleryImages = [
  "/images/lena-8107.jpg",
  "/images/lena-8109.jpg",
  "/images/lena-8114.jpg",
  "/images/lena-8272.jpg",
  "/images/lena-8321.jpg",
  "/images/lena-8322.jpg",
  "/images/lena-8335.jpg",
  "/images/lena-8363.jpg",
  "/images/lena-8364.jpg",
  "/images/lena-8365.jpg",
] as const;

export const testimonialAvatars = [
  "/images/avatar-jonas.jpg",
  "/images/avatar-2.jpg",
  "/images/avatar-3.jpg",
  "/images/avatar-tomas.jpg",
  "/images/avatar-maria.jpg",
  "/images/avatar-pedro.jpg",
] as const;
