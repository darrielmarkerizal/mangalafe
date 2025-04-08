import React from "react";
import CardPortfolio from "../ui/card-portofolio";
import { compareSync } from "bcryptjs";

const portfolioData = [
  {
    title: "AMDAL Pembangunan Pabrik",
    description:
      "Studi AMDAL untuk pembangunan pabrik manufaktur di Jawa Barat dengan pendekatan sustainable development.",
    imageUrl: "/images/hero-bg.png",
    link: "/portfolio/amdal-pabrik",
    client: "PT. Samator LNG",
    service: [
      "PKKKPR & PKKPRL",
      "AMDAL & DELH",
      "UKL-UPL & DPLH",
      "PERTEK",
      "Laporan Pemantauan dan Pengelolaan Lingkungan",
    ],
  },
  {
    title: "Pengelolaan Limbah B3",
    description:
      "Program pengelolaan limbah B3 untuk kawasan industri di Surabaya dengan teknologi modern.",
    imageUrl: "/images/hero-bg.png",
    link: "/portfolio/limbah-b3",
    client: "PT. Samator LNG",
    service: [
      "PKKKPR & PKKPRL",
      "AMDAL & DELH",
      "UKL-UPL & DPLH",
      "PERTEK",
      "Laporan Pemantauan dan Pengelolaan Lingkungan",
    ],
  },
  {
    title: "Audit Lingkungan",
    description:
      "Audit lingkungan komprehensif untuk perusahaan tambang di Kalimantan Timur.",
    imageUrl: "/images/hero-bg.png",
    link: "/portfolio/audit-lingkungan",
    client: "PT. Samator LNG",
    service: [
      "PKKKPR & PKKPRL",
      "AMDAL & DELH",
      "UKL-UPL & DPLH",
      "PERTEK",
      "Laporan Pemantauan dan Pengelolaan Lingkungan",
    ],
  },
];

const PortfolioHero = () => {
  return (
    <section className="mt-[72px]">
      <div className="container px-4 mx-auto py-16">
        <div className="flex flex-col text-center">
          <h1 className="text-primary text-[36px] md:text-[48px] mb-5 font-bold font-montserrat leading-[120%]">
            Portofolio Proyek Kami
          </h1>
          <p className="font-plus-jakarta-sans text-primary text-[16px] mb-12">
            Temukan pengalaman kami dalam mendukung pembangunan berkelanjutan
            melalui proyek-proyek lingkungan di berbagai wilayah Indonesia.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioData.map((item, index) => (
            <CardPortfolio
              key={index}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              service={item.service}
              client={item.client}
              link={item.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioHero;
