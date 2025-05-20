"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence } from "framer-motion";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  FileTextIcon,
  BuildingIcon,
  CalendarIcon,
  ListChecksIcon,
  ImageIcon,
  InfoIcon,
  AlertCircleIcon,
  SearchIcon,
  UploadIcon,
  XCircleIcon,
  CheckCircleIcon,
  RefreshCwIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

const projectSchema = z.object({
  name: z.string().min(3, { message: "Nama proyek minimal 3 karakter" }),
  initiator: z
    .string()
    .min(2, { message: "Nama pemrakarsa minimal 2 karakter" }),
  period: z.coerce
    .number()
    .int()
    .min(2000, { message: "Periode minimal tahun 2000" })
    .max(new Date().getFullYear(), {
      message: "Periode tidak boleh melebihi tahun saat ini",
    }),
  services: z.array(z.string()).min(1, { message: "Pilih minimal 1 layanan" }),
  photo: z
    .string()
    .url({ message: "URL foto tidak valid" })
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
});

export default function ProjectForm({ project = null, onSuccess }) {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [selectedServicesCount, setSelectedServicesCount] = useState(0);
  const isEditMode = !!project;
  const [formProgress, setFormProgress] = useState(0);
  const [searchServices, setSearchServices] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(project?.photo || null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const [showNetworkErrorDialog, setShowNetworkErrorDialog] = useState(false);
  const [networkErrorDetails, setNetworkErrorDetails] = useState(null);
  const [retryUpload, setRetryUpload] = useState(null);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      initiator: project?.initiator || "",
      period: project?.period || new Date().getFullYear(),
      services: project?.Services?.map((s) => s.id.toString()) || [],
      photo: project?.photo || "",
      description: project?.description || "",
    },
  });

  const watchedServices = form.watch("services");

  useEffect(() => {
    if (watchedServices) {
      setSelectedServicesCount(watchedServices.length);
    }
  }, [watchedServices]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/service", {
          params: {
            sortBy: "name",
            sortOrder: "ASC",
          },
        });

        if (response.data.success) {
          setServices(response.data.data);
        } else {
          toast.error("Gagal memuat data layanan");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Gagal memuat data layanan");
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const formValues = form.getValues();
    let filledFields = 0;
    let totalFields = 3;

    if (formValues.name.trim().length >= 3) filledFields++;
    if (formValues.initiator.trim().length >= 2) filledFields++;
    if (formValues.period) filledFields++;
    if (watchedServices && watchedServices.length > 0) filledFields++;

    setFormProgress(Math.round((filledFields / totalFields) * 100));
  }, [
    form.watch("name"),
    form.watch("initiator"),
    form.watch("period"),
    watchedServices,
  ]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchServices.toLowerCase())
  );

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        router.push("/admin");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let response;

      if (isEditMode) {
        response = await axios.put(`/api/project?id=${project.id}`, data, {
          headers,
        });
      } else {
        response = await axios.post("/api/project", data, { headers });
      }

      if (response.data.success) {
        toast.success(
          isEditMode ? "Proyek berhasil diperbarui" : "Proyek berhasil dibuat",
          {
            description: isEditMode
              ? "Detail proyek telah diperbarui"
              : "Proyek baru telah ditambahkan",
          }
        );

        if (onSuccess) {
          onSuccess(response.data.data);
        } else {
          router.push("/admin/projects");
        }
      } else {
        toast.error("Gagal menyimpan proyek", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error saving project:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan proyek";
      toast.error("Gagal menyimpan proyek", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => currentYear - i
  );

  const RequiredLabel = ({ children }) => (
    <div className="flex items-center gap-1">
      {children} <span className="text-destructive">*</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Wajib diisi</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  // Updated image upload function with better error handling
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Store the file for potential retry
    setRetryUpload(file);

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Hanya file JPG, JPEG, PNG, dan GIF yang diizinkan.");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 5MB.");
      return;
    }

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("fileToUpload", file);

    try {
      // Use a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

      // Use environment variable instead of hardcoded URL
      const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_API_URL;

      if (!uploadUrl) {
        throw new Error(
          "Upload URL not configured. Please set NEXT_PUBLIC_UPLOAD_API_URL in your environment variables."
        );
      }

      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: controller.signal,
        // Add additional request options to help with CORS
        withCredentials: false,
      });

      clearTimeout(timeoutId);

      if (response.data.success) {
        // Set the URL to the form
        form.setValue("photo", response.data.url);
        setImagePreview(response.data.url);
        toast.success("Foto berhasil diunggah");
      } else {
        setUploadError(response.data.message || "Gagal mengunggah foto");
        toast.error("Gagal mengunggah foto", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);

      // Collect error information for debugging
      const errorInfo = {
        message: error.message || "Unknown error",
        code: error.code || "",
        stack: error.stack || "",
        details: error.response?.data || {},
      };

      setNetworkErrorDetails(errorInfo);
      setShowNetworkErrorDialog(true);

      // Set a user-friendly error
      setUploadError("Terjadi masalah jaringan saat mengunggah foto");
      toast.error("Gagal menghubungi server unggah", {
        description:
          "Silakan periksa koneksi internet Anda atau coba lagi nanti",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Alternative image upload method using base64 (as fallback)
  const handleUseLocalImage = () => {
    if (!retryUpload) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;

      // Set base64 image URL to form
      form.setValue("photo", base64Image);
      setImagePreview(base64Image);

      toast.success("Foto digunakan sebagai alternatif", {
        description: "Foto akan disimpan sebagai data URL",
      });

      setShowNetworkErrorDialog(false);
    };

    reader.onerror = () => {
      toast.error("Gagal membaca file gambar secara lokal");
      setShowNetworkErrorDialog(false);
    };

    reader.readAsDataURL(retryUpload);
  };

  const removeImage = () => {
    form.setValue("photo", "");
    setImagePreview(null);
    setRetryUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto"
    >
      <motion.div whileHover={{ x: 3 }} className="mb-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/projects")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-left"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Kembali ke Daftar Proyek
        </Button>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border overflow-hidden"
          >
            {/* Header with Progress */}
            <div className="p-4 sm:p-6 border-b bg-muted/10">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="p-2 bg-primary/10 rounded-full flex-shrink-0"
                  >
                    <FileTextIcon className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">
                      {isEditMode ? "Edit Proyek" : "Tambah Proyek Baru"}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {isEditMode
                        ? "Perbarui detail proyek yang sudah ada"
                        : "Isi formulir di bawah ini untuk membuat proyek baru"}
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-32">
                  <div className="text-xs text-right mb-1 text-muted-foreground">
                    {formProgress}% Selesai
                  </div>
                  <Progress value={formProgress} className="h-2" />
                </div>
              </div>
            </div>

            {/* Form Content - Single continuous scroll */}
            <div className="p-4 sm:p-6">
              <div className="space-y-8">
                {/* Basic Information Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4 text-primary" />
                    Informasi Dasar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Nama Proyek</RequiredLabel>
                          </FormLabel>
                          <div className="relative">
                            <BuildingIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                            <FormControl>
                              <Input
                                placeholder="Masukkan nama proyek"
                                {...field}
                                disabled={isLoading}
                                className="pl-9"
                              />
                            </FormControl>
                          </div>
                          <FormDescription className="text-xs">
                            Nama lengkap proyek yang akan dikerjakan
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="initiator"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Pemrakarsa</RequiredLabel>
                          </FormLabel>
                          <div className="relative">
                            <BuildingIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                            <FormControl>
                              <Input
                                placeholder="Masukkan nama initiator"
                                {...field}
                                disabled={isLoading}
                                className="pl-9"
                              />
                            </FormControl>
                          </div>
                          <FormDescription className="text-xs">
                            Nama perusahaan/instansi pemrakarsa
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2 md:max-w-[50%]">
                          <FormLabel>
                            <RequiredLabel>Periode</RequiredLabel>
                          </FormLabel>
                          <div className="relative">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value?.toString()}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <div className="relative">
                                  <CalendarIcon className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground z-10" />
                                  <SelectTrigger className="pl-9">
                                    <SelectValue placeholder="Pilih tahun periode" />
                                  </SelectTrigger>
                                </div>
                              </FormControl>
                              <SelectContent>
                                {years.map((year) => (
                                  <SelectItem
                                    key={year}
                                    value={year.toString()}
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormDescription className="text-xs">
                            Tahun pelaksanaan proyek
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>

                {/* Services Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="pt-6 border-t"
                >
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <ListChecksIcon className="h-4 w-4 text-primary" />
                      <RequiredLabel>Layanan</RequiredLabel>
                    </h3>
                    <Badge
                      variant={
                        selectedServicesCount > 0 ? "default" : "outline"
                      }
                      className="transition-all"
                    >
                      {selectedServicesCount} dipilih
                    </Badge>
                  </div>

                  <FormField
                    control={form.control}
                    name="services"
                    render={() => (
                      <FormItem>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                          <span>
                            Pilih minimal 1 layanan yang terkait dengan proyek
                            ini
                          </span>
                        </div>

                        {isLoadingServices ? (
                          <div className="flex flex-col items-center justify-center py-8 bg-muted/10 rounded-md border border-dashed">
                            <Loader2 className="h-8 w-8 animate-spin text-primary/70 mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Memuat data layanan...
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="relative">
                              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Cari layanan..."
                                className="pl-9 mb-2"
                                value={searchServices}
                                onChange={(e) =>
                                  setSearchServices(e.target.value)
                                }
                              />
                            </div>
                            <ScrollArea className="border rounded-md p-2 bg-white h-56 sm:h-[280px]">
                              <div className="grid grid-cols-1 gap-3 p-1">
                                <AnimatePresence>
                                  {filteredServices.length === 0 ? (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="flex flex-col items-center justify-center h-full py-8 text-center"
                                    >
                                      <ListChecksIcon className="h-10 w-10 text-muted-foreground/30 mb-2" />
                                      <p className="text-muted-foreground">
                                        Tidak ada layanan yang sesuai
                                      </p>
                                    </motion.div>
                                  ) : (
                                    filteredServices.map((service, index) => (
                                      <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                      >
                                        <FormField
                                          control={form.control}
                                          name="services"
                                          render={({ field }) => {
                                            return (
                                              <FormItem
                                                key={service.id}
                                                className={`flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 sm:p-4 ${
                                                  field.value?.includes(
                                                    service.id.toString()
                                                  )
                                                    ? "bg-primary/5 border-primary/30"
                                                    : "hover:bg-muted/20"
                                                }`}
                                              >
                                                <FormControl>
                                                  <Checkbox
                                                    checked={field.value?.includes(
                                                      service.id.toString()
                                                    )}
                                                    onCheckedChange={(
                                                      checked
                                                    ) => {
                                                      const serviceId =
                                                        service.id.toString();
                                                      return checked
                                                        ? field.onChange([
                                                            ...field.value,
                                                            serviceId,
                                                          ])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                              (value) =>
                                                                value !==
                                                                serviceId
                                                            )
                                                          );
                                                    }}
                                                    disabled={isLoading}
                                                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                  />
                                                </FormControl>
                                                <div className="space-y-1 leading-none flex-1">
                                                  <FormLabel className="text-sm font-medium cursor-pointer">
                                                    {service.name}
                                                  </FormLabel>
                                                </div>
                                              </FormItem>
                                            );
                                          }}
                                        />
                                      </motion.div>
                                    ))
                                  )}
                                </AnimatePresence>
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Description Section */}
                <div className="grid grid-cols-1">
                  <h3 className="text-[14px] mb-1 font-plus-jakarta-sans">
                    Deskripsi Proyek
                  </h3>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Masukkan deskripsi proyek..."
                            className="min-h-[150px] bg-white font-plus-jakarta-sans resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Photo Upload Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-6 border-t"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Foto Proyek
                  </h3>

                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          {/* Hidden input for form value */}
                          <input type="hidden" {...field} />

                          {/* File upload UI */}
                          <div
                            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 ${
                              uploadError
                                ? "border-red-300 bg-red-50"
                                : (() => {
                                    // Check if imagePreview is valid
                                    const isValidImageUrl = (url) => {
                                      if (!url) return false;
                                      if (url.startsWith("data:image/"))
                                        return true;
                                      if (/^[^\/]+\.[a-zA-Z]+$/.test(url))
                                        return false;

                                      try {
                                        if (
                                          url.startsWith("http://") ||
                                          url.startsWith("https://")
                                        ) {
                                          new URL(url);
                                          return true;
                                        }
                                        if (url.startsWith("/")) return true;
                                        return false;
                                      } catch (e) {
                                        return false;
                                      }
                                    };

                                    // Only apply green styling if there's a valid image URL
                                    return imagePreview &&
                                      isValidImageUrl(imagePreview)
                                      ? "border-green-300 bg-green-50"
                                      : "border-muted-foreground/25 hover:border-primary/40 bg-muted/10";
                                  })()
                            } transition-colors`}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              if (
                                e.dataTransfer.files &&
                                e.dataTransfer.files[0]
                              ) {
                                const event = {
                                  target: {
                                    files: [e.dataTransfer.files[0]],
                                  },
                                };
                                handleImageUpload(event);
                              }
                            }}
                          >
                            {imagePreview ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  {(() => {
                                    const isValidImageUrl = (url) => {
                                      if (!url) return false;
                                      if (url.startsWith("data:image/"))
                                        return true;
                                      if (/^[^\/]+\.[a-zA-Z]+$/.test(url))
                                        return false;

                                      try {
                                        if (
                                          url.startsWith("http://") ||
                                          url.startsWith("https://")
                                        ) {
                                          new URL(url);
                                          return true;
                                        }
                                        if (url.startsWith("/")) return true;
                                        return false;
                                      } catch (e) {
                                        return false;
                                      }
                                    };

                                    if (isValidImageUrl(imagePreview)) {
                                      return (
                                        <div className="flex items-center gap-2">
                                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                          <p className="text-sm font-medium text-green-600">
                                            Foto berhasil diunggah
                                          </p>
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <div className="flex items-center gap-2">
                                          <AlertCircleIcon className="h-5 w-5 text-amber-600" />
                                          <p className="text-sm font-medium text-amber-600">
                                            Belum ada gambar valid
                                          </p>
                                        </div>
                                      );
                                    }
                                  })()}

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={removeImage}
                                    className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <XCircleIcon className="h-5 w-5" />
                                  </Button>
                                </div>

                                <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-md border">
                                  {(() => {
                                    const isValidImageUrl = (url) => {
                                      if (!url) return false;
                                      if (url.startsWith("data:image/"))
                                        return true;
                                      if (/^[^\/]+\.[a-zA-Z]+$/.test(url))
                                        return false;

                                      try {
                                        if (
                                          url.startsWith("http://") ||
                                          url.startsWith("https://")
                                        ) {
                                          new URL(url);
                                          return true;
                                        }
                                        if (url.startsWith("/")) return true;
                                        return false;
                                      } catch (e) {
                                        return false;
                                      }
                                    };

                                    if (isValidImageUrl(imagePreview)) {
                                      if (imagePreview.startsWith("data:")) {
                                        return (
                                          <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                          />
                                        );
                                      } else {
                                        return (
                                          <div className="relative w-full h-full">
                                            <img
                                              src={imagePreview}
                                              alt="Preview"
                                              className="absolute inset-0 w-full h-full object-cover"
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
                                            {(() => {
                                              try {
                                                const url = new URL(
                                                  imagePreview
                                                );
                                                return (
                                                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                                                    Image from: {url.hostname}
                                                  </div>
                                                );
                                              } catch (e) {
                                                return null;
                                              }
                                            })()}
                                          </div>
                                        );
                                      }
                                    } else {
                                      // For invalid image URL, just show "Tidak ada gambar"
                                      return (
                                        <div className="flex flex-col items-center justify-center h-full w-full bg-muted/20">
                                          <p className="text-muted-foreground text-center flex flex-col items-center">
                                            <span className="text-3xl mb-2">
                                              📷
                                            </span>
                                            <span>Tidak ada gambar</span>
                                          </p>
                                        </div>
                                      );
                                    }
                                  })()}
                                </div>

                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={uploadingImage || isLoading}
                                  className="mt-2"
                                >
                                  <UploadIcon className="mr-2 h-4 w-4" />
                                  {(() => {
                                    const isValidImageUrl = (url) => {
                                      if (!url) return false;
                                      if (url.startsWith("data:image/"))
                                        return true;
                                      if (/^[^\/]+\.[a-zA-Z]+$/.test(url))
                                        return false;

                                      try {
                                        if (
                                          url.startsWith("http://") ||
                                          url.startsWith("https://")
                                        ) {
                                          new URL(url);
                                          return true;
                                        }
                                        if (url.startsWith("/")) return true;
                                        return false;
                                      } catch (e) {
                                        return false;
                                      }
                                    };

                                    return isValidImageUrl(imagePreview)
                                      ? "Ganti Gambar"
                                      : "Unggah Gambar";
                                  })()}
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center space-y-2">
                                <div className="p-3 bg-primary/10 rounded-full">
                                  <UploadIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium">
                                    Unggah Foto Proyek
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Drag & drop atau klik untuk mengunggah
                                    gambar (JPG, PNG, GIF)
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Maksimal 5MB
                                  </p>
                                </div>

                                {uploadError && (
                                  <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                                    <AlertCircleIcon className="h-4 w-4" />
                                    <span>{uploadError}</span>
                                  </div>
                                )}

                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={uploadingImage || isLoading}
                                  className="mt-4"
                                >
                                  {uploadingImage ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Mengunggah...
                                    </>
                                  ) : (
                                    <>
                                      <UploadIcon className="mr-2 h-4 w-4" />
                                      Pilih Gambar
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}

                            {/* Hidden file input */}
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/gif"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={uploadingImage || isLoading}
                            />
                          </div>
                        </div>

                        <FormDescription className="text-xs mt-2">
                          Unggah foto untuk menampilkan gambar proyek (opsional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Required Fields Note */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start sm:items-center gap-2 p-3 sm:p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-sm"
                >
                  <AlertCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-xs sm:text-sm">
                    Kolom dengan tanda{" "}
                    <span className="text-destructive font-medium">*</span>{" "}
                    wajib diisi
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Form Footer */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end gap-3 p-4 sm:p-6 border-t bg-muted/5 sticky bottom-0"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/projects")}
                disabled={isLoading}
              >
                Batal
              </Button>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading || isLoadingServices}
                  className="min-w-[120px]"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading
                    ? isEditMode
                      ? "Menyimpan..."
                      : "Membuat..."
                    : isEditMode
                      ? "Simpan Perubahan"
                      : "Buat Proyek"}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </form>
      </Form>

      {/* Network error dialog */}
      <AlertDialog
        open={showNetworkErrorDialog}
        onOpenChange={setShowNetworkErrorDialog}
      >
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircleIcon className="h-5 w-5" />
              Gagal Mengunggah Foto
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Terjadi masalah saat menghubungi server unggah gambar. Ini
                mungkin karena:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Koneksi internet terputus</li>
                <li>Server unggah sedang tidak tersedia</li>
                <li>Masalah dengan kebijakan keamanan browser (CORS)</li>
              </ul>

              <div className="bg-muted/20 p-3 rounded-md text-xs font-mono overflow-x-auto mt-4">
                <p className="font-semibold">Detail Error:</p>
                <p>{networkErrorDetails?.message || "Unknown error"}</p>
                <p>{networkErrorDetails?.code || ""}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNetworkErrorDialog(false)}
              className="sm:flex-1"
            >
              Tutup
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() =>
                handleImageUpload({ target: { files: [retryUpload] } })
              }
              className="sm:flex-1"
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleUseLocalImage}
              className="sm:flex-1"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Gunakan Secara Lokal
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
