/**
 * Hotel policies — stay rules independent of any booking provider.
 */

export type CancellationPolicy = {
  /** Free cancellation until N days before check-in. */
  freeCancelDaysBefore: number;
  /** Human-readable summary key / note for staff (not i18n UI yet). */
  note: string;
};

export type HotelPolicies = {
  minNights: number;
  maxNights: number;
  checkInFrom: string; // "14:00"
  checkOutUntil: string; // "11:00"
  cancellation: CancellationPolicy;
  mealsIncluded: ("breakfast" | "dinner")[];
};

export const hotelPolicies: HotelPolicies = {
  minNights: 1,
  maxNights: 30,
  checkInFrom: "14:00",
  checkOutUntil: "11:00",
  cancellation: {
    freeCancelDaysBefore: 7,
    note: "Free cancellation until 7 days before arrival; within 7 days non-refundable.",
  },
  mealsIncluded: ["breakfast", "dinner"],
};
