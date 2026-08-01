"use client";

import { BookingService } from "@/lib/booking";
import { useI18n } from "@/lib/i18n";

type BookButtonProps = {
  roomSlug?: string;
  roomId?: string;
  quantity?: number;
  className?: string;
  variant?: "solid" | "outline";
  children?: React.ReactNode;
  source?: string;
};

export function BookButton({
  roomSlug,
  roomId,
  quantity = 1,
  className = "",
  variant = "solid",
  children,
  source,
}: BookButtonProps) {
  const { t } = useI18n();
  const slug = roomSlug ?? roomId;
  const label = children ?? t.common.bookStay;
  const options = { source, quantity: quantity > 1 ? quantity : undefined };

  if (!BookingService.isEnabled()) {
    return null;
  }

  const href = slug
    ? BookingService.getRoomUrl(slug, options)
    : BookingService.getUrl();
  const external = BookingService.isExternal();

  return (
    <a
      href={href}
      className={`btn-pill ${variant === "outline" ? "btn-pill-outline" : ""} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => {
        e.preventDefault();
        if (slug) {
          BookingService.openRoom(slug, options);
        } else {
          BookingService.open({ source });
        }
      }}
    >
      <span>{label}</span>
      <span className="btn-arrow" aria-hidden>
        <span className="btn-arrow-icon">→</span>
      </span>
    </a>
  );
}
