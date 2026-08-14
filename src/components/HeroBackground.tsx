import { getImageProps } from "next/image";
import { images } from "@/lib/content";

/**
 * Art-directed hero background:
 * - phones (&lt; 768px): portrait mobile photo
 * - tablet / desktop: existing landscape hero
 *
 * &lt;picture&gt; + media query so phones do not download the desktop file.
 */
export function HeroBackground() {
  const shared = {
    alt: "AndeStay Hostel hero",
    sizes: "100vw",
    quality: 90,
    priority: true,
  };

  const { props: desktop } = getImageProps({
    ...shared,
    src: images.hero,
    width: 2400,
    height: 1600,
  });

  const { props: mobile } = getImageProps({
    ...shared,
    src: images.heroMobile,
    width: 1290,
    height: 1290,
  });

  return (
    <div className="absolute inset-0 overflow-hidden">
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet={desktop.srcSet}
          sizes={desktop.sizes}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- art-directed <picture> */}
        <img
          {...mobile}
          alt={shared.alt}
          className="absolute inset-0 h-full w-full origin-center scale-105 object-cover object-[50%_40%] animate-[heroZoom_18s_ease-out_forwards] md:object-[42%_38%]"
        />
      </picture>
    </div>
  );
}
