"use client";

import { BookingService } from "@/lib/booking";

type BookButtonProps = {
  /** Website room slug (e.g. double-room) — never a provider product id. */
  roomSlug?: string;
  /** @deprecated use roomSlug */
  roomId?: string;
  className?: string;
  variant?: "solid" | "outline";
  children?: React.ReactNode;
  /** Analytics source label */
  source?: string;
};

/**
 * Sole “Book a stay” CTA — BookingService only.
 * No URLs, no provider knowledge, no product ids.
 */
export function BookButton({
  roomSlug,
  roomId,
  className = "",
  variant = "solid",
  children = "Book a stay",
  source,
}: BookButtonProps) {
  const slug = roomSlug ?? roomId;

  if (!BookingService.isEnabled()) {
    return null;
  }

  const href = slug
    ? BookingService.getRoomUrl(slug)
    : BookingService.getUrl();
  const external = BookingService.isExternal();

  return (
    <a
      href={href}
      className={`btn-pill ${variant === "outline" ? "btn-pill-outline" : ""} ${className}`}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      onClick={(e) => {
        e.preventDefault();
        if (slug) {
          BookingService.openRoom(slug, { source });
        } else {
          BookingService.open({ source });
        }
      }}
    >
      <span>{children}</span>
      <span className="btn-arrow" aria-hidden>
        <span className="btn-arrow-icon">→</span>
      </span>
    </a>
  );
}
