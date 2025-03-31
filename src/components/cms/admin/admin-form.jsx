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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  UserIcon,
  MailIcon,
  LockIcon,
  InfoIcon,
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Schema for creating a new admin
const createAdminSchema = z
  .object({
    full_name: z.string().min(2, { message: "Nama harus minimal 2 karakter" }),
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

// Schema for editing an admin
const editAdminSchema = z
  .object({
    full_name: z.string().min(2, { message: "Nama harus minimal 2 karakter" }),
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z
      .string()
      .min(6, { message: "Password minimal 6 karakter" })
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

export default function AdminForm({ admin = null, onSuccess }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isEditMode = !!admin;

  // Use the appropriate schema based on whether we're editing or creating
  const schema = isEditMode ? editAdminSchema : createAdminSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: admin?.full_name || "",
      email: admin?.email || "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

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

      // If password is empty during edit, remove it from the request
      if (isEditMode && !data.password) {
        const { password, confirmPassword, ...dataWithoutPassword } = data;

        response = await axios.put(
          `/api/admin/${admin.id}`,
          dataWithoutPassword,
          {
            headers,
          }
        );
      } else if (isEditMode) {
        const { confirmPassword, ...dataWithoutConfirm } = data;

        response = await axios.put(
          `/api/admin/${admin.id}`,
          dataWithoutConfirm,
          {
            headers,
          }
        );
      } else {
        const { confirmPassword, ...dataWithoutConfirm } = data;

        response = await axios.post("/api/admin", dataWithoutConfirm, {
          headers,
        });
      }

      if (response.data.success) {
        toast.success(
          isEditMode ? "Admin berhasil diperbarui" : "Admin berhasil dibuat",
          {
            description: isEditMode
              ? "Data admin telah diperbarui"
              : "Admin baru telah ditambahkan",
          }
        );

        if (onSuccess) {
          onSuccess(response.data.data);
        } else {
          router.push("/admin/users");
        }
      } else {
        toast.error("Gagal menyimpan data admin", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error saving admin:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan data admin";
      toast.error("Gagal menyimpan data admin", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        onClick={() => router.push("/admin/users")}
        className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali ke Daftar Admin
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b bg-muted/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold">
                  {isEditMode ? "Edit Admin" : "Tambah Admin Baru"}
                </h2>
              </div>
              <p className="text-muted-foreground ml-10 mt-1">
                {isEditMode
                  ? "Perbarui data admin yang sudah ada"
                  : "Isi formulir di bawah ini untuk membuat admin baru"}
              </p>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Admin Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-primary" />
                    Informasi Admin
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Nama Lengkap</RequiredLabel>
                          </FormLabel>
                          <div className="relative">
                            <UserIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                            <FormControl>
                              <Input
                                placeholder="Masukkan nama lengkap"
                                {...field}
                                disabled={isLoading}
                                className="pl-9"
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Nama lengkap admin yang akan ditampilkan
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Email</RequiredLabel>
                          </FormLabel>
                          <div className="relative">
                            <MailIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Masukkan alamat email"
                                {...field}
                                disabled={isLoading}
                                className="pl-9"
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Email akan digunakan untuk login
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Password Section */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <LockIcon className="h-4 w-4 text-primary" />
                    {isEditMode ? "Ubah Password" : "Password"}
                    {isEditMode && (
                      <span className="text-xs text-muted-foreground font-normal ml-2">
                        (opsional)
                      </span>
                    )}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {!isEditMode && (
                              <RequiredLabel>Password</RequiredLabel>
                            )}
                            {isEditMode && "Password Baru"}
                          </FormLabel>
                          <div className="relative">
                            <LockIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={
                                  isEditMode
                                    ? "Masukkan password baru (opsional)"
                                    : "Masukkan password"
                                }
                                {...field}
                                disabled={isLoading}
                                className="pl-9 pr-10"
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1 h-8 w-8 text-muted-foreground"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <FormDescription>
                            {isEditMode
                              ? "Biarkan kosong jika tidak ingin mengubah password"
                              : "Password minimal 6 karakter"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {!isEditMode && (
                              <RequiredLabel>Konfirmasi Password</RequiredLabel>
                            )}
                            {isEditMode && "Konfirmasi Password Baru"}
                          </FormLabel>
                          <div className="relative">
                            <LockIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={
                                  isEditMode
                                    ? "Konfirmasi password baru"
                                    : "Konfirmasi password"
                                }
                                {...field}
                                disabled={isLoading}
                                className="pl-9 pr-10"
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1 h-8 w-8 text-muted-foreground"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <FormDescription>
                            Masukkan password yang sama untuk konfirmasi
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Required Fields Note */}
                <div className="flex items-center gap-2 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-sm">
                  <AlertCircleIcon className="h-5 w-5 flex-shrink-0" />
                  <p>
                    Kolom dengan tanda{" "}
                    <span className="text-destructive font-medium">*</span>{" "}
                    wajib diisi
                  </p>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex justify-end gap-3 p-6 border-t bg-muted/5">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/users")}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Menyimpan..." : "Membuat..."}
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    {isEditMode ? "Simpan Perubahan" : "Buat Admin"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
