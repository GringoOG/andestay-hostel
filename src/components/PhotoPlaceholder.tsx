import Image from "next/image";

type PhotoPlaceholderProps = {
  label: string;
  src?: string;
  className?: string;
  /** Extra classes for the <Image> (e.g. object-contain on mobile heroes) */
  imageClassName?: string;
  priority?: boolean;
  objectPosition?: string;
  /** Fill a positioned parent (e.g. absolute inset-0 hero) */
  fillParent?: boolean;
  /** Responsive sizes hint — keep tight on mobile for faster downloads */
  sizes?: string;
  /** 80–85 = sharp on retina phones, still lean via AVIF/WebP */
  quality?: number;
};

export function PhotoPlaceholder({
  label,
  src,
  className = "",
  imageClassName = "",
  priority = false,
  objectPosition = "center",
  fillParent = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 900px",
  quality = 85,
}: PhotoPlaceholderProps) {
  if (!src) {
    return (
      <div
        className={`photo-ph relative ${className}`}
        data-label={`Photo · ${label}`}
        role="img"
        aria-label={`Placeholder for ${label}`}
      />
    );
  }

  return (
    <div
      className={`photo-frame relative ${fillParent ? "h-full w-full" : ""} ${className}`}
    >
      <Image
        src={src}
        alt={label}
        fill
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={imageClassName || "object-cover"}
        style={{ objectPosition }}
      />
    </div>
  );
}
