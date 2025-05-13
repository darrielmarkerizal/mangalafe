"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  HelpCircle,
  ChevronLeft,
  Users,
  UserGroup,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

    // Check if sidebar state is saved in localStorage
    const savedSidebarState = localStorage.getItem("sidebarCollapsed");
    if (savedSidebarState) {
      setSidebarCollapsed(savedSidebarState === "true");
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

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/admin/dashboard",
    },
    {
      name: "Proyek",
      href: "/admin/projects",
      icon: FileText,
      current: pathname.startsWith("/admin/projects"),
    },
    {
      name: "Tim",
      href: "/admin/team",
      icon: Users,
      current: pathname.startsWith("/admin/team"),
    },
    {
      name: "Admin",
      href: "/admin/users",
      icon: User,
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

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
        <div className="flex h-16 shrink-0 items-center border-b px-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 truncate"
          >
            <Image
              src="/logo.svg"
              alt="Mangala Dipa Lokatara Logo"
              width={28}
              height={30}
              priority
              className="flex-shrink-0"
            />
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent truncate">
              PT Mangala Dipa Lokatara
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 rounded-full hover:bg-muted/50"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
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
                <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm flex-shrink-0">
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
                  <ChevronRight className="h-4 w-4 ml-2 text-white" />
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
              <LogOut
                className={`h-5 w-5 ${isLoggingOut ? "animate-spin" : ""}`}
              />
              {isLoggingOut ? "Keluar..." : "Keluar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar - simplified toggle UX */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col bg-white border-r transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:w-20" : "lg:w-72"
        )}
      >
        {/* Header without toggle button */}
        <div className="flex h-16 shrink-0 items-center border-b px-4 justify-between">
          {!sidebarCollapsed && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 w-full overflow-hidden"
            >
              <Image
                src="/logo.svg"
                alt="Mangala Dipa Lokatara Logo"
                width={30}
                height={33}
                priority
                className="flex-shrink-0"
              />
              <span className="text-base font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent truncate">
                PT Mangala Dipa Lokatara
              </span>
            </Link>
          )}

          {sidebarCollapsed && (
            <Link
              href="/admin/dashboard"
              className="mx-auto"
              title="PT Mangala Dipa Lokatara"
            >
              <Image
                src="/logo.svg"
                alt="Mangala Dipa Lokatara Logo"
                width={33}
                height={36}
                priority
              />
            </Link>
          )}
        </div>

        {/* User profile section - unchanged */}
        {userData && !sidebarCollapsed && (
          <div className="px-4 py-4 border-b bg-primary/5">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground font-medium">
                {getGreeting()}
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm flex-shrink-0">
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

        {userData && sidebarCollapsed && (
          <div className="py-4 border-b bg-primary/5 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm cursor-pointer">
                  <AvatarFallback className="bg-gradient-to-br from-primary/90 to-primary/70 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex flex-col gap-1">
                <p className="font-medium">{userData.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {userData.email}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Navigation menu */}
        <div className="flex flex-1 flex-col gap-1 p-2">
          {!sidebarCollapsed && (
            <div className="text-xs uppercase text-muted-foreground tracking-wider mb-2 ml-3 font-medium">
              Menu Utama
            </div>
          )}

          {navigation.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-lg transition-all duration-200",
                    sidebarCollapsed
                      ? "px-2 py-2.5 mx-auto w-12 h-12 hover:bg-muted/30"
                      : "px-3 py-2.5",
                    item.current
                      ? "bg-gradient-to-r from-primary/90 to-primary/80 text-white shadow-sm"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-3",
                      sidebarCollapsed && "justify-center w-full"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        item.current ? "text-white" : "",
                        sidebarCollapsed && "mx-auto"
                      )}
                    />
                    {!sidebarCollapsed && item.name}
                  </div>
                  {!sidebarCollapsed && (
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
                        <ChevronRight className="h-4 w-4 ml-2 text-white" />
                      )}
                    </div>
                  )}
                </Link>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}

          <div className="mt-auto">
            {/* Toggle button - ONLY above logout */}
            <div className="py-2 mb-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={toggleSidebar}
                    className={cn(
                      "w-full rounded-lg flex items-center justify-center gap-2 transition-all duration-200",
                      sidebarCollapsed ? "h-10 p-0 flex-col py-2" : "h-10"
                    )}
                  >
                    {sidebarCollapsed ? (
                      <>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-[10px]">Perluas</span>
                      </>
                    ) : (
                      <>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="text-xs">Tutup Sidebar</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right">
                    <p>Perluas sidebar untuk navigasi lengkap</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>

            {/* Logout button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  className={cn(
                    "justify-start gap-3 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200",
                    sidebarCollapsed
                      ? "w-12 h-12 mx-auto p-0 flex items-center justify-center rounded-full"
                      : "w-full"
                  )}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut
                    className={`h-5 w-5 ${isLoggingOut ? "animate-spin" : ""}`}
                  />
                  {!sidebarCollapsed && (isLoggingOut ? "Keluar..." : "Keluar")}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">
                  <p>Keluar dari sistem</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "min-h-screen flex flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        {/* Header - without toggle button */}
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
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          {/* Page title - visible on desktop */}
          <div className="hidden lg:block flex-1">
            <h1 className="text-lg font-semibold">
              {navigation.find((item) => item.current)?.name || "Dashboard"}
            </h1>
          </div>

          {/* Center logo - visible on mobile */}
          <div className="flex-1 flex justify-center items-center lg:hidden">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Mangala Dipa Lokatara Logo"
                width={24}
                height={26}
                priority
              />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent truncate max-w-[180px]">
                PT Mangala Dipa Lokatara
              </span>
            </Link>
          </div>

          {/* Right nav items */}
          <div className="flex items-center gap-x-3">
            {/* Help button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex rounded-full h-8 w-8"
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </Button>

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
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Keluar..." : "Keluar"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
