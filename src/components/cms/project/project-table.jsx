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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  // Generate a range of years from 2000 to current year (without future years)
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
      // Get token from cookie instead of  for better security
      // This assumes you have a js-cookie or similar library
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-montserrat)]">
          Proyek
        </h1>
        <p className="text-muted-foreground mt-2 font-[family-name:var(--font-plus-jakarta-sans)]">
          Kelola semua proyek konsultasi lingkungan.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari proyek atau layanan..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary">
              Cari
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchProjects()}
              disabled={isLoading}
            >
              <RefreshCwIcon
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={() => router.push("/admin/projects/create")}
              size="sm"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Tambah Proyek
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="shadow-md border border-slate-200">
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">
                  <FilterIcon className="h-4 w-4 inline-block mr-2 text-muted-foreground" />
                  Filter Proyek
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="rounded-full h-8 w-8 p-0"
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <CardDescription>
                Pilih opsi filter untuk menyaring proyek berdasarkan tahun dan
                layanan
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 pb-2">
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Filter berdasarkan tahun periode proyek
                  </p>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Filter berdasarkan jenis layanan proyek
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 pt-3 pb-4 border-t mt-4">
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
            </CardFooter>
          </Card>
        )}

        {(yearFilter !== "all_years" || serviceFilter !== "all_services") && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter aktif:</span>
            <div className="flex flex-wrap gap-2">
              {yearFilter !== "all_years" && (
                <Badge variant="secondary" className="gap-1">
                  Tahun: {yearFilter}
                  <XIcon
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setYearFilter("all_years");
                      fetchProjects({
                        period: "",
                        service:
                          serviceFilter === "all_services" ? "" : serviceFilter,
                      });
                    }}
                  />
                </Badge>
              )}
              {serviceFilter !== "all_services" && (
                <Badge variant="secondary" className="gap-1">
                  Layanan:{" "}
                  {
                    availableServices.find(
                      (s) => s.id.toString() === serviceFilter
                    )?.name
                  }
                  <XIcon
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setServiceFilter("all_services");
                      fetchProjects({
                        period: yearFilter === "all_years" ? "" : yearFilter,
                        service: "",
                      });
                    }}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
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

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select
              value={perPage.toString()}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ProjectTableDashboard
          projects={projects}
          isLoading={isLoading}
          onView={handleViewProject}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />

        {metadata.totalPages > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Menampilkan {projects.length} dari {metadata.totalItems} proyek
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={metadata.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
