export enum BookingErrorCode {
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  ROOM_UNAVAILABLE = "ROOM_UNAVAILABLE",
  PROVIDER_UNAVAILABLE = "PROVIDER_UNAVAILABLE",
  PROVIDER_NOT_REGISTERED = "PROVIDER_NOT_REGISTERED",
  BOOKING_DISABLED = "BOOKING_DISABLED",
  INVALID_CONFIG = "INVALID_CONFIG",
  UNKNOWN = "UNKNOWN",
}

export class BookingError extends Error {
  readonly code: BookingErrorCode;
  readonly roomSlug?: string;
  readonly cause?: unknown;

  constructor(
    code: BookingErrorCode,
    message: string,
    options?: { roomSlug?: string; cause?: unknown },
  ) {
    super(message);
    this.name = "BookingError";
    this.code = code;
    this.roomSlug = options?.roomSlug;
    this.cause = options?.cause;
  }

  static roomNotFound(roomSlug: string): BookingError {
    return new BookingError(
      BookingErrorCode.ROOM_NOT_FOUND,
      `Room slug "${roomSlug}" is not mapped for the active booking provider.`,
      { roomSlug },
    );
  }

  static roomUnavailable(roomSlug: string): BookingError {
    return new BookingError(
      BookingErrorCode.ROOM_UNAVAILABLE,
      `Room "${roomSlug}" is unavailable.`,
      { roomSlug },
    );
  }

  static providerUnavailable(message: string, cause?: unknown): BookingError {
    return new BookingError(
      BookingErrorCode.PROVIDER_UNAVAILABLE,
      message,
      { cause },
    );
  }

  static disabled(): BookingError {
    return new BookingError(
      BookingErrorCode.BOOKING_DISABLED,
      "Booking is disabled (NEXT_PUBLIC_BOOKING_ENABLED=false).",
    );
  }
}
