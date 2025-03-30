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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-montserrat)]">
          Admin
        </h1>
        <p className="text-muted-foreground mt-2 font-[family-name:var(--font-plus-jakarta-sans)]">
          Kelola pengguna admin untuk sistem manajemen proyek.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari admin..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary">
              Cari
            </Button>
          </form>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAdmins()}
              disabled={isLoading}
            >
              <RefreshCwIcon
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={() => router.push("/admin/users/create")}
              size="sm"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Tambah Admin
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
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

        {/* Admin Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Terdaftar Pada</TableHead>
                <TableHead>Diperbarui Pada</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[150px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-9 w-9 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center h-32 text-muted-foreground"
                  >
                    Tidak ada data admin yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin, index) => {
                  const rowNumber = (currentPage - 1) * perPage + index + 1;
                  return (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{rowNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span>{admin.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MailIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{admin.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(admin.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(admin.updatedAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">Aksi</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditAdmin(admin)}
                              className="cursor-pointer"
                            >
                              <EditIcon className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {metadata.totalPages > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Menampilkan {admins.length} dari {metadata.totalItems} admin
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={metadata.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus admin ini? Tindakan ini tidak
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
