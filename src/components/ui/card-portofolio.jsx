"use client";
import { useState } from "react";
import Image from "next/image";

const CardPortfolio = ({ title, description, imageUrl, client, service }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[188px] md:h-[356px] w-full">
        <Image
          src={imageUrl || "./images/hero-bg.png"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 bg-primary h-full">
        <h3 className="mb-2 text-[20px] font-bold text-white font-montserrat">
          {title}
        </h3>
        <p className="mb-3 text-[16px] text-white font-plus-jakarta-sans">
          {description}
        </p>
        <h3 className="mb-2 text-[20px] font-bold text-white font-montserrat">
          {client}
        </h3>
        <div className="flex flex-wrap gap-2">
          {service &&
            service.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-white rounded-full text-primary font-semibold"
              >
                {item}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CardPortfolio;
