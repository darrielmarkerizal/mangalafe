"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeftIcon,
  BuildingIcon,
  CalendarIcon,
  FileTextIcon,
  PencilIcon,
  TrashIcon,
  ImageIcon,
  Loader2,
  AlertCircleIcon,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export function ProjectDetail({ project, onEdit, onBack }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!project) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await axios.delete(`/api/project?id=${project.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Proyek berhasil dihapus");
        router.push("/admin/projects");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Gagal menghapus proyek");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="w-fit"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700"
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit Proyek
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>

        {/* Main content */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-primary">
                  {project.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  ID: {project.id}
                </CardDescription>
              </div>
              <Badge className="text-sm px-2 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {project.period}
              </Badge>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BuildingIcon className="h-5 w-5 text-primary" />
                  Informasi Proyek
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-muted/20 rounded-md">
                    <p className="text-sm text-muted-foreground">Nama Proyek</p>
                    <p className="font-medium">{project.name}</p>
                  </div>

                  <div className="p-3 bg-muted/20 rounded-md">
                    <p className="text-sm text-muted-foreground">Initiator</p>
                    <p className="font-medium">{project.initiator}</p>
                  </div>

                  <div className="p-3 bg-muted/20 rounded-md">
                    <p className="text-sm text-muted-foreground">Periode</p>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{project.period}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5 text-primary" />
                  Layanan Terkait
                </h3>

                <div className="p-3 bg-muted/20 rounded-md min-h-[120px]">
                  <p className="text-sm text-muted-foreground mb-2">
                    Layanan yang Disediakan
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.Services && project.Services.length > 0 ? (
                      project.Services.map((service) => (
                        <Badge
                          key={service.id}
                          variant="secondary"
                          className="px-2 py-1 font-normal"
                        >
                          {service.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">
                        Tidak ada layanan terkait
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Photo section */}
            {project.photo && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Foto Proyek
                </h3>

                <div className="relative overflow-hidden rounded-md border bg-muted/10 aspect-video w-full max-w-2xl mx-auto">
                  <Image
                    src={project.photo}
                    alt={project.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg"; // Provide a fallback image
                    }}
                  />
                </div>
              </div>
            )}

            {/* Metadata section */}
            <div className="mt-8 text-xs text-muted-foreground">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <p>
                  Dibuat: {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Diperbarui: {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircleIcon className="h-5 w-5" />
              Konfirmasi Hapus Proyek
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus proyek{" "}
              <span className="font-semibold">{project.name}</span>? Tindakan
              ini tidak dapat dibatalkan dan semua data terkait proyek akan
              dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <TrashIcon className="h-4 w-4" />
                  Hapus Proyek
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
