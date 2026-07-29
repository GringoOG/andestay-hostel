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
};

export function PhotoPlaceholder({
  label,
  src,
  className = "",
  imageClassName = "",
  priority = false,
  objectPosition = "center",
  fillParent = false,
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
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 900px"
        className={imageClassName || "object-cover"}
        style={{ objectPosition }}
      />
    </div>
  );
}
