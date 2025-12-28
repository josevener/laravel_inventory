import { useState, useMemo } from "react";
import { UserCog, Plus, Trash2 } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import ConfirmDialog from "@/Components/custom/ConfirmDialog";

export default function ProjectsTab({
  projects = [],
  newProjects = [],
  setNewProjects,
  isEditing,
}) {
  const [search, setSearch] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);

  const filteredExisting = useMemo(() => {
    return projects?.filter(
      (p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.code?.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  const addNewProject = () => {
    if (!isEditing) return;
    setNewProjects([
      {
        tempId: Date.now(),
        code: "",
        name: "",
        company_name: "",
        is_active: true,
      },
      ...newProjects,
    ]);
  };

  const updateNewProject = (index, field, value) => {
    const updated = [...newProjects];
    updated[index] = { ...updated[index], [field]: value };
    setNewProjects(updated);
  };

  const confirmRemove = (index) => {
    setDeleteIndex(index);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex === null) return;
    setNewProjects(newProjects.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          Projects
        </h2>

        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-72"
          />
          {isEditing && (
            <Button type="button" onClick={addNewProject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              {isEditing && <TableHead className="w-10"></TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* New projects - at the top */}
            {newProjects.map((np, index) => (
              <TableRow key={np.tempId} className="bg-muted/30">
                <TableCell>
                  <Input
                    value={np.code || ""}
                    onChange={(e) => updateNewProject(index, "code", e.target.value)}
                    placeholder="Project code"
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={np.name || ""}
                    onChange={(e) => updateNewProject(index, "name", e.target.value)}
                    placeholder="Project name"
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={np.company_name || ""}
                    onChange={(e) => updateNewProject(index, "company_name", e.target.value)}
                    placeholder="Company name"
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <select
                    value={np.is_active ? "true" : "false"}
                    onChange={(e) =>
                      updateNewProject(index, "is_active", e.target.value === "true")
                    }
                    className="h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
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

            {/* Existing projects */}
            {filteredExisting?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono">{p.code}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.company_name}</TableCell>
                <TableCell>
                  {p.is_active ? "Active" : "Inactive"}
                </TableCell>
                {isEditing && <TableCell />}
              </TableRow>
            ))}

            {filteredExisting.length === 0 && newProjects.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isEditing ? 5 : 4}
                  className="text-center text-muted-foreground py-6"
                >
                  No projects found
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
        title="Remove this project?"
        description="This will delete the unsaved new project entry. This action cannot be undone."
        confirmText="Remove"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
}