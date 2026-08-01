import type { CabinId } from "@/lib/i18n";
import {
  getHotelRoom,
  getRoomNightlyPen,
  hotelRooms,
  PEN_PER_USD,
  type HotelRoomId,
} from "@/lib/hotel";

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
 * 8365 → hero (landing)
 * 8107, 8109, 8114, 8272, 8321, 8322, 8335, 8363, 8364 → used across sections
 */
export const images = {
  /** IMG_8365 — landing hero */
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

/** Marketing presentation for a cabin card (joined with hotel domain data). */
export type CabinMarketing = {
  id: CabinId;
  images: string[];
  photoLabel: string;
};

export type CabinMeta = CabinMarketing & {
  units: number;
  capacity: number;
  pricePen: number;
};

/**
 * Marketing-only fields. Inventory / capacity / price come from `@/lib/hotel`.
 */
const cabinMarketing: CabinMarketing[] = [
  {
    id: "simple-room",
    photoLabel: "Simple cabin for one guest",
    images: ["/images/lena-8109.jpg"],
  },
  {
    id: "double-room",
    photoLabel: "Double cabin with two beds",
    images: ["/images/room-double-01.jpg", "/images/room-double-02.jpg"],
  },
  {
    id: "triple-room",
    photoLabel: "Triple cabin with three beds",
    images: ["/images/room-triple-01.jpg", "/images/room-triple-02.jpg"],
  },
  {
    id: "matrimonial-room",
    photoLabel: "Matrimonial cabin with double bed",
    images: ["/images/lena-8364.jpg"],
  },
];

function toCabinMeta(m: CabinMarketing): CabinMeta {
  const roomId = m.id as HotelRoomId;
  const room = getHotelRoom(roomId);
  return {
    ...m,
    units: room?.inventory ?? 1,
    capacity: room?.capacity ?? 1,
    pricePen: getRoomNightlyPen(roomId),
  };
}

/**
 * Cabin cards for the website — marketing + hotel operational join.
 * Order follows `hotelRooms`.
 */
export const cabins: CabinMeta[] = hotelRooms.map((room) => {
  const marketing = cabinMarketing.find((c) => c.id === room.id);
  if (!marketing) {
    throw new Error(`Missing marketing presentation for room "${room.id}"`);
  }
  return toCabinMeta(marketing);
});

/** Re-export for existing imports — source of truth is `@/lib/hotel/rates`. */
export { PEN_PER_USD };

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
