"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CardLayanan from "../ui/card-layanan";

// animasi per-card
const AnimatedCard = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

const Layanan = () => {
  const layananData = [
    {
      title: "PKKKPR & PKKPRL",
      description:
        "Memastikan proyek darat dan laut sesuai regulasi tata ruang, menjaga keberlanjutan ekosistem.",
      icon: "./layanan/layanan-0.svg",
    },
    {
      title: "AMDAL & DELH",
      description:
        "Analisis dan evaluasi dampak lingkungan, seimbangkan pembangunan dengan pelestarian.",
      icon: "./layanan/layanan-1.svg",
    },
    {
      title: "UKL-UPL & DPLH",
      description:
        "Kelola dan pantau dampak lingkungan proyek, pastikan kepatuhan dan kelestarian.",
      icon: "./layanan/layanan-2.svg",
    },
    {
      title: "PERTEK",
      description:
        "Dapatkan persetujuan teknis untuk proyek, pastikan standar lingkungan terpenuhi.",
      icon: "./layanan/layanan-3.svg",
    },
    {
      title: "Laporan Pemantauan dan Pengelolaan Lingkungan",
      description:
        "Pantau dan kelola dampak lingkungan berkala, dukung operasional yang berkelanjutan.",
      icon: "./layanan/layanan-4.svg",
    },
    {
      title: "LARAP",
      description:
        "Rencanakan pengadaan lahan dan pemukiman ulang, minimalkan dampak sosial dengan solusi adil.",
      icon: "./layanan/layanan-5.svg",
    },
    {
      title: "Studi dan kajian Bidang Transportasi",
      description:
        "Kajian transportasi untuk proyek infrastruktur, optimalkan efisiensi dengan dampak minimal.",
      icon: "./layanan/layanan-6.svg",
    },
    {
      title: "Jasa Survey Lingkungan",
      description:
        "Survei lingkungan mendalam, berikan data akurat untuk perencanaan proyek yang berkelanjutan.",
      icon: "./layanan/layanan-7.svg",
    },
  ];

  return (
    <section>
      <div className="container px-4 mx-auto py-12">
        <div className="flex flex-col items-center justify-center w-full mb-10">
          <h1 className="text-[48px] font-montserrat font-bold max-w-[50%] text-center leading-[120%] md:max-w-[100%]">
            Layanan Kami
          </h1>
          <p className="text-[20px] md:text-[18px] text-center mt-4 font-plus-jakarta-sans text-primary md:max-w-[50%]">
            Solusi lingkungan terpercaya untuk mendukung pembangunan
            berkelanjutan dengan pendekatan profesional dan berbasis keahlian.
          </p>
        </div>

        {/* Mobile Layout */}
        <div className="grid md:hidden gap-6">
          {layananData.map((data, index) => (
            <AnimatedCard key={index}>
              <CardLayanan {...data} index={index} />
            </AnimatedCard>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex gap-6">
          <div className="w-1/2 grid gap-6">
            <div className="grid grid-cols-2 gap-6">
              <AnimatedCard>
                <CardLayanan {...layananData[0]} />
              </AnimatedCard>
              <AnimatedCard>
                <CardLayanan {...layananData[1]} />
              </AnimatedCard>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <AnimatedCard>
                <CardLayanan {...layananData[2]} />
              </AnimatedCard>
              <AnimatedCard>
                <CardLayanan {...layananData[3]} />
              </AnimatedCard>
            </div>
            <div className="grid grid-cols-1">
              <AnimatedCard>
                <CardLayanan {...layananData[4]} />
              </AnimatedCard>
            </div>
          </div>
          <div className="w-1/2 grid gap-6">
            <AnimatedCard>
              <CardLayanan {...layananData[5]} />
            </AnimatedCard>
            <AnimatedCard>
              <CardLayanan {...layananData[6]} />
            </AnimatedCard>
            <AnimatedCard>
              <CardLayanan {...layananData[7]} />
            </AnimatedCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Layanan;
