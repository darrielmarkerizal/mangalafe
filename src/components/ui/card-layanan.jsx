import React from "react";
import Image from "next/image";

const CardLayanan = ({ title, description, icon, index }) => {
  const isLargeTitle = index >= 4 && index <= 7;

  return (
    <div className="bg-primary rounded-[10px] shadow-lg p-6">
      <div className="w-12 h-12">
        <Image
          src={icon}
          alt={title}
          width={100}
          height={100}
          className="object-contain"
        />
      </div>
      <h3
        className={`font-montserrat font-bold text-[24px] md:max-w-[80%] leading-[120%] ${
          isLargeTitle ? "md:text-[40px]" : "text-[24px]"
        } text-white mt-2`}
      >
        {title}
      </h3>
      <p className="font-plus-jakarta-sans text-[16px] text-white mt-2">
        {description}
      </p>
    </div>
  );
};

export default CardLayanan;
