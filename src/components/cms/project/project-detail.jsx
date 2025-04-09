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
  UploadIcon,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProjectDetail({ project, onEdit, onBack }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // For mobile tabs

  if (!project) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        router.push("/admin");
        return;
      }

      const response = await axios.delete(`/api/project/${project.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Delete response:", response.data);

      if (response.data.success) {
        toast.success("Proyek berhasil dihapus");
        router.push("/admin/projects");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(
        "Gagal menghapus proyek: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header with controls */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <motion.div whileHover={{ x: -3 }} whileTap={{ x: -5 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="w-fit"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700"
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Proyek
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Hapus
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-primary/10 shadow-md">
            <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-start justify-between">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardTitle className="text-2xl font-bold text-primary">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    ID: {project.id}
                  </CardDescription>
                </motion.div>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                >
                  <Badge className="text-sm px-2 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                    {project.period}
                  </Badge>
                </motion.div>
              </div>
            </CardHeader>
            <Separator />

            {/* Desktop Content */}
            <div className="hidden md:block">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BuildingIcon className="h-5 w-5 text-primary" />
                      Informasi Proyek
                    </h3>

                    <div className="grid grid-cols-1 gap-3">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="p-3 bg-muted/20 rounded-md border border-transparent hover:border-primary/10 transition-all"
                      >
                        <p className="text-sm text-muted-foreground">
                          Nama Proyek
                        </p>
                        <p className="font-medium">{project.name}</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="p-3 bg-muted/20 rounded-md border border-transparent hover:border-primary/10 transition-all"
                      >
                        <p className="text-sm text-muted-foreground">
                          Initiator
                        </p>
                        <p className="font-medium">{project.initiator}</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="p-3 bg-muted/20 rounded-md border border-transparent hover:border-primary/10 transition-all"
                      >
                        <p className="text-sm text-muted-foreground">Periode</p>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{project.period}</p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileTextIcon className="h-5 w-5 text-primary" />
                      Layanan Terkait
                    </h3>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="p-3 bg-muted/20 rounded-md min-h-[120px] border border-transparent hover:border-primary/10 transition-all"
                    >
                      <p className="text-sm text-muted-foreground mb-2">
                        Layanan yang Disediakan
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                          {project.Services && project.Services.length > 0 ? (
                            project.Services.map((service, index) => (
                              <motion.div
                                key={service.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Badge
                                  variant="secondary"
                                  className="px-2 py-1 font-normal"
                                >
                                  {service.name}
                                </Badge>
                              </motion.div>
                            ))
                          ) : (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-muted-foreground italic"
                            >
                              Tidak ada layanan terkait
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Photo section */}
                {project.photo ? (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 space-y-4"
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Foto Proyek
                    </h3>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="relative overflow-hidden rounded-md border bg-muted/10 aspect-video w-full max-w-2xl mx-auto shadow-sm hover:shadow-md transition-all"
                    >
                      {(() => {
                        const isValidUrl = (url) => {
                          try {
                            if (!url) return false;

                            // Reject common filenames without paths
                            if (/^[^\/]+\.[a-zA-Z]+$/.test(url)) {
                              // This matches patterns like "url_foto.jpg", "image.png", etc.
                              return false;
                            }

                            // Handle relative paths starting with "/"
                            if (url.startsWith("/")) return true;

                            // Handle absolute URLs with protocol
                            if (
                              url.startsWith("http://") ||
                              url.startsWith("https://")
                            ) {
                              new URL(url);
                              return true;
                            }

                            // Handle data URLs
                            if (url.startsWith("data:image/")) return true;

                            // Anything else is considered invalid
                            return false;
                          } catch (e) {
                            console.log("URL validation error:", e.message);
                            return false;
                          }
                        };

                        const hasValidPhoto =
                          project.photo && isValidUrl(project.photo);

                        if (hasValidPhoto) {
                          return (
                            <Image
                              src={project.photo}
                              alt={project.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                console.log(
                                  "Image load error, showing 'No Image' message"
                                );
                                e.target.parentNode.innerHTML = `
                                  <div class="flex items-center justify-center h-full w-full bg-muted/20">
                                    <p class="text-muted-foreground text-center flex flex-col items-center">
                                      <span class="text-3xl mb-2">📷</span>
                                      <span>Tidak ada gambar</span>
                                    </p>
                                  </div>
                                `;
                              }}
                            />
                          );
                        } else {
                          return (
                            <div className="flex items-center justify-center h-full w-full bg-muted/20">
                              <p className="text-muted-foreground text-center flex flex-col items-center">
                                <span className="text-3xl mb-2">📷</span>
                                <span>Tidak ada gambar</span>
                              </p>
                            </div>
                          );
                        }
                      })()}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 space-y-4"
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Foto Proyek
                    </h3>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="relative overflow-hidden rounded-md border bg-muted/10 aspect-video w-full max-w-2xl mx-auto shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col items-center justify-center h-full w-full bg-muted/20">
                        <p className="text-muted-foreground text-center flex flex-col items-center mb-4">
                          <span className="text-3xl mb-2">📷</span>
                          <span>Tidak ada gambar</span>
                          {project.photo && (
                            <span className="text-xs text-red-400 mt-1">
                              Format gambar tidak valid: "{project.photo}"
                            </span>
                          )}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            toast.info(
                              "Fitur upload gambar tersedia di halaman Edit Proyek",
                              {
                                description:
                                  "Silakan edit proyek untuk menambahkan foto baru",
                              }
                            );
                          }}
                        >
                          <UploadIcon className="mr-2 h-4 w-4" />
                          Tambahkan Foto
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Metadata section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 text-xs text-muted-foreground"
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <p>
                      Dibuat: {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      Diperbarui:{" "}
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              </CardContent>
            </div>

            {/* Mobile TabsContent - Important: This needs to be inside the Tabs component */}
            <div className="md:hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="info" className="flex-1">
                    <BuildingIcon className="mr-2 h-4 w-4" />
                    Info Proyek
                  </TabsTrigger>
                  <TabsTrigger value="services" className="flex-1">
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    Layanan
                  </TabsTrigger>
                  <TabsTrigger value="photo" className="flex-1">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Foto
                  </TabsTrigger>
                </TabsList>

                {/* Tab content must be inside the Tabs component */}
                <TabsContent value="info" className="mt-0 p-4 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BuildingIcon className="h-5 w-5 text-primary" />
                    Informasi Proyek
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className="p-3 bg-muted/20 rounded-md"
                    >
                      <p className="text-sm text-muted-foreground">
                        Nama Proyek
                      </p>
                      <p className="font-medium">{project.name}</p>
                    </motion.div>

                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className="p-3 bg-muted/20 rounded-md"
                    >
                      <p className="text-sm text-muted-foreground">Initiator</p>
                      <p className="font-medium">{project.initiator}</p>
                    </motion.div>

                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className="p-3 bg-muted/20 rounded-md"
                    >
                      <p className="text-sm text-muted-foreground">Periode</p>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{project.period}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Mobile metadata */}
                  <div className="text-xs text-muted-foreground pt-4 border-t">
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <p>
                        Dibuat:{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        Diperbarui:{" "}
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="mt-0 p-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <FileTextIcon className="h-5 w-5 text-primary" />
                    Layanan Terkait
                  </h3>

                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="p-3 bg-muted/20 rounded-md min-h-[120px]"
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      Layanan yang Disediakan
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {project.Services && project.Services.length > 0 ? (
                          project.Services.map((service, index) => (
                            <motion.div
                              key={service.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge
                                variant="secondary"
                                className="px-2 py-1 font-normal"
                              >
                                {service.name}
                              </Badge>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-muted-foreground italic">
                            Tidak ada layanan terkait
                          </p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="photo" className="mt-0 p-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Foto Proyek
                  </h3>

                  <div className="relative overflow-hidden rounded-md border bg-muted/10 aspect-video w-full mx-auto">
                    {(() => {
                      const isValidUrl = (url) => {
                        try {
                          if (!url) return false;

                          // Reject common filenames without paths
                          if (/^[^\/]+\.[a-zA-Z]+$/.test(url)) {
                            // This matches patterns like "url_foto.jpg", "image.png", etc.
                            return false;
                          }

                          // Handle relative paths starting with "/"
                          if (url.startsWith("/")) return true;

                          // Handle absolute URLs with protocol
                          if (
                            url.startsWith("http://") ||
                            url.startsWith("https://")
                          ) {
                            new URL(url);
                            return true;
                          }

                          // Handle data URLs
                          if (url.startsWith("data:image/")) return true;

                          // Anything else is considered invalid
                          return false;
                        } catch (e) {
                          console.log("URL validation error:", e.message);
                          return false;
                        }
                      };

                      const hasValidPhoto =
                        project.photo && isValidUrl(project.photo);

                      if (hasValidPhoto) {
                        return (
                          <Image
                            src={project.photo}
                            alt={project.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              console.log(
                                "Image load error, showing 'No Image' message"
                              );
                              e.target.parentNode.innerHTML = `
                                <div class="flex items-center justify-center h-full w-full bg-muted/20">
                                  <p class="text-muted-foreground text-center flex flex-col items-center">
                                    <span class="text-3xl mb-2">📷</span>
                                    <span>Tidak ada gambar</span>
                                  </p>
                                </div>
                              `;
                            }}
                          />
                        );
                      } else {
                        return (
                          <div className="flex items-center justify-center h-full w-full bg-muted/20">
                            <p className="text-muted-foreground text-center flex flex-col items-center">
                              <span className="text-3xl mb-2">📷</span>
                              <span>Tidak ada gambar</span>
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircleIcon className="h-5 w-5" />
                Konfirmasi Hapus Proyek
              </AlertDialogTitle>
            </motion.div>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus proyek{" "}
              <span className="font-semibold">{project.name}</span>? Tindakan
              ini tidak dapat dibatalkan dan semua data terkait proyek akan
              dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              Batal
            </AlertDialogCancel>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
            </motion.div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
