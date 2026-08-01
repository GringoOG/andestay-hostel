/**
 * Shared booking API contract types.
 *
 * Route handlers can stay stubbed; frontend + BookingEngine share these shapes
 * so a real backend does not force a rewrite.
 */

import type { HotelRoomId } from "@/lib/hotel";

export type IsoDate = string; // YYYY-MM-DD

export type GuestCount = {
  adults: number;
  children?: number;
};

export type StayDates = {
  checkIn: IsoDate;
  checkOut: IsoDate;
};

/* —— Availability —— */

export type AvailabilityRequest = {
  room?: HotelRoomId;
  dates: StayDates;
  quantity?: number;
  guests?: GuestCount;
};

export type AvailabilityRoomQuote = {
  room: HotelRoomId;
  available: number;
  /** Nightly base price in hotel currency (PEN). */
  price: number;
  currency: "PEN";
};

export type AvailabilityResponse = {
  dates: StayDates;
  rooms: AvailabilityRoomQuote[];
};

/* —— Bookings —— */

export type BookingGuest = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export type BookingRequest = {
  room: HotelRoomId;
  dates: StayDates;
  guests: GuestCount;
  quantity?: number;
  guest: BookingGuest;
  promoCode?: string;
  notes?: string;
};

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "expired"
  | "failed";

export type BookingResponse = {
  id: string;
  status: BookingStatus;
  room: HotelRoomId;
  dates: StayDates;
  quantity: number;
  guests: GuestCount;
  total: number;
  currency: "PEN";
  createdAt: string; // ISO datetime
};

/* —— Payments —— */

export type PaymentRequest = {
  bookingId: string;
  amount: number;
  currency: "PEN";
  /** Intent — deposit vs full stay. */
  kind?: "deposit" | "full";
};

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentResponse = {
  id: string;
  bookingId: string;
  status: PaymentStatus;
  amount: number;
  currency: "PEN";
  /** Provider checkout URL when redirect flow is used. */
  checkoutUrl?: string;
};
