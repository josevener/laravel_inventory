import React, { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Plus, Building2, Users, Package, Trash2, Edit, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DeleteConfirmDialog from "@/components/custom/DeleteConfirmDialog"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function ClientsIndex({ clients }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingClient, setDeletingClient] = useState(null)
  const safeRoute = useSafeRoute()

  const openDelete = (client) => {
    setDeletingClient(client)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    router.delete(safeRoute("companies.destroy", { company: deletingClient.id }), {
      onFinish: () => setDeleteDialogOpen(false),
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title="Clients" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building2 className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
              <p className="text-muted-foreground">Manage tenant companies</p>
            </div>
          </div>
          <Button asChild>
            <Link href={safeRoute("companies.create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className={`relative ${!client.is_active ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {client.name}
                      {client.is_superadmin > 0 && <Shield className="h-5 w-5 text-purple-600" />}
                    </h3>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {client.code}
                    </code>
                  </div>
                  <Badge variant={!client.deleted_at ? "default" : "secondary"}>
                    {!client.deleted_at ? "Active" : "Deleted"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Contact</p>
                    <p className="font-medium">{client.contact_person || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{client.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{client.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Since</p>
                    <p className="font-medium">
                      {new Date(client.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.users_count} users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.products_count} products</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={safeRoute("companies.edit", { company: client.id })}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Link>
                  </Button>
                  {!client.is_superadmin && (
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={client.users_count > 0 || client.products_count > 0}
                      onClick={() => openDelete(client)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Client"
          description="This client will be soft-deleted. You can restore later."
          itemName={deletingClient?.name}
        />
      </div>
    </AuthenticatedLayout>
  )
}