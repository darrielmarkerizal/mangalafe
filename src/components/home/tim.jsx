import React from "react";
import CardTim from "../ui/card-tim";

const teamData = [
  {
    name: "Dr. Ahmad Rizki",
    position: "Environmental Director",
    image: "/images/hero-bg.png",
  },
  {
    name: "Ir. Sarah Putri",
    position: "Senior Environmental Engineer",
    image: "/images/hero-bg.png",
  },
  {
    name: "Dr. Budi Santoso",
    position: "Waste Management Specialist",
    image: "/images/hero-bg.png",
  },
  {
    name: "Ir. Maya Indah",
    position: "Sustainability Consultant",
    image: "/images/hero-bg.png",
  },
  {
    name: "Dr. Rendra Pratama",
    position: "Environmental Analyst",
    image: "/images/hero-bg.png",
  },
  {
    name: "Ir. Nina Widya",
    position: "Environmental Project Manager",
    image: "/images/hero-bg.png",
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
            <CardTim
              key={index}
              name={member.name}
              position={member.position}
              image={member.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tim;
