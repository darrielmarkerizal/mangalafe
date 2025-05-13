"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
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
  Plus,
  Users,
  Search as SearchIcon,
  SortAsc,
  SortDesc,
  Filter as FilterIcon,
  X as XIcon,
  RefreshCw as RefreshCwIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  AlertCircle as AlertCircleIcon,
  Trash as TrashIcon,
} from "lucide-react";

import TeamMembersList from "@/components/cms/team/team-members-list";
import TeamMemberDialog from "@/components/cms/team/team-member-dialog";
import DeleteConfirmDialog from "@/components/cms/team/delete-confirm-dialog";
import TeamMembersLoading from "@/components/cms/team/team-members-loading";
import EmptyTeamState from "@/components/cms/team/empty-team-state";
import NetworkErrorDialog from "@/components/cms/team/network-error-dialog";

function TeamPageContent() {
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

  const fetchTeamMembers = async (params = {}) => {
    try {
      setIsLoading(true);

      // Build query string for API request
      const queryParams = new URLSearchParams();
      queryParams.append("page", params.page || page);
      queryParams.append("limit", params.limit || limit);

      if (params.search || search)
        queryParams.append("search", params.search || search);

      const activeStatus =
        params.isActive !== undefined ? params.isActive : isActiveFilter;
      if (activeStatus !== null && activeStatus !== undefined) {
        queryParams.append("isActive", activeStatus);
      }

      queryParams.append("sortBy", params.sortBy || sortBy);
      queryParams.append("sortOrder", params.sortOrder || sortOrder);

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
      setTeamMembers([]);
      setPagination({
        page: 1,
        limit: 10,
        totalPages: 0,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateQueryParams({ search: searchTerm, page: 1 });
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
          m.id === member.id ? { ...m, isActive: !member.isActive } : m
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
          { headers }
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

  const handleApplyFilters = () => {
    updateQueryParams({
      isActive: activeFilter,
      sortBy: currentSortBy,
      sortOrder: currentSortOrder,
      limit: parseInt(currentLimit),
      page: 1,
    });
    setShowFilters(false);
  };

  const handleResetFilters = () => {
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

    setShowFilters(false);
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

  const handlePerPageChange = (value) => {
    setCurrentLimit(value);
    updateQueryParams({ limit: parseInt(value), page: 1 });
  };

  const handleSortChange = (value) => {
    setCurrentSortBy(value);
  };

  const toggleSortOrder = () => {
    const newOrder = currentSortOrder === "ASC" ? "DESC" : "ASC";
    setCurrentSortOrder(newOrder);
    updateQueryParams({ sortOrder: newOrder });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTeamMembers();
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
                placeholder="Cari nama atau jabatan..."
                className="pl-9 h-10 bg-muted/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          {activeFilter !== null && (
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
                {activeFilter !== null && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Badge variant="secondary" className="gap-1 px-2 py-1">
                      Status:{" "}
                      {activeFilter === "true" ? "Aktif" : "Tidak Aktif"}
                      <XIcon
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => {
                          setActiveFilter(null);
                          updateQueryParams({ isActive: null });
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
                    <span className="text-sm font-medium">Status Anggota</span>
                    {activeFilter !== null && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs font-normal"
                      >
                        {activeFilter === "true" ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    )}
                  </div>
                  <Select
                    value={activeFilter === null ? "all" : activeFilter}
                    onValueChange={(value) =>
                      setActiveFilter(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Status anggota" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="true">Aktif</SelectItem>
                      <SelectItem value="false">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center mb-1.5">
                    <span className="text-sm font-medium">Tampilkan</span>
                  </div>
                  <Select value={currentLimit} onValueChange={setCurrentLimit}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Item per halaman" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per halaman</SelectItem>
                      <SelectItem value="10">10 per halaman</SelectItem>
                      <SelectItem value="25">25 per halaman</SelectItem>
                      <SelectItem value="50">50 per halaman</SelectItem>
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
            <Select value={currentSortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Urut berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="displayOrder">Urutan tampilan</SelectItem>
                <SelectItem value="name">Nama</SelectItem>
                <SelectItem value="position">Jabatan</SelectItem>
                <SelectItem value="createdAt">Tanggal dibuat</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={toggleSortOrder}
            >
              {currentSortOrder === "ASC" ? (
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
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-9"
              >
                <RefreshCwIcon
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={handleAddNewMember} size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Anggota
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Team Members List */}
        <div className="overflow-hidden">
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
              <div className="overflow-x-auto">
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
                        <Badge variant="outline" className="whitespace-nowrap">
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

        {/* Pagination Footer */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border-t"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tampilkan:</span>
            <Select value={currentLimit} onValueChange={handlePerPageChange}>
              <SelectTrigger className="w-[80px] bg-white">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground ml-4">
              {pagination.totalItems > 0 ? (
                <>
                  Menampilkan {(page - 1) * limit + 1}-
                  {Math.min(page * limit, pagination.totalItems)} dari{" "}
                  {pagination.totalItems} anggota tim
                </>
              ) : (
                "Tidak ada anggota tim"
              )}
            </span>
          </div>

          {pagination.totalPages > 0 && (
            <div className="flex justify-center">
              <nav className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  <ChevronDownIcon className="h-4 w-4 rotate-90" />
                </Button>

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
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled
                          >
                            ...
                          </Button>
                          <Button
                            variant={page === p ? "default" : "outline"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePageChange(p)}
                          >
                            {p}
                          </Button>
                        </React.Fragment>
                      );
                    }

                    return (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Button>
                    );
                  })}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  <ChevronDownIcon className="h-4 w-4 -rotate-90" />
                </Button>
              </nav>
            </div>
          )}
        </motion.div>
      </div>

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

// This is the main page component that implements the Suspense boundary
export default function TeamPage() {
  return (
    <Suspense fallback={<TeamPageLoading />}>
      <TeamPageContent />
    </Suspense>
  );
}

// Simple loading component
function TeamPageLoading() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border p-8">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Memuat data tim...</p>
        </div>
      </div>
    </div>
  );
}
