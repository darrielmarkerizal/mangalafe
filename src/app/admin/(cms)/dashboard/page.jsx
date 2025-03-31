import { ProjectDashboard } from "@/components/cms/dashboard/project-dashboard";

export const metadata = {
  title: "Dashboard Admin | PT Mangala Dipa Lokatara",
  description:
    "Panel administrasi untuk manajemen proyek konsultasi lingkungan",
};

export default function DashboardPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground">
        Kelola semua proyek konsultasi lingkungan PT Mangala Dipa dari satu
        tempat
      </p>
      <div className="mt-6">
        <ProjectDashboard />
      </div>
    </div>
  );
}
