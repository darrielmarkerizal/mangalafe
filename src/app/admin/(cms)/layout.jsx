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
  SearchIcon,
  HelpCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);

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

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Track scrolling for shadow effect on header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
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

  // Format greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 19) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transition-all duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-1.5">
              <FileTextIcon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
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
          <div className="px-4 py-4 border-b bg-primary/5">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground font-medium">
                {getGreeting()}
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-primary/90 to-primary/70 text-white">
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
          </div>
        )}

        <div className="flex flex-col gap-1 p-4">
          <div className="text-xs uppercase text-muted-foreground tracking-wider mb-2 ml-3 font-medium">
            Menu Utama
          </div>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                item.current
                  ? "bg-gradient-to-r from-primary/90 to-primary/80 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn("h-5 w-5", item.current ? "text-white" : "")}
                />
                {item.name}
              </div>
              <div className="flex items-center">
                {item.badge && (
                  <Badge
                    className={cn(
                      "text-[10px] py-0 h-4 min-w-4 flex items-center justify-center rounded-full font-medium",
                      item.current
                        ? "bg-white text-primary"
                        : "bg-primary/15 text-primary"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
                {item.current && (
                  <ChevronRightIcon className="h-4 w-4 ml-2 text-white" />
                )}
              </div>
            </Link>
          ))}

          <div className="mt-auto pt-6">
            <Button
              variant="destructive"
              className="w-full justify-start gap-3 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200"
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col bg-white border-r">
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-1.5">
              <FileTextIcon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              PT Mangala Dipa
            </span>
          </Link>
        </div>

        {userData && (
          <div className="px-4 py-4 border-b bg-primary/5">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground font-medium">
                {getGreeting()}
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-primary/90 to-primary/70 text-white">
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
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1 p-4">
          <div className="text-xs uppercase text-muted-foreground tracking-wider mb-2 ml-3 font-medium">
            Menu Utama
          </div>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                item.current
                  ? "bg-gradient-to-r from-primary/90 to-primary/80 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn("h-5 w-5", item.current ? "text-white" : "")}
                />
                {item.name}
              </div>
              <div className="flex items-center">
                {item.badge && (
                  <Badge
                    className={cn(
                      "text-[10px] py-0 h-4 min-w-4 flex items-center justify-center rounded-full font-medium",
                      item.current
                        ? "bg-white text-primary"
                        : "bg-primary/15 text-primary"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
                {item.current && (
                  <ChevronRightIcon className="h-4 w-4 ml-2 text-white" />
                )}
              </div>
            </Link>
          ))}

          <div className="mt-auto pt-6">
            <Button
              variant="destructive"
              className="w-full justify-start gap-3 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200"
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
      <div className="lg:pl-72 min-h-screen flex flex-col">
        {/* Header - both mobile and desktop */}
        <div
          className={cn(
            "sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 bg-white px-4 sm:px-6 transition-shadow duration-200",
            isScrolled ? "shadow-md" : "border-b"
          )}
        >
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted/50 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          {/* Page title - visible on desktop */}
          <div className="hidden lg:block flex-1">
            <h1 className="text-lg font-semibold">
              {navigation.find((item) => item.current)?.name || "Dashboard"}
            </h1>
          </div>

          {/* Center logo - visible on mobile */}
          <div className="flex-1 flex justify-center lg:hidden">
            <Link
              href="/admin/dashboard"
              className="font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
            >
              PT Mangala Dipa
            </Link>
          </div>

          {/* Right nav items */}
          <div className="flex items-center gap-x-4">
            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative rounded-full h-8 w-8 p-0"
                >
                  <Avatar className="h-8 w-8 border border-primary/10">
                    <AvatarFallback className="bg-gradient-to-br from-primary/90 to-primary/70 text-white text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-3 border-b">
                  <p className="font-medium truncate">{userData?.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {userData?.email}
                  </p>
                </div>

                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 focus:text-red-700 focus:bg-red-50"
                >
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Keluar..." : "Keluar"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1 p-6 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
