import { ProjectDashboard } from "@/components/cms/dashboard/project-dashboard";

export const metadata = {
  title: "Dashboard Admin | PT Mangala Dipa Lokatara",
  description:
    "Panel administrasi untuk manajemen proyek konsultasi lingkungan",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-montserrat)]">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 font-[family-name:var(--font-plus-jakarta-sans)]">
          Kelola semua proyek konsultasi lingkungan dari satu tempat.
        </p>
      </div>

      <ProjectDashboard />
    </div>
  );
}
