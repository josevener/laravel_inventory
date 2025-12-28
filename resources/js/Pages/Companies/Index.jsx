import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Building2, Shield, Edit, Trash2, Search, Plus, SquareArrowOutUpRight } from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/Components/ui/input-group";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useSafeRoute } from "@/hooks/useSafeRoute";

export default function ClientsIndex({ clients }) {
  const safeRoute = useSafeRoute();
  const [search, setSearch] = useState("");

  const handleDelete = (client) => {
    if (confirm(`Are you sure you want to delete ${client.name}?`)) {
      router.delete(safeRoute("companies.destroy", { company: client.id }));
    }
  };

  const handleSearch = () => {
    router.get(safeRoute("companies.index"), { search }, { preserveState: true });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <AuthenticatedLayout>
      <Head title="Clients" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building2 className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
              <p className="text-muted-foreground">Manage your tenant companies</p>
            </div>
          </div>

          <div className="flex w-full max-w-xl items-center justify-between gap-4">
            <InputGroup>
              <InputGroupInput
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              {search && (
                <InputGroupAddon>
                  <Button variant="ghost" size="icon" onClick={() => setSearch("")}>
                    ×
                  </Button>
                </InputGroupAddon>
              )}
              <InputGroupAddon>
                <Button variant="ghost" size="icon" onClick={handleSearch}>
                  <Search />
                </Button>
              </InputGroupAddon>
            </InputGroup>

            <Button asChild>
              <Link href={safeRoute("companies.create")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Link>
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-36 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    No clients found.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="w-12">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.visit(safeRoute("companies.show", { company: client.id }));
                        }}
                      >
                        <SquareArrowOutUpRight 
                          style={{
                            width: "28px",
                            height: "28px",
                            color: "green"
                          }} 
                        />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {client.name}
                        {client.is_superadmin > 0 && <Shield className="h-4 w-4 text-purple-600" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{client.code}</code>
                    </TableCell>
                    <TableCell>{client.contact_person || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={!client.deleted_at && client.is_active ? "default" : "secondary"}
                      >
                        {!client.deleted_at ? (client.is_active ? "Active" : "Inactive") : "Deleted"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.visit(safeRoute("companies.edit", { company: client.id }));
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit 
                            style={{
                              width: "18px",
                              height: "18px",
                            }} 
                          />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="text-destructive hover:text-destructive/90"
                          disabled={client.is_superadmin}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(client);
                          }}
                        >
                          <Trash2
                            style={{
                              width: "18px",
                              height: "18px",
                              color: "#F4F4F4"
                            }} 
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}