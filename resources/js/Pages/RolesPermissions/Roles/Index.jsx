import React, { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Plus, Shield, Trash2, Edit } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import DeleteConfirmDialog from "@/Components/custom/DeleteConfirmDialog"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function RolesIndex({ roles }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingRole, setDeletingRole] = useState(null)
  const safeRoute = useSafeRoute()

  const openDelete = (role) => {
    setDeletingRole(role)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    router.delete(safeRoute("roles.destroy", { role: deletingRole.id }), {
      onFinish: () => setDeleteDialogOpen(false),
    })
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("roles-permissions.index")}
      breadCrumbLinkText={"Roles & Permissions"}
      breadCrumbPage={"Roles"}
    >
      <Head title="Roles & Permissions" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
              <p className="text-muted-foreground">Manage roles and access control</p>
            </div>
          </div>
          <Button asChild>
            <Link href={safeRoute("roles.create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    {role.name}
                  </CardTitle>
                  <Badge variant="secondary">{role.users_count} users</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Permissions</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {role.permissions.slice(0, 5).map((perm) => (
                        <Badge key={perm.id} variant="outline" className="text-xs">
                          {perm.name}
                        </Badge>
                      ))}
                      {role.permissions.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={safeRoute("roles.edit", { role: role.id })}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={role.users_count > 0}
                      onClick={() => openDelete(role)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Role"
          description="This role will be permanently deleted."
          itemName={deletingRole?.name}
        />
      </div>
    </AuthenticatedLayout>
  )
}