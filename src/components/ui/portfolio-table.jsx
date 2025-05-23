"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRight } from "lucide-react";

export function PortfolioTable({ projects, isLoading }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  // Display loading skeletons
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%] sm:w-[40%] lg:w-[45%]">
                Nama Proyek
              </TableHead>
              <TableHead className="w-[30%] sm:w-[25%] lg:w-[20%]">
                Pemrakarsa
              </TableHead>
              <TableHead className="w-[10%] sm:w-[10%] lg:w-[10%]">
                Tahun
              </TableHead>
              <TableHead className="w-[25%] sm:w-[25%] lg:w-[25%]">
                Layanan
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-full max-w-[350px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[180px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%] sm:w-[40%] lg:w-[45%]">
                Nama Proyek
              </TableHead>
              <TableHead className="w-[30%] sm:w-[25%] lg:w-[20%]">
                Pemrakarsa
              </TableHead>
              <TableHead className="w-[10%] sm:w-[10%] lg:w-[10%]">
                Tahun
              </TableHead>
              <TableHead className="w-[25%] sm:w-[25%] lg:w-[25%]">
                Layanan
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
                  <p className="mb-2 text-lg font-medium">Tidak Ada Data</p>
                  <p className="text-sm">
                    Tidak ada proyek yang sesuai dengan kriteria pencarian
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  const isValidImageUrl = (url) => {
    if (!url) return false;
    if (url.startsWith("data:image/")) return true;
    if (/^[^\/]+\.[a-zA-Z]+$/.test(url)) return false;

    try {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        new URL(url);
        return true;
      }
      if (url.startsWith("/")) return true;
      return false;
    } catch (e) {
      return false;
    }
  };

  return (
    <TooltipProvider>
      <div className="relative rounded-md border overflow-hidden">
        {/* Mobile scroll indicator */}
        <div className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-background to-transparent p-2 animate-pulse pointer-events-none z-10 flex items-center">
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>
        <div className="w-full overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%] sm:w-[40%] lg:w-[45%]">
                  Nama Proyek
                </TableHead>
                <TableHead className="w-[30%] sm:w-[25%] lg:w-[20%]">
                  Pemrakarsa
                </TableHead>
                <TableHead className="w-[10%] sm:w-[10%] lg:w-[10%]">
                  Tahun
                </TableHead>
                <TableHead className="w-[25%] sm:w-[25%] lg:w-[25%]">
                  Layanan
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  className="hover:bg-muted/50 transition-colors"
                  onMouseEnter={() => setHoveredRow(project.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell className="font-medium">
                    {project.name.length > 50 ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="max-w-[220px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[450px] xl:max-w-[550px] truncate">
                            {project.name}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[350px]">
                          {project.name}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="max-w-[220px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[450px] xl:max-w-[550px]">
                        {project.name}
                      </div>
                    )}
                    {project.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[220px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[450px] xl:max-w-[550px]">
                            {project.description}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[350px] text-xs">
                          {project.description}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    {project.initiator.length > 25 ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[180px] xl:max-w-[220px] truncate">
                            {project.initiator}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{project.initiator}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[180px] xl:max-w-[220px]">
                        {project.initiator}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5">
                      {project.period}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.Services.slice(0, 2).map((service) =>
                        service.name.length > 15 ? (
                          <Tooltip key={service.id}>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="font-normal text-xs truncate w-auto px-2 py-1"
                              >
                                {service.name}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>{service.name}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Badge
                            key={service.id}
                            variant="secondary"
                            className="font-normal text-xs w-auto px-2 py-1"
                          >
                            {service.name}
                          </Badge>
                        )
                      )}
                      {project.Services.length > 2 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="font-normal text-xs cursor-help px-2 py-1"
                            >
                              +{project.Services.length - 2}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            align="start"
                            className="p-2"
                          >
                            <div className="flex flex-col gap-1.5">
                              {project.Services.slice(2).map((service) => (
                                <span key={service.id} className="text-xs">
                                  {service.name}
                                </span>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Mobile scroll hint text */}
        <div className="md:hidden text-xs text-center text-muted-foreground py-2 border-t">
          Geser ke kanan untuk melihat selengkapnya
        </div>
      </div>
    </TooltipProvider>
  );
}
