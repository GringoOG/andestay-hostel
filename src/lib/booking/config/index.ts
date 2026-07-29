import { BookingProviderId, type BookingConfig } from "../types";
import { env, envFlag } from "./env";

function parseProvider(raw: string): BookingProviderId {
  const value = raw.toLowerCase();
  const match = (Object.values(BookingProviderId) as string[]).find((v) => v === value);
  return (match as BookingProviderId | undefined) ?? BookingProviderId.QLOAPPS;
}

export const bookingConfig: BookingConfig = {
  provider: parseProvider(env("NEXT_PUBLIC_BOOKING_PROVIDER", BookingProviderId.QLOAPPS)),
  enabled: envFlag("NEXT_PUBLIC_BOOKING_ENABLED", true),
  openInNewTab: envFlag("NEXT_PUBLIC_BOOKING_OPEN_IN_NEW_TAB", true),
  external: envFlag("NEXT_PUBLIC_BOOKING_EXTERNAL", true),
  baseUrl: env("NEXT_PUBLIC_BOOKING_BASE_URL", "https://book.example-hostel.com"),
  defaultPath: env("NEXT_PUBLIC_BOOKING_DEFAULT_PATH", "/"),
};
