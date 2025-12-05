import React, { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Plus, Building2, Phone, Mail, MapPin, BadgeCheck, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import DeleteConfirmDialog from "@/Components/custom/DeleteConfirmDialog"

export default function SuppliersIndex({ suppliers }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingSupplier, setDeletingSupplier] = useState(null)

  const openDelete = (supplier) => {
    setDeletingSupplier(supplier)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    router.delete(route("suppliers.destroy", deletingSupplier.id), {
      onFinish: () => setDeleteDialogOpen(false),
      preserveScroll: true,
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title="Suppliers" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
            <p className="text-muted-foreground">Manage your suppliers and vendors</p>
          </div>
          <Button asChild>
            <Link href={route("suppliers.create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">
                        {supplier.company_name || supplier.name}
                      </h3>
                    </div>
                    {supplier.company_name && (
                      <p className="text-sm text-muted-foreground">Contact: {supplier.name}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {supplier.code}
                      </code>
                      <Badge variant={supplier.is_active ? "default" : "secondary"}>
                        {supplier.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {supplier.phone}
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {supplier.email}
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span className="line-clamp-2">{supplier.address}</span>
                  </div>
                )}
                {supplier.gst_number && (
                  <div className="flex items-center gap-2 text-xs">
                    <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
                    GST: {supplier.gst_number}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-muted-foreground">
                    {supplier.gate_passes_count} gate passes
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={route("suppliers.edit", supplier.id)}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={supplier.gate_passes_count > 0}
                      onClick={() => openDelete(supplier)}
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
          title="Delete Supplier"
          description="This supplier will be permanently removed."
          itemName={deletingSupplier?.company_name || deletingSupplier?.name}
          confirmText="Delete Supplier"
        />
      </div>
    </AuthenticatedLayout>
  )
}