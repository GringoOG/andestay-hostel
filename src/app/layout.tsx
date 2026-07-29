import type { Metadata } from "next";
import { Instrument_Serif, Poppins } from "next/font/google";
import { Footer } from "@/components/Footer";
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
  title: {
    default: "AndeStay Hostel — Colpapampa",
    template: "%s · AndeStay Hostel",
  },
  description:
    "AndeStay Hostel in Colpapampa — a welcoming base in the Andes for travelers and hikers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${instrument.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}
