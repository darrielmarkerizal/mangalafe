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

export function ProjectTableDashboard({
  projects,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">No.</TableHead>
            <TableHead>Nama Proyek</TableHead>
            <TableHead>Initiator</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Layanan</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
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
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
          ) : projects.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-muted-foreground"
              >
                Belum ada data proyek
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project, index) => (
              <TableRow key={project.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.initiator}</TableCell>
                <TableCell>{project.period}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {project.Services && project.Services.length > 0 ? (
                      project.Services.slice(0, 2).map((service) => (
                        <Badge
                          key={service.id}
                          variant="outline"
                          className="whitespace-nowrap"
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
                            <Badge variant="outline" className="cursor-help">
                              +{project.Services.length - 2}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="p-2">
                            <div className="space-y-1">
                              <p className="text-xs font-medium mb-1">
                                Layanan lainnya:
                              </p>
                              {project.Services.slice(2).map((service) => (
                                <p key={service.id} className="text-xs">
                                  • {service.name}
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
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onView && onView(project)}
                          >
                            <EyeIcon className="h-4 w-4" />
                            <span className="sr-only">Lihat</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Lihat Detail</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEdit && onEdit(project)}
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Edit Proyek</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onDelete && onDelete(project.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Hapus</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Hapus Proyek</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
