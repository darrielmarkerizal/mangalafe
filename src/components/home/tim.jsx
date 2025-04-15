import React from "react";
import CardTim from "../ui/card-tim";
import AnimatedCardWrapper from "@/lib/AnimatedCardWrapper";

const teamData = [
  {
    name: "IWAN WILIYANTO, S.T., M.M.",
    position: "Komisaris",
    image: "/images/Komisaris.png",
  },
  {
    name: "EMMANUELLE SARASWATI GITA DEWI, S.HUT., MBA",
    position: "Direktur",
    image: "/images/Gita.png",
  },
  {
    name: "FAHMI ANSHARI, S.T.P.",
    position: "Operasional",
    image: "/images/Fahmi.png",
  },
  {
    name: "SURYO ARIF SETYAWAN, S.Si.",
    position: "Biologi",
    image: "/images/Surya.png",
  },
  {
    name: "SHERLY DEVIANTY, S.T., M.Sc.",
    position: "Teknik Sipil dan Transportasi",
    image: "/images/Sherly.png",
  },
  {
    name: "ADE ULFA NUGROHO, S.Si.",
    position: "Biologi",
    image: "/images/Ade.png",
  },
];

const Tim = () => {
  return (
    <section>
      <div className="container mx-auto py-16 px-4">
        <div>
          <h1 className="font-montserrat text-[48px] font-bold text-primary">
            Tim Kami
          </h1>
          <span className="font-plus-jakarta-sans text-primary text-[18px]">
            Didukung oleh para ahli berpengalaman dan bersertifikasi, kami siap
            memberikan solusi lingkungan terbaik untuk Anda.
          </span>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamData.map((member, index) => (
            <AnimatedCardWrapper key={index}>
              <CardTim
                name={member.name}
                position={member.position}
                image={member.image}
              />
            </AnimatedCardWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tim;
