"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

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
import { Textarea } from "@/components/ui/textarea";
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

const projectSchema = z.object({
  name: z.string().min(3, { message: "Nama proyek minimal 3 karakter" }),
  initiator: z
    .string()
    .min(2, { message: "Nama initiator minimal 2 karakter" }),
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
});

export default function ProjectForm({ project = null, onSuccess }) {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [selectedServicesCount, setSelectedServicesCount] = useState(0);
  const isEditMode = !!project;

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      initiator: project?.initiator || "",
      period: project?.period || new Date().getFullYear(),
      services: project?.Services?.map((s) => s.id.toString()) || [],
      photo: project?.photo || "",
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

  return (
    <div className="mx-auto">
      <Button
        type="button"
        variant="ghost"
        onClick={() => router.push("/admin/projects")}
        className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
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

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <FileTextIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Proyek" : "Tambah Proyek Baru"}
          </h1>
        </div>
        <p className="text-muted-foreground ml-10">
          {isEditMode
            ? "Perbarui detail proyek yang sudah ada"
            : "Isi formulir di bawah ini untuk membuat proyek baru"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Informasi Dasar</h2>
              <div className="space-y-6">
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
                      <FormDescription>
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
                        <RequiredLabel>Initiator</RequiredLabel>
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
                      <FormDescription>
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
                    <FormItem>
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
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormDescription>
                        Tahun pelaksanaan proyek
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  <RequiredLabel>Layanan</RequiredLabel>
                </h2>
                <Badge
                  variant={selectedServicesCount > 0 ? "default" : "outline"}
                  className="ml-2"
                >
                  {selectedServicesCount} dipilih
                </Badge>
              </div>

              <FormField
                control={form.control}
                name="services"
                render={() => (
                  <FormItem>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                      <ListChecksIcon className="h-4 w-4" />
                      <span>
                        Pilih minimal 1 layanan yang terkait dengan proyek ini
                      </span>
                    </div>

                    {isLoadingServices ? (
                      <div className="flex flex-col items-center justify-center py-8 bg-muted/30 rounded-md border border-dashed">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/70 mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Memuat data layanan...
                        </p>
                      </div>
                    ) : (
                      <div className="border rounded-md p-2 max-h-[320px]">
                        <ScrollArea className="h-full pr-4">
                          <div className="grid grid-cols-1 gap-3 p-1">
                            {services.map((service) => (
                              <FormField
                                key={service.id}
                                control={form.control}
                                name="services"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={service.id}
                                      className={`flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 ${
                                        field.value?.includes(
                                          service.id.toString()
                                        )
                                          ? "bg-primary/5 border-primary/30"
                                          : "hover:bg-muted/30"
                                      }`}
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            service.id.toString()
                                          )}
                                          onCheckedChange={(checked) => {
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
                                                      value !== serviceId
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
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-4">Informasi Tambahan</h2>

              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Foto</FormLabel>
                    <div className="relative">
                      <ImageIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="Masukkan URL foto (opsional)"
                          {...field}
                          disabled={isLoading}
                          className="pl-9"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      URL foto untuk menampilkan gambar proyek (opsional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-sm">
              <AlertCircleIcon className="h-5 w-5 flex-shrink-0" />
              <p>
                Kolom dengan tanda{" "}
                <span className="text-destructive font-medium">*</span> wajib
                diisi
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 pb-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/projects")}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isLoadingServices}
                className="min-w-[120px]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading
                  ? isEditMode
                    ? "Menyimpan..."
                    : "Membuat..."
                  : isEditMode
                    ? "Simpan Perubahan"
                    : "Buat Proyek"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
