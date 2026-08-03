/**
 * Hotel rates — base / seasonal pricing (source of truth for amounts).
 * Display formatting stays in marketing helpers (`content.formatRoomPrice`).
 */

import type { HotelRoomId } from "./rooms";

export type MoneyAmount = {
  /** Amount in minor currency units are NOT used — hotel quotes whole PEN. */
  amount: number;
  currency: "PEN";
};

export type RoomRate = {
  roomId: HotelRoomId;
  /** Base nightly rate (PEN). */
  nightly: MoneyAmount;
};

/** Approx. soles per USD for marketing dual display only. */
export const PEN_PER_USD = 3.4;

/**
 * Client base rates (PEN / night).
 * Seasonal / dynamic rules will live here later — not in providers.
 */
export const roomRates: RoomRate[] = [
  { roomId: "simple-room", nightly: { amount: 55, currency: "PEN" } },
  { roomId: "double-room", nightly: { amount: 110, currency: "PEN" } },
  { roomId: "triple-room", nightly: { amount: 160, currency: "PEN" } },
  { roomId: "matrimonial-room", nightly: { amount: 110, currency: "PEN" } },
];

export function getRoomNightlyPen(roomId: HotelRoomId): number {
  const rate = roomRates.find((r) => r.roomId === roomId);
  return rate?.nightly.amount ?? 0;
}
