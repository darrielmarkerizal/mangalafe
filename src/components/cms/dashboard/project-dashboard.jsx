"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ProjectTableDashboard } from "./project-table-dashboard";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  RefreshCwIcon,
  FileTextIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/cms/dashboard/components/stat-card";
import {
  MapIcon,
  ClipboardCheckIcon,
  ActivityIcon,
  BarChartIcon,
  HomeIcon,
  CarIcon,
  SearchIcon,
} from "lucide-react";

export function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState({});
  const router = useRouter();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/project/dashboard");
      if (response.data.success) {
        setProjects(response.data.data.latestProjects);
        const mappedStats = [
          {
            title: "Total Proyek",
            value: response.data.data.total,
            description: "Semua proyek dalam database",
            icon: FileTextIcon,
          },
          {
            title: "PKKPR",
            value:
              response.data.data.byService.find(
                (s) => s.name === "PKKPR & PKKPRL"
              )?.count || 0,
            description: "Persetujuan Kesesuaian",
            icon: MapIcon,
            iconColor: "text-blue-500",
          },
          {
            title: "AMDAL",
            value:
              response.data.data.byService.find(
                (s) => s.name === "AMDAL & DELH"
              )?.count || 0,
            description: "Analisis Dampak Lingkungan",
            icon: ActivityIcon,
            iconColor: "text-green-500",
          },
          {
            title: "UKL-UPL",
            value:
              response.data.data.byService.find(
                (s) => s.name === "UKL-UPL & DPLH"
              )?.count || 0,
            description: "Upaya Pengelolaan",
            icon: ClipboardCheckIcon,
            iconColor: "text-yellow-500",
          },
          {
            title: "Pemantauan",
            value:
              response.data.data.byService.find(
                (s) =>
                  s.name === "Laporan Pemantauan dan Pengelolaan Lingkungan"
              )?.count || 0,
            description: "Laporan Pemantauan",
            icon: BarChartIcon,
            iconColor: "text-purple-500",
          },
          {
            title: "PERTEK",
            value:
              response.data.data.byService.find((s) => s.name === "PERTEK")
                ?.count || 0,
            description: "Persetujuan Teknis",
            icon: FileTextIcon,
            iconColor: "text-red-500",
          },
          {
            title: "LARAP",
            value:
              response.data.data.byService.find((s) => s.name === "LARAP")
                ?.count || 0,
            description: "Land Acquisition",
            icon: HomeIcon,
            iconColor: "text-orange-500",
          },
          {
            title: "Transportasi",
            value:
              response.data.data.byService.find(
                (s) => s.name === "Studi dan Kajian Bidang Transportasi"
              )?.count || 0,
            description: "Studi Transportasi",
            icon: CarIcon,
            iconColor: "text-teal-500",
          },
          {
            title: "Survey",
            value:
              response.data.data.byService.find(
                (s) => s.name === "Jasa Survey Lingkungan"
              )?.count || 0,
            description: "Jasa Survey Lingkungan",
            icon: SearchIcon,
            iconColor: "text-indigo-500",
          },
        ];
        setStatsData(mappedStats);
      } else {
        toast.error("Gagal memuat data dashboard", {
          description: response.data.message,
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Gagal memuat data dashboard. Silakan coba lagi nanti.",
      });
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
          fetchDashboardData();
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
    <div className="space-y-8">
      {/* Header with summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-2">Dashboard Proyek</h1>
        <p className="text-muted-foreground">
          Ringkasan data proyek PT Mangala Dipa. Total{" "}
          {isLoading ? "..." : statsData[0]?.value || 0} proyek tercatat dalam
          sistem.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {statsData.length > 0
          ? statsData.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                iconColor={stat.iconColor}
                isLoading={isLoading}
              />
            ))
          : // Skeleton placeholder saat data belum ada
            Array(9)
              .fill(0)
              .map((_, index) => (
                <StatCard
                  key={index}
                  title=""
                  value=""
                  description=""
                  icon={FileTextIcon}
                  isLoading={true}
                />
              ))}
      </div>

      {/* Project Table Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-primary" />
            Proyek Terbaru
          </h2>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCwIcon
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Link href="/admin/projects/create">
              <Button variant="default" size="sm" className="gap-2">
                <PlusIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Proyek Baru</span>
              </Button>
            </Link>
          </div>
        </div>

        <ProjectTableDashboard
          projects={projects}
          isLoading={isLoading}
          onView={handleViewProject}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />

        <div className="flex justify-end mt-6">
          <Link href="/admin/projects">
            <Button
              variant="outline"
              className="flex items-center gap-2 transition-all hover:pr-5"
            >
              Lihat Semua Proyek
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
