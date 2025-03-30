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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card className="w-full shadow-lg bg-white rounded-xl overflow-hidden border-0">
        <div className="h-2 bg-primary w-full"></div>
        <CardHeader className="space-y-2 sm:space-y-3 pt-8">
          <div className="mx-auto mb-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl md:text-3xl text-center font-[family-name:var(--font-montserrat)]">
            Login Admin
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-center font-[family-name:var(--font-plus-jakarta-sans)]">
            Masukkan email dan kata sandi Anda untuk masuk ke dashboard admin
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 font-[family-name:var(--font-plus-jakarta-sans)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormLabel className="text-sm sm:text-base font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="m@example.com"
                          className="h-11 sm:h-12 pl-10 transition-all focus-visible:ring-primary"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
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
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-sm sm:text-base font-medium">
                        Password
                      </FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan kata sandi"
                          className="h-11 sm:h-12 pl-10 transition-all focus-visible:ring-primary"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-muted/50 p-1 rounded-full transition-colors"
                          onClick={togglePasswordVisibility}
                          aria-label={
                            showPassword
                              ? "Sembunyikan kata sandi"
                              : "Tampilkan kata sandi"
                          }
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium shadow-sm hover:shadow transition-all"
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
            </form>
          </Form>
        </CardContent>
        <div className="p-4 bg-muted/10 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PT Mangala Dipa. All rights reserved.
        </div>
      </Card>
    </div>
  );
}
