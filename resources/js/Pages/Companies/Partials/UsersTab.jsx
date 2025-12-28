import { useState, useMemo } from "react";
import { Users, Plus, Trash2, Copy, RefreshCw } from "lucide-react";
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
import { toast } from "sonner";
import ConfirmDialog from "@/Components/custom/ConfirmDialog";

export default function UsersTab({
  users = [],
  newUsers = [],
  setNewUsers,
  isEditing,
}) {
  const [search, setSearch] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredExisting = useMemo(() => {
    return users?.filter(
      (u) =>
        `${u.first_name || ""} ${u.last_name || ""}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const addNewUser = () => {
    if (!isEditing) return;
    setSelectedUser(null);

    const newPassword = generatePassword();

    setNewUsers([
      {
        tempId: Date.now(),
        first_name: "",
        last_name: "",
        email: "",
        password: newPassword,
      },
      ...newUsers,
    ]);

    toast.success("New user added", {
      description: "A password has been auto-generated.",
    });
  };

  const updateNewUser = (index, field, value) => {
    const updated = [...newUsers];
    updated[index] = { ...updated[index], [field]: value };
    setNewUsers(updated);
  };

  const confirmRemove = (index) => {
    setDeleteIndex(index);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex === null) return;
    setNewUsers(newUsers.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
    toast.success("Removed", {
      description: "New user row has been deleted.",
    });
  };

  const copyToClipboard = (text, label = "Text") => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!", {
      description: `${label} copied to clipboard`,
      duration: 2000,
    });
  };

  const copyUserDetails = (user, isNew = false) => {
    let password = user.password || "";

    // For existing users: generate a new password
    if (!isNew) {
      password = generatePassword();
      // Note: This is client-side only — to save it, you'd need a separate API call
      // For now, we just generate & copy (you can add backend update later)
    }

    const details = [
      `Name: ${(user.first_name || "") + " " + (user.last_name || "")}`.trim(),
      `Email: ${user.email || ""}`,
      `Password: ${password}`,
    ].filter(Boolean).join("\n");

    copyToClipboard(details, "User details");

    if (!isNew) {
      toast.info("New password generated", {
        description: "A new password was created for this existing user. It was copied to clipboard.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Users
        </h2>

        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-72"
          />

          {isEditing && (
            <Button type="button" onClick={addNewUser}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          )}
        </div>
      </div>
      
      {/* Copy/Generate for existing users */}
      <div>
        <Button
          type="button"
          variant={selectedUser ? "default" : "secondary"}
          onClick={() => {
            if (!selectedUser) {
              toast.error("No user selected", {
                description: "Please click on a user row first.",
              });
              return;
            }
            copyUserDetails(selectedUser, false); // false = existing user
          }}
          disabled={!selectedUser}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy & Generate Password
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Password</TableHead>
              {isEditing && <TableHead className="w-24 text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* New users */}
            {newUsers.map((nu, index) => (
              <TableRow key={nu.tempId} className="bg-muted/30">
                <TableCell className="flex gap-2">
                  <Input
                    value={nu.first_name || ""}
                    onChange={(e) => updateNewUser(index, "first_name", e.target.value)}
                    placeholder="First name"
                    className="h-8 flex-1"
                  />
                  <Input
                    value={nu.last_name || ""}
                    onChange={(e) => updateNewUser(index, "last_name", e.target.value)}
                    placeholder="Last name"
                    className="h-8 flex-1"
                  />
                </TableCell>

                <TableCell>
                  <Input
                    type="email"
                    value={nu.email || ""}
                    onChange={(e) => updateNewUser(index, "email", e.target.value)}
                    placeholder="user@example.com"
                    className="h-8"
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={nu.password || ""}
                      onChange={(e) => updateNewUser(index, "password", e.target.value)}
                      placeholder="Password"
                      className="h-8 flex-1 font-mono"
                    />
                    {isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newPass = generatePassword();
                          updateNewUser(index, "password", newPass);
                          toast.info("New password generated");
                        }}
                        title="Generate new password"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                    {nu.password && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(nu.password, "Password")}
                        title="Copy password"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>

                {isEditing && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => copyUserDetails(nu, true)} // true = new user
                        title="Copy all details"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmRemove(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {/* Existing users */}
            {filteredExisting?.map((u) => (
              <TableRow
                key={u.id}
                className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedUser?.id === u.id ? "bg-primary/10 ring-1 ring-primary" : ""
                }`}
                onClick={() => setSelectedUser(u)}
              >
                <TableCell className="font-medium">
                  {u.first_name} {u.last_name}
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell className="text-muted-foreground">••••••••</TableCell>
                {isEditing && <TableCell />}
              </TableRow>
            ))}

            {filteredExisting.length === 0 && newUsers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isEditing ? 4 : 3}
                  className="text-center text-muted-foreground py-6"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Modal for delete */}
      <ConfirmDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
        title="Remove new user?"
        description="This will delete the unsaved new user entry. This action cannot be undone."
        confirmText="Remove"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
}