"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import AdminForm from "@/components/cms/admin/admin-form";
import { Loader2 } from "lucide-react";

export default function EditAdminPage() {
  const params = useParams();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          toast.error("Sesi anda telah berakhir, silakan login kembali");
          router.push("/admin");
          return;
        }

        const response = await axios.get(`/api/admin/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setAdmin(response.data.data);
        } else {
          toast.error("Gagal memuat data admin", {
            description: response.data.message,
          });
          router.push("/admin/users");
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
        toast.error("Gagal memuat data admin", {
          description: "Admin tidak ditemukan atau terjadi kesalahan",
        });
        router.push("/admin/users");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchAdmin();
    }
  }, [params.id, router]);

  const handleSuccess = () => {
    router.push("/admin/users");
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold">Edit Admin</h1>
        <p className="text-muted-foreground">Memuat data admin...</p>
        <div className="mt-6 flex items-center justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold">Edit Admin</h1>
      <p className="text-muted-foreground">
        Perbarui informasi admin yang sudah ada
      </p>
      <div className="mt-6">
        <AdminForm admin={admin} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
