import { Toaster } from "@/components/ui/sonner";
import { Montserrat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "PT Mangala Dipa Lokatara | Konsultan Lingkungan di Indonesia",
  description:
    "Menyediakan layanan profesional untuk pembangunan berkelanjutan dan pelestarian lingkungan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${plusJakartaSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
