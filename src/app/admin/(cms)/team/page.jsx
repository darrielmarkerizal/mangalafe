"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";

import TeamMembersList from "@/components/cms/team/team-members-list";
import TeamMemberDialog from "@/components/cms/team/team-member-dialog";
import DeleteConfirmDialog from "@/components/cms/team/delete-confirm-dialog";
import TeamMembersLoading from "@/components/cms/team/team-members-loading";
import EmptyTeamState from "@/components/cms/team/empty-team-state";
import NetworkErrorDialog from "@/components/cms/team/network-error-dialog";

export default function TeamPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [networkErrorDetails, setNetworkErrorDetails] = useState(null);
  const [showNetworkErrorDialog, setShowNetworkErrorDialog] = useState(false);
  const [retryUpload, setRetryUpload] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/team");

      if (response.data.success) {
        const sortedMembers = response.data.data.sort(
          (a, b) => a.displayOrder - b.displayOrder
        );
        setTeamMembers(sortedMembers);
      } else {
        toast.error("Gagal memuat data tim");
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Gagal memuat data tim");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTeamMembers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);

        // Update displayOrder values
        const updatedArray = newArray.map((item, index) => ({
          ...item,
          displayOrder: index,
        }));

        // Save new order to database
        updateMembersOrder(updatedArray);

        return updatedArray;
      });
    }
  };

  const updateMembersOrder = async (updatedMembers) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        router.push("/admin");
        return;
      }

      await axios.post("/api/team/reorder", updatedMembers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error updating member order:", error);
      toast.error("Gagal memperbarui urutan anggota tim");
    }
  };

  const handleToggleActive = async (member) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        router.push("/admin");
        return;
      }

      await axios.patch(
        `/api/team/${member.id}`,
        { isActive: !member.isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setTeamMembers(
        teamMembers.map((m) =>
          m.id === member.id ? { ...m, isActive: !m.isActive } : m
        )
      );

      toast.success(
        `Anggota tim "${member.name}" telah ${
          !member.isActive ? "diaktifkan" : "dinonaktifkan"
        }`
      );
    } catch (error) {
      console.error("Error toggling active status:", error);
      toast.error("Gagal mengubah status anggota tim");
    }
  };

  const handleEditMember = (member) => {
    setCurrentMember(member);
    setIsDialogOpen(true);
  };

  const handleAddNewMember = () => {
    setCurrentMember(null);
    setIsDialogOpen(true);
  };

  const handleDeleteMember = (member) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      setIsDeleting(true);
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        router.push("/admin");
        return;
      }

      await axios.delete(`/api/team/${memberToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeamMembers(teamMembers.filter((m) => m.id !== memberToDelete.id));
      toast.success(`Anggota tim "${memberToDelete.name}" berhasil dihapus`);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Gagal menghapus anggota tim");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveMember = async (memberData) => {
    try {
      setIsSaving(true);
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesi anda telah berakhir, silakan login kembali");
        router.push("/admin");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let response;
      if (currentMember) {
        // Update existing member
        response = await axios.put(
          `/api/team/${currentMember.id}`,
          memberData,
          {
            headers,
          }
        );
      } else {
        // Create new member
        response = await axios.post(
          "/api/team",
          {
            ...memberData,
            displayOrder: teamMembers.length,
          },
          { headers }
        );
      }

      if (response.data.success) {
        fetchTeamMembers();
        setIsDialogOpen(false);
        toast.success(
          currentMember
            ? `Anggota tim "${memberData.name}" berhasil diperbarui`
            : `Anggota tim "${memberData.name}" berhasil ditambahkan`
        );
      } else {
        toast.error("Gagal menyimpan anggota tim");
      }
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Gagal menyimpan anggota tim");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUploadError = (error, file) => {
    setNetworkErrorDetails(error);
    setRetryUpload(file);
    setShowNetworkErrorDialog(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-10"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Manajemen Tim
              </CardTitle>
              <CardDescription>
                Kelola anggota tim yang ditampilkan di website
              </CardDescription>
            </div>
            <Button onClick={handleAddNewMember} className="gap-1">
              <Plus className="h-4 w-4" />
              Tambah Anggota Tim
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TeamMembersLoading />
          ) : teamMembers.length === 0 ? (
            <EmptyTeamState onAddMember={handleAddNewMember} />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <Card className="border-dashed">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Foto</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Aktif</TableHead>
                      <TableHead>Aksi</TableHead>
                      <TableHead className="w-[60px]">
                        <Badge variant="outline" className="whitespace-nowrap">
                          Drag & Drop
                        </Badge>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext
                      items={teamMembers.map((member) => member.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <TeamMembersList
                        teamMembers={teamMembers}
                        onEdit={handleEditMember}
                        onDelete={handleDeleteMember}
                        onToggleActive={handleToggleActive}
                      />
                    </SortableContext>
                  </TableBody>
                </Table>
              </Card>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Team Member Dialog */}
      <TeamMemberDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={currentMember}
        onSave={handleSaveMember}
        isSaving={isSaving}
        onUploadError={handleImageUploadError}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        member={memberToDelete}
        onConfirm={confirmDeleteMember}
        isDeleting={isDeleting}
      />

      {/* Network Error Dialog */}
      <NetworkErrorDialog
        isOpen={showNetworkErrorDialog}
        onOpenChange={setShowNetworkErrorDialog}
        errorDetails={networkErrorDetails}
        retryFile={retryUpload}
      />
    </motion.div>
  );
}
