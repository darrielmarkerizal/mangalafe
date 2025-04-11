"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { ProjectTableDashboard } from "@/components/cms/dashboard/project-table-dashboard";
import { Pagination } from "@/components/cms/dashboard/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  FilterIcon,
  XIcon,
  AlertCircleIcon,
  TrashIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [metadata, setMetadata] = useState({
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [yearFilter, setYearFilter] = useState("all_years");
  const [serviceFilter, setServiceFilter] = useState("all_services");
  const [availableServices, setAvailableServices] = useState([]);

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => currentYear - i
  );

  useEffect(() => {
    fetchProjects();
  }, [currentPage, perPage, sortBy, sortOrder]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchProjects = async (params = {}) => {
    setIsLoading(true);
    try {
      const queryParams = {
        search: searchQuery,
        page: currentPage,
        perPage: perPage,
        sortBy: sortBy,
        sortOrder: sortOrder,
        ...params,
      };

      Object.keys(queryParams).forEach(
        (key) => queryParams[key] === "" && delete queryParams[key]
      );

      try {
        const response = await axios.get("/api/project", {
          params: queryParams,
        });

        if (response.data.success) {
          setProjects(response.data.data);
          setMetadata(response.data.metadata);
        } else {
          setProjects([]);
          setMetadata({
            totalItems: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          });
          toast.error(response.data.message);
        }
      } catch (error) {
        // Handle 404 specifically - not an error but just empty data
        if (error.response && error.response.status === 404) {
          setProjects([]);
          setMetadata({
            totalItems: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          });

          // Show toast message for empty data
          toast.info("Data tidak ditemukan", {
            description:
              "Tidak ada proyek yang sesuai dengan kriteria pencarian.",
          });
        } else {
          // Handle other errors
          console.error("Error fetching projects:", error);
          toast.error("Gagal mengambil data proyek", {
            description: error.message,
          });
          setProjects([]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("/api/service", {
        params: {
          sortBy: "name",
          sortOrder: "ASC",
        },
      });

      if (response.data.success) {
        setAvailableServices(response.data.data);
      } else {
        toast.error("Gagal mengambil data layanan");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Gagal mengambil data layanan");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProjects({ search: searchQuery, page: 1 });
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchProjects({
      period: yearFilter === "all_years" ? "" : yearFilter,
      service: serviceFilter === "all_services" ? "" : serviceFilter,
      page: 1,
    });
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setYearFilter("all_years");
    setServiceFilter("all_services");
    setCurrentPage(1);
    fetchProjects({
      period: "",
      service: "",
      page: 1,
    });
    setShowFilters(false);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (value) => {
    setPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleViewProject = (project) => {
    router.push(`/admin/projects/${project.id}`);
  };

  const handleEditProject = (project) => {
    router.push(`/admin/projects/edit/${project.id}`);
  };

  const handleDeleteProject = (projectId) => {
    setProjectToDelete(projectId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        return;
      }

      const response = await axios.delete(
        `/api/project?id=${projectToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Proyek berhasil dihapus");
        fetchProjects();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Gagal menghapus proyek");
    } finally {
      setShowDeleteDialog(false);
      setProjectToDelete(null);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-5 border-b"
        >
          <form onSubmit={handleSearch} className="flex gap-2 w-full">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari proyek atau layanan..."
                className="pl-9 h-10 bg-muted/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" variant="secondary" className="h-10">
                Cari
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                variant={showFilters ? "default" : "outline"}
                size="icon"
                className="h-10 w-10"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="h-4 w-4" />
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* Active Filters */}
        <AnimatePresence>
          {(yearFilter !== "all_years" || serviceFilter !== "all_services") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-2 p-3 bg-muted/10 border-b overflow-hidden"
            >
              <span className="text-sm text-muted-foreground">
                Filter aktif:
              </span>
              <div className="flex flex-wrap gap-2">
                {yearFilter !== "all_years" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Badge variant="secondary" className="gap-1 px-2 py-1">
                      Tahun: {yearFilter}
                      <XIcon
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => {
                          setYearFilter("all_years");
                          fetchProjects({
                            period: "",
                            service:
                              serviceFilter === "all_services"
                                ? ""
                                : serviceFilter,
                          });
                        }}
                      />
                    </Badge>
                  </motion.div>
                )}
                {serviceFilter !== "all_services" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Badge variant="secondary" className="gap-1 px-2 py-1">
                      Layanan:{" "}
                      {
                        availableServices.find(
                          (s) => s.id.toString() === serviceFilter
                        )?.name
                      }
                      <XIcon
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => {
                          setServiceFilter("all_services");
                          fetchProjects({
                            period:
                              yearFilter === "all_years" ? "" : yearFilter,
                            service: "",
                          });
                        }}
                      />
                    </Badge>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-5 bg-muted/5 border-b overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center mb-1.5">
                    <span className="text-sm font-medium">Tahun Proyek</span>
                    {yearFilter !== "all_years" && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs font-normal"
                      >
                        {yearFilter}
                      </Badge>
                    )}
                  </div>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_years">Semua Tahun</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center mb-1.5">
                    <span className="text-sm font-medium">Jenis Layanan</span>
                    {serviceFilter !== "all_services" && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs font-normal truncate max-w-[200px]"
                      >
                        {
                          availableServices.find(
                            (s) => s.id.toString() === serviceFilter
                          )?.name
                        }
                      </Badge>
                    )}
                  </div>
                  <Select
                    value={serviceFilter}
                    onValueChange={setServiceFilter}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Pilih layanan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_services">
                        Semua Layanan
                      </SelectItem>
                      {availableServices.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                        >
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  size="sm"
                  className="font-normal"
                >
                  Reset Filter
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  size="sm"
                  className="font-medium"
                >
                  Terapkan Filter
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sort and Pagination Controls */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border-b"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Urut:</span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Urut berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nama</SelectItem>
                <SelectItem value="createdAt">Tanggal Dibuat</SelectItem>
                <SelectItem value="period">Tahun</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={toggleSortOrder}
            >
              {sortOrder === "ASC" ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProjects()}
                disabled={isLoading}
                className="h-9"
              >
                <RefreshCwIcon
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => router.push("/admin/projects/create")}
                size="sm"
                className="h-9"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Tambah Proyek
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Projects Table */}
        <ProjectTableDashboard
          projects={projects}
          isLoading={isLoading}
          onView={handleViewProject}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />

        {/* Pagination Footer */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border-t"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tampilkan:</span>
            <Select
              value={perPage.toString()}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger className="w-[80px] bg-white">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground ml-4">
              {metadata.totalItems > 0 ? (
                <>
                  Menampilkan {(currentPage - 1) * perPage + 1}-
                  {Math.min(currentPage * perPage, metadata.totalItems)} dari{" "}
                  {metadata.totalItems} proyek
                </>
              ) : (
                "Tidak ada proyek"
              )}
            </span>
          </div>

          {metadata.totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={metadata.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </motion.div>
      </div>

      {/* Enhanced Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AlertCircleIcon className="h-5 w-5" />
              </motion.div>
              Konfirmasi Hapus Proyek
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak
              dapat dibatalkan dan semua data terkait proyek akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-4 sm:space-x-4">
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 mr-2">
              Batal
            </AlertDialogCancel>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Hapus
              </AlertDialogAction>
            </motion.div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
