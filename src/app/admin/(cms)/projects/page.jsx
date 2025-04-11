import ProjectTable from "@/components/cms/project/project-table";

export default function ProjectPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
      <h1 className="text-2xl font-bold mb-2">Daftar Proyek</h1>
      <p className="text-muted-foreground">
        Kelola semua proyek konsultasi lingkungan PT Mangala Dipa Lokatara
      </p>
      <div className="mt-6">
        <ProjectTable />
      </div>
    </div>
  );
}
