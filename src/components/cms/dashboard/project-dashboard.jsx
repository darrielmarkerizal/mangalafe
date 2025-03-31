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
  LayoutDashboardIcon,
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
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStats, setFilteredStats] = useState([]);
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
        setFilteredStats(mappedStats);
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

  // Filter stats when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStats(statsData);
      return;
    }

    const filtered = statsData.filter(
      (stat) =>
        stat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStats(filtered);
  }, [searchQuery, statsData]);

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Header with Search */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border overflow-hidden relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mt-32 -mr-32 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <LayoutDashboardIcon className="h-6 w-6 text-primary" />
                Dashboard Proyek
              </h1>
              <p className="text-muted-foreground mt-1">
                Ringkasan data proyek PT Mangala Dipa. Total{" "}
                <span className="font-semibold text-foreground">
                  {isLoading ? "..." : statsData[0]?.value || 0}
                </span>{" "}
                proyek tercatat dalam sistem.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari statistik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 h-9 w-full max-w-[200px] bg-muted/20"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDashboardData}
                disabled={isLoading}
                className="h-9"
              >
                <RefreshCwIcon
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards with Tabbed View for Mobile */}
      <div className="block md:hidden">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 grid grid-cols-3 h-auto p-1">
            <TabsTrigger value="all" className="text-xs py-2">
              Semua
            </TabsTrigger>
            <TabsTrigger value="popular" className="text-xs py-2">
              Utama
            </TabsTrigger>
            <TabsTrigger value="other" className="text-xs py-2">
              Lainnya
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 grid-cols-1 sm:grid-cols-2"
            >
              <AnimatePresence>
                {(filteredStats.length > 0 ? filteredStats : statsData).map(
                  (stat, index) => (
                    <motion.div
                      key={stat.title}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <StatCard
                        title={stat.title}
                        value={stat.value}
                        description={stat.description}
                        icon={stat.icon}
                        iconColor={stat.iconColor}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          <TabsContent value="popular">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 grid-cols-1 sm:grid-cols-2"
            >
              <AnimatePresence>
                {(filteredStats.length > 0 ? filteredStats : statsData)
                  .slice(0, 4)
                  .map((stat) => (
                    <motion.div
                      key={stat.title}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <StatCard
                        title={stat.title}
                        value={stat.value}
                        description={stat.description}
                        icon={stat.icon}
                        iconColor={stat.iconColor}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          <TabsContent value="other">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 grid-cols-1 sm:grid-cols-2"
            >
              <AnimatePresence>
                {(filteredStats.length > 0 ? filteredStats : statsData)
                  .slice(4)
                  .map((stat) => (
                    <motion.div
                      key={stat.title}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <StatCard
                        title={stat.title}
                        value={stat.value}
                        description={stat.description}
                        icon={stat.icon}
                        iconColor={stat.iconColor}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Stats Grid */}
      <div className="hidden md:block">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:gap-6 grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <AnimatePresence>
            {(filteredStats.length > 0 ? filteredStats : statsData).map(
              (stat, index) => (
                <motion.div
                  key={stat.title}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <StatCard
                    title={stat.title}
                    value={stat.value}
                    description={stat.description}
                    icon={stat.icon}
                    iconColor={stat.iconColor}
                    isLoading={isLoading}
                  />
                </motion.div>
              )
            )}

            {/* Placeholder for no results when filtering */}
            {filteredStats.length === 0 && !isLoading && searchQuery && (
              <motion.div
                className="col-span-full flex flex-col items-center justify-center py-8 text-center bg-white rounded-xl border p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <SearchIcon className="h-10 w-10 text-muted-foreground/30 mb-2" />
                <p className="text-sm font-medium">Tidak ada hasil ditemukan</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tidak dapat menemukan statistik untuk "{searchQuery}"
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Hapus Pencarian
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Table Section */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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
                <span className="inline sm:hidden">Tambah</span>
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

        <motion.div className="flex justify-end mt-6" whileHover="hover">
          <Link href="/admin/projects">
            <Button variant="outline" className="flex items-center gap-2 group">
              Lihat Semua Proyek
              <motion.div
                variants={{
                  hover: { x: 5 },
                }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRightIcon className="h-4 w-4" />
              </motion.div>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
