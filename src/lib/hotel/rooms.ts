/**
 * Hotel domain — operational room catalog (not marketing copy).
 * Marketing presentation lives in `src/lib/content.ts`.
 */

export type HotelRoomId =
  | "simple-room"
  | "double-room"
  | "triple-room"
  | "matrimonial-room";

export type HotelRoom = {
  id: HotelRoomId;
  /** Physical units of this type. */
  inventory: number;
  /** Max adults per unit. */
  capacity: number;
};

/**
 * Display / booking order:
 * simple → double → triple → matrimonial
 */
export const hotelRooms: HotelRoom[] = [
  { id: "simple-room", inventory: 1, capacity: 1 },
  { id: "double-room", inventory: 4, capacity: 2 },
  { id: "triple-room", inventory: 1, capacity: 3 },
  { id: "matrimonial-room", inventory: 3, capacity: 2 },
];

export function getHotelRoom(id: HotelRoomId): HotelRoom | undefined {
  return hotelRooms.find((r) => r.id === id);
}

export function listHotelRoomIds(): HotelRoomId[] {
  return hotelRooms.map((r) => r.id);
}
