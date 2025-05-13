"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import useRouter
import CardPortfolio from "../ui/card-portofolio";
import CTAButton from "../ui/CTAbutton";

const PengalamanKami = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "/api/project?page=1&perPage=3&sortBy=createdAt&sortOrder=DESC"
        );
        setProjects(response.data.data); // Extract the 'data' array from the response
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="bg-primary flex justify-center">Loading...</div>;
  }

  const isValidImageUrl = (url) => {
    if (!url) return false;
    if (url.startsWith("data:image/")) return true;
    if (/^[^\/]+\.[a-zA-Z]+$/.test(url)) return false;

    try {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        new URL(url);
        return true;
      }
      if (url.startsWith("/")) return true;
      return false;
    } catch (e) {
      return false;
    }
  };

  const getProjectDescription = (project) => {
    if (project.description) return project.description;
    return `Proyek ${project.name} yang diinisiasi oleh ${project.initiator} pada tahun ${project.period}`;
  };

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-[48px] font-montserrat text-white font-bold text-center mb-8">
          Pengalaman Kami
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {projects.map((project) => (
            <CardPortfolio
              key={project.id}
              type="list-no-image"
              title={project.name}
              description={getProjectDescription(project)}
              imageUrl={
                isValidImageUrl(project.photo) ? project.photo : "/logo.svg"
              }
              service={project.Services.map((service) => service.name)}
              client={project.initiator}
              period={project.period}
              link={`/portfolio/${project.id}`}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <CTAButton
            variant="green"
            className="text-primary font-bold py-2 px-4 rounded hover:text-primary hover:bg-white/30"
            onClick={() => router.push("/portofolio")} // Update navigation
          >
            Lihat Selengkapnya
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default PengalamanKami;
