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
import Cookies from "js-cookie";

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

        // Create Total Proyek card first
        const mappedStats = [
          {
            title: "Total Proyek",
            value: response.data.data.total,
            description: "Semua proyek dalam database",
            icon: FileTextIcon,
          },
        ];

        // Add separate card for each service with appropriate icon
        const serviceIconMap = {
          PKKPR: {
            icon: MapIcon,
            color: "text-blue-500",
            desc: "Persetujuan Kesesuaian",
          },
          PKKPRL: {
            icon: MapIcon,
            color: "text-blue-500",
            desc: "Persetujuan Kesesuaian",
          },
          AMDAL: {
            icon: ActivityIcon,
            color: "text-green-500",
            desc: "Analisis Dampak Lingkungan",
          },
          DELH: {
            icon: ActivityIcon,
            color: "text-green-500",
            desc: "Dokumen Evaluasi Lingkungan Hidup",
          },
          "UKL-UPL": {
            icon: ClipboardCheckIcon,
            color: "text-yellow-500",
            desc: "Upaya Pengelolaan",
          },
          DPLH: {
            icon: ClipboardCheckIcon,
            color: "text-yellow-500",
            desc: "Dokumen Pengelolaan Lingkungan Hidup",
          },
          "Laporan Pemantauan dan Pengelolaan Lingkungan": {
            icon: BarChartIcon,
            color: "text-purple-500",
            desc: "Laporan Pemantauan",
          },
          PERTEK: {
            icon: FileTextIcon,
            color: "text-red-500",
            desc: "Persetujuan Teknis",
          },
          LARAP: {
            icon: HomeIcon,
            color: "text-orange-500",
            desc: "Land Acquisition",
          },
          "Studi dan Kajian Bidang Transportasi": {
            icon: CarIcon,
            color: "text-teal-500",
            desc: "Studi Transportasi",
          },
          "Jasa Survey Lingkungan": {
            icon: SearchIcon,
            color: "text-indigo-500",
            desc: "Jasa Survey",
          },
          ANDALIN: {
            icon: ActivityIcon,
            color: "text-emerald-500",
            desc: "Analisis Dampak Lalu Lintas",
          },
        };

        // Map each service to a stat card
        response.data.data.byService.forEach((service) => {
          // Extract base service name (without trailing spaces)
          const baseName = service.name.trim();
          const serviceConfig = serviceIconMap[baseName] || {
            icon: FileTextIcon,
            color: "text-gray-500",
            desc: baseName,
          };

          mappedStats.push({
            title: baseName,
            value: service.count,
            description: serviceConfig.desc,
            icon: serviceConfig.icon,
            iconColor: serviceConfig.color,
          });
        });

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

  const handleDeleteProject = async (projectId) => {
    console.log("Delete request for project ID:", projectId);

    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        return;
      }

      const response = await axios.delete(`/api/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Delete API response:", response.data);

      if (response.data.success) {
        toast.success("Proyek berhasil dihapus");
        // Refresh project list
        fetchDashboardData();
      } else {
        console.error("API returned error:", response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(`Gagal menghapus proyek: ${error.message}`);
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
                Ringkasan data proyek PT Mangala Dipa Lokatara. Total{" "}
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
