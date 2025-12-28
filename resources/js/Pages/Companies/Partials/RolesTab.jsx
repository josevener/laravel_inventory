import { useState } from "react";
import { Shield, Plus, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import ConfirmDialog from "@/Components/custom/ConfirmDialog";

export default function RolesTab({
  roles = [],
  newRoles = [],
  setNewRoles,
  isEditing,
}) {
  const [search, setSearch] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);

  const filtered = roles.filter((r) =>
    [r.name, r.guard_name]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const addNewRole = () => {
    if (!isEditing) return;
    setNewRoles([
      {
        tempId: Date.now(),
        name: "",
        guard_name: "web",
      },
      ...newRoles,
    ]);
  };

  const updateNewRole = (index, field, value) => {
    const updated = [...newRoles];
    updated[index] = { ...updated[index], [field]: value };
    setNewRoles(updated);
  };

  const confirmRemove = (index) => {
    setDeleteIndex(index);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex === null) return;
    setNewRoles(newRoles.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Roles & Permissions
        </h2>

        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-72"
          />
          {isEditing && (
            <Button type="button" onClick={addNewRole}>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Guard</TableHead>
              {isEditing && <TableHead className="w-10"></TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* New roles - at the top */}
            {newRoles.map((nr, index) => (
              <TableRow key={nr.tempId} className="bg-muted/30">
                <TableCell>
                  <Input
                    value={nr.name || ""}
                    onChange={(e) => updateNewRole(index, "name", e.target.value)}
                    placeholder="Role name (e.g. admin)"
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={nr.guard_name || "web"}
                    // onChange={(e) => updateNewRole(index, "guard_name", e.target.value)}
                    placeholder="Guard name (usually 'web')"
                    className="h-8"
                  />
                </TableCell>
                {isEditing && (
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmRemove(index)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {/* Existing roles */}
            {filtered.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.guard_name}</TableCell>
                {isEditing && <TableCell />}
              </TableRow>
            ))}

            {filtered.length === 0 && newRoles.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isEditing ? 3 : 2}
                  className="text-center text-muted-foreground py-6"
                >
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
        title="Remove this role?"
        description="This will delete the unsaved new role entry. This action cannot be undone."
        confirmText="Remove"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
}