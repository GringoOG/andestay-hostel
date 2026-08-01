/**
 * Hotel domain barrel — operational data for booking / rates / policies.
 * Marketing copy & imagery stay in `@/lib/content`.
 */

export {
  hotelRooms,
  getHotelRoom,
  listHotelRoomIds,
  type HotelRoom,
  type HotelRoomId,
} from "./rooms";

export {
  roomRates,
  getRoomNightlyPen,
  PEN_PER_USD,
  type MoneyAmount,
  type RoomRate,
} from "./rates";

export { hotelPolicies, type HotelPolicies, type CancellationPolicy } from "./policies";

export { hotelSettings, type HotelSettings } from "./settings";
