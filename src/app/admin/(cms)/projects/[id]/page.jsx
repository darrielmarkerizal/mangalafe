"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { ProjectDetail } from "@/components/cms/project/project-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Loader2 } from "lucide-react";

export default function ViewProjectPage() {
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

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold">Detail Proyek</h1>
        <p className="text-muted-foreground">Memuat detail proyek...</p>
        <div className="mt-6 flex items-center justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold">Detail Proyek</h1>
      <p className="text-muted-foreground">
        Lihat informasi lengkap mengenai proyek
      </p>
      <div className="mt-6">
        <ProjectDetail
          project={project}
          onEdit={() => router.push(`/admin/projects/edit/${params.id}`)}
          onBack={() => router.push("/admin/projects")}
        />
      </div>
    </div>
  );
}
