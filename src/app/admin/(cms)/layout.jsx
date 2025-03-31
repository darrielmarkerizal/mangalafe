"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  UserIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from cookies when component mounts
    const userDataFromCookie = Cookies.get("user");
    if (userDataFromCookie) {
      try {
        const parsedUser = JSON.parse(userDataFromCookie);
        setUserData(parsedUser);
      } catch (e) {
        console.error("Error parsing user data from cookie:", e);
      }
    }
  }, []);

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboardIcon,
      current: pathname === "/admin/dashboard",
    },
    {
      name: "Proyek",
      href: "/admin/projects",
      icon: FileTextIcon,
      current: pathname.startsWith("/admin/projects"),
    },
    {
      name: "Admin",
      href: "/admin/users",
      icon: UserIcon,
      current: pathname.startsWith("/admin/users"),
    },
  ];

  const handleLogout = () => {
    setIsLoggingOut(true);
    try {
      Cookies.remove("token");
      Cookies.remove("user");

      toast.success("Berhasil keluar dari sistem");

      router.push("/admin");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Gagal keluar dari sistem");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData || !userData.full_name) return "U";

    const nameParts = userData.full_name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F2F4F8]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transition-all duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              PT Mangala Dipa
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 rounded-full hover:bg-muted/50"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {userData && (
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{userData.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {userData.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1 p-4">
          <div className="text-xs uppercase text-muted-foreground tracking-wider mb-2 ml-3">
            Menu Utama
          </div>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                item.current
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.name}
              </div>
              {item.current && (
                <ChevronRightIcon className="h-4 w-4 opacity-70" />
              )}
            </Link>
          ))}

          <div className="mt-auto pt-6">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:border-destructive/50"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOutIcon
                className={`h-5 w-5 ${isLoggingOut ? "animate-spin" : ""}`}
              />
              {isLoggingOut ? "Keluar..." : "Keluar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-white border-r">
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              PT Mangala Dipa
            </span>
          </Link>
        </div>

        {userData && (
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{userData.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {userData.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1 p-4">
          <div className="text-xs uppercase text-muted-foreground tracking-wider mb-2 ml-3">
            Menu Utama
          </div>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                item.current
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.name}
              </div>
              {item.current && (
                <ChevronRightIcon className="h-4 w-4 opacity-70" />
              )}
            </Link>
          ))}

          <div className="mt-auto pt-6">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:border-destructive/50"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOutIcon
                className={`h-5 w-5 ${isLoggingOut ? "animate-spin" : ""}`}
              />
              {isLoggingOut ? "Keluar..." : "Keluar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted/50"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          <div className="flex-1 flex justify-center">
            <Link
              href="/admin/dashboard"
              className="font-semibold text-primary"
            >
              PT Mangala Dipa
            </Link>
          </div>

          <div className="flex items-center gap-x-2">
            <Link href="/admin/users">
              <Avatar className="h-8 w-8 border border-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>

        {/* Content area */}
        <main className="p-6 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
