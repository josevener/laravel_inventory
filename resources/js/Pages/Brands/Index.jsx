import React, { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Plus, Tag, Edit, Trash2 } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import DeleteConfirmDialog from "@/Components/custom/DeleteConfirmDialog"
import { useSafeRoute } from "@/hooks/useSafeRoute"
import { EmptyState } from "@/Components/custom/EmptyState"

export default function BrandsIndex({ brands }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingBrand, setDeletingBrand] = useState(null)
  const safeRoute = useSafeRoute()

  const openDeleteDialog = (brand) => {
    setDeletingBrand(brand)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    router.delete(
      safeRoute("brands.destroy", { brand: deletingBrand.id }),
      {
        onFinish: () => setDeleteDialogOpen(false),
        preserveScroll: true,
      }
    )
  }

  return (
    <AuthenticatedLayout>
      <Head title="Brands" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
            <p className="text-muted-foreground">
              Manage product brands across your inventory
            </p>
          </div>
          <Button asChild>
            <Link href={safeRoute("brands.create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Link>
          </Button>
        </div>

        {/* Content */}
        {brands.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                All Brands ({brands.length})
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {brands.map((brand) => (
                  <Card key={brand.id} className="relative overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {brand.name}
                          </h3>
                          <p className="text-sm text-muted-foreground font-mono">
                            {brand.code}
                          </p>
                        </div>

                        <Badge variant="secondary">
                          {brand.products_count || 0} products
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {brand.description ? (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {brand.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No description
                        </p>
                      )}

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            href={safeRoute("brands.edit", {
                              brand: brand.id,
                            })}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(brand)}
                          disabled={brand.products_count > 0 || brand.is_system}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            icon={Tag}
            title="No Brands Yet"
            description="You haven't created any brands yet. Start by adding your first brand."
            primaryAction={{
              label: "Create Brand",
              onClick: () => router.visit(safeRoute("brands.create")),
            }}
          />
        )}

        {/* Delete Dialog */}
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Brand"
          description="This brand will be permanently deleted."
          itemName={deletingBrand?.name}
          confirmText="Delete Brand"
        />
      </div>
    </AuthenticatedLayout>
  )
}
