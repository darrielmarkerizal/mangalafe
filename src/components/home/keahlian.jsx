"use client";
import React from "react";
import CTAButton from "../ui/CTAButton";
import CardKeahlian from "../ui/card-keahlian";

const Keahlian = () => {
  const keahlianList = [
    {
      value: 12,
      unit: "Projects",
      subtitle: "Proyek Terverifikasi",
      type: "stats",
      content:
        "Berhasil menyelesaikan proyek lingkungan untuk berbagai klien, dari pemerintah hingga swasta",
    },
    {
      type: "image",
      content: "/images/hero-bg.png",
    },
    {
      value: 5,
      unit: "Wilayah",
      subtitle: "Wilayah Proyek",
      type: "stats",
      content:
        "Meliputi Yogyakarta, Riau, Kalimantan, Sulawesi, Jawa Barat, dan Jawa Timur",
    },
    {
      value: 31.18,
      unit: "KM",
      subtitle: "Pipa Gas",
      type: "stats",
      content:
        "Pemasangan pipa gas bawah laut oleh PT Samator LNG di Bangkudulis-Tarakan",
    },
    {
      type: "image",
      content: "/images/hero-bg.png",
    },
  ];

  return (
    <section className="relative min-h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/keahlian-bg.png')",
          filter: "brightness(0.7)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col text-secondary px-4 container mx-auto py-16 md:flex-row">
        <div className="w-full md:w-1/2">
          <h1 className="text-[48px] md:text-[72px] font-bold text-left mb-5 leading-[120%] text-white">
            <span className="md:hidden">
              Keahlian dan <br /> Dampak <br /> Kami
            </span>
            <span className="hidden md:flex">
              Keahlian dan <br /> Dampak Kami
            </span>
          </h1>
        </div>
        <div className="flex flex-col md:w-1/2 justify-center">
          <p className="text-[16px] md:text-[20px] text-left mb-8 w-[100%] text-white">
            Kami berkomitmen memberikan solusi lingkungan terbaik melalui
            pendekatan berbasis keahlian dan pengalaman.
          </p>
          <div className="flex flex-row gap-4">
            <CTAButton
              className="flex-1 md:flex-none px-1 md:px-6"
              onClick={() => console.log("Next clicked!")}
              variant="green"
            >
              Pelajari Layanan Kami
            </CTAButton>
            <CTAButton
              className="flex-1 md:flex-none px-1 md:px-6"
              onClick={() => console.log("Next clicked!")}
              variant="white"
            >
              Lihat Portofolio Kami
            </CTAButton>
          </div>
        </div>
      </div>

      {/* Card List */}
      <div className="relative z-10 container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* Column 1 - Full height card */}
          <div className="h-full flex">
            <CardKeahlian {...keahlianList[0]} className="h-full w-full" />
          </div>

          {/* Column 2 - Two equal cards */}
          <div className="flex flex-col gap-6 h-full">
            <div className="flex-1">
              <CardKeahlian {...keahlianList[1]} className="h-full" />
            </div>
            <div className="flex-1">
              <CardKeahlian {...keahlianList[2]} className="h-full" />
            </div>
          </div>

          {/* Column 3 - Two equal cards */}
          <div className="flex flex-col gap-6 h-full">
            <div className="flex-1">
              <CardKeahlian {...keahlianList[3]} className="h-full" />
            </div>
            <div className="flex-1">
              <CardKeahlian {...keahlianList[4]} className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Keahlian;
