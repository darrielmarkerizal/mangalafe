"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon, XIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ProjectForm({ project, onClose }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: project
      ? {
          name: project.name || "",
          client: project.client || "",
          description: project.description || "",
          startDate: project.startDate
            ? new Date(project.startDate).toISOString().split("T")[0]
            : "",
          endDate: project.endDate
            ? new Date(project.endDate).toISOString().split("T")[0]
            : "",
          status: project.status || "planned",
          location: project.location || "",
          budget: project.budget ? project.budget.toString() : "",
        }
      : {
          name: "",
          client: "",
          description: "",
          startDate: "",
          endDate: "",
          status: "planned",
          location: "",
          budget: "",
        },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      let response;

      if (project) {
        // Update existing project
        response = await axios.put(`/api/project/${project.id}`, data);
      } else {
        // Create new project
        response = await axios.post("/api/project", data);
      }

      if (response.data.success) {
        toast.success(
          project ? "Proyek berhasil diperbarui" : "Proyek berhasil dibuat",
          {
            description: project
              ? "Detail proyek telah diperbarui."
              : "Proyek baru telah ditambahkan ke sistem.",
          }
        );
        onClose(true);
      } else {
        toast.error("Gagal menyimpan proyek", {
          description:
            response.data.message || "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Terjadi kesalahan", {
        description: "Gagal menyimpan data proyek. Silakan coba lagi nanti.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Nama proyek harus diisi" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Proyek</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Masukkan nama proyek"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client"
            rules={{ required: "Nama klien harus diisi" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Klien</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Masukkan nama klien"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokasi</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Masukkan lokasi proyek"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anggaran (Rp)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Masukkan anggaran proyek"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            rules={{ required: "Tanggal mulai harus diisi" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Mulai</FormLabel>
                <FormControl>
                  <Input {...field} type="date" disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Berakhir (Opsional)</FormLabel>
                <FormControl>
                  <Input {...field} type="date" disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status proyek" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planned">Rencana</SelectItem>
                    <SelectItem value="in_progress">Sedang Berjalan</SelectItem>
                    <SelectItem value="on_hold">Ditunda</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Masukkan deskripsi proyek"
                  className="min-h-32"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose()}
            disabled={isLoading}
          >
            <XIcon className="h-4 w-4 mr-2" />
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
            {project ? "Perbarui Proyek" : "Simpan Proyek"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
