"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      current: pathname === "/admin/projects",
    },
    {
      name: "Admin",
      href: "/admin/users",
      icon: UserIcon,
      current: pathname === "/admin/users",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-lg transition-transform duration-300 ease-in-out lg:hidden",
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
            className="absolute right-4"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <div className="flex flex-col gap-1 p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                item.current
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}

          <div className="mt-auto pt-6">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-muted-foreground"
            >
              <LogOutIcon className="h-5 w-5" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r">
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              PT Mangala Dipa
            </span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                item.current
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}

          <div className="mt-auto pt-6">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-muted-foreground"
            >
              <LogOutIcon className="h-5 w-5" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <div className="flex flex-1 justify-end gap-x-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserIcon className="h-6 w-6" />
              <span className="sr-only">Your profile</span>
            </Button>
          </div>
        </div>

        {/* Content area */}
        <main className="p-6 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
