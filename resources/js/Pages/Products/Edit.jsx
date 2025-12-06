import React from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft, Package } from "lucide-react"

export default function Edit({ product, categories, units }) {
  const { data, setData, put, processing, errors } = useForm({
    sku: product.sku || "",
    name: product.name || "",
    category_id: product.category_id?.toString() || "",
    unit_id: product.unit_id?.toString() || "",
    current_stock: product.current_stock || 0,
    reorder_level: product.reorder_level || 10,
    description: product.description || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    put(route("products.update", product.id))
  }

  return (
    <AuthenticatedLayout>
      <Head title="Edit Product" />

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between py-4 px-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={route("products.index")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Edit Product
          </h1>
          <div className="w-[100px]" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="sku">SKU <span className="text-destructive">*</span></Label>
                <Input
                  id="sku"
                  value={data.sku}
                  onChange={(e) => setData("sku", e.target.value.toUpperCase())}
                  placeholder="e.g. CEM-001"
                  className="mt-1.5 font-mono"
                />
                {errors.sku && <p className="text-sm text-destructive mt-1.5">{errors.sku}</p>}
              </div>

              <div>
                <Label htmlFor="name">Product Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="e.g. OPC 53 Grade Cement"
                  className="mt-1.5"
                />
                {errors.name && <p className="text-sm text-destructive mt-1.5">{errors.name}</p>}
              </div>

              <div>
                <Label>Category <span className="text-destructive">*</span></Label>
                <Select value={data.category_id} onValueChange={(v) => setData("category_id", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && <p className="text-sm text-destructive mt-1.5">{errors.category_id}</p>}
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div>
                <Label>Unit <span className="text-destructive">*</span></Label>
                <Select value={data.unit_id} onValueChange={(v) => setData("unit_id", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name} ({unit.short_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit_id && <p className="text-sm text-destructive mt-1.5">{errors.unit_id}</p>}
              </div>

              <div>
                <Label htmlFor="current_stock">Initial Stock</Label>
                <Input
                  id="current_stock"
                  type="number"
                  min="0"
                  value={data.current_stock}
                  onChange={(e) => setData("current_stock", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="reorder_level">Reorder Level <span className="text-destructive">*</span></Label>
                <Input
                  id="reorder_level"
                  type="number"
                  min="0"
                  value={data.reorder_level}
                  onChange={(e) => setData("reorder_level", e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Alert when stock falls below this number
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  placeholder="Add details..."
                  rows={5}
                  className="mt-1.5 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Fixed Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
            <div className="max-w-5xl mx-auto px-6 py-4 flex justify-end gap-3">
              <Button type="button" variant="outline" size="lg" asChild>
                <Link href={route("products.index")}>Cancel</Link>
              </Button>
              <Button type="submit" size="lg" disabled={processing}>
                {processing ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </div>
          <div className="h-28" />
        </form>
      </div>
    </AuthenticatedLayout>
  )
}