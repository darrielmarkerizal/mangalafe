"use client";

import React, { useEffect, useState } from "react";
import CardTim from "../ui/card-tim";
import AnimatedCardWrapper from "@/lib/AnimatedCardWrapper";

const Tim = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const response = await fetch("/api/team");
        const data = await response.json();

        if (data.success) {
          // Filter only active members and sort by displayOrder
          const activeMembers = data.data
            .filter((member) => member.isActive)
            .sort((a, b) => a.displayOrder - b.displayOrder);

          setTeamMembers(activeMembers);
        } else {
          console.error("Error fetching team members:", data.error);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  if (isLoading) {
    return (
      <section>
        <div className="container mx-auto py-16 px-4">
          <div>
            <h1 className="font-montserrat text-[48px] font-bold text-primary">
              Tim Kami
            </h1>
            <span className="font-plus-jakarta-sans text-primary text-[18px]">
              Didukung oleh para ahli berpengalaman dan bersertifikasi, kami
              siap memberikan solusi lingkungan terbaik untuk Anda.
            </span>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Loading skeleton */}
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-video md:aspect-square rounded-[12px]"></div>
                <div className="py-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
          {teamMembers.map((member) => (
            <AnimatedCardWrapper key={member.id}>
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
