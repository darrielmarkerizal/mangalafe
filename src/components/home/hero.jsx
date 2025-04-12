"use client";

import React from "react";
import { BoxReveal } from "../magicui/box-reveal";
import CTAButton from "../ui/CTAButton";
import { FlipText } from "../magicui/flip-text";

const Hero = () => {
  return (
    <div className="relative h-screen w-full">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          filter: "brightness(0.7)",
        }}
      />

      <div className="relative z-10 h-full w-full flex flex-col justify-center text-secondary px-4 container mx-auto">
        <BoxReveal boxColor="#02382c" duration={0.5}>
          <h1
            className="text-[36px] md:text-[72px] font-bold text-left mb-6 leading-[40px] md:leading-[80px] text-white"
            aria-label="Keseimbangan untuk Kemajuan Berkelanjutan dan Lingkungan"
          >
            <span className="md:hidden">
              Keseimbangan
              <br />
              untuk
              <br />
              Kemajuan
              <br />
              <FlipText
                words={["Berkelanjutan", "Lingkungan"]}
                className="inline-block text-[36px] font-bold text-white"
                aria-hidden="true"
              />
            </span>
            <span className="hidden md:inline">
              Keseimbangan untuk
              <br />
              Kemajuan{" "}
              <FlipText
                words={["Berkelanjutan", "Lingkungan"]}
                className="inline-block text-[72px] font-bold text-white"
                aria-hidden="true"
              />
            </span>
          </h1>
        </BoxReveal>

        <BoxReveal boxColor="#02382c" duration={0.5}>
          <p className="text-[16px] md:text-[20px] text-left mb-8 md:max-w-[70%] w-[100%] text-white">
            Membangun fondasi pembangunan yang menjunjung tinggi pelestarian
            lingkungan dan kesejahteraan masyarakat, dengan pendekatan
            komprehensif yang memadukan keahlian teknis, pemahaman regulasi, dan
            komitmen terhadap praktik terbaik lingkungan
          </p>
        </BoxReveal>

        <BoxReveal boxColor="#02382c" duration={0.5}>
          <div className="inline-block">
            <CTAButton
              onClick={() => console.log("Next clicked!")}
              className="px-6"
              variant="green"
            >
              Konsultasikan Kebutuhan Anda
            </CTAButton>
          </div>
        </BoxReveal>
      </div>
    </div>
  );
};

export default Hero;
