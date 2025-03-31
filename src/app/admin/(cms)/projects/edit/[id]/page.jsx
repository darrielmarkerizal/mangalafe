"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import ProjectForm from "@/components/cms/project/new-project";
import { Loader2 } from "lucide-react";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/project/${params.id}`);
        if (response.data.success) {
          setProject(response.data.data);
        } else {
          toast.error("Gagal memuat data proyek", {
            description: response.data.message,
          });
          router.push("/admin/projects");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Gagal memuat data proyek", {
          description: "Proyek tidak ditemukan atau terjadi kesalahan",
        });
        router.push("/admin/projects");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id, router]);

  const handleSuccess = () => {
    router.push(`/admin/projects/${params.id}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold">Edit Proyek</h1>
        <p className="text-muted-foreground">Memuat data proyek...</p>
        <div className="mt-6 flex items-center justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold">Edit Proyek</h1>
      <p className="text-muted-foreground">
        Perbarui informasi proyek yang sudah ada
      </p>
      <div className="mt-6">
        <ProjectForm project={project} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
