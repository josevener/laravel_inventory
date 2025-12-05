// resources/js/Pages/Products/Index.jsx
import React, { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Plus, Package, AlertTriangle, Edit, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import DeleteConfirmDialog from "@/Components/custom/DeleteConfirmDialog"
import { Input } from "@/Components/ui/input"

export default function ProductsIndex({ products, warehouses }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [search, setSearch] = useState("");

  const openDeleteDialog = (product) => {
    setDeletingProduct(product)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setDeletingProduct(null)
  }

  const handleDelete = () => {
    if (!deletingProduct) return

    router.delete(route("products.destroy", deletingProduct.id), {
      onFinish: () => {
        closeDeleteDialog()
      },
      preserveScroll: true,
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title="Products & Stock" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products & Stock</h1>
            <p className="text-muted-foreground">
              Manage items and view real-time stocks
            </p>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Input 
              type="text" 
              name="search"
              placeholder="Search name, serial no., or category..."
              className="w-[300px]"
              onChange={(e) => setSearch(e.target.value)} 
            />

            <Button asChild>
              <Link href={route("products.create")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              All Products ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial No. / Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Total Stock</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {products.map((product) => {
                    const totalStock = product.warehouses.reduce(
                      (sum, w) => sum + w.pivot.current_stock,
                      0
                    )
                    const isLow = totalStock > 0 && totalStock < product.reorder_level

                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-mono text-sm font-semibold">{product.serial_no}</div>
                            <div className="text-sm text-foreground">{product.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category.name}</TableCell>
                        <TableCell>{product.unit.short_name}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {totalStock}
                        </TableCell>

                        <TableCell className="text-center">
                          {isLow ? (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit mx-auto">
                              <AlertTriangle className="h-3 w-3" />
                              Low Stock
                            </Badge>
                          ) : totalStock === 0 ? (
                            <Badge variant="secondary">Out of Stock</Badge>
                          ) : (
                            <Badge variant="default">In Stock</Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="bg-blue-500 hover:bg-blue-600" asChild>
                              <Link href={route("products.edit", product.id)}>
                                <Edit className="h-4 w-4 text-white" />
                              </Link>
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteDialog(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Reusable Delete Confirmation Modal */}
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
          title="Delete Product"
          description="This product will be permanently deleted along with all stock records across warehouses."
          itemName={deletingProduct?.name}
          confirmText="Delete Product"
          isLoading={router.progress?.pending}
        />
      </div>
    </AuthenticatedLayout>
  )
}