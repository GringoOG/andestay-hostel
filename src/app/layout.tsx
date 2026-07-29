import type { Metadata } from "next";
import { Instrument_Serif, Inter, Poppins } from "next/font/google";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
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
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${instrument.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}
