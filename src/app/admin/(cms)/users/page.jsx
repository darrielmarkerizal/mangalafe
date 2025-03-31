import AdminTable from "@/components/cms/admin/admin-table";

export default function AdminPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
      <h1 className="text-2xl font-bold mb-2">Pengelolaan Admin</h1>
      <p className="text-muted-foreground">
        Kelola pengguna admin untuk sistem manajemen proyek PT Mangala Dipa
      </p>
      <div className="mt-6">
        <AdminTable />
      </div>
    </div>
  );
}
