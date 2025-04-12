"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { NumberTicker } from "../magicui/number-ticker";

const CardKeahlian = ({
  value,
  unit,
  subtitle,
  content,
  type,
  className = "",
}) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const Wrapper = motion.div;

  if (type === "stats") {
    return (
      <Wrapper
        ref={ref}
        className={`bg-white p-8 min-h-[245px] flex flex-col justify-between ${className}`}
        variants={variants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <h2 className="text-[52px] font-bold text-primary leading-[120%] font-montserrat">
          <NumberTicker value={value} className="text-primary" />
          {unit && <span className="ml-2">{unit}</span>}
        </h2>

        <div>
          <h3 className="text-primary text-[18px] font-semibold font-plus-jakarta-sans">
            {subtitle}
          </h3>
          <div className="text-[16px] text-primary">{content}</div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      ref={ref}
      className={`relative min-h-[245px] w-full overflow-hidden ${className}`}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <Image
        src={content}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-300 hover:scale-110"
      />
    </Wrapper>
  );
};

export default CardKeahlian;
