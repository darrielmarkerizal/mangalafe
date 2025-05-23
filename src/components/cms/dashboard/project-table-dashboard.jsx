"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { FileTextIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export function ProjectTableDashboard({
  projects,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) {
  const handleDeleteClick = (e, projectId) => {
    e.stopPropagation();
    console.log("Delete button clicked for project ID:", projectId);

    if (typeof onDelete === "function") {
      try {
        onDelete(projectId);
      } catch (error) {
        console.error("Error in delete handler:", error);
      }
    } else {
      console.error("onDelete is not a function:", onDelete);
    }
  };

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-12 font-semibold">No.</TableHead>
            <TableHead className="font-semibold">Nama Proyek</TableHead>
            <TableHead className="font-semibold">Pemrakarsa</TableHead>
            <TableHead className="font-semibold">Periode</TableHead>
            <TableHead className="font-semibold">Layanan</TableHead>
            <TableHead className="text-right font-semibold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow
                  key={`skeleton-${index}`}
                  className="hover:bg-muted/5"
                >
                  <TableCell>
                    <Skeleton className="h-5 w-5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
          ) : projects.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-52 text-center py-10 text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-muted">
                    <FileTextIcon className="h-8 w-8 text-muted-foreground/80" />
                    <div className="absolute top-0 right-0 w-4 h-4 bg-muted-foreground/30 rounded-full flex items-center justify-center">
                      <span className="text-background text-[10px] font-bold">
                        ?
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-center max-w-sm">
                    <p className="font-medium text-base">
                      Belum ada data proyek
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Semua proyek yang ditambahkan akan muncul di sini
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  className="group cursor-pointer hover:bg-muted/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-primary/90 max-w-[180px]">
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="truncate">{project.name}</div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-[300px] break-words"
                        >
                          <p className="text-xs">{project.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="max-w-[150px]">
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="truncate">{project.initiator}</div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">{project.initiator}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-muted/30 font-normal"
                    >
                      {project.period}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5 flex-wrap">
                      {project.Services && project.Services.length > 0 ? (
                        project.Services.slice(0, 2).map((service) => (
                          <Badge
                            key={service.id}
                            variant="secondary"
                            className="whitespace-nowrap font-normal"
                          >
                            {service.name.length > 10
                              ? service.name.split(" ")[0]
                              : service.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          Tidak ada layanan
                        </span>
                      )}
                      {project.Services && project.Services.length > 2 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="cursor-help bg-primary/10 hover:bg-primary/15"
                              >
                                +{project.Services.length - 2}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="p-3 rounded-lg">
                              <div className="space-y-1.5">
                                <p className="text-xs font-medium mb-1">
                                  Layanan lainnya:
                                </p>
                                {project.Services.slice(2).map((service) => (
                                  <p
                                    key={service.id}
                                    className="text-xs flex items-center gap-1.5"
                                  >
                                    <motion.div
                                      className="w-1.5 h-1.5 rounded-full bg-primary"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ duration: 0.2 }}
                                    />
                                    {service.name}
                                  </p>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                onView && onView(project);
                              }}
                            >
                              <EyeIcon className="h-4 w-4" />
                              <span className="sr-only">Lihat</span>
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">Lihat Detail</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit && onEdit(project);
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">Edit Proyek</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="h-8 w-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 flex items-center justify-center"
                              onClick={(e) => handleDeleteClick(e, project.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Hapus</span>
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">Hapus Proyek</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
