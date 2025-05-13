import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";

export default function EmptyTeamState({ onAddMember }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Users className="h-16 w-16 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-semibold mb-1">Belum ada anggota tim</h3>
      <p className="text-muted-foreground mb-4">
        Tambahkan anggota tim untuk ditampilkan di website
      </p>
      <Button onClick={onAddMember}>
        <Plus className="h-4 w-4 mr-2" />
        Tambah Anggota Tim
      </Button>
    </div>
  );
}
