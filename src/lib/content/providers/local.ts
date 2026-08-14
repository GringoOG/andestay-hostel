/**
 * Local content provider — today’s hotel/ + site-data.
 * Output matches the pre-repository cabin join exactly.
 */

import {
  getRoomNightlyPen,
  hotelPolicies,
  hotelRooms,
  type HotelRoomId,
} from "@/lib/hotel";
import { cabinMarketing, images } from "../site-data";
import type { ContentRepository } from "../repository";
import type { HomeContent, Room, RoomSlug } from "../types";

/** Canonical English room copy for the content model (UI still uses i18n). */
const roomCopy: Record<
  HotelRoomId,
  {
    title: string;
    shortDescription: string;
    description: string;
    amenities: string[];
  }
> = {
  "simple-room": {
    title: "Simple cabana",
    shortDescription: "A private cabin for solo travelers resting after the trail.",
    description: "A private cabin for solo travelers resting after the trail.",
    amenities: ["1 single bed", "Hot shower", "Free Wi-Fi"],
  },
  "double-room": {
    title: "Double cabana",
    shortDescription: "Two single beds for a comfortable night after the trail.",
    description: "Two single beds for a comfortable night after the trail.",
    amenities: ["2 single beds", "Hot shower", "Free Wi-Fi"],
  },
  "triple-room": {
    title: "Triple cabana",
    shortDescription: "Three single beds for friends and small hiking groups.",
    description: "Three single beds for friends and small hiking groups.",
    amenities: ["3 single beds", "Hot shower", "Free Wi-Fi"],
  },
  "matrimonial-room": {
    title: "Matrimonial cabana",
    shortDescription: "One large double bed for couples after the trek.",
    description: "One large double bed for couples after the trek.",
    amenities: ["1 large double bed", "Hot shower", "Free Wi-Fi"],
  },
};

function mealsFlags(): { breakfastIncluded: boolean; dinnerIncluded: boolean } {
  return {
    breakfastIncluded: hotelPolicies.mealsIncluded.includes("breakfast"),
    dinnerIncluded: hotelPolicies.mealsIncluded.includes("dinner"),
  };
}

/**
 * Stable seed stamp for local catalog — do not use Date.now()
 * (would bust cache / ISR identity on every request).
 * Bump LOCAL_CONTENT_VERSION when hotel/ or site-data room payload changes.
 */
const LOCAL_CONTENT_VERSION = 1;
const LOCAL_UPDATED_AT = "2026-08-03T00:00:00.000Z";

/**
 * Sync room catalog — same join order as former `content.ts` cabins.
 * Used by LocalContentProvider and backward-compatible `cabins` export.
 */
export function buildLocalRooms(): Room[] {
  const meals = mealsFlags();

  return hotelRooms.map((hotelRoom, index) => {
    const marketing = cabinMarketing.find((c) => c.id === hotelRoom.id);
    if (!marketing) {
      throw new Error(`Missing marketing presentation for room "${hotelRoom.id}"`);
    }

    const copy = roomCopy[hotelRoom.id];
    const [cover, ...rest] = marketing.images;
    const coverSrc = cover ?? "/images/hero.jpg";

    return {
      id: hotelRoom.id,
      slug: hotelRoom.id,
      title: copy.title,
      subtitle: marketing.photoLabel,
      shortDescription: copy.shortDescription,
      description: copy.description,
      price: getRoomNightlyPen(hotelRoom.id),
      currency: "PEN" as const,
      capacity: hotelRoom.capacity,
      inventory: hotelRoom.inventory,
      breakfastIncluded: meals.breakfastIncluded,
      dinnerIncluded: meals.dinnerIncluded,
      amenities: copy.amenities,
      coverImage: { src: coverSrc, alt: marketing.photoLabel },
      gallery: rest.map((src) => ({ src, alt: marketing.photoLabel })),
      active: true,
      order: index,
      version: LOCAL_CONTENT_VERSION,
      updatedAt: LOCAL_UPDATED_AT,
      lastModifiedBy: "System",
    };
  });
}

export function createLocalContentProvider(): ContentRepository {
  return {
    async getRooms(): Promise<Room[]> {
      return buildLocalRooms().filter((r) => r.active);
    },

    async getRoom(slug: RoomSlug): Promise<Room | null> {
      const room = buildLocalRooms().find((r) => r.slug === slug && r.active);
      return room ?? null;
    },

    async getHomepage(): Promise<HomeContent> {
      return {
        heroImage: {
          src: images.hero,
          alt: "Wooden A-frame cabins at AndeStay Hostel in Colpapampa on the Salkantay Trek",
        },
        aboutHeroImage: {
          src: images.aboutHero,
          alt: "AndeStay Hostel cabins and mountain views in Colpapampa on the Salkantay Trek",
        },
        lastingImages: [
          {
            src: images.lastingA,
            alt: "Misty Andean mountains near AndeStay Hostel on the Salkantay Trek",
          },
          {
            src: images.lastingB,
            alt: "AndeStay Hostel wooden cabins at dusk in Colpapampa",
          },
        ],
        avatarImages: images.avatars.map((src) => ({
          src,
          alt: "AndeStay Hostel guest",
        })),
      };
    },
  };
}
