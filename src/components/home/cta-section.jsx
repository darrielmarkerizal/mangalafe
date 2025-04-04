"use client";
import React from "react";
import CTAButton from "../ui/CTAButton";

const CTASection = () => {
  return (
    <section className="relative py-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.7)",
        }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 md:max-w-[50%]">
        <div className="text-center ">
          <h1 className="text-[48px] font-bold text-white mb-6 font-montserrat leading-[120%]">
            Wujudkan Proyek Anda dengan Solusi Lingkungan Terbaik
          </h1>
          <p className="text-white mb-8">
            Kami siap membantu Anda membangun masa depan yang berkelanjutan
            dengan pendekatan profesional dan berbasis keahlian.
          </p>
          <div className="w-full flex justify-center ">
            <div className="flex flex-row gap-4 ">
              <CTAButton
                className="flex-none px-2 md:px-6"
                onClick={() => console.log("Next clicked!")}
                variant="white"
              >
                Konsultasikan Sekarang
              </CTAButton>
              <CTAButton
                className="flex-none px-2 md:px-6"
                onClick={() => console.log("Next clicked!")}
                variant="green"
              >
                Hubungi Kami
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
