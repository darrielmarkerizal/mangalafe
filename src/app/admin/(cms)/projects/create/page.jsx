import ProjectForm from "@/components/cms/project/new-project";

export default function CreateProjectPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
      <h1 className="text-2xl font-bold mb-2">Tambah Proyek Baru</h1>
      <p className="text-muted-foreground">
        Isi formulir berikut untuk menambahkan proyek baru ke sistem
      </p>
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
