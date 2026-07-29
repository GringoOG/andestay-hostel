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
 * 8365 → hero (landing — do not replace)
 * 8107, 8109, 8114, 8272, 8321, 8322, 8335, 8363, 8364 → used across sections
 */
export const images = {
  /** IMG_8365 — fixed landing hero */
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
  pricePen: number;
  image: string;
  photoLabel: string;
};

export const cabins: CabinMeta[] = [
  {
    id: "double-room",
    pricePen: 98,
    photoLabel: "Double room interior",
    image: "/images/room-interior.jpg",
  },
  {
    id: "family-room",
    pricePen: 98,
    photoLabel: "Family cabin with valley view",
    image: "/images/lena-8364.jpg",
  },
  {
    id: "triple-room",
    pricePen: 158,
    photoLabel: "Triple room with three beds",
    image: "/images/room-triple.jpg",
  },
  {
    id: "deluxe-room",
    pricePen: 130,
    photoLabel: "Deluxe cabin",
    image: "/images/lena-8109.jpg",
  },
  {
    id: "deluxe-family-room",
    pricePen: 150,
    photoLabel: "Deluxe family cabin",
    image: "/images/lena-8363.jpg",
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
