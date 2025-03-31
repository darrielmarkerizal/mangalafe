"use client";

import { useState, useEffect } from "react";
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
  const [activeTab, setActiveTab] = useState("basic");
  const [formProgress, setFormProgress] = useState(0);
  const [searchServices, setSearchServices] = useState("");

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
            <div className="p-6 border-b bg-muted/10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="p-2 bg-primary/10 rounded-full"
                  >
                    <FileTextIcon className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {isEditMode ? "Edit Proyek" : "Tambah Proyek Baru"}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {isEditMode
                        ? "Perbarui detail proyek yang sudah ada"
                        : "Isi formulir di bawah ini untuk membuat proyek baru"}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block w-32">
                  <div className="text-xs text-right mb-1 text-muted-foreground">
                    {formProgress}% Selesai
                  </div>
                  <Progress value={formProgress} className="h-2" />
                </div>
              </div>
            </div>

            {/* Mobile Tabs - Only shown on mobile */}
            <div className="sm:hidden border-b">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-muted/10 p-0 h-12">
                  <TabsTrigger
                    value="basic"
                    className="flex-1 data-[state=active]:bg-primary/10"
                    onClick={() => setActiveTab("basic")}
                  >
                    <BuildingIcon className="mr-2 h-4 w-4" />
                    Dasar
                  </TabsTrigger>
                  <TabsTrigger
                    value="services"
                    className="flex-1 data-[state=active]:bg-primary/10"
                    onClick={() => setActiveTab("services")}
                  >
                    <ListChecksIcon className="mr-2 h-4 w-4" />
                    Layanan
                    {selectedServicesCount > 0 && (
                      <Badge className="ml-2 bg-primary text-white">
                        {selectedServicesCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="additional"
                    className="flex-1 data-[state=active]:bg-primary/10"
                    onClick={() => setActiveTab("additional")}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Tambahan
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="p-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Progress Form</p>
                  <p className="text-sm text-muted-foreground">
                    {formProgress}%
                  </p>
                </div>
                <Progress value={formProgress} className="h-1.5 mt-2" />
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <div className="space-y-8">
                {/* On mobile: TabsContent, on desktop: always visible */}
                <div
                  className={`sm:block ${activeTab !== "basic" ? "hidden" : ""}`}
                >
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BuildingIcon className="h-4 w-4 text-primary" />
                      Informasi Dasar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <FormDescription>
                              Tahun pelaksanaan proyek
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Services Section */}
                <div
                  className={`pt-4 border-t sm:block ${activeTab !== "services" ? "hidden" : ""}`}
                >
                  <motion.div
                    initial={{
                      x: activeTab === "services" ? -10 : 0,
                      opacity: activeTab === "services" ? 0 : 1,
                    }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
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
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
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
                              <ScrollArea className="border rounded-md p-2 bg-white h-[280px]">
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
                                                  className={`flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 ${
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
                </div>

                {/* Additional Information */}
                <div
                  className={`pt-4 border-t sm:block ${activeTab !== "additional" ? "hidden" : ""}`}
                >
                  <motion.div
                    initial={{
                      x: activeTab === "additional" ? -10 : 0,
                      opacity: activeTab === "additional" ? 0 : 1,
                    }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Informasi Tambahan
                    </h3>

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
                  </motion.div>
                </div>

                {/* Required Fields Note */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-sm"
                >
                  <AlertCircleIcon className="h-5 w-5 flex-shrink-0" />
                  <p>
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
              className="flex justify-end gap-3 p-6 border-t bg-muted/5"
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
    </motion.div>
  );
}
