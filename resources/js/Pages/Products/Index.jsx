import React, { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Plus, Package, AlertTriangle, Edit, Trash2, Search, SquareArrowOutUpRight, Package2Icon } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import DeleteConfirmDialog from "@/components/custom/DeleteConfirmDialog"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useSafeRoute } from "@/hooks/useSafeRoute"
import { EmptyState } from "@/Components/custom/EmptyState"

export default function ProductsIndex({ products: initialProducts }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const safeRoute = useSafeRoute()

  // Filter only when searchQuery changes
  const filteredProducts = initialProducts.filter(p =>
    searchQuery === "" ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = () => {
    setSearchQuery(searchInput.trim())
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchInput("")
    setSearchQuery("")
  }

  const openDeleteDialog = (product) => {
    setDeletingProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    router.delete(safeRoute("products.destroy", { product: deletingProduct.id }), {
      onFinish: () => setDeleteDialogOpen(false),
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
            <p className="text-muted-foreground">Manage items and view current stock levels</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Input
                placeholder="Search by SKU, name or category..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-80 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute text-[20px] right-12 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Button asChild>
              <Link href={safeRoute("products.create")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Show active search term */}
        {searchQuery && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Showing results for:</span>
            <Badge variant="secondary">"{searchQuery}"</Badge>
            <button
              onClick={clearSearch}
              className="text-sm text-primary hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Products Table */}
        {filteredProducts.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                All Products ({filteredProducts.length})
                {searchQuery && <span className="text-sm font-normal text-muted-foreground">• {initialProducts.length} total</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border max-h-[calc(100vh-280px)] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead>SKU / Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                          const isLow = product.current_stock > 0 && product.current_stock < product.reorder_level
                          const isOut = product.current_stock === 0

                          return (
                            <TableRow key={product.id}>
                              <TableCell>
                                <Button 
                                  onClick={() => router.visit(safeRoute("products.show", { product: product.id }))}
                                  className="cursor-pointer bg-transparent hover:bg-gray-50"
                                >
                                  <SquareArrowOutUpRight className="h-5 w-5 text-green-500" />
                                </Button>
                              </TableCell>
                              <TableCell className="font-medium">
                                <div>
                                  <div className="font-mono text-sm font-semibold">{product.sku}</div>
                                  <div className="text-sm text-foreground">{product.name}</div>
                                </div>
                              </TableCell>
                              <TableCell>{product.category?.name}</TableCell>
                              <TableCell>{product.unit?.short_name}</TableCell>
                              <TableCell className="text-right font-semibold">
                                <span className={isOut ? "text-destructive" : isLow ? "text-orange-600" : "text-green-600"}>
                                  {product.current_stock}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                {isLow ? (
                                  <Badge variant="destructive" className="flex items-center gap-1 w-fit mx-auto">
                                    <AlertTriangle className="h-3 w-3" />
                                    Low Stock
                                  </Badge>
                                ) : isOut ? (
                                  <Badge variant="secondary">Out of Stock</Badge>
                                ) : (
                                  <Badge variant="default">In Stock</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={safeRoute("products.edit", { product: product.id })}>
                                      <Edit className="h-4 w-4" />
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
                        })
                      }
                    </TableBody>
                  </Table>
              </div>
            </CardContent>
          </Card>
         ) : (
          <EmptyState
            icon={Package2Icon}
            title="No Products Yet"
            description="You haven't created any products yet. Get started by creating your first product."
            primaryAction={{ label: "Create Product", onClick: () => router.visit(safeRoute("products.create")) }}
            // secondaryAction={{ label: "Import Product", onClick: () => openImportModal() }}
            // learnMoreHref="https://docs.example.com/products"
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Product"
          description="This product will be permanently deleted from your inventory."
          itemName={deletingProduct?.name}
          confirmText="Delete Product"
          isLoading={router.progress?.pending}
        />
      </div>
    </AuthenticatedLayout>
  )
}