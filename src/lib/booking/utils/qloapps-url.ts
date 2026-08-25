/**
 * QloApps hotel-listing URL builder.
 *
 * Example:
 * https://book.andestay.com/cs/8-andestay-hostel?date_from=2026-08-25&date_to=2026-08-26&occupancy%5B0%5D%5Badults%5D=1&occupancy%5B0%5D%5Bchildren%5D=0
 */

export type QloAppsLocale = "en" | "es" | "cs";

export type BuildQloAppsHotelUrlInput = {
  baseUrl: string;
  hotelSlug: string;
  locale?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  adults?: number | null;
  children?: number | null;
};

/** Site locales → QloApps path segment (fr/de fall back to en). */
export function mapBookingLocale(locale?: string | null): QloAppsLocale {
  const value = (locale ?? "en").toLowerCase();
  if (value === "es" || value === "cs" || value === "en") return value;
  return "en";
}

/**
 * Build hotel listing URL. Uses URL / URLSearchParams only (no hand-built query strings).
 * Without both dates, returns the bare listing URL.
 */
export function buildQloAppsHotelUrl(input: BuildQloAppsHotelUrlInput): string {
  const base = input.baseUrl.replace(/\/$/, "") || "https://book.andestay.com";
  const slug = input.hotelSlug.replace(/^\/+|\/+$/g, "") || "8-andestay-hostel";
  const locale = mapBookingLocale(input.locale);

  const url = new URL(`${base}/${locale}/${slug}`);

  const checkIn = input.checkIn?.trim();
  const checkOut = input.checkOut?.trim();

  if (checkIn && checkOut) {
    const params = new URLSearchParams();
    params.set("date_from", checkIn);
    params.set("date_to", checkOut);
    params.set(
      "occupancy[0][adults]",
      String(Math.max(1, Math.floor(input.adults ?? 1))),
    );
    params.set(
      "occupancy[0][children]",
      String(Math.max(0, Math.floor(input.children ?? 0))),
    );
    url.search = params.toString();
  }

  return url.toString();
}
