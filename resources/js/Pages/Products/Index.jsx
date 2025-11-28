import React from "react"
import { Head, Link } from "@inertiajs/react"
import { Plus, Package, AlertTriangle } from "lucide-react"
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

export default function ProductsIndex({ products, warehouses }) {
  return (
    <>
      <Head title="Products & Stock" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products & Stock</h1>
            <p className="text-muted-foreground">Manage items and view real-time stock across warehouses</p>
          </div>
          <Button asChild>
            <Link href="/products/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              All Products ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU / Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    {warehouses.map(wh => (
                      <TableHead key={wh.id} className="text-center">
                        {wh.code}
                        <br />
                        <span className="text-xs text-muted-foreground">{wh.name}</span>
                      </TableHead>
                    ))}
                    <TableHead className="text-right">Total Stock</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => {
                    const totalStock = product.warehouses.reduce((sum, w) => sum + w.pivot.current_stock, 0)
                    const isLow = product.low_stock > 0

                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{product.sku}</div>
                            <div className="text-sm text-muted-foreground">{product.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category.name}</TableCell>
                        <TableCell>{product.unit.short_name}</TableCell>
                        {warehouses.map(wh => {
                          const stock = product.warehouses.find(w => w.id === wh.id)
                          const qty = stock ? stock.pivot.current_stock : 0
                          const isLowHere = qty < product.reorder_level && qty > 0
                          const isZero = qty === 0

                          return (
                            <TableCell key={wh.id} className="text-center">
                              <span className={`font-medium ${isZero ? "text-destructive" : isLowHere ? "text-orange-600" : "text-green-600"}`}>
                                {qty}
                              </span>
                            </TableCell>
                          )
                        })}
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
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}