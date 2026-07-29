import { BookingLogger } from "../logger";
import type { BookingAnalyticsPayload } from "../types";

type AnalyticsSink = (payload: BookingAnalyticsPayload) => void;

const sinks: AnalyticsSink[] = [];

/**
 * Register GA / Plausible / PostHog / Mixpanel later — UI stays untouched.
 */
export function registerBookingAnalyticsSink(sink: AnalyticsSink): void {
  sinks.push(sink);
}

export function trackBookingEvent(payload: BookingAnalyticsPayload): void {
  BookingLogger.info(payload.event, payload as unknown as Record<string, unknown>);

  for (const sink of sinks) {
    try {
      sink(payload);
    } catch (err) {
      BookingLogger.warn("analytics_sink_failed", {
        event: payload.event,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Phase 1: dataLayer hook when present (GTM / GA ready).
  if (typeof window !== "undefined") {
    const w = window as Window & { dataLayer?: Record<string, unknown>[] };
    w.dataLayer?.push({
      event: payload.event,
      booking_provider: payload.provider,
      booking_room: payload.roomSlug,
      booking_source: payload.source,
      booking_url: payload.url,
    });
  }
}

export function trackBookingClick(
  payload: Omit<BookingAnalyticsPayload, "event"> & { roomSlug?: string },
): void {
  trackBookingEvent({
    event: payload.roomSlug ? "booking_open_room" : "booking_click",
    ...payload,
  });
}
