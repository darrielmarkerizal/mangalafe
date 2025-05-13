"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Users,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  X,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

import TeamMembersList from "@/components/cms/team/team-members-list";
import TeamMemberDialog from "@/components/cms/team/team-member-dialog";
import DeleteConfirmDialog from "@/components/cms/team/delete-confirm-dialog";
import TeamMembersLoading from "@/components/cms/team/team-members-loading";
import EmptyTeamState from "@/components/cms/team/empty-team-state";
import NetworkErrorDialog from "@/components/cms/team/network-error-dialog";

export default function TeamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get pagination parameters from URL or use defaults
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const isActiveFilter = searchParams.get("isActive");
  const sortBy = searchParams.get("sortBy") || "displayOrder";
  const sortOrder = searchParams.get("sortOrder") || "ASC";

  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [networkErrorDetails, setNetworkErrorDetails] = useState(null);
  const [showNetworkErrorDialog, setShowNetworkErrorDialog] = useState(false);
  const [retryUpload, setRetryUpload] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Local state for search that will be applied on submit
  const [searchTerm, setSearchTerm] = useState(search);
  const [activeFilter, setActiveFilter] = useState(isActiveFilter);
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);
  const [currentLimit, setCurrentLimit] = useState(limit.toString());

  // Add a new state for filter visibility on mobile
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchTeamMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, isActiveFilter, sortBy, sortOrder]);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);

      // Build query string for API request
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      if (search) queryParams.append("search", search);
      if (isActiveFilter !== null && isActiveFilter !== undefined) {
        queryParams.append("isActive", isActiveFilter);
      }

      queryParams.append("sortBy", sortBy);
      queryParams.append("sortOrder", sortOrder);

      const response = await axios.get(`/api/team?${queryParams.toString()}`);

      if (response.data.success) {
        setTeamMembers(response.data.data);
        setPagination(response.data.meta);
      } else {
        toast.error("Gagal memuat data tim");
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Gagal memuat data tim");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTeamMembers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);

        // Update displayOrder values
        const updatedArray = newArray.map((item, index) => ({
          ...item,
          displayOrder: index + (page - 1) * limit,
        }));

        // Save new order to database
        updateMembersOrder(updatedArray);

        return updatedArray;
      });
    }
  };

  const updateMembersOrder = async (updatedMembers) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        router.push("/admin");
        return;
      }

      await axios.post("/api/team/reorder", updatedMembers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error updating member order:", error);
      toast.error("Gagal memperbarui urutan anggota tim");
    }
  };

  const handleToggleActive = async (member) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        router.push("/admin");
        return;
      }

      await axios.patch(
        `/api/team/${member.id}`,
        { isActive: !member.isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setTeamMembers(
        teamMembers.map((m) =>
          m.id === member.id ? { ...m, isActive: !m.isActive } : m
        )
      );

      toast.success(
        `Anggota tim "${member.name}" telah ${
          !member.isActive ? "diaktifkan" : "dinonaktifkan"
        }`
      );
    } catch (error) {
      console.error("Error toggling active status:", error);
      toast.error("Gagal mengubah status anggota tim");
    }
  };

  const handleEditMember = (member) => {
    setCurrentMember(member);
    setIsDialogOpen(true);
  };

  const handleAddNewMember = () => {
    setCurrentMember(null);
    setIsDialogOpen(true);
  };

  const handleDeleteMember = (member) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      setIsDeleting(true);
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        router.push("/admin");
        return;
      }

      await axios.delete(`/api/team/${memberToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeamMembers(teamMembers.filter((m) => m.id !== memberToDelete.id));
      toast.success(`Anggota tim "${memberToDelete.name}" berhasil dihapus`);
      setIsDeleteDialogOpen(false);

      // Refresh the data after deletion
      fetchTeamMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Gagal menghapus anggota tim");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveMember = async (memberData) => {
    try {
      setIsSaving(true);
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        router.push("/admin");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let response;
      if (currentMember) {
        // Update existing member
        response = await axios.put(
          `/api/team/${currentMember.id}`,
          memberData,
          {
            headers,
          }
        );
      } else {
        // Create new member
        response = await axios.post(
          "/api/team",
          {
            ...memberData,
            displayOrder: pagination.totalItems,
          },
          { headers }
        );
      }

      if (response.data.success) {
        fetchTeamMembers();
        setIsDialogOpen(false);
        toast.success(
          currentMember
            ? `Anggota tim "${memberData.name}" berhasil diperbarui`
            : `Anggota tim "${memberData.name}" berhasil ditambahkan`
        );
      } else {
        toast.error("Gagal menyimpan anggota tim");
      }
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Gagal menyimpan anggota tim");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUploadError = (error, file) => {
    setNetworkErrorDetails(error);
    setRetryUpload(file);
    setShowNetworkErrorDialog(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    updateQueryParams({ page: newPage });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    updateQueryParams({
      search: searchTerm,
      isActive: activeFilter,
      sortBy: currentSortBy,
      sortOrder: currentSortOrder,
      limit: currentLimit,
      page: 1, // Reset to first page when filters change
    });
  };

  const updateQueryParams = (params) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Update or add each parameter
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });

    // Navigate with the new search params
    router.push(`/admin/team?${newSearchParams.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveFilter(null);
    setCurrentSortBy("displayOrder");
    setCurrentSortOrder("ASC");
    setCurrentLimit("10");

    updateQueryParams({
      search: null,
      isActive: null,
      sortBy: "displayOrder",
      sortOrder: "ASC",
      limit: 10,
      page: 1,
    });
  };

  const toggleSortOrder = () => {
    const newOrder = currentSortOrder === "ASC" ? "DESC" : "ASC";
    setCurrentSortOrder(newOrder);
    updateQueryParams({ sortOrder: newOrder });
  };

  // Add a refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTeamMembers();
    setIsRefreshing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-4 md:py-6 lg:py-10 px-4 sm:px-6 lg:px-8"
    >
      <Card className="shadow-sm border-zinc-200/80 bg-white">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Users className="h-6 w-6 text-primary" />
                Manajemen Tim
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Kelola anggota tim yang ditampilkan di website
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-9"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button onClick={handleAddNewMember} size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-1.5" />
                Tambah Anggota
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Mobile filter toggle */}
        <div className="px-6 py-3 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex justify-between items-center text-muted-foreground"
          >
            <span className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter & Pencarian
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </Button>
        </div>

        {/* Filter section */}
        <CardContent className="pt-4 bg-white">
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: showFilters || window.innerWidth >= 768 ? "auto" : 0,
              opacity: showFilters || window.innerWidth >= 768 ? 1 : 0,
            }}
            className="overflow-hidden md:overflow-visible"
          >
            <form onSubmit={handleFilterSubmit} className="mb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-sm font-medium">
                    Cari
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Cari nama atau jabatan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select
                    value={activeFilter === null ? "all" : activeFilter}
                    onValueChange={(value) =>
                      setActiveFilter(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Semua status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua status</SelectItem>
                      <SelectItem value="true">Aktif</SelectItem>
                      <SelectItem value="false">Tidak aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortBy" className="text-sm font-medium">
                    Urutan
                  </Label>
                  <Select
                    value={currentSortBy}
                    onValueChange={setCurrentSortBy}
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="displayOrder">
                        Urutan tampilan
                      </SelectItem>
                      <SelectItem value="name">Nama</SelectItem>
                      <SelectItem value="position">Jabatan</SelectItem>
                      <SelectItem value="createdAt">Tanggal dibuat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit" className="text-sm font-medium">
                    Tampilkan
                  </Label>
                  <Select value={currentLimit} onValueChange={setCurrentLimit}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per halaman</SelectItem>
                      <SelectItem value="10">10 per halaman</SelectItem>
                      <SelectItem value="25">25 per halaman</SelectItem>
                      <SelectItem value="50">50 per halaman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:self-end">
                  <div className="flex items-center gap-2 h-10">
                    <Button type="submit" className="flex-1 h-10">
                      <Filter className="h-4 w-4 mr-2" />
                      Terapkan
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={toggleSortOrder}
                      className="h-10 w-10 p-0 flex items-center justify-center"
                      title={
                        currentSortOrder === "ASC"
                          ? "Urutkan Menurun"
                          : "Urutkan Menaik"
                      }
                    >
                      {currentSortOrder === "ASC" ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={clearFilters}
                      className="h-10 w-10 p-0 flex items-center justify-center"
                      title="Reset Filter"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>

          <Separator className="my-4" />

          <div className="overflow-hidden rounded-md">
            {isLoading ? (
              <TeamMembersLoading />
            ) : teamMembers.length === 0 ? (
              <EmptyTeamState onAddMember={handleAddNewMember} />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <div className="border rounded-md overflow-x-auto bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-100">
                        <TableHead className="w-[80px]">Foto</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Jabatan
                        </TableHead>
                        <TableHead className="text-center">Aktif</TableHead>
                        <TableHead>Aksi</TableHead>
                        <TableHead className="w-[60px] text-center">
                          <Badge
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            Urutan
                          </Badge>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SortableContext
                        items={teamMembers.map((member) => member.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <TeamMembersList
                          teamMembers={teamMembers}
                          onEdit={handleEditMember}
                          onDelete={handleDeleteMember}
                          onToggleActive={handleToggleActive}
                        />
                      </SortableContext>
                    </TableBody>
                  </Table>
                </div>
              </DndContext>
            )}
          </div>
        </CardContent>

        {/* Pagination Footer */}
        {!isLoading && teamMembers.length > 0 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t pt-6 pb-4 text-center sm:text-left bg-white gap-4 sm:gap-6">
            <div className="text-sm text-muted-foreground w-full sm:w-auto">
              Menampilkan {(page - 1) * limit + 1}-
              {Math.min(page * limit, pagination.totalItems)} dari{" "}
              {pagination.totalItems} anggota tim
            </div>

            <Pagination className="w-full sm:w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    className={
                      !pagination.hasPrevPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    return (
                      p === 1 ||
                      p === pagination.totalPages ||
                      (p >= page - 1 && p <= page + 1)
                    );
                  })
                  .map((p, i, arr) => {
                    if (i > 0 && arr[i - 1] !== p - 1) {
                      return (
                        <React.Fragment key={`ellipsis-${p}`}>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              isActive={page === p}
                              onClick={() => handlePageChange(p)}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      );
                    }

                    return (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={page === p}
                          onClick={() => handlePageChange(p)}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    className={
                      !pagination.hasNextPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      {/* Team Member Dialog */}
      <TeamMemberDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={currentMember}
        onSave={handleSaveMember}
        isSaving={isSaving}
        onUploadError={handleImageUploadError}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        member={memberToDelete}
        onConfirm={confirmDeleteMember}
        isDeleting={isDeleting}
      />

      {/* Network Error Dialog */}
      <NetworkErrorDialog
        isOpen={showNetworkErrorDialog}
        onOpenChange={setShowNetworkErrorDialog}
        errorDetails={networkErrorDetails}
        retryFile={retryUpload}
      />
    </motion.div>
  );
}
