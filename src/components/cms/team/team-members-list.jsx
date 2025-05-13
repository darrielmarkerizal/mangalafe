import { useSortable } from "@dnd-kit/sortable";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical } from "lucide-react";

// Individual sortable item component
function SortableTeamMemberItem({
  id,
  teamMember,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className="group hover:bg-muted/40"
    >
      <TableCell className="w-14 font-medium">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
          {teamMember.image ? (
            <img
              src={teamMember.image}
              alt={teamMember.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-person.png";
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-primary/10 text-primary text-xs font-bold">
              {teamMember.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="font-medium">{teamMember.name}</TableCell>
      <TableCell>{teamMember.position}</TableCell>
      <TableCell>
        <Checkbox
          checked={teamMember.isActive}
          onCheckedChange={() => onToggleActive(teamMember)}
          className="data-[state=checked]:bg-primary"
        />
      </TableCell>
      <TableCell className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(teamMember)}
          className="h-8 w-8 rounded-full hover:bg-muted transition-colors"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(teamMember)}
          className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
      <TableCell>
        <div
          className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </TableCell>
    </TableRow>
  );
}

// Main list component
export default function TeamMembersList({
  teamMembers,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  return (
    <>
      {teamMembers.map((member) => (
        <SortableTeamMemberItem
          key={member.id}
          id={member.id}
          teamMember={member}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </>
  );
}
