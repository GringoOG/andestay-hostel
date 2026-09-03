/**
 * Site / marketing static data (local source only).
 * Consumed by ContentRepository local provider — not by React directly long-term.
 */

import type { CabinId } from "@/lib/i18n";
import { PEN_PER_USD } from "@/lib/hotel";

export type SitePhone = {
  /** Display label, e.g. +51 906 067 917 */
  label: string;
  /** E.164 digits without + — for tel: and wa.me */
  e164: string;
};

export const sitePhones: SitePhone[] = [
  { label: "+51 906 067 917", e164: "51906067917" },
  { label: "+51 958 163 200", e164: "51958163200" },
];

export const site = {
  name: "AndeStay Hostel",
  tagline: "Your base in the Andes.",
  location: "Colpapampa",
  email: "andestayhostel@gmail.com",
  /** @deprecated use sitePhones — kept for single-number fallbacks */
  phone: sitePhones[0].label,
  phoneHref: `tel:+${sitePhones[0].e164}`,
  phones: sitePhones,
  /** Primary WhatsApp (footer / quick actions) — first number */
  whatsappUrl: `https://wa.me/${sitePhones[0].e164}`,
  address: "CU-109 Cabañas, Colpapampa, Peru",
  /** WGS84 — AndeStay Hostel Colpapampa */
  lat: -13.32624,
  lng: -72.666575,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=-13.32624%2C-72.666575",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=-13.32624,-72.666575&z=15&hl=es&output=embed",
  instagramUrl: "https://www.instagram.com/andestayhostel",
  tiktokUrl: "https://www.tiktok.com/@andestayhostel",
};

export function telHref(phone: SitePhone): string {
  return `tel:+${phone.e164}`;
}

export function whatsappHref(phone: SitePhone): string {
  return `https://wa.me/${phone.e164}`;
}

export const navHrefs = [
  { href: "/", key: "home" as const },
  { href: "/the-cabana", key: "about" as const },
  { href: "/accommodation", key: "rooms" as const },
  { href: "/transport", key: "transport" as const },
  { href: "/contact", key: "contact" as const },
] as const;

/**
 * Photo map (foto Leňa):
 * 8365 → hero (landing)
 * 8107, 8109, 8114, 8272, 8321, 8322, 8335, 8363, 8364 → used across sections
 */
export const images = {
  /** IMG_8365 — landing hero (tablet / desktop) */
  hero: "/images/hero.jpg",
  /** Portrait hero — phones only (< md) */
  heroMobile: "/images/hero-mobile.jpg",
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

/**
 * Marketing-only fields. Inventory / capacity / price come from `@/lib/hotel`
 * via the local ContentRepository provider.
 */
export const cabinMarketing: CabinMarketing[] = [
  {
    id: "simple-room",
    photoLabel: "Simple cabin for one guest",
    images: ["/images/room-double-01.jpg", "/images/room-double-02.jpg"],
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

export { PEN_PER_USD };

export function priceUsdFromPen(pricePen: number): number {
  return Math.round(pricePen / PEN_PER_USD);
}

export function formatRoomPrice(pricePen: number): {
  usd: number;
  pen: number;
  label: string;
} {
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
