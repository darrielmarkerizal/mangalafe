import React from "react";
import Image from "next/image";
import { NumberTicker } from "../magicui/number-ticker";

const CardKeahlian = ({
  value,
  unit,
  subtitle,
  content,
  type,
  className = "",
}) => {
  if (type === "stats") {
    return (
      <div
        className={`bg-white p-8 min-h-[245px] flex flex-col justify-between ${className}`}
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
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-[245px] w-full overflow-hidden ${className}`}
    >
      <Image
        src={content}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-300 hover:scale-110"
      />
    </div>
  );
};

export default CardKeahlian;
