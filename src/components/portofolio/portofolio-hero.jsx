"use client";
import React, { useState, useEffect } from "react";
import CardPortfolio from "../ui/card-portofolio";
import axios from "axios";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

const SORT_OPTIONS = {
  "createdAt-DESC": {
    label: "Terbaru",
    icon: "↓",
  },
  "createdAt-ASC": {
    label: "Terlama",
    icon: "↑",
  },
  "name-ASC": {
    label: "Nama (A-Z)",
    icon: "↓",
  },
  "name-DESC": {
    label: "Nama (Z-A)",
    icon: "↑",
  },
  "period-DESC": {
    label: "Periode Terbaru",
    icon: "↓",
  },
  "period-ASC": {
    label: "Periode Terlama",
    icon: "↑",
  },
};

const PortfolioHero = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(6);
  const [itemsPerPage, setItemsPerPage] = useState("6");
  const [sortOption, setSortOption] = useState("createdAt-DESC");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/service");
        if (response.data.success) {
          setServices(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const fetchProjects = async (resetPage = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: resetPage ? 1 : currentPage,
        perPage: itemsPerPage,
        sortBy,
        sortOrder,
      });

      if (search) params.append("search", search);
      if (selectedPeriod !== "all") params.append("period", selectedPeriod);
      if (selectedService !== "all") params.append("service", selectedService);

      try {
        const response = await axios.get(`/api/project?${params}`);

        if (response.data.success && response.data.data) {
          setProjects(response.data.data);
          setTotalPages(response.data.metadata?.totalPages || 1);
          setCurrentPage(resetPage ? 1 : currentPage);
        } else {
          setProjects([]);
          setTotalPages(1);
          setCurrentPage(1);
        }
      } catch (apiError) {
        if (apiError.response?.status === 404) {
          setProjects([]);
          setTotalPages(1);
          setCurrentPage(1);
        } else {
          throw apiError;
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
      setTotalPages(1);
      setCurrentPage(1);

      if (error.code === "ERR_NETWORK") {
        toast.error("Gagal terhubung ke server", {
          description: "Periksa koneksi internet Anda dan coba lagi",
        });
      } else if (error.response?.status !== 404) {
        toast.error("Terjadi kesalahan", {
          description: "Gagal memuat data proyek. Silakan coba lagi nanti",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        fetchProjects();
      } catch (error) {
        console.error("Error in fetch effect:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    currentPage,
    sortBy,
    sortOrder,
    itemsPerPage,
    search,
    selectedPeriod,
    selectedService,
  ]);

  useEffect(() => {
    const [field, order] = sortOption.split("-");
    setSortBy(field);
    setSortOrder(order);
  }, [sortOption]);

  const years = Array.from(
    { length: new Date().getFullYear() - 1999 },
    (_, i) => 2000 + i
  );

  const handleFilter = () => {
    fetchProjects(true);
  };

  const handleResetFilter = async () => {
    setSortOption("createdAt-DESC");
    setSelectedPeriod("all");
    setSelectedService("all");
    setSearch("");
    setCurrentPage(1);
    setItemsPerPage("6");

    try {
      setIsLoading(true);
      const response = await axios.get(
        "/api/project?page=1&perPage=6&sortBy=createdAt&sortOrder=DESC"
      );
      setProjects(response.data.data || []);
      setTotalPages(response.data.metadata?.totalPages || 1);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error resetting projects:", error);
      setProjects([]);
      setTotalPages(1);

      if (error.response?.status !== 404) {
        toast.error("Gagal memuat ulang data", {
          description: "Silakan refresh halaman dan coba lagi",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFilter = async (type) => {
    setIsLoading(true);
    try {
      switch (type) {
        case "search":
          setSearch("");
          break;
        case "period":
          setSelectedPeriod("all");
          break;
        case "service":
          setSelectedService("all");
          break;
        case "sort":
          setSortOption("createdAt-DESC");
          setSortBy("createdAt");
          setSortOrder("DESC");
          break;
        default:
          break;
      }

      await Promise.resolve();

      const params = new URLSearchParams({
        page: 1,
        perPage: itemsPerPage,
        sortBy: type === "sort" ? "createdAt" : sortBy,
        sortOrder: type === "sort" ? "DESC" : sortOrder,
      });

      if (type !== "search" && search) params.append("search", search);
      if (type !== "period" && selectedPeriod !== "all")
        params.append("period", selectedPeriod);
      if (type !== "service" && selectedService !== "all")
        params.append("service", selectedService);

      try {
        const response = await axios.get(`/api/project?${params}`);

        if (response.data.success && response.data.data) {
          setProjects(response.data.data);
          setTotalPages(response.data.metadata?.totalPages || 1);
          setCurrentPage(1);
        } else {
          throw new Error("No data found");
        }
      } catch (apiError) {
        if (
          apiError.response?.status === 404 ||
          apiError.message === "No data found"
        ) {
          setProjects([]);
          setTotalPages(1);
          setCurrentPage(1);
        } else {
          throw apiError;
        }
      }
    } catch (error) {
      console.error("Error removing filter:", error);

      setProjects([]);
      setTotalPages(1);
      setCurrentPage(1);

      if (error.response?.status !== 404) {
        toast.error("Gagal memuat data", {
          description: "Silakan coba lagi nanti",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    <section className="mt-[72px]">
      <div className="container px-4 mx-auto py-16">
        <div className="flex flex-col text-center">
          <h1 className="text-primary text-[36px] md:text-[48px] mb-5 font-bold font-montserrat leading-[120%]">
            Portofolio Proyek Kami
          </h1>
          <p className="font-plus-jakarta-sans text-primary text-[16px] mb-12 max-w-2xl mx-auto">
            Temukan pengalaman kami dalam mendukung pembangunan berkelanjutan
            melalui proyek-proyek lingkungan di berbagai wilayah Indonesia.
          </p>
        </div>

        <div className="mb-8 space-y-4 bg-background rounded-lg p-4 shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari proyek..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFilter();
                    }
                  }}
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 whitespace-nowrap hover:bg-primary hover:text-white transition-colors duration-200"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px] p-6">
                  <SheetHeader className="space-y-4 mb-8">
                    <SheetTitle className="text-xl font-bold text-primary">
                      Filter Proyek
                    </SheetTitle>
                    <SheetDescription className="text-base">
                      Sesuaikan pencarian proyek berdasarkan kriteria berikut
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-8 pb-20">
                    <div className="space-y-4">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <span className="text-primary">●</span> Periode
                      </label>
                      <Select
                        value={selectedPeriod}
                        onValueChange={setSelectedPeriod}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih tahun" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="font-medium">
                            Semua tahun
                          </SelectItem>
                          {years.reverse().map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <span className="text-primary">●</span> Layanan
                      </label>
                      <Select
                        value={selectedService}
                        onValueChange={setSelectedService}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih layanan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="font-medium">
                            Semua layanan
                          </SelectItem>
                          {services.map((service) => (
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
                    <div className="space-y-4">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <span className="text-primary">●</span> Urutkan
                      </label>
                      <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Urutan" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(SORT_OPTIONS).map(
                            ([value, option]) => (
                              <SelectItem
                                key={value}
                                value={value}
                                className="flex items-center justify-between"
                              >
                                <span>{option.label}</span>
                                <span className="text-muted-foreground">
                                  {option.icon}
                                </span>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleResetFilter();
                          document
                            .querySelector("[data-radix-collection-item]")
                            ?.click();
                        }}
                        className="hover:bg-destructive/10"
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={() => {
                          handleFilter();
                          const closeButton = document.querySelector(
                            "[data-radix-collection-item]"
                          );
                          if (closeButton) closeButton.click();
                        }}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Terapkan Filter
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {(search ||
            selectedPeriod !== "all" ||
            selectedService !== "all" ||
            sortOption !== "createdAt-DESC") && (
            <div className="flex flex-wrap gap-2 animate-in fade-in-0 duration-500">
              {search && (
                <Badge
                  variant="secondary"
                  className="gap-2 px-3 py-1.5 hover:bg-destructive/20 transition-colors cursor-pointer group"
                  onClick={() => handleRemoveFilter("search")}
                >
                  <Search className="h-3 w-3" />
                  <span className="group-hover:line-through">{search}</span>
                  <span className="ml-1 text-muted-foreground group-hover:text-destructive">
                    ×
                  </span>
                </Badge>
              )}
              {selectedPeriod !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-2 px-3 py-1.5 hover:bg-destructive/20 transition-colors cursor-pointer group"
                  onClick={() => handleRemoveFilter("period")}
                >
                  <span className="text-primary">●</span>
                  <span className="group-hover:line-through">
                    Tahun: {selectedPeriod}
                  </span>
                  <span className="ml-1 text-muted-foreground group-hover:text-destructive">
                    ×
                  </span>
                </Badge>
              )}
              {selectedService !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-2 px-3 py-1.5 hover:bg-destructive/20 transition-colors cursor-pointer group"
                  onClick={() => handleRemoveFilter("service")}
                >
                  <span className="text-primary">●</span>
                  <span className="group-hover:line-through">
                    Layanan:{" "}
                    {
                      services.find((s) => s.id.toString() === selectedService)
                        ?.name
                    }
                  </span>
                  <span className="ml-1 text-muted-foreground group-hover:text-destructive">
                    ×
                  </span>
                </Badge>
              )}
              {sortOption !== "createdAt-DESC" && (
                <Badge
                  variant="secondary"
                  className="gap-2 px-3 py-1.5 hover:bg-destructive/20 transition-colors cursor-pointer group"
                  onClick={() => handleRemoveFilter("sort")}
                >
                  <ArrowUpDown className="h-3 w-3" />
                  <span className="group-hover:line-through">
                    {SORT_OPTIONS[sortOption].label}
                  </span>
                  <span className="ml-1 text-muted-foreground group-hover:text-destructive">
                    ×
                  </span>
                </Badge>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px] bg-background/50 rounded-lg border border-dashed">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Memuat proyek...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px] bg-background/50 rounded-lg border border-dashed">
            <div className="text-center space-y-4 max-w-md mx-auto px-4">
              <div className="space-y-2">
                <p className="text-lg font-medium text-primary">
                  Tidak Ada Proyek
                </p>
                <p className="text-sm text-muted-foreground">
                  Tidak ada proyek yang sesuai dengan kriteria pencarian Anda.
                  Silakan coba:
                </p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2 text-left list-disc list-inside">
                <li>Mengubah kata kunci pencarian</li>
                <li>Memilih periode tahun yang berbeda</li>
                <li>Memilih kategori layanan lainnya</li>
                <li>Menghapus beberapa filter yang aktif</li>
              </ul>
              <Button
                variant="outline"
                onClick={handleResetFilter}
                className="mt-4 hover:bg-primary hover:text-white transition-colors"
              >
                Reset Semua Filter
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <CardPortfolio
                  key={project.id}
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

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-6 bg-background rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground w-full sm:w-auto">
                <span>Menampilkan</span>
                <Select
                  value={itemsPerPage}
                  onValueChange={(value) => {
                    setItemsPerPage(value);
                    setCurrentPage(1);
                    fetchProjects(true);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                  </SelectContent>
                </Select>
                <span>item per halaman</span>
              </div>

              <div className="w-full sm:w-auto flex justify-center sm:ml-auto">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="hover:bg-primary hover:text-white transition-colors"
                      />
                    </PaginationItem>
                    {Array.from(
                      { length: Math.max(totalPages, 1) },
                      (_, i) => i + 1
                    ).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className={`hover:bg-primary/10 transition-colors ${
                            currentPage === page
                              ? "bg-primary text-white hover:bg-primary/90"
                              : ""
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, Math.max(totalPages, 1))
                          )
                        }
                        disabled={currentPage === Math.max(totalPages, 1)}
                        className="hover:bg-primary hover:text-white transition-colors"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PortfolioHero;
