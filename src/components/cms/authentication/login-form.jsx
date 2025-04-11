"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { UserIcon, MailIcon, LockIcon } from "lucide-react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";

export function LoginForm({ className, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/user/login", data);

      if (response.data.success) {
        Cookies.set("token", response.data.data.token, {
          expires: 1,
          path: "/",
          sameSite: "Strict",
        });

        Cookies.set("user", JSON.stringify(response.data.data.user), {
          expires: 1,
          path: "/",
          sameSite: "Strict",
        });

        toast.success("Login Berhasil", {
          description: "Anda akan dialihkan ke dashboard",
        });

        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          toast.error("Login Gagal", {
            description: "Email atau password salah",
          });
        } else if (status === 400) {
          toast.error("Login Gagal", {
            description: data.message,
          });
        } else {
          toast.error("Terjadi Kesalahan", {
            description: data.message || "Gagal melakukan login",
          });
        }
      } else {
        toast.error("Terjadi Kesalahan", {
          description: "Gagal terhubung ke server",
        });
        console.error("Login error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full shadow-xl bg-white rounded-xl overflow-hidden border-0">
          <div className="h-1.5 bg-gradient-to-r from-primary to-secondary w-full"></div>
          <CardHeader className="space-y-2 sm:space-y-3 pt-8 pb-4">
            <motion.div
              className="mx-auto mb-4 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src="/logo.svg"
                alt="Mangala Dipa Lokatara Logo"
                width={60}
                height={60}
                className="mx-auto drop-shadow-md"
                priority
              />
              <div className="w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/5 rounded-full -z-10"></div>
            </motion.div>
            <CardTitle className="text-xl sm:text-2xl md:text-2xl text-center font-montserrat text-primary">
              Admin Dashboard
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-center font-plus-jakarta-sans">
              Masukkan kredensial Anda untuk mengakses panel admin
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-7 font-plus-jakarta-sans">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email harus diisi",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Format email tidak valid",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        Email
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          className="relative"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="nama@contoh.com"
                            className="h-11 pl-10 transition-all focus-visible:ring-primary/60 rounded-lg bg-muted/30 border-muted"
                            disabled={isLoading}
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Password harus diisi",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        Password
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          className="relative"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-11 pl-10 transition-all focus-visible:ring-primary/60 rounded-lg bg-muted/30 border-muted"
                            disabled={isLoading}
                          />
                          <motion.button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors text-muted-foreground hover:text-primary/80"
                            onClick={togglePasswordVisibility}
                            aria-label={
                              showPassword
                                ? "Sembunyikan kata sandi"
                                : "Tampilkan kata sandi"
                            }
                            disabled={isLoading}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                          >
                            {showPassword ? (
                              <EyeOffIcon className="h-4 w-4" />
                            ) : (
                              <EyeIcon className="h-4 w-4" />
                            )}
                          </motion.button>
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    className="w-full h-11 text-sm font-medium shadow-sm hover:shadow transition-all bg-gradient-to-r from-primary to-primary/90 rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      "Masuk ke Dashboard"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
          <div className="p-4 bg-muted/20 border-t text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} PT Mangala Dipa Lokatara</p>
            <p className="text-[10px] mt-1 text-muted-foreground/80">
              Sistem Manajemen Proyek Internal
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
