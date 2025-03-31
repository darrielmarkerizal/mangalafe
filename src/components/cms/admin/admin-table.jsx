"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
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
  EditIcon,
  TrashIcon,
  EyeIcon,
  MailIcon,
  UserIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  ShieldIcon,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Cookies from "js-cookie";
import { Badge } from "@/components/ui/badge";

export default function AdminTable() {
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [metadata, setMetadata] = useState({
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, [currentPage, perPage, sortBy, sortOrder]);

  const fetchAdmins = async (params = {}) => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Sesi anda telah berakhir", {
          description: "Silakan login kembali untuk melanjutkan",
        });
        router.push("/admin");
        return;
      }

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
        const response = await axios.get("/api/admin", {
          params: queryParams,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setAdmins(response.data.data);
          setMetadata(response.data.metadata);
        } else {
          setAdmins([]);
          setMetadata({
            currentPage: 1,
            perPage: 10,
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
          setAdmins([]);
          setMetadata({
            currentPage: 1,
            perPage: 10,
            totalItems: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          });

          // Show toast message for empty data
          toast.info("Data tidak ditemukan", {
            description:
              "Tidak ada admin yang sesuai dengan kriteria pencarian.",
          });
        } else {
          // Handle other errors
          console.error("Error fetching admins:", error);
          toast.error("Gagal mengambil data admin", {
            description: error.message,
          });
          setAdmins([]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAdmins({ search: searchQuery, page: 1 });
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

  const handleEditAdmin = (admin) => {
    router.push(`/admin/users/edit/${admin.id}`);
  };

  const handleDeleteAdmin = (adminId) => {
    setAdminToDelete(adminId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");

      const response = await axios.delete(`/api/admin?id=${adminToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Admin berhasil dihapus");
        fetchAdmins();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Gagal menghapus admin");
    } finally {
      setShowDeleteDialog(false);
      setAdminToDelete(null);
      setIsLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Format short date
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {/* Search Section */}
        <div className="p-5 border-b">
          <form onSubmit={handleSearch} className="flex gap-2 w-full">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari admin berdasarkan nama atau email..."
                className="pl-9 h-10 bg-muted/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" className="h-10">
              Cari
            </Button>
          </form>
        </div>

        {/* Sort and Action Controls */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Urut:</span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Urut berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_name">Nama</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="createdAt">Tanggal Dibuat</SelectItem>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAdmins()}
              disabled={isLoading}
              className="h-9"
            >
              <RefreshCwIcon
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={() => router.push("/admin/users/create")}
              size="sm"
              className="h-9"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Tambah Admin
            </Button>
          </div>
        </div>

        {/* Admin Table */}
        <Table>
          <TableHeader className="bg-muted/30 hover:bg-muted/30">
            <TableRow>
              <TableHead className="w-[50px] font-semibold">No</TableHead>
              <TableHead className="font-semibold">Nama</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Tanggal Dibuat</TableHead>
              <TableHead className="font-semibold">
                Terakhir Diperbarui
              </TableHead>
              <TableHead className="text-right font-semibold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                  key={`skeleton-${index}`}
                  className="hover:bg-muted/5"
                >
                  <TableCell>
                    <Skeleton className="h-5 w-8" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <Skeleton className="h-5 w-[120px]" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[180px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[100px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-52 text-center py-10 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-muted">
                      <UserIcon className="h-8 w-8 text-muted-foreground/80" />
                      <div className="absolute top-0 right-0 w-4 h-4 bg-muted-foreground/30 rounded-full flex items-center justify-center">
                        <span className="text-background text-[10px] font-bold">
                          ?
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 text-center max-w-sm">
                      <p className="font-medium text-base">
                        Tidak ada data admin
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Semua pengguna admin yang ditambahkan akan muncul di
                        sini
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin, index) => {
                const rowNumber = (currentPage - 1) * perPage + index + 1;
                return (
                  <TableRow
                    key={admin.id}
                    className="group cursor-pointer hover:bg-muted/5"
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {rowNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-primary/90">
                            {admin.full_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Admin
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MailIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{admin.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-muted/20 font-normal"
                      >
                        {formatShortDate(admin.createdAt)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatShortDate(admin.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700"
                          onClick={() => handleEditAdmin(admin)}
                        >
                          <EditIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                          onClick={() => handleDeleteAdmin(admin.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border-t">
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
                  {metadata.totalItems} admin
                </>
              ) : (
                "Tidak ada admin"
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
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus admin ini? Tindakan ini tidak
              dapat dibatalkan dan semua akses admin ini akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
