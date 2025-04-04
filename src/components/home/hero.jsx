"use client";

import React from "react";
import CTAButton from "../ui/CTAButton";

const Hero = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          filter: "brightness(0.7)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex flex-col justify-center text-secondary px-4 container mx-auto">
        <h1 className="text-[36px] md:text-[72px] font-bold text-left mb-6 leading-[40px] md:leading-[80px] text-white">
          <span className="md:hidden">
            Keseimbangan
            <br />
            untuk
            <br />
            Kemajuan
            <br />
            Berkelanjutan
          </span>
          <span className="hidden md:inline">
            Keseimbangan untuk
            <br />
            Kemajuan Berkelanjutan
          </span>
        </h1>
        <p className="text-[16px] md:text-[20px] text-left mb-8 md:max-w-[70%] w-[100%] text-white">
          Membangun fondasi pembangunan yang menjunjung tinggi pelestarian
          lingkungan dan kesejahteraan masyarakat, dengan pendekatan
          komprehensif yang memadukan keahlian teknis, pemahaman regulasi, dan
          komitmen terhadap praktik terbaik lingkungan
        </p>
        <div className="inline-block">
          <CTAButton onClick={() => console.log("Next clicked!")}>
            Konsultasikan Kebutuhan Anda
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default Hero;
