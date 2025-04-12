import { Toaster } from "@/components/ui/sonner";
import { Montserrat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/layout-wrapper";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export const metadata = {
  title: "PT Mangala Dipa Lokatara | Konsultan Lingkungan Indonesia",
  description:
    "PT Mangala Dipa Lokatara adalah konsultan lingkungan profesional yang menyediakan layanan AMDAL, UKL-UPL, perizinan lingkungan, dan solusi berkelanjutan di seluruh Indonesia.",
  keywords:
    "konsultan lingkungan, amdal, ukl upl, jasa lingkungan, mangala dipa lokatara, sustainability indonesia, izin lingkungan, analisis dampak lingkungan, jasa konsultasi lingkungan indonesia",
  authors: [
    { name: "PT Mangala Dipa Lokatara", url: process.env.NEXT_PUBLIC_SITE_URL },
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  openGraph: {
    title: "PT Mangala Dipa Lokatara",
    description:
      "Konsultan Lingkungan terpercaya di Indonesia untuk solusi pembangunan berkelanjutan.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Mangala Dipa Lokatara",

    locale: "id_ID",
    type: "website",
  },
  robots: "index, follow",
  themeColor: "#0F172A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${montserrat.variable} ${plusJakartaSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Toaster />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
