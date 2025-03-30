"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ProjectTableDashboard } from "./project-table-dashboard";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState({});
  const router = useRouter();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // Mengambil hanya 5 proyek terbaru untuk dashboard
      const response = await axios.get(
        "/api/project?page=1&perPage=5&latest=true"
      );
      if (response.data.success) {
        setProjects(response.data.data);
        setMetadata(response.data.metadata);
      } else {
        toast.error("Gagal memuat data proyek", {
          description: response.data.message,
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Gagal memuat data proyek. Silakan coba lagi nanti.",
      });
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleViewProject = (project) => {
    router.push(`/admin/projects/${project.id}`);
  };

  const handleEditProject = (project) => {
    router.push(`/admin/projects/${project.id}/edit`);
  };

  const handleDeleteProject = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      try {
        const response = await axios.delete(`/api/project/${id}`);
        if (response.data.success) {
          toast.success("Proyek berhasil dihapus");
          fetchProjects();
        } else {
          toast.error("Gagal menghapus proyek", {
            description: response.data.message,
          });
        }
      } catch (error) {
        toast.error("Terjadi kesalahan", {
          description: "Gagal menghapus proyek. Silakan coba lagi nanti.",
        });
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Proyek Terbaru</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProjects}
            disabled={isLoading}
          >
            <RefreshCwIcon
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <ProjectTableDashboard
        projects={projects}
        isLoading={isLoading}
        onView={handleViewProject}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />

      <div className="flex justify-center mt-4">
        <Link href="/admin/projects">
          <Button variant="outline" className="flex items-center gap-2">
            Lihat Semua Proyek
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
