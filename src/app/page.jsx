import CTASection from "@/components/home/cta-section";
import Hero from "@/components/home/hero";
import Keahlian from "@/components/home/keahlian";
import Layanan from "@/components/home/layanan";
import PengalamanKami from "@/components/home/pengalamankami";
import Tim from "@/components/home/tim";
import Image from "next/image";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Mangala Dipa Lokatara",
    description:
      "Keseimbangan untuk Kemajuan Berkelanjutan Membangun fondasi pembangunan yang menjunjung tinggi pelestarian lingkungan dan kesejahteraan masyarakat, dengan pendekatan komprehensif yang memadukan keahlian teknis, pemahaman regulasi, dan komitmen terhadap praktik terbaik lingkungan",
    url: "https://mangalafe.vercel.app/",
    publisher: {
      "@type": "Organization",
      name: "Mangala Dipa Lokatara",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Kaliurang KM 5 CT 3 No. 22",
        addressLocality: "Sleman",
        addressRegion: "Daerah Istimaewa Yogyakarta",
        postalCode: "55598",
        addressCountry: "ID",
      },
      email: "mangaladipalokatara@gmail.com",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Hero />
      <Layanan />
      <PengalamanKami />
      <Tim />
      <CTASection />
    </main>
  );
}
