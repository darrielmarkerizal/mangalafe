"use client";

import AdminForm from "@/components/cms/admin/admin-form";
import { useRouter } from "next/navigation";

export default function CreateAdminPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/users");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold">Tambah Admin Baru</h1>
      <p className="text-muted-foreground">
        Buat akun admin baru untuk mengakses sistem
      </p>
      <div className="mt-6">
        <AdminForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
