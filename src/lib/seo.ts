import { site, sitePhones, images } from "@/lib/content/site-data";

/** Canonical site origin — override with NEXT_PUBLIC_SITE_URL when custom domain is live. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://andestay-hostel.vercel.app";

export const seo = {
  title: "AndeStay Hostel Colpapampa | Authentic Lodging & Cabins on Salkantay Trek",
  description:
    "Relax after Salkantay Pass at AndeStay Hostel in Colpapampa (Chaullay). Cozy private cabins, real hot showers, hearty mountain meals & Wi-Fi for independent hikers. Book directly via WhatsApp.",
  ogImage: images.hero,
  ogImageAlt:
    "Wooden A-frame cabins at AndeStay Hostel in Colpapampa on the Salkantay Trek",
} as const;

export function lodgingBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "AndeStay Hostel Colpapampa",
    alternateName: ["AndeStay Hostel", "AndeStay Collpapampa", "AndeStay Chaullay"],
    description:
      "Mountain lodge and wooden cabins located in Colpapampa (Chaullay) along the Salkantay Trek in Cusco, Peru — hot showers, meals, Wi-Fi, and trail-side rest for independent hikers.",
    url: siteUrl,
    image: [`${siteUrl}${images.hero}`, `${siteUrl}${images.heroMobile}`],
    telephone: `+${sitePhones[0].e164}`,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "CU-109 Cabañas",
      addressLocality: "Colpapampa",
      addressRegion: "Cusco",
      addressCountry: "PE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.lat,
      longitude: site.lng,
    },
    priceRange: "$$",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Hot shower", value: true },
      { "@type": "LocationFeatureSpecification", name: "Mountain view", value: true },
      { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Device charging", value: true },
      { "@type": "LocationFeatureSpecification", name: "Luggage storage", value: true },
    ],
    sameAs: [site.instagramUrl, site.tiktokUrl].filter(Boolean),
  };
}
