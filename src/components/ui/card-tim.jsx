import React from "react";
import Image from "next/image";

const CardTim = ({ name, position, image }) => {
  return (
    <div className="flex flex-col">
      <div className="relative aspect-[3/4] md:aspect-square w-full rounded-[12px] overflow-hidden">
        {/* Image */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="py-4">
        <h3 className="font-montserrat text-[20px] font-semibold text-primary">
          {name}
        </h3>
        <p className="font-plus-jakarta-sans text-primary text-[18px]">
          {position}
        </p>
      </div>
    </div>
  );
};

export default CardTim;
