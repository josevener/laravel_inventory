import React, { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Plus, FolderOpen, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import DeleteConfirmDialog from "@/Components/custom/DeleteConfirmDialog"
import { useSafeRoute } from "@/hooks/useSafeRoute"
import { EmptyState } from "@/Components/custom/EmptyState"

export default function CategoriesIndex({ categories }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const safeRoute = useSafeRoute()

  const openDeleteDialog = (cat) => {
    setDeletingCategory(cat)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    router.delete(safeRoute("categories.destroy", { category: deletingCategory.id }), {
      onFinish: () => setDeleteDialogOpen(false),
      preserveScroll: true,
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title="Categories" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Organize your products into categories</p>
          </div>
          <Button asChild>
            <Link href={safeRoute("categories.create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Link>
          </Button>
        </div>

        {categories.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                All Categories ({categories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <Card key={category.id} className="relative overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{category.code}</p>
                        </div>
                        <Badge variant="secondary">{category.products.length || 0} products</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {category.description ? (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No description</p>
                      )}
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={safeRoute("categories.edit", { category: category.id })}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(category)}
                          disabled={category.products_count > 0}
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
            icon={FolderOpen}
            title="No Categories Yet"
            description="You haven't created any categories yet. Get started by creating your first category."
            primaryAction={{ label: "Create Category", onClick: () => router.visit(safeRoute("categories.create")) }}
            // secondaryAction={{ label: "Import Category", onClick: () => openImportModal() }}
            // learnMoreHref="https://docs.example.com/categories"
          />
        )}

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Category"
          description="This category will be permanently deleted."
          itemName={deletingCategory?.name}
          confirmText="Delete Category"
        />
      </div>
    </AuthenticatedLayout>
  )
}