import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Poppins } from "next/font/google";
import { Footer } from "@/components/Footer";
import { LocaleProvider } from "@/lib/i18n";
import { lodgingBusinessJsonLd, seo, siteUrl } from "@/lib/seo";
import "./globals.css";

/**
 * Typography matches Cabana Mountain (Framer):
 * - Poppins: body, UI, large sans headings (weights 200–700)
 * - Instrument Serif italic: display accents (cabin names, “in nature.”, etc.)
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.title,
    template: "%s · AndeStay Hostel",
  },
  description: seo.description,
  applicationName: "AndeStay Hostel",
  // New paths on purpose: browsers cache /favicon.ico very aggressively
  // (often ignoring content changes), so we point tabs at /icons/andestay-*.
  icons: {
    icon: [
      { url: "/icons/andestay-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/andestay-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icons/andestay-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/andestay.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/icons/andestay-180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/icons/andestay-32.png"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AndeStay Hostel",
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: seo.ogImage,
        width: 2000,
        height: 1500,
        alt: seo.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1c2a22",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = lodgingBusinessJsonLd();

  return (
    <html lang="en" className={`${poppins.variable} ${instrument.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LocaleProvider>
          {children}
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
