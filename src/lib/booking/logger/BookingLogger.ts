type LogLevel = "debug" | "info" | "warn" | "error";

type LogPayload = Record<string, unknown> | undefined;

/**
 * BookingLogger — swap sink later (Sentry / LogRocket / DB) without touching UI.
 */
function emit(level: LogLevel, message: string, payload?: LogPayload): void {
  const entry = {
    scope: "booking",
    level,
    message,
    ...payload,
    ts: new Date().toISOString(),
  };

  // Phase 1 sink — replace body only when wiring observability.
  if (level === "error") {
    console.error("[booking]", entry);
    return;
  }
  if (level === "warn") {
    console.warn("[booking]", entry);
    return;
  }
  if (process.env.NODE_ENV === "development") {
    console.info("[booking]", entry);
  }
}

export const BookingLogger = {
  debug: (message: string, payload?: LogPayload) => emit("debug", message, payload),
  info: (message: string, payload?: LogPayload) => emit("info", message, payload),
  warn: (message: string, payload?: LogPayload) => emit("warn", message, payload),
  error: (message: string, payload?: LogPayload) => emit("error", message, payload),
};
