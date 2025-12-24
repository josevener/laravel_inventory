import React, { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Plus, Scale, Edit, Trash2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DeleteConfirmDialog from "@/components/custom/DeleteConfirmDialog"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useSafeRoute } from "@/hooks/useSafeRoute"
import { toast } from "sonner"
import { EmptyState } from "@/Components/custom/EmptyState"

export default function UnitsIndex({ units }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingUnit, setDeletingUnit] = useState(null)
  const safeRoute = useSafeRoute()

  const openDelete = (unit) => {
    setDeletingUnit(unit)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    router.delete(safeRoute("units.destroy", { unit: deletingUnit.id }), {
      onSuccess: () => {
        toast({ title: "Success", description: "Unit deleted successfully!" })
        setDeleteDialogOpen(false)
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Cannot delete unit used by products." })
        setDeleteDialogOpen(false)
      },
      onFinish: () => setDeleteDialogOpen(false),
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title="Units" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Units of Measurement</h1>
            <p className="text-muted-foreground">Manage units used across products</p>
          </div>
          <Button asChild>
            <Link href={safeRoute("units.create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Unit
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {units.length > 0 ? (
            units.map((unit) => (
              <Card key={unit.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div className="flex items-center gap-3">
                    <Scale className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{unit.name}</CardTitle>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {unit.short_name}
                      </code>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {unit.products.length || 0} product{unit.products.length > 1 ? 's' : ''}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={safeRoute("units.edit", { unit: unit.id })}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={unit.products.length > 0}
                        onClick={() => openDelete(unit)}
                        className={`${unit.products.length > 0 ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))) : (
            <div className="col-span-full">
              <EmptyState
                icon={FolderOpen}
                title="No Units Yet"
                description="You haven't created any units yet. Get started by creating your first unit."
                primaryAction={{ label: "Create Unit", onClick: () => router.visit(safeRoute("units.create")) }}
              />
            </div>
          )}
        </div>

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Unit"
          description="This unit will be permanently deleted."
          itemName={deletingUnit?.name}
        />
      </div>
    </AuthenticatedLayout>
  )
}