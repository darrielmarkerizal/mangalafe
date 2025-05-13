"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const CardPortfolio = ({
  type,
  title,
  description,
  imageUrl,
  client,
  service,
  period,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const MAX_VISIBLE_BADGES = 2;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const truncateDescription = (text, maxLength = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const DescriptionText = () => {
    if (!description) {
      return (
        <p
          className={`mb-3 text-[16px] ${
            type === "list-no-image" ? "text-primary" : "text-white"
          } font-plus-jakarta-sans`}
        >
          -
        </p>
      );
    }

    if (isMobile) {
      const isLongDescription = description.length > 200;

      return (
        <div className="mb-3">
          <p
            className={`text-[16px] ${
              type === "list-no-image" ? "text-primary" : "text-white"
            } font-plus-jakarta-sans`}
          >
            {showFullDescription
              ? description
              : truncateDescription(description)}
          </p>
          {isLongDescription && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 text-sm text-white/80 hover:text-white underline underline-offset-2 transition-colors"
            >
              {showFullDescription
                ? "Tampilkan Lebih Sedikit"
                : "Tampilkan Semua"}
            </button>
          )}
        </div>
      );
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <p
            className={`mb-3 text-[16px] ${
              type === "list-no-image" ? "text-primary" : "text-white"
            } font-plus-jakarta-sans cursor-help`}
          >
            {truncateDescription(description)}
          </p>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] text-sm bg-white text-primary">
          {description}
        </TooltipContent>
      </Tooltip>
    );
  };

  const ServiceBadges = () => {
    if (!service || service.length === 0) return null;

    if (isMobile) {
      return (
        <div className="flex flex-wrap gap-2">
          {service.map((item, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`${
                type === "list-no-image"
                  ? "bg-primary text-white"
                  : "bg-white text-primary"
              } border-transparent hover:bg-white/90 hover:text-primary font-semibold px-3 py-1`}
            >
              {item}
            </Badge>
          ))}
        </div>
      );
    }

    const visibleServices = service.slice(0, MAX_VISIBLE_BADGES);
    const remainingCount = service.length - MAX_VISIBLE_BADGES;

    return (
      <div className="flex flex-wrap gap-2">
        {visibleServices.map((item, index) => (
          <Badge
            key={index}
            variant="outline"
            className={`${
              type === "list-no-image"
                ? "bg-primary text-white"
                : "bg-white text-primary"
            } border-transparent hover:bg-white/90 hover:text-primary font-semibold px-3 py-1`}
          >
            {item}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={`${
                  type === "list-no-image"
                    ? "bg-primary text-white"
                    : "bg-white text-primary"
                } border-transparent hover:bg-white/90 hover:text-primary font-semibold px-3 py-1 cursor-help`}
              >
                +{remainingCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-primary p-2">
              <div className="flex flex-col gap-1">
                {service.slice(MAX_VISIBLE_BADGES).map((item, index) => (
                  <span key={index}>{item}</span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative h-[188px] md:h-[356px] w-full   ${
          type === "list-no-image" ? "hidden" : "block"
        }`}
      >
        <Image
          src={imageUrl || "./images/hero-bg.png"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div
        className={`p-4 ${
          type === "list-no-image"
            ? "bg-[#fffbec] text-primary"
            : "bg-primary text-white"
        } h-full`}
      >
        {period && (
          <Badge
            variant="outline"
            className={`${
              type === "list-no-image"
                ? "bg-primary text-white"
                : "bg-white text-primary"
            } border-transparent hover:bg-white/90 hover:text-primary font-semibold px-3 py-1`}
          >
            {period}
          </Badge>
        )}
        <h3 className="mb-2 text-[20px] font-bold font-montserrat">{title}</h3>
        <DescriptionText />
        <div className="flex flex-col gap-2">
          <h3 className="text-[20px] font-bold font-montserrat">{client}</h3>
        </div>
        <div className="mt-4">
          <ServiceBadges />
        </div>
      </div>
    </div>
  );
};

export default CardPortfolio;
